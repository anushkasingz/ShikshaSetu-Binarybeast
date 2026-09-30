import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileCheck2, 
  Scale, 
  CreditCard, 
  Users, 
  BarChart3, 
  PieChart as PieIcon,
  UserCheck, 
  Bell, 
  Building2,
  RefreshCw,
  Search,
  MapPin
} from 'lucide-react';
import { ApplicationRecord, MismatchRecord, ScholarshipScheme, StudentProfile } from '../../types/scholarship';
import { ApplicationsQueue } from './ApplicationsQueue';
import { MismatchDesk } from './MismatchDesk';
import { DbtMonitoring } from './DbtMonitoring';
import { UnreachedStudentsDesk } from './UnreachedStudentsDesk';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { CoverageHeatmapCharts } from './CoverageHeatmapCharts';
import { ManualReviewModal } from './ManualReviewModal';
import { Language, TRANSLATIONS } from '../../data/translations';

interface AdminPortalViewProps {
  applications: ApplicationRecord[];
  mismatches: MismatchRecord[];
  schemes: ScholarshipScheme[];
  student: StudentProfile;
  language?: Language;
  onUpdateApplicationStatus: (appId: string, newStatus: any, remarks?: string, deficiencyReason?: string) => void;
  onResolveMismatch: (mismatchId: string, action: 'approve' | 'defect') => void;
  onTriggerDisbursalBatch: () => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  applications,
  mismatches,
  schemes,
  student,
  language = 'en',
  onUpdateApplicationStatus,
  onResolveMismatch,
  onTriggerDisbursalBatch
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'visuals' | 'queue' | 'mismatches' | 'dbt' | 'outreach' | 'analytics'>('visuals');
  const [officerRole, setOfficerRole] = useState<'District Welfare Officer (Varanasi)' | 'State Nodal Officer (Uttar Pradesh)' | 'Institute Nodal Officer (AKTU/GEC)'>('District Welfare Officer (Varanasi)');
  const [reviewModalApp, setReviewModalApp] = useState<ApplicationRecord | null>(null);

  const pendingMismatches = mismatches.filter(m => m.status === 'Pending_Review').length;
  const pendingApps = applications.filter(a => a.status === 'Submitted' || a.status === 'District_Verified').length;

  return (
    <div className="py-4 px-2 sm:px-4 max-w-7xl mx-auto space-y-5">
      
      {/* Officer Header Card with Tricolor Border & Aesthetics */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-500 via-white to-emerald-500"></div>

        <div className="flex items-center gap-3.5 pl-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 shrink-0 ring-1 ring-white/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{t.officerPortalTitle}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                {t.officerNodalDesk}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.officerRoleLabel} <strong className="text-slate-200">{officerRole}</strong> • Session Verified via e-Pramaan Single Sign-On
            </p>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">{t.officerRoleLabel}</span>
          <select
            value={officerRole}
            onChange={(e) => setOfficerRole(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-sm"
          >
            <option value="District Welfare Officer (Varanasi)">District Welfare Officer (Varanasi)</option>
            <option value="State Nodal Officer (Uttar Pradesh)">State Nodal Officer (Uttar Pradesh)</option>
            <option value="Institute Nodal Officer (AKTU/GEC)">Institute Nodal Officer (AKTU/GEC)</option>
          </select>
        </div>
      </div>

      {/* KPI Counters with Indian Tricolor Accents */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 hover:border-slate-600 transition shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">{t.kpiTotalApps}</span>
          <div className="text-xl font-bold text-white font-mono mt-0.5">{applications.length} Files</div>
          <span className="text-[10px] text-blue-400 font-medium">100% Aadhaar Verified</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 hover:border-amber-500/40 transition shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">{t.kpiPendingVerif}</span>
          <div className="text-xl font-bold text-amber-300 font-mono mt-0.5">{pendingApps} Pending</div>
          <span className="text-[10px] text-amber-400 font-medium">Immediate Nodal Action</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 hover:border-rose-500/40 transition shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">{t.kpiFlaggedMismatches}</span>
          <div className="text-xl font-bold text-rose-400 font-mono mt-0.5">{pendingMismatches} Discrepancies</div>
          <span className="text-[10px] text-rose-300 font-medium">Automated Detection</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 hover:border-emerald-500/40 transition shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">{t.kpiDisbursed}</span>
          <div className="text-xl font-bold text-emerald-300 font-mono mt-0.5">
            ₹{applications.reduce((acc, a) => acc + (a.status === 'Disbursed' ? a.amountSanctioned : 0), 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">PFMS Direct Benefit Transfer</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center p-1 bg-slate-800/90 rounded-2xl border border-slate-700/70 shadow-inner overflow-x-auto">
        
        {/* Visuals Tab */}
        <button
          onClick={() => setActiveTab('visuals')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'visuals'
              ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <PieIcon className="w-3.5 h-3.5" />
          <span>{t.tabChartsHeatmaps}</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/20 text-white font-mono">
            New
          </span>
        </button>

        <button
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'queue'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>{t.tabVerifQueue} ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mismatches')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'mismatches'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>{t.tabMismatchDesk}</span>
          {pendingMismatches > 0 && (
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white">
              {pendingMismatches}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('dbt')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'dbt'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>{t.tabDbtMonitoring}</span>
        </button>

        <button
          onClick={() => setActiveTab('outreach')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'outreach'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{t.tabUnreachedOutreach}</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>{t.tabAnalytics}</span>
        </button>

      </div>

      {/* Tab Panels */}
      {activeTab === 'visuals' && (
        <CoverageHeatmapCharts
          applications={applications}
          schemes={schemes}
        />
      )}

      {activeTab === 'queue' && (
        <ApplicationsQueue
          applications={applications}
          onSelectApplication={(app: ApplicationRecord) => setReviewModalApp(app)}
          onOpenManualReview={(app: ApplicationRecord) => setReviewModalApp(app)}
        />
      )}

      {activeTab === 'mismatches' && (
        <MismatchDesk
          mismatches={mismatches}
          onResolveMismatch={onResolveMismatch}
        />
      )}

      {activeTab === 'dbt' && (
        <DbtMonitoring
          applications={applications}
          onTriggerDisbursalBatch={onTriggerDisbursalBatch}
        />
      )}

      {activeTab === 'outreach' && (
        <UnreachedStudentsDesk />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsDashboard
          applications={applications}
          schemes={schemes}
        />
      )}

      {/* Manual Review Modal */}
      {reviewModalApp && (
        <ManualReviewModal
          application={reviewModalApp}
          student={student}
          isOpen={!!reviewModalApp}
          onClose={() => setReviewModalApp(null)}
          onDecision={(appId: string, decision: 'Approve' | 'Deficient' | 'Reject', remarks: string, deficiencyReason?: string) => {
            const newStatus = decision === 'Approve' ? 'District_Verified' : decision === 'Deficient' ? 'Deficient' : 'Rejected';
            onUpdateApplicationStatus(appId, newStatus, remarks, deficiencyReason);
            setReviewModalApp(null);
          }}
        />
      )}

    </div>
  );
};
