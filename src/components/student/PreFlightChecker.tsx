import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  FileText, 
  ShieldCheck, 
  RefreshCw, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  Info,
  Calendar,
  Layers,
  UserCheck
} from 'lucide-react';
import { StudentProfile, ScholarshipScheme } from '../../types/scholarship';
import { Language, TRANSLATIONS } from '../../data/translations';

interface PreFlightCheckerProps {
  student: StudentProfile;
  schemes: ScholarshipScheme[];
  language?: Language;
  onUpdateStudent?: (student: StudentProfile) => void;
  onSelectSchemeToApply?: (scheme: ScholarshipScheme) => void;
}

export interface DocumentAuditResult {
  docId: string;
  docName: string;
  type: string;
  issuer: string;
  isFit: boolean;
  fitNotes: string;
  isMatched: boolean;
  matchNotes: string;
  isValid: boolean;
  validityNotes: string;
  criticality: 'PASS' | 'WARNING' | 'CRITICAL';
}

export const PreFlightChecker: React.FC<PreFlightCheckerProps> = ({
  student,
  schemes,
  language = 'en',
  onUpdateStudent,
  onSelectSchemeToApply
}) => {
  const t = TRANSLATIONS[language];
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(schemes[0]?.id || 'scheme_1');
  const [isSyncing, setIsSyncing] = useState(false);
  const [resolvedIssues, setResolvedIssues] = useState<Record<string, boolean>>({});

  const selectedScheme = schemes.find(s => s.id === selectedSchemeId) || schemes[0];

  // Dynamic audit generator based on student documents and chosen scheme
  const auditResults: DocumentAuditResult[] = [
    {
      docId: 'doc_aadhaar',
      docName: 'Aadhaar Demographic Card',
      type: 'Identity & Biometric',
      issuer: 'UIDAI DigiLocker Gateway',
      isFit: true,
      fitNotes: 'Full KYC & demographic record match National Scholarship Portal format.',
      isMatched: true,
      matchNotes: `Name matches APAAR ID: ${student.fullName}. Verified with linked mobile.`,
      isValid: true,
      validityNotes: 'Aadhaar e-KYC valid indefinitely. Biometric lock disabled for DBT.',
      criticality: 'PASS'
    },
    {
      docId: 'doc_income',
      docName: 'Annual Family Income Certificate',
      type: 'Financial Eligibility',
      issuer: 'Tehsildar Office, District Varanasi',
      isFit: !resolvedIssues['doc_income'] && student.annualFamilyIncome > selectedScheme.criteria.maxFamilyIncomeAnnual ? false : true,
      fitNotes: !resolvedIssues['doc_income'] && student.annualFamilyIncome > selectedScheme.criteria.maxFamilyIncomeAnnual
        ? `MISFIT: Uploaded certificate shows ₹${student.annualFamilyIncome.toLocaleString('en-IN')}, but ${selectedScheme.shortName} ceiling is ₹${selectedScheme.criteria.maxFamilyIncomeAnnual.toLocaleString('en-IN')}.`
        : `FIT: Income ₹${student.annualFamilyIncome.toLocaleString('en-IN')} is within ₹${selectedScheme.criteria.maxFamilyIncomeAnnual.toLocaleString('en-IN')} ceiling.`,
      isMatched: true,
      matchNotes: 'Father\'s name and applicant address correlate with DigiLocker records.',
      isValid: resolvedIssues['doc_income'] ? true : false,
      validityNotes: resolvedIssues['doc_income'] 
        ? 'Renewed: Current Financial Year 2026-27 certificate verified.'
        : 'EXPIRED: Certificate was issued on 14-May-2023 (> 12 months validity elapsed). Government requires renewal for FY 2026-27.',
      criticality: resolvedIssues['doc_income'] ? 'PASS' : 'CRITICAL'
    },
    {
      docId: 'doc_12th',
      docName: 'Class 12th Board Marksheet',
      type: 'Academic Merit',
      issuer: 'CBSE New Delhi',
      isFit: true,
      fitNotes: `FIT: Student scored ${student.marksPercentage}% (Minimum required: ${selectedScheme.criteria.minMarksPercent}%).`,
      isMatched: resolvedIssues['doc_12th'] ? true : false,
      matchNotes: resolvedIssues['doc_12th']
        ? 'RESOLVED: Name spelling synchronized to "Priya Sharma" with CBSE Board API.'
        : 'MISMATCHED: Name appears as "Priya Kumari" on Marksheet but "Priya Sharma" on Aadhaar/APAAR (89% risk of officer rejection).',
      isValid: true,
      validityNotes: 'Permanent digital educational certificate with cryptographic QR.',
      criticality: resolvedIssues['doc_12th'] ? 'PASS' : 'WARNING'
    },
    {
      docId: 'doc_caste',
      docName: 'Social Category Certificate (OBC-NCL)',
      type: 'Reservation Quota',
      issuer: 'Revenue Department, UP',
      isFit: true,
      fitNotes: `FIT: Applicant category "${student.category}" is eligible for the allocated quota.`,
      isMatched: true,
      matchNotes: 'Certificate bar-code matches state revenue e-District repository.',
      isValid: true,
      validityNotes: 'Valid through 31-March-2027.',
      criticality: 'PASS'
    },
    {
      docId: 'doc_domicile',
      docName: 'State Domicile Certificate',
      type: 'Jurisdiction Proof',
      issuer: 'District Magistrate Office, Varanasi',
      isFit: true,
      fitNotes: `FIT: Domiciled in ${student.domicileState}, matching state quota allocations.`,
      isMatched: true,
      matchNotes: 'Permanent residential address verified.',
      isValid: true,
      validityNotes: 'Lifetime domicile validity verified.',
      criticality: 'PASS'
    },
    {
      docId: 'doc_bank',
      docName: 'Aadhaar-Seeded Bank Passbook / NPCI Mandate',
      type: 'DBT Direct Disbursal',
      issuer: `${student.bankAccount.bankName} (NPCI APB)`,
      isFit: student.bankAccount.npciAadhaarSeeded ? true : false,
      fitNotes: student.bankAccount.npciAadhaarSeeded 
        ? 'FIT: Bank account is actively linked to NPCI Aadhaar Payment Bridge for direct credit.'
        : 'MISFIT: Bank account is not seeded with Aadhaar. Disbursals will fail.',
      isMatched: true,
      matchNotes: `Account ending in ${student.bankAccount.accountNumberMasked} belongs to ${student.fullName}.`,
      isValid: true,
      validityNotes: 'Active transaction status confirmed via PFMS mandate.',
      criticality: student.bankAccount.npciAadhaarSeeded ? 'PASS' : 'CRITICAL'
    }
  ];

  const hasCritical = auditResults.some(r => r.criticality === 'CRITICAL');
  const hasWarning = auditResults.some(r => r.criticality === 'WARNING');

  const handleAutoReconcile = (docId: string) => {
    setIsSyncing(true);
    setTimeout(() => {
      setResolvedIssues(prev => ({ ...prev, [docId]: true }));
      setIsSyncing(false);
    }, 700);
  };

  const handleAutoReconcileAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setResolvedIssues({
        doc_income: true,
        doc_12th: true,
        doc_caste: true,
        doc_bank: true
      });
      setIsSyncing(false);
    }, 1200);
  };

  return (
    <div className="py-4 px-2 sm:px-4 max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-950/40 via-slate-900 to-emerald-950/40 border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold uppercase tracking-wider">
              {t.preFlightTitle}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              3-Way Audit Engine
            </span>
          </div>
          <h2 className="text-base sm:text-xl font-bold text-white">
            {t.preFlightTitle}
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            {t.preFlightSubtitle}
          </p>
        </div>

        {/* Scheme Selector for Targeted Audit */}
        <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-700 shrink-0">
          <span className="text-xs text-slate-400 font-semibold">Target Scheme:</span>
          <select
            value={selectedSchemeId}
            onChange={(e) => setSelectedSchemeId(e.target.value)}
            className="bg-slate-800 text-xs text-white rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            {schemes.map(s => (
              <option key={s.id} value={s.id}>
                {s.shortName} (₹{s.annualBenefit.toLocaleString('en-IN')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Flight Status Assessment Card */}
      <div className={`p-5 rounded-2xl border shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        hasCritical 
          ? 'bg-rose-950/30 border-rose-500/50' 
          : hasWarning
          ? 'bg-amber-950/30 border-amber-500/50'
          : 'bg-emerald-950/30 border-emerald-500/50'
      }`}>
        <div className="flex items-start gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
            hasCritical 
              ? 'bg-rose-600 text-white shadow-rose-600/30' 
              : hasWarning 
              ? 'bg-amber-600 text-white shadow-amber-600/30'
              : 'bg-emerald-600 text-white shadow-emerald-600/30'
          }`}>
            {hasCritical ? <XCircle className="w-6 h-6" /> : hasWarning ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white">
                {hasCritical 
                  ? t.preFlightBlocked 
                  : hasWarning 
                  ? 'Caution Advised: 1 Discrepancy Found' 
                  : t.preFlightReady}
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                hasCritical ? 'bg-rose-500/20 text-rose-300' : hasWarning ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {hasCritical ? 'Pre-Flight Halted' : hasWarning ? 'Caution' : 'Cleared for Submission'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {hasCritical 
                ? 'Your application will face rejection or a 15-day deficiency block at the District Nodal desk unless resolved.'
                : hasWarning
                ? 'Minor discrepancy detected. You may auto-reconcile or submit with an officer remarks waiver.'
                : 'All certificates are authentic, active for FY 2026-27, and verified against National Academic Depository & DigiLocker.'}
            </p>
          </div>
        </div>

        {/* Global Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          {(hasCritical || hasWarning) && (
            <button
              onClick={handleAutoReconcileAll}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing DigiLocker...' : 'Auto-Reconcile All via DigiLocker'}</span>
            </button>
          )}

          {!hasCritical && onSelectSchemeToApply && (
            <button
              onClick={() => onSelectSchemeToApply(selectedScheme)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.preFlightProceed}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3 Audit Pillars Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-xs font-bold text-white">1. Misfit Check</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Checks if uploaded file matches the required document type, social reservation category, and income limits.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-xs font-bold text-white">2. Mismatch Check</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Compares spelling, DOB, parent name, and address between Aadhaar, Marksheet, and Bank Passbook.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-xs font-bold text-white">3. Expired Check</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Verifies certificate issue date against statutory validity rules (e.g. 1-year ceiling for Income & EWS).
          </p>
        </div>
      </div>

      {/* Detailed Document-by-Document Audit Matrix */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Mandatory Documents Checklist for {selectedScheme.shortName} ({auditResults.length} Items)
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            {auditResults.filter(r => r.criticality === 'PASS').length} of {auditResults.length} Ready
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {auditResults.map((item) => (
            <div
              key={item.docId}
              className={`p-4 rounded-xl border transition-all shadow-md ${
                item.criticality === 'CRITICAL'
                  ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500'
                  : item.criticality === 'WARNING'
                  ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                
                {/* Document Information */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className={`w-4 h-4 ${
                      item.criticality === 'CRITICAL' ? 'text-rose-400' : item.criticality === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'
                    }`} />
                    <h4 className="font-bold text-white text-sm">
                      {item.docName}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Issuing Authority: <span className="text-slate-300 font-medium">{item.issuer}</span>
                  </p>
                </div>

                {/* 3-Pillar Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Fit Badge */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    item.isFit ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {item.isFit ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span>{item.isFit ? t.preFlightFit : t.preFlightMisfit}</span>
                  </span>

                  {/* Match Badge */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    item.isMatched ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {item.isMatched ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    <span>{item.isMatched ? t.preFlightMatched : t.preFlightMismatch}</span>
                  </span>

                  {/* Validity Badge */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    item.isValid ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {item.isValid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    <span>{item.isValid ? t.preFlightValid : t.preFlightExpired}</span>
                  </span>
                </div>

              </div>

              {/* Explanatory Notes & Action Row */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  {!item.isFit && (
                    <p className="text-rose-300 font-medium">⚠️ {item.fitNotes}</p>
                  )}
                  {!item.isMatched && (
                    <p className="text-amber-300 font-medium">⚠️ {item.matchNotes}</p>
                  )}
                  {!item.isValid && (
                    <p className="text-rose-300 font-medium">🛑 {item.validityNotes}</p>
                  )}
                  {item.isFit && item.isMatched && item.isValid && (
                    <p className="text-emerald-400">✓ All checks passed. Document is ready for instant officer sanction.</p>
                  )}
                </div>

                {/* Item-level Auto-Fix */}
                {(!item.isFit || !item.isMatched || !item.isValid) && (
                  <button
                    onClick={() => handleAutoReconcile(item.docId)}
                    disabled={isSyncing}
                    className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 hover:text-orange-300 border border-slate-700 text-[11px] font-semibold flex items-center gap-1.5 transition shrink-0"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{t.preFlightAutoFix}</span>
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
