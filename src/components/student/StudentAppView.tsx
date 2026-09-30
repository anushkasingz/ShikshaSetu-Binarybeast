import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  ShieldCheck, 
  FolderLock, 
  FileCheck2, 
  Clock, 
  Users, 
  History, 
  Award, 
  Smartphone, 
  Maximize2, 
  Minimize2,
  Mic,
  Sparkles
} from 'lucide-react';
import { StudentProfile, ScholarshipScheme, ApplicationRecord, MismatchRecord } from '../../types/scholarship';
import { StudentHome } from './StudentHome';
import { ScholarshipSearchEngine } from './ScholarshipSearchEngine';
import { DocumentVerifier } from './DocumentVerifier';
import { PreFlightChecker } from './PreFlightChecker';
import { CitizenCharterClock } from './CitizenCharterClock';
import { ParentModeView } from './ParentModeView';
import { UserHistoryTracker } from './UserHistoryTracker';
import { ApplicationTracker } from './ApplicationTracker';
import { DocumentWallet } from './DocumentWallet';
import { SchemeDetailModal } from './SchemeDetailModal';
import { ProfileEditModal } from './ProfileEditModal';
import { Language, TRANSLATIONS } from '../../data/translations';

export type StudentPortalTab = 
  | 'dashboard' 
  | 'search' 
  | 'verifier' 
  | 'preflight' 
  | 'charter' 
  | 'parent' 
  | 'history' 
  | 'tracker';

interface StudentAppViewProps {
  student: StudentProfile;
  schemes: ScholarshipScheme[];
  applications: ApplicationRecord[];
  mismatches: MismatchRecord[];
  language?: Language;
  onUpdateStudent: (updated: StudentProfile) => void;
  onApplySuccess: (newApp: ApplicationRecord) => void;
  onResolveDeficiency: (appId: string) => void;
  onOpenJagoWithPrompt: (prompt: string) => void;
  onOpenJago: () => void;
}

export const StudentAppView: React.FC<StudentAppViewProps> = ({
  student,
  schemes,
  applications,
  mismatches,
  language = 'en',
  onUpdateStudent,
  onApplySuccess,
  onResolveDeficiency,
  onOpenJagoWithPrompt,
  onOpenJago
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<StudentPortalTab>('dashboard');
  const [isMobileFrameMode, setIsMobileFrameMode] = useState<boolean>(false);
  const [selectedSchemeForModal, setSelectedSchemeForModal] = useState<ScholarshipScheme | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <div className="py-4 px-2 sm:px-4 max-w-7xl mx-auto space-y-4">
      
      {/* Top View Toggle Bar */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-orange-400" />
          <span className="font-semibold text-slate-200">{t.studentHeaderTitle}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
            {t.brandTag}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileFrameMode(!isMobileFrameMode)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs border border-slate-700"
          >
            {isMobileFrameMode ? <Maximize2 className="w-3.5 h-3.5 text-orange-400" /> : <Minimize2 className="w-3.5 h-3.5 text-orange-400" />}
            <span>{isMobileFrameMode ? 'Expand Desktop View' : 'Compact Mobile Device View'}</span>
          </button>
        </div>
      </div>

      {/* Main Container: either inside Phone Shell or responsive wide container */}
      <div className={`transition-all duration-300 ${isMobileFrameMode ? 'max-w-md mx-auto' : 'w-full'}`}>
        <div className={`${
          isMobileFrameMode 
            ? 'border-4 border-slate-700 rounded-[36px] bg-slate-900 shadow-2xl p-3 ring-1 ring-white/10 overflow-hidden' 
            : ''
        }`}>
          
          {/* Simulated Mobile Status Bar if in phone frame */}
          {isMobileFrameMode && (
            <div className="flex items-center justify-between px-4 py-1 text-[11px] text-slate-400 font-mono border-b border-slate-800/80 mb-3">
              <span>09:41</span>
              <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto"></div>
              <span>5G • 100%</span>
            </div>
          )}

          {/* Student Portal Comprehensive Navigation Bar */}
          <div className="flex items-center p-1 bg-slate-800/90 rounded-2xl border border-slate-700/70 mb-5 shadow-inner overflow-x-auto">
            
            {/* 1. Unified 5-Scheme Dashboard */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t.tabOverview}</span>
            </button>

            {/* 2. Scholarship Search & Eligibility Engine */}
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'search'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.tabSearch}</span>
            </button>

            {/* 3. Document Verifier */}
            <button
              onClick={() => setActiveTab('verifier')}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'verifier'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>{t.tabVerifier}</span>
            </button>

            {/* 4. Pre-Flight Submission Check */}
            <button
              onClick={() => setActiveTab('preflight')}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'preflight'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-blue-300" />
              <span>{t.tabPreFlight}</span>
            </button>

            {/* 5. 30-Day Citizen's Charter Clock */}
            <button
              onClick={() => setActiveTab('charter')}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'charter'
                  ? 'bg-gradient-to-r from-orange-600 to-rose-600 text-white shadow-md shadow-orange-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-orange-300" />
              <span>{t.tabCharter}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/20 text-white font-mono">
                30D
              </span>
            </button>

            {/* 6. Parent Mode */}
            <button
              onClick={() => setActiveTab('parent')}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'parent'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-purple-300" />
              <span>{t.tabParent}</span>
            </button>

            {/* 7. User History & Activity Tracking */}
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5 text-indigo-300" />
              <span>{t.tabHistory}</span>
            </button>

            {/* 8. Application Tracker */}
            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'tracker'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-teal-300" />
              <span>{t.tabTracker} ({applications.length})</span>
            </button>

          </div>

          {/* Tab Views */}
          {activeTab === 'dashboard' && (
            <StudentHome
              student={student}
              schemes={schemes}
              applications={applications}
              mismatches={mismatches}
              language={language}
              onSelectScheme={(s) => setSelectedSchemeForModal(s)}
              onOpenProfileEdit={() => setIsProfileModalOpen(true)}
              onOpenJagoWithPrompt={onOpenJagoWithPrompt}
              onNavigateToTab={(tabName) => {
                if (tabName === 'home') setActiveTab('dashboard');
                else if (tabName === 'wallet') setActiveTab('verifier');
                else if (tabName === 'applications') setActiveTab('tracker');
                else if (tabName === 'preflight') setActiveTab('preflight');
                else if (tabName === 'charter') setActiveTab('charter');
              }}
            />
          )}

          {activeTab === 'search' && (
            <ScholarshipSearchEngine
              schemes={schemes}
              student={student}
              language={language}
              onSelectScheme={(s) => setSelectedSchemeForModal(s)}
            />
          )}

          {activeTab === 'verifier' && (
            <DocumentVerifier
              student={student}
              language={language}
              onUpdateStudent={onUpdateStudent}
              onOpenJagoWithPrompt={onOpenJagoWithPrompt}
            />
          )}

          {activeTab === 'preflight' && (
            <PreFlightChecker
              student={student}
              schemes={schemes}
              language={language}
              onUpdateStudent={onUpdateStudent}
              onSelectSchemeToApply={(s) => setSelectedSchemeForModal(s)}
            />
          )}

          {activeTab === 'charter' && (
            <CitizenCharterClock
              applications={applications}
              student={student}
              language={language}
              onOpenJagoWithPrompt={onOpenJagoWithPrompt}
              onResolveDeficiency={onResolveDeficiency}
            />
          )}

          {activeTab === 'parent' && (
            <ParentModeView
              student={student}
              schemes={schemes}
              applications={applications}
              language={language}
              onOpenJagoWithPrompt={onOpenJagoWithPrompt}
            />
          )}

          {activeTab === 'history' && (
            <UserHistoryTracker
              student={student}
              applications={applications}
              language={language}
              onOpenJagoWithPrompt={onOpenJagoWithPrompt}
            />
          )}

          {activeTab === 'tracker' && (
            <ApplicationTracker
              applications={applications}
              student={student}
              onOpenJagoWithPrompt={onOpenJagoWithPrompt}
              onResolveDeficiency={onResolveDeficiency}
            />
          )}

        </div>
      </div>

      {/* Floating JAGO Voice Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={onOpenJago}
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-bold text-xs shadow-2xl shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all group ring-2 ring-white/30"
        >
          <div className="relative">
            <Mic className="w-4 h-4 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
          </div>
          <span className="tracking-wide">Talk to JAGO</span>
          <Sparkles className="w-3.5 h-3.5 text-slate-950 group-hover:rotate-45 transition-transform" />
        </button>
      </div>

      {/* Modals */}
      <SchemeDetailModal
        scheme={selectedSchemeForModal}
        student={student}
        isOpen={!!selectedSchemeForModal}
        language={language}
        onClose={() => setSelectedSchemeForModal(null)}
        onApplySuccess={onApplySuccess}
        hasAlreadyApplied={applications.some(a => a.schemeId === selectedSchemeForModal?.id)}
      />

      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        student={student}
        onSave={onUpdateStudent}
      />

    </div>
  );
};
