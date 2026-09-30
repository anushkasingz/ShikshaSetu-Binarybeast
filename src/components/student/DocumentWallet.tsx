import React, { useState } from 'react';
import { 
  FolderLock, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  RefreshCw, 
  QrCode, 
  Scan, 
  Sparkles,
  ExternalLink,
  Eye,
  Check,
  Calendar,
  Lock
} from 'lucide-react';
import { StudentProfile, StudentDocument } from '../../types/scholarship';
import { queryMockDigiLocker } from '../../data/mockExternalApis';

interface DocumentWalletProps {
  student: StudentProfile;
  onUpdateStudent: (updated: StudentProfile) => void;
  onOpenJagoWithPrompt?: (prompt: string) => void;
}

export const DocumentWallet: React.FC<DocumentWalletProps> = ({
  student,
  onUpdateStudent,
  onOpenJagoWithPrompt
}) => {
  const [selectedDoc, setSelectedDoc] = useState<StudentDocument | null>(student.documents[0] || null);
  const [isSyncingDigilocker, setIsSyncingDigilocker] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('');
  const [isScanningOcr, setIsScanningOcr] = useState(false);
  const [ocrAuditResult, setOcrAuditResult] = useState<any | null>(null);

  const handleDigiLockerSync = async () => {
    setIsSyncingDigilocker(true);
    setSyncSuccessMsg('');
    try {
      const res = await queryMockDigiLocker(student.apaarId);
      if (res.status === 'SUCCESS') {
        setSyncSuccessMsg(`DigiLocker Gateway: ${res.data.certificates.length} digital credentials verified via MeitY URI.`);
        onUpdateStudent({
          ...student,
          digiLockerLinked: true
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncingDigilocker(false);
      setTimeout(() => setSyncSuccessMsg(''), 4000);
    }
  };

  const handleRunAiOcrAudit = (doc: StudentDocument) => {
    setSelectedDoc(doc);
    setIsScanningOcr(true);
    setOcrAuditResult(null);

    setTimeout(() => {
      setIsScanningOcr(false);
      const isExpiring = doc.expiryDate && new Date(doc.expiryDate).getTime() < new Date('2026-11-01').getTime();
      const hasNameMismatch = doc.ocrExtractedData.fullName && doc.ocrExtractedData.fullName !== student.fullName;

      setOcrAuditResult({
        confidence: doc.ocrConfidence * 100,
        tamperDetected: false,
        digitalSignatureValid: true,
        extractedName: doc.ocrExtractedData.fullName || student.fullName,
        serialNumber: doc.ocrExtractedData.serialNumber || 'UP-REV-99214',
        issuingAuthority: doc.ocrExtractedData.issuingAuthority || 'Govt of Uttar Pradesh',
        status: hasNameMismatch ? 'NAME_VARIANCE_FLAGGED' : isExpiring ? 'EXPIRING_SOON_FLAGGED' : 'HEALTHY_VERIFIED',
        recommendation: hasNameMismatch 
          ? 'Minor middle name abbreviation detected. Auto-reconcilable via APAAR graph.'
          : isExpiring 
          ? 'Certificate expires in under 30 days. Recommend renewing via e-District before state sanction.'
          : 'Document satisfies all Nodal Officer compliance rules. Safe for instant DBT disbursal.'
      });
    }, 1200);
  };

  return (
    <div className="space-y-5">
      
      {/* Wallet Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-800/90 via-slate-800 to-indigo-950/60 border border-slate-700/80 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 shrink-0">
            <FolderLock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                ShikshaSetu Document Wallet
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                <Lock className="w-3 h-3" />
                <span>AES-256 Cloud Vault</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              MeitY DigiLocker verified digital credential repository & AI OCR validation engine
            </p>
          </div>
        </div>

        {/* Sync Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDigiLockerSync}
            disabled={isSyncingDigilocker}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingDigilocker ? 'animate-spin' : ''}`} />
            <span>{isSyncingDigilocker ? 'Syncing DigiLocker...' : 'Sync DigiLocker Vault'}</span>
          </button>
        </div>
      </div>

      {syncSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{syncSuccessMsg}</span>
        </div>
      )}

      {/* Grid: Document List & AI Audit Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Document Cards */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-300">
              Issued & Uploaded Credentials ({student.documents.length})
            </span>
            <span>Click any doc to run AI OCR audit</span>
          </div>

          <div className="space-y-2.5">
            {student.documents.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              const isExpiring = doc.expiryDate && new Date(doc.expiryDate).getTime() < new Date('2026-11-01').getTime();

              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-blue-500 ring-1 ring-blue-500/50 shadow-md'
                      : 'bg-slate-800/50 hover:bg-slate-800/70 border-slate-700/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-700/60 text-blue-300 shrink-0 mt-0.5">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white">
                            {doc.name}
                          </h4>
                          {doc.source === 'DigiLocker' && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              DigiLocker
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Issued: {doc.issuedDate} • {doc.fileName}
                        </p>

                        {/* Expiry Pill */}
                        {doc.expiryDate && (
                          <div className={`mt-1.5 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            isExpiring ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-700 text-slate-300'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            <span>Valid Until: {doc.expiryDate} {isExpiring && '(Renew Soon)'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRunAiOcrAudit(doc);
                        }}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 pt-1 font-semibold"
                      >
                        <Scan className="w-3 h-3" />
                        <span>Run AI Audit</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick upload drop area simulation */}
          <div className="p-4 rounded-xl border-2 border-dashed border-slate-700 hover:border-slate-600 bg-slate-800/30 text-center cursor-pointer transition">
            <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-slate-300">Upload Additional Supporting Document</p>
            <p className="text-[11px] text-slate-500">PDF, JPG up to 5MB • Automatically audited with OCR Pre-Check</p>
          </div>
        </div>

        {/* AI OCR & Tamper Analysis Inspector Panel */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  AI Pre-Check & OCR Inspector
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Official AI Pre-Check
              </span>
            </div>

            {selectedDoc ? (
              <div className="space-y-4 text-xs">
                
                {/* Active Document Card Preview */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{selectedDoc.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{selectedDoc.verificationBadgeId || 'MANUAL-HASH-OK'}</span>
                  </div>

                  <div className="h-28 rounded-lg bg-slate-800/90 border border-slate-700/50 flex flex-col items-center justify-center text-center p-3 text-slate-400 relative overflow-hidden">
                    <QrCode className="w-12 h-12 text-slate-500 mb-1 opacity-60" />
                    <p className="text-[10px] font-mono text-slate-400">DIGITAL_SEAL: {selectedDoc.verificationBadgeId || 'SHA-256'}</p>
                    <p className="text-[9px] text-emerald-400 font-semibold mt-0.5">Government Cryptographic Stamp Verified</p>
                  </div>

                  <button
                    onClick={() => handleRunAiOcrAudit(selectedDoc)}
                    disabled={isScanningOcr}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md transition disabled:opacity-50"
                  >
                    <Scan className={`w-3.5 h-3.5 ${isScanningOcr ? 'animate-spin' : ''}`} />
                    <span>{isScanningOcr ? 'Scanning with OCR Engine...' : 'Run Live AI Inspection'}</span>
                  </button>
                </div>

                {/* OCR Audit Results */}
                {isScanningOcr && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-center space-y-2">
                    <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin mx-auto" />
                    <p className="font-semibold text-white">Extracting Text & Hologram Patterns...</p>
                    <p className="text-[11px] text-slate-400">Cross-verifying applicant name, issuing seal, and validity duration</p>
                  </div>
                )}

                {ocrAuditResult && !isScanningOcr && (
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400">
                        Audit Health Report
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ocrAuditResult.status === 'HEALTHY_VERIFIED' 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {ocrAuditResult.confidence}% Confidence
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">OCR Extracted Name:</span>
                        <span className="font-semibold text-white">{ocrAuditResult.extractedName}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Issuing Authority:</span>
                        <span className="text-slate-200">{ocrAuditResult.issuingAuthority}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Certificate Reference:</span>
                        <span className="font-mono text-slate-300">{ocrAuditResult.serialNumber}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
                      <p className="font-semibold text-white mb-0.5 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                        <span>AI Recommendation</span>
                      </p>
                      <p>{ocrAuditResult.recommendation}</p>
                    </div>

                    {onOpenJagoWithPrompt && (
                      <button
                        onClick={() => onOpenJagoWithPrompt(`I ran an AI pre-check on my ${selectedDoc.name} and found: ${ocrAuditResult.recommendation}. What should I do?`)}
                        className="w-full text-center text-xs text-amber-300 hover:text-amber-200 underline pt-1"
                      >
                        Ask JAGO about this document
                      </button>
                    )}
                  </div>
                )}

              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">Select a document to inspect</p>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
