import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  IndianRupee, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Download, 
  HelpCircle,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ApplicationRecord, StudentProfile } from '../../types/scholarship';

interface ApplicationTrackerProps {
  applications: ApplicationRecord[];
  student: StudentProfile;
  onOpenJagoWithPrompt?: (prompt: string) => void;
  onResolveDeficiency?: (appId: string) => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  student,
  onOpenJagoWithPrompt,
  onResolveDeficiency
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  const STAGES = [
    { key: 'Submitted', label: '1. Application Submitted', desc: 'Aadhaar & DigiLocker e-Signed' },
    { key: 'Institute_Verified', label: '2. College / School Verification', desc: 'Bonafide & Fee Roll verified by Nodal Officer' },
    { key: 'District_Verified', label: '3. District Welfare Approval', desc: 'District Magistrate / Social Welfare Nodal Review' },
    { key: 'State_Sanctioned', label: '4. State Sanction Order', desc: 'State Directorate financial sanction issued' },
    { key: 'Disbursed', label: '5. PFMS DBT Disbursal', desc: 'Aadhaar Payment Bridge transfer credited to bank' }
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'Submitted': return 0;
      case 'Institute_Verified': return 1;
      case 'District_Verified': return 2;
      case 'State_Sanctioned': return 3;
      case 'Disbursed': return 4;
      case 'Deficient': return 1;
      case 'Rejected': return 1;
      default: return 0;
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Overview Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-800/90 via-slate-800 to-indigo-950/60 border border-slate-700/80 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>Scholarship Application & DBT Lifecycle</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono border border-blue-500/30">
              Live PFMS Bridge
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent real-time milestone tracking from College Nodal desk to Aadhaar DBT bank account
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
            <span className="text-slate-400">Total Sanctioned: </span>
            <span className="font-bold text-emerald-300">
              ₹{applications.filter(a => a.status !== 'Rejected' && a.status !== 'Deficient').reduce((acc, curr) => acc + curr.amountSanctioned, 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: App List on Left, Active Tracker on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left List of Applications */}
        <div className="lg:col-span-5 space-y-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-1">
            Submitted Applications ({applications.length})
          </span>

          {applications.map((app) => {
            const isSelected = app.id === selectedApp?.id;
            const isDeficient = app.status === 'Deficient';

            return (
              <div
                key={app.id}
                onClick={() => setSelectedAppId(app.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-blue-500 ring-1 ring-blue-500/50 shadow-md'
                    : 'bg-slate-800/50 hover:bg-slate-800/70 border-slate-700/70'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">{app.applicationNumber}</span>
                    <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 mt-0.5">
                      {app.schemeName}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Applied: {app.appliedDate} • ₹{app.amountSanctioned.toLocaleString('en-IN')}/yr
                    </p>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isDeficient 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                      : app.status === 'Disbursed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {app.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Active Timeline Details */}
        <div className="lg:col-span-7">
          {selectedApp ? (
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-5">
              
              {/* Header details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700/80 pb-4 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">{selectedApp.applicationNumber}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                      Match: {selectedApp.matchScore}%
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                    {selectedApp.schemeName}
                  </h3>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-[11px] text-slate-400">Award Entitlement</p>
                  <p className="text-base font-extrabold text-emerald-300 font-mono">
                    ₹{selectedApp.amountSanctioned.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Deficiency Alert Box if Flagged */}
              {selectedApp.status === 'Deficient' && (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-600/50 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>DEFICIENCY NOTICE ISSUED BY NODAL OFFICER</span>
                  </div>
                  <p className="text-xs text-rose-200">
                    <strong>Reason:</strong> {selectedApp.deficiencyReason}
                  </p>
                  <p className="text-[11px] text-slate-300">
                    <strong>Action Required:</strong> {selectedApp.deficiencyActionRequired}
                  </p>
                  
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-amber-300 font-mono">
                      ⏳ Mandatory 15-Day Correction Window Active
                    </span>

                    <button
                      onClick={() => onResolveDeficiency?.(selectedApp.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition"
                    >
                      Submit Clarification
                    </button>
                  </div>
                </div>
              )}

              {/* 5-Stage Visual Progress Timeline */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  Verification Pipeline
                </h4>

                <div className="space-y-3">
                  {STAGES.map((stg, idx) => {
                    const currentIdx = getStageIndex(selectedApp.status);
                    const isPassed = idx < currentIdx || (idx === currentIdx && selectedApp.status === 'Disbursed');
                    const isCurrent = idx === currentIdx && selectedApp.status !== 'Disbursed';

                    return (
                      <div key={stg.key} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isPassed 
                              ? 'bg-emerald-500 text-slate-950' 
                              : isCurrent 
                              ? 'bg-blue-600 text-white ring-4 ring-blue-500/20' 
                              : 'bg-slate-700 text-slate-400'
                          }`}>
                            {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          {idx < STAGES.length - 1 && (
                            <div className={`w-0.5 h-6 mt-1 ${isPassed ? 'bg-emerald-500/60' : 'bg-slate-700'}`}></div>
                          )}
                        </div>

                        <div className="flex-1 pb-2">
                          <div className="flex items-center justify-between">
                            <p className={`text-xs font-bold ${isCurrent ? 'text-white' : isPassed ? 'text-emerald-300' : 'text-slate-400'}`}>
                              {stg.label}
                            </p>
                            {isCurrent && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                                In Progress
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">{stg.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* DBT & Bank NPCI Settlement Box */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Aadhaar Payment Bridge (PFMS DBT) Status</span>
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    selectedApp.dbtStatus === 'PFMS_Batch_Queued'
                      ? 'bg-amber-500/20 text-amber-300'
                      : selectedApp.dbtStatus === 'Credited'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {selectedApp.dbtStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-400">Target Bank Account:</span>
                    <p className="text-white font-mono">{student.bankAccount.bankName} ({student.bankAccount.accountNumberMasked})</p>
                  </div>
                  <div>
                    <span className="text-slate-400">NPCI Mandate Status:</span>
                    <p className="text-emerald-300 font-semibold">Active & Aadhaar Seeded</p>
                  </div>
                  {selectedApp.pfmsTransactionId && (
                    <div className="col-span-2">
                      <span className="text-slate-400">PFMS Batch Reference:</span>
                      <p className="text-blue-300 font-mono">{selectedApp.pfmsTransactionId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Officer Remarks & Help */}
              {selectedApp.officerRemarks && (
                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/50 text-[11px] text-slate-300">
                  <span className="font-semibold text-slate-200">Latest Nodal Officer Remark: </span>
                  <span>{selectedApp.officerRemarks}</span>
                </div>
              )}

              {/* JAGO Support Trigger */}
              {onOpenJagoWithPrompt && (
                <button
                  onClick={() => onOpenJagoWithPrompt(`Can you explain the current status of my application ${selectedApp.applicationNumber} and when the scholarship will be deposited?`)}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ask JAGO about this application status</span>
                </button>
              )}

            </div>
          ) : (
            <p className="text-xs text-slate-400">No application selected</p>
          )}
        </div>

      </div>

    </div>
  );
};
