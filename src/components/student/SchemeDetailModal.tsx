import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Calendar, 
  IndianRupee, 
  ShieldCheck, 
  Building2, 
  Send, 
  Sparkles,
  ArrowRight,
  Clock,
  FileCheck2,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ScholarshipScheme, StudentProfile, ApplicationRecord } from '../../types/scholarship';
import { evaluateSchemeEligibility } from '../../services/smartEngines';
import { Language, TRANSLATIONS } from '../../data/translations';

interface SchemeDetailModalProps {
  scheme: ScholarshipScheme | null;
  student: StudentProfile;
  isOpen: boolean;
  language?: Language;
  onClose: () => void;
  onApplySuccess: (newApp: ApplicationRecord) => void;
  hasAlreadyApplied?: boolean;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  scheme,
  student,
  isOpen,
  language = 'en',
  onClose,
  onApplySuccess,
  hasAlreadyApplied = false
}) => {
  const t = TRANSLATIONS[language];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentAadhaar, setConsentAadhaar] = useState(true);
  const [consentDigilocker, setConsentDigilocker] = useState(true);
  const [preFlightReconciled, setPreFlightReconciled] = useState(false);

  if (!isOpen || !scheme) return null;

  const matchResult = evaluateSchemeEligibility(student, scheme);

  const handleApply = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newApp: ApplicationRecord = {
        id: `app_${Date.now()}`,
        applicationNumber: `SS-2026-UP-${Math.floor(100000 + Math.random() * 900000)}`,
        schemeId: scheme.id,
        schemeName: scheme.name,
        studentId: student.id,
        studentName: student.fullName,
        apaarId: student.apaarId,
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'Submitted',
        stageProgress: 20,
        amountSanctioned: scheme.annualBenefit,
        dbtStatus: 'Not_Initiated',
        officerRemarks: 'Submitted via ShikshaSetu Pre-Flight Verified Engine. Transferred to Institute Nodal Officer desk.',
        riskLevel: matchResult.blockers.length > 0 ? 'High' : 'Low',
        matchScore: matchResult.matchScore
      };

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      setIsSubmitting(false);
      onApplySuccess(newApp);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800 flex items-start justify-between">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {scheme.code}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                {matchResult.matchScore}% Match
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Quota: {scheme.quotaFilledPercent}% filled
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
              {scheme.name}
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>{scheme.ministry}</span>
            </p>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-300">
          
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                <span>{t.annualBenefit}</span>
              </div>
              <p className="text-sm font-bold text-emerald-300">
                ₹{scheme.annualBenefit.toLocaleString('en-IN')}/year
              </p>
              <p className="text-[10px] text-slate-400 truncate">{scheme.benefitType}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                <span>{t.deadline}</span>
              </div>
              <p className="text-sm font-bold text-amber-300">
                {scheme.deadlineDate}
              </p>
              <p className="text-[10px] text-slate-400">First batch allocation</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                <span>Direct Benefit Transfer</span>
              </div>
              <p className="text-xs font-semibold text-blue-200">
                PFMS Aadhaar Bridge
              </p>
              <p className="text-[10px] text-slate-400">Direct to {student.bankAccount.bankName}</p>
            </div>
          </div>

          {/* Scheme Description */}
          <div>
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-1.5">
              Scheme Description
            </h4>
            <p className="leading-relaxed text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              {scheme.description}
            </p>
          </div>

          {/* Pre-Flight Document Check Status Card */}
          <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-orange-400 font-bold">✈️</span>
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                  Pre-Flight Submission Document Audit
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {preFlightReconciled ? 'All Clear (5/5 Pass)' : 'Audit Active'}
              </span>
            </div>

            {/* Checklist */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-slate-200">Income Certificate (Tehsildar)</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  [FIT & VALID]
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={preFlightReconciled ? "text-emerald-400" : "text-amber-400"}>
                    {preFlightReconciled ? "✓" : "⚠️"}
                  </span>
                  <span className="text-slate-200">Class 12th Marksheet (CBSE)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    preFlightReconciled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {preFlightReconciled ? '[MATCHED]' : '[SPELLING DISCREPANCY]'}
                  </span>
                  {!preFlightReconciled && (
                    <button
                      onClick={() => setPreFlightReconciled(true)}
                      className="text-[10px] text-orange-400 hover:underline"
                    >
                      Sync DigiLocker
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-slate-200">Aadhaar & NPCI Bank Link ({student.bankAccount.bankName})</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  [SEEDED & FIT]
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 pt-1">
              {preFlightReconciled 
                ? '✓ All documents match official repositories. No risk of rejection at Institute or District Nodal desk.'
                : '💡 Pre-Flight check confirmed basic criteria match. Minor name discrepancy can be auto-cleared.'}
            </p>
          </div>

          {/* Consent Checkboxes */}
          {!hasAlreadyApplied && (
            <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/40 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentAadhaar}
                  onChange={(e) => setConsentAadhaar(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-0"
                />
                <span className="text-[11px] text-indigo-200">
                  I give statutory consent to fetch my verified demographic and academic credentials from DigiLocker & APAAR repository.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentDigilocker}
                  onChange={(e) => setConsentDigilocker(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-0"
                />
                <span className="text-[11px] text-indigo-200">
                  I authorize Direct Benefit Transfer (DBT) under 30-Day Citizen's Charter to my Aadhaar-seeded account ({student.bankAccount.bankName}).
                </span>
              </label>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-800/90 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            Close
          </button>

          {hasAlreadyApplied ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.alreadyApplied}</span>
            </div>
          ) : (
            <button
              onClick={handleApply}
              disabled={isSubmitting || !consentAadhaar || !consentDigilocker}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Submitting & Initializing 30-Day Charter...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{t.applyNow}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
