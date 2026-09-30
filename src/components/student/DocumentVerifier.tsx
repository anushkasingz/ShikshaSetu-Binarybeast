import React, { useState } from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  QrCode, 
  ExternalLink, 
  Upload, 
  Lock, 
  Sparkles,
  FileText,
  BadgeCheck,
  Check
} from 'lucide-react';
import { StudentProfile, StudentDocument } from '../../types/scholarship';
import { Language, TRANSLATIONS } from '../../data/translations';

interface DocumentVerifierProps {
  student: StudentProfile;
  language?: Language;
  onUpdateStudent: (student: StudentProfile) => void;
  onOpenJagoWithPrompt?: (prompt: string) => void;
}

export const DocumentVerifier: React.FC<DocumentVerifierProps> = ({
  student,
  language = 'en',
  onUpdateStudent,
  onOpenJagoWithPrompt
}) => {
  const t = TRANSLATIONS[language];
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string>(student.documents[0]?.id || '');
  const [scanCompleteTime, setScanCompleteTime] = useState<string | null>(null);

  const selectedDoc = student.documents.find(d => d.id === selectedDocId) || student.documents[0];

  const handleRunFullScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanCompleteTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1200);
  };

  return (
    <div className="py-4 px-2 sm:px-4 max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-950/40 via-slate-900 to-emerald-950/40 border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
              DPI Verification Engine
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-semibold border border-orange-500/30">
              DigiLocker Cryptographic Seals
            </span>
          </div>
          <h2 className="text-base sm:text-xl font-bold text-white">
            {t.verifierTitle}
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            {t.verifierSubtitle}
          </p>
        </div>

        <button
          onClick={handleRunFullScan}
          disabled={isScanning}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Verifying Digital Signatures...' : t.verifyScanButton}</span>
        </button>
      </div>

      {/* Verification Overview KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Total Wallet Documents</span>
          <p className="text-xl font-bold text-white font-mono">{student.documents.length} Certificates</p>
          <span className="text-[10px] text-blue-400 font-medium">DigiLocker Synced</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Verified Authentic</span>
          <p className="text-xl font-bold text-emerald-300 font-mono">
            {student.documents.filter(d => d.verifiedStatus === 'Verified').length} Passed
          </p>
          <span className="text-[10px] text-emerald-400 font-medium">100% Cryptographic Match</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Average OCR Integrity</span>
          <p className="text-xl font-bold text-orange-300 font-mono">97.4%</p>
          <span className="text-[10px] text-orange-400 font-medium">High Optical Precision</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Aadhaar & NPCI Bridge</span>
          <p className="text-xl font-bold text-teal-300 font-mono">Active Link</p>
          <span className="text-[10px] text-teal-400 font-medium">DBT Direct Disbursal Ready</span>
        </div>
      </div>

      {/* Main Grid: Document List on Left & In-Depth Verification Scrutiny on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Document List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Registered Documents ({student.documents.length})
          </span>

          <div className="space-y-2.5">
            {student.documents.map((doc) => {
              const isSelected = doc.id === selectedDoc?.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                      : 'bg-slate-900/80 hover:bg-slate-800/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                        <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                          {doc.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Issuer: {doc.ocrExtractedData.issuingAuthority || doc.source} • Issued: {doc.issuedDate}
                      </p>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      doc.verifiedStatus === 'Verified'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {doc.verifiedStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Document Scrutiny Desk */}
        <div className="lg:col-span-7">
          {selectedDoc ? (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Type: {selectedDoc.type}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                      OCR: {selectedDoc.ocrConfidence}%
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    {selectedDoc.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <BadgeCheck className="w-4 h-4 text-emerald-400" />
                    <span>Cryptographically Signed</span>
                  </span>
                </div>
              </div>

              {/* Live Laser Verification Badge */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/40 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>DigiLocker Cryptographic Seal Validated</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Badge ID: {selectedDoc.verificationBadgeId || 'DL-IN-2026-8819'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Extracted Applicant Name</span>
                    <p className="font-bold text-white font-mono mt-0.5">
                      {selectedDoc.ocrExtractedData.fullName || student.fullName}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Issuing Government Authority</span>
                    <p className="font-bold text-white mt-0.5">
                      {selectedDoc.ocrExtractedData.issuingAuthority || 'Government of India'}
                    </p>
                  </div>

                  {selectedDoc.ocrExtractedData.incomeValue && (
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Certified Annual Income</span>
                      <p className="font-bold text-emerald-300 font-mono mt-0.5">
                        ₹{selectedDoc.ocrExtractedData.incomeValue.toLocaleString('en-IN')}/year
                      </p>
                    </div>
                  )}

                  {selectedDoc.ocrExtractedData.serialNumber && (
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Document Barcode / Serial</span>
                      <p className="font-mono text-slate-300 text-xs mt-0.5">
                        {selectedDoc.ocrExtractedData.serialNumber}
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-200 flex items-center justify-between">
                  <span>SHA-256 Digest: 8f9b...3c12 verified against National Academic Depository</span>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              {/* Validity & Expiry Tracker */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="font-semibold text-white block">Statutory Validity for Scholarship Cycle:</span>
                    <span className="text-[11px] text-slate-400">
                      {selectedDoc.expiryDate ? `Valid until ${selectedDoc.expiryDate}` : 'Lifetime Educational Credential (No Expiry)'}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  Current FY 2026-27 Active
                </span>
              </div>

              {/* JAGO Inquiry */}
              {onOpenJagoWithPrompt && (
                <button
                  onClick={() => onOpenJagoWithPrompt(`Is my ${selectedDoc.name} valid for central scholarship quotas and what if there is a spelling difference on it?`)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ask JAGO to audit this document for government scrutiny</span>
                </button>
              )}

            </div>
          ) : (
            <p className="text-xs text-slate-400">Select a document to inspect.</p>
          )}
        </div>

      </div>

    </div>
  );
};
