/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, ActivePortal } from './components/Navbar';
import { StudentAppView } from './components/student/StudentAppView';
import { AdminPortalView } from './components/admin/AdminPortalView';
import { JagoVoiceChat } from './components/student/JagoVoiceChat';
import { AuthScreen, UserSession } from './components/auth/AuthScreen';
import { SchemeDetailModal } from './components/student/SchemeDetailModal';
import { 
  INITIAL_STUDENT, 
  INITIAL_APPLICATIONS, 
  INITIAL_MISMATCHES 
} from './data/sampleStudents';
import { SCHOLARSHIP_SCHEMES } from './data/scholarshipsData';
import { 
  StudentProfile, 
  ApplicationRecord, 
  MismatchRecord, 
  ScholarshipScheme 
} from './types/scholarship';
import { Language, TRANSLATIONS } from './data/translations';

export default function App() {
  // One-User-One-Login active session state
  const [session, setSession] = useState<UserSession | null>(null);

  const [activePortal, setActivePortal] = useState<ActivePortal>('student');
  const [language, setLanguage] = useState<Language>('en');
  
  // Platform Core State
  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT);
  const [schemes, setSchemes] = useState<ScholarshipScheme[]>(SCHOLARSHIP_SCHEMES);
  const [applications, setApplications] = useState<ApplicationRecord[]>(INITIAL_APPLICATIONS);
  const [mismatches, setMismatches] = useState<MismatchRecord[]>(INITIAL_MISMATCHES);
  
  // Modal states
  const [isJagoOpen, setIsJagoOpen] = useState(false);
  const [selectedSchemeForModal, setSelectedSchemeForModal] = useState<ScholarshipScheme | null>(null);

  const t = TRANSLATIONS[language];

  // Authentication Handlers (Smooth Sign Up & Login Support)
  const handleLoginSuccess = (newSession: UserSession, updatedStudent?: Partial<StudentProfile>) => {
    setSession(newSession);
    if (updatedStudent) {
      setStudent(prev => ({
        ...prev,
        ...updatedStudent
      }));
    }
    if (newSession.role === 'officer' || newSession.role === 'admin') {
      setActivePortal('admin');
    } else {
      setActivePortal('student');
    }
  };

  const handleLogout = () => {
    setSession(null);
  };

  // Application Handlers
  const handleApplySuccess = (newApp: ApplicationRecord) => {
    setApplications(prev => [newApp, ...prev]);
  };

  const handleResolveDeficiency = (appId: string) => {
    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          status: 'Submitted',
          deficiencyReason: undefined,
          deficiencyActionRequired: undefined,
          officerRemarks: 'Deficiency clarification documents uploaded by student. Returned to Nodal Desk priority queue.',
          riskLevel: 'Low'
        };
      }
      return a;
    }));
  };

  const handleUpdateApplicationStatus = (
    appId: string, 
    newStatus: any, 
    remarks?: string, 
    deficiencyReason?: string
  ) => {
    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          status: newStatus,
          officerRemarks: remarks || a.officerRemarks,
          deficiencyReason: deficiencyReason || a.deficiencyReason,
          stageProgress: newStatus === 'Disbursed' ? 100 : newStatus === 'District_Verified' ? 60 : a.stageProgress
        };
      }
      return a;
    }));
  };

  const handleResolveMismatch = (mismatchId: string, action: 'approve' | 'defect') => {
    setMismatches(prev => prev.map(m => {
      if (m.id === mismatchId) {
        return {
          ...m,
          status: action === 'approve' ? 'Override_Approved' : 'Clarification_Requested'
        };
      }
      return m;
    }));
  };

  const handleTriggerDisbursalBatch = () => {
    setApplications(prev => prev.map(a => {
      if (a.status === 'District_Verified' || a.dbtStatus === 'PFMS_Batch_Queued') {
        return {
          ...a,
          status: 'Disbursed',
          dbtStatus: 'Credited',
          stageProgress: 100,
          pfmsTransactionId: `PFMS-2026-DBT-${Math.floor(100000 + Math.random() * 900000)}`,
          officerRemarks: 'Disbursed directly to Aadhaar-seeded bank account via PFMS APB transfer.'
        };
      }
      return a;
    }));
  };

  const handleOpenJagoWithPrompt = (prompt: string) => {
    setIsJagoOpen(true);
  };

  // If no active session, show the Auth screen with One-User-One-Login, smooth Sign-Up & Trial User Feature
  // Defaulting to Sign Up so new users see registration immediately before accessing the app
  if (!session) {
    return (
      <AuthScreen
        onLoginSuccess={handleLoginSuccess}
        student={student}
        language={language}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Top Universal Navbar with Student Portal and Officer Desk Portals */}
      <Navbar
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        language={language}
        setLanguage={setLanguage}
        onOpenJago={() => setIsJagoOpen(true)}
        unreadCount={mismatches.filter(m => m.status === 'Pending_Review').length}
        session={session}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activePortal === 'student' && (
          <StudentAppView
            student={student}
            schemes={schemes}
            applications={applications}
            mismatches={mismatches}
            language={language}
            onUpdateStudent={setStudent}
            onApplySuccess={handleApplySuccess}
            onResolveDeficiency={handleResolveDeficiency}
            onOpenJagoWithPrompt={handleOpenJagoWithPrompt}
            onOpenJago={() => setIsJagoOpen(true)}
          />
        )}

        {activePortal === 'admin' && (
          <AdminPortalView
            applications={applications}
            mismatches={mismatches}
            schemes={schemes}
            student={student}
            language={language}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
            onResolveMismatch={handleResolveMismatch}
            onTriggerDisbursalBatch={handleTriggerDisbursalBatch}
          />
        )}
      </main>

      {/* Scheme Detail / Instant Apply Modal */}
      <SchemeDetailModal
        scheme={selectedSchemeForModal}
        student={student}
        isOpen={!!selectedSchemeForModal}
        language={language}
        onClose={() => setSelectedSchemeForModal(null)}
        onApplySuccess={handleApplySuccess}
        hasAlreadyApplied={applications.some(a => a.schemeId === selectedSchemeForModal?.id)}
      />

      {/* JAGO AI Multilingual Voice & Chat Assistant */}
      <JagoVoiceChat
        isOpen={isJagoOpen}
        onClose={() => setIsJagoOpen(false)}
        student={student}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Tricolor National Footer */}
      <footer className="bg-slate-900/90 border-t border-slate-800/80 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">{t.brandTitle}</span>
            <span>•</span>
            <span className="text-orange-400 font-medium">{t.brandTag}</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Direct Benefit Transfer</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>DigiLocker Sandbox Gateway</span>
            <span>•</span>
            <span>APAAR / ABC Academic Bank</span>
            <span>•</span>
            <span>NPCI Aadhaar Payment Bridge (APB)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
