import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  Scale, 
  Sparkles, 
  ExternalLink, 
  Check, 
  X,
  FileWarning
} from 'lucide-react';
import { MismatchRecord } from '../../types/scholarship';

interface MismatchDeskProps {
  mismatches: MismatchRecord[];
  onResolveMismatch: (mismatchId: string, action: 'approve' | 'defect') => void;
}

export const MismatchDesk: React.FC<MismatchDeskProps> = ({
  mismatches,
  onResolveMismatch
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filtered = mismatches.filter(m => {
    if (filterSeverity === 'ALL') return true;
    return m.severity === filterSeverity;
  });

  return (
    <div className="space-y-4">
      
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-800/90 via-slate-800 to-amber-950/40 border border-slate-700/80 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Automated Mismatch & Discrepancy Queue
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                AI Cross-Check Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Cross-comparing student claims against DigiLocker, UDISE+, and APAAR verified state repositories
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'Critical', 'Warning', 'Minor'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterSeverity === sev
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Mismatch Cards */}
      <div className="space-y-3">
        {filtered.map((m) => {
          const isPending = m.status === 'Pending_Review' || m.status === 'Clarification_Requested';

          return (
            <div
              key={m.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    m.severity === 'Critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : m.severity === 'Warning'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {m.severity} Severity
                  </span>
                  <span className="font-bold text-white text-xs sm:text-sm">
                    {m.fieldName} Variance
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Applicant: <strong className="text-slate-200">{m.studentName}</strong> (APAAR: {m.apaarId})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">Detected: {m.detectedAt}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    m.status === 'Override_Approved' 
                      ? 'bg-emerald-500/20 text-emerald-300' 
                      : m.status === 'Rejected'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-slate-700 text-amber-300'
                  }`}>
                    {m.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Side-by-side diff */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Student claim */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Student Entered Value
                  </span>
                  <p className="text-sm font-bold text-white font-mono">
                    {m.studentClaimedValue}
                  </p>
                  <p className="text-[10px] text-slate-400">Source: Self-Declaration & Portal Form</p>
                </div>

                {/* Verified Source */}
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-700/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-indigo-300 uppercase tracking-wider">
                      Official Verified Data ({m.officialSource})
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-700/50">
                      Authoritative Source
                    </span>
                  </div>
                  <p className="text-sm font-bold text-indigo-200 font-mono">
                    {m.sourceVerifiedValue}
                  </p>
                  <p className="text-[10px] text-slate-400">Digital Seal Authenticated via Sandbox Gateway</p>
                </div>
              </div>

              {/* AI Recommendation Snippet */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/40 text-xs text-slate-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-slate-200 text-[11px]">AI Recommender Analysis:</p>
                  <p className="text-[11px] text-slate-300">{m.suggestion}</p>
                </div>
              </div>

              {/* Officer Actions */}
              {isPending && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/60">
                  <button
                    onClick={() => onResolveMismatch(m.id, 'defect')}
                    className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition"
                  >
                    Issue Defect Notice (15-Day Cure)
                  </button>

                  <button
                    onClick={() => onResolveMismatch(m.id, 'approve')}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Auto-Reconciliation</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-400 bg-slate-800/40 rounded-2xl border border-slate-700">
            No mismatches in this severity category. All records are reconciled.
          </div>
        )}
      </div>

    </div>
  );
};
