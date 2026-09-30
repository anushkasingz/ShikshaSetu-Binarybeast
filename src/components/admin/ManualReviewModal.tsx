import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Send, 
  Clock, 
  FileText, 
  Check, 
  XCircle,
  Building2,
  Calendar
} from 'lucide-react';
import { ApplicationRecord, StudentProfile } from '../../types/scholarship';

interface ManualReviewModalProps {
  application: ApplicationRecord | null;
  student: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onDecision: (
    appId: string, 
    decision: 'Approve' | 'Deficient' | 'Reject', 
    remarks: string,
    deficiencyReason?: string
  ) => void;
}

export const ManualReviewModal: React.FC<ManualReviewModalProps> = ({
  application,
  student,
  isOpen,
  onClose,
  onDecision
}) => {
  const [remarks, setRemarks] = useState('');
  const [selectedDeficiencyReason, setSelectedDeficiencyReason] = useState('Income certificate nearing expiration; updated e-District copy required.');
  const [decisionMode, setDecisionMode] = useState<'view' | 'approve' | 'defect' | 'reject'>('view');

  if (!isOpen || !application) return null;

  const handleConfirmDecision = (decision: 'Approve' | 'Deficient' | 'Reject') => {
    onDecision(
      application.id,
      decision,
      remarks || (decision === 'Approve' ? 'All criteria, documents, and DigiLocker records verified. Approved for state sanction.' : 'Deficiency notice issued with 15-day cure window.'),
      decision === 'Deficient' ? selectedDeficiencyReason : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-b border-slate-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                OFFICER REVIEW DESK
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {application.applicationNumber}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-1">
              {application.studentName} — {application.schemeName}
            </h2>
            <p className="text-xs text-slate-400">
              APAAR ID: {application.apaarId} • Sanction Award: ₹{application.amountSanctioned.toLocaleString('en-IN')}
            </p>
          </div>

          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-300">
          
          {/* Student Dossier Summary */}
          <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div>
              <span className="text-[10px] text-slate-400 block">Category</span>
              <span className="font-semibold text-white">{student.category}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Annual Income</span>
              <span className="font-semibold text-emerald-300 font-mono">₹{student.annualFamilyIncome.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">12th Marks</span>
              <span className="font-semibold text-white font-mono">{student.marksPercentage}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Institution</span>
              <span className="font-semibold text-white truncate block">{student.institutionName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">DigiLocker Status</span>
              <span className="font-semibold text-emerald-400">Verified Credentials</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">NPCI DBT Bank</span>
              <span className="font-semibold text-emerald-400">Aadhaar Seeded</span>
            </div>
          </div>

          {/* Current Application Details */}
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Current Verification Status:</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {application.status.replace(/_/g, ' ')}
              </span>
            </div>
            {application.officerRemarks && (
              <p className="text-[11px] text-slate-400 italic">
                Prior Remarks: "{application.officerRemarks}"
              </p>
            )}
          </div>

          {/* Decision Modes Selection */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              Select Officer Adjudication
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDecisionMode('approve')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                  decisionMode === 'approve'
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-xs">Approve & Sanction</span>
                <span className="text-[9px] text-slate-400">Queue for PFMS DBT</span>
              </button>

              <button
                type="button"
                onClick={() => setDecisionMode('defect')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                  decisionMode === 'defect'
                    ? 'bg-amber-600/30 border-amber-500 text-amber-200 ring-2 ring-amber-500/30'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-xs">Mark Deficient</span>
                <span className="text-[9px] text-slate-400">15-Day Correction Window</span>
              </button>

              <button
                type="button"
                onClick={() => setDecisionMode('reject')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                  decisionMode === 'reject'
                    ? 'bg-rose-600/30 border-rose-500 text-rose-200 ring-2 ring-rose-500/30'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <XCircle className="w-5 h-5 text-rose-400" />
                <span className="font-bold text-xs">Reject</span>
                <span className="text-[9px] text-slate-400">Ineligible / Disqualified</span>
              </button>
            </div>
          </div>

          {/* If Deficient: Reason Picker */}
          {decisionMode === 'defect' && (
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-2 animate-in fade-in">
              <label className="block font-semibold text-amber-300 text-xs">
                Deficiency Reason (Student will see this in their JAGO radar):
              </label>
              <select
                value={selectedDeficiencyReason}
                onChange={(e) => setSelectedDeficiencyReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Income certificate nearing expiration; updated e-District copy required.">
                  Income certificate nearing expiration; updated e-District copy required.
                </option>
                <option value="Aadhaar and Board Marksheet name variance detected; clarification needed.">
                  Aadhaar and Board Marksheet name variance detected; clarification needed.
                </option>
                <option value="College bonafide admission receipt seal unclear; re-upload clear PDF.">
                  College bonafide admission receipt seal unclear; re-upload clear PDF.
                </option>
                <option value="Bank account unlinked from NPCI Aadhaar mapper; mandate required.">
                  Bank account unlinked from NPCI Aadhaar mapper; mandate required.
                </option>
              </select>
            </div>
          )}

          {/* Officer Remarks Field */}
          <div>
            <label className="block mb-1 font-semibold text-slate-300">
              Audit Remarks & Officer Log:
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter official remark for audit trail..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-800/90 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>

          {decisionMode === 'approve' && (
            <button
              onClick={() => handleConfirmDecision('Approve')}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Sanction Approval</span>
            </button>
          )}

          {decisionMode === 'defect' && (
            <button
              onClick={() => handleConfirmDecision('Deficient')}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Defect Notice</span>
            </button>
          )}

          {decisionMode === 'reject' && (
            <button
              onClick={() => handleConfirmDecision('Reject')}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition"
            >
              <XCircle className="w-4 h-4" />
              <span>Confirm Rejection</span>
            </button>
          )}

          {decisionMode === 'view' && (
            <span className="text-xs text-slate-400 italic">Select an adjudication decision above</span>
          )}
        </div>

      </div>
    </div>
  );
};
