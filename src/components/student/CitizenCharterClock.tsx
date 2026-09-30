import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Phone, 
  Calendar, 
  User, 
  Building2, 
  FileText, 
  Download, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Printer, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { ApplicationRecord, StudentProfile } from '../../types/scholarship';
import { Language, TRANSLATIONS } from '../../data/translations';

interface CitizenCharterClockProps {
  applications: ApplicationRecord[];
  student: StudentProfile;
  language?: Language;
  onOpenJagoWithPrompt?: (prompt: string) => void;
  onResolveDeficiency?: (appId: string) => void;
}

export const CitizenCharterClock: React.FC<CitizenCharterClockProps> = ({
  applications,
  student,
  language = 'en',
  onOpenJagoWithPrompt,
  onResolveDeficiency
}) => {
  const t = TRANSLATIONS[language];
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [showTokenModal, setShowTokenModal] = useState(false);

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  // Calculate simulated days elapsed under Citizen's Charter
  const getElapsedDays = (app: ApplicationRecord) => {
    if (!app) return 12;
    if (app.status === 'Disbursed') return 28;
    if (app.status === 'State_Sanctioned') return 22;
    if (app.status === 'District_Verified') return 16;
    if (app.status === 'Deficient') return 11;
    if (app.status === 'Submitted') return 6;
    return 14;
  };

  const elapsedDays = selectedApp ? getElapsedDays(selectedApp) : 14;
  const totalDays = 30;
  const remainingDays = Math.max(0, totalDays - elapsedDays);
  const isOverdue = elapsedDays > totalDays;
  const isHealthy = elapsedDays <= 24 && selectedApp?.status !== 'Deficient' && selectedApp?.status !== 'Rejected';
  const isPriority = elapsedDays > 24 && elapsedDays <= totalDays;

  // Simple-language reason generator (सरल भाषा में व्याख्या)
  const getSimpleReasonExplanation = (app: ApplicationRecord, lang: Language) => {
    if (!app) return { title: 'No application selected', detail: '' };

    if (app.status === 'Disbursed') {
      if (lang === 'hi') {
        return {
          title: 'छात्रवृत्ति आपके बैंक खाते में सफलतापूर्वक भेजी जा चुकी है!',
          detail: `PFMS आधार ब्रिज द्वारा ₹${app.amountSanctioned.toLocaleString('en-IN')} की राशि आपके ${student.bankAccount.bankName} खाते (अंतिम 4 अंक: ${student.bankAccount.accountNumberMasked}) में जमा कर दी गई है। ट्रांजेक्शन संदर्भ: ${app.pfmsTransactionId || 'PFMS-2026-DBT-882194'}.`
        };
      } else if (lang === 'hinglish') {
        return {
          title: 'Scholarship aapke bank account mein successfully transfer ho chuki hai!',
          detail: `PFMS Aadhaar Bridge se ₹${app.amountSanctioned.toLocaleString('en-IN')} aapke ${student.bankAccount.bankName} account (${student.bankAccount.accountNumberMasked}) mein deposit ho gaye hain. Transaction reference: ${app.pfmsTransactionId || 'PFMS-2026-DBT-882194'}.`
        };
      }
      return {
        title: 'Scholarship Amount Successfully Credited to Bank Account!',
        detail: `The full sanctioned scholarship benefit of ₹${app.amountSanctioned.toLocaleString('en-IN')} has been transferred directly into your ${student.bankAccount.bankName} account (${student.bankAccount.accountNumberMasked}) via PFMS Aadhaar Payment Bridge. Transaction Ref: ${app.pfmsTransactionId || 'PFMS-2026-DBT-882194'}.`
      };
    }

    if (app.status === 'Deficient') {
      if (lang === 'hi') {
        return {
          title: 'आवेदन रुका हुआ है: नोडल अधिकारी ने स्पष्टीकरण मांगा है',
          detail: `कारण: ${app.deficiencyReason || 'दस्तावेज़ की प्रति अस्पष्ट है'}। आपकी 30-दिवसीय घड़ी दिन ${elapsedDays} पर रोक दी गई है ताकि आपका समय बर्बाद न हो। आपको 15 दिनों के भीतर सही दस्तावेज़ अपलोड करना होगा।`
        };
      } else if (lang === 'hinglish') {
        return {
          title: 'Application ruka hua hai: Nodal Officer ne clarification maangi hai',
          detail: `Reason: ${app.deficiencyReason || 'Document blurry hai'}. Aapki 30-day clock day ${elapsedDays} par pause hai. Aapko 15 din ke andar sahi document upload karna hoga.`
        };
      }
      return {
        title: 'Application Paused: Nodal Officer Issued Clarification Notice',
        detail: `Reason: ${app.deficiencyReason || 'Uploaded document scan requires clearer re-submission'}. Your 30-day SLA clock has been paused at Day ${elapsedDays} so your deadline is protected. Please re-upload the requested file within the 15-day cure window.`
      };
    }

    if (app.status === 'Submitted') {
      if (lang === 'hi') {
        return {
          title: 'आवेदन कॉलेज / स्कूल स्तर पर लंबित है',
          detail: 'आपके कॉलेज के प्रधानाचार्य / नोडल अधिकारी को आपकी कक्षा में उपस्थिति (75%+) और बोनाफाइड छात्र होने की पुष्टि करनी है। इस चरण में आमतौर पर 3 से 5 दिन लगते हैं। छात्र को अभी कुछ करने की आवश्यकता नहीं है।'
        };
      } else if (lang === 'hinglish') {
        return {
          title: 'Application College / Institute level par pending hai',
          detail: 'Aapke College Principal / Nodal Officer ko attendance aur bonafide confirm karna hai. Isme aamtaur par 3-5 din lagte hain. Aapko abhi koi action lene ki zaroorat nahi hai.'
        };
      }
      return {
        title: 'Application is with your College / Institute Nodal Officer',
        detail: 'The College Principal / Nodal Officer is verifying your enrolled attendance records and admission roll. Average clearance time is 3 to 5 business days. No action is required from the student at this stage.'
      };
    }

    if (app.status === 'District_Verified') {
      if (lang === 'hi') {
        return {
          title: 'जिला कल्याण अधिकारी द्वारा स्वीकृत, राज्य आवंटन की प्रतीक्षा',
          detail: 'वाराणसी जिला कल्याण कार्यालय ने आपके आय और निवास प्रमाण पत्र का सत्यापन पूरा कर लिया है। अब राज्य समाज कल्याण निदेशालय द्वारा मेरिट सूची और फंड आवंटन आदेश जारी किया जा रहा है।'
        };
      } else if (lang === 'hinglish') {
        return {
          title: 'District Welfare Office ne approve kiya, State Sanction pending hai',
          detail: 'Varanasi District Welfare Office ne verification complete kar liya hai. Ab State Directorate se fund sanction order aur merit allocation ho raha hai.'
        };
      }
      return {
        title: 'District Scrutiny Passed; Awaiting State Directorate Sanction',
        detail: 'The District Welfare Officer (Varanasi) has authenticated your certificates against district revenue records. The application has been queued for State Directorate fund sanction and merit list issuance.'
      };
    }

    // Default / State Sanctioned
    if (lang === 'hi') {
      return {
        title: 'राज्य वित्तीय स्वीकृति जारी, PFMS ट्रेजरी हस्तांतरण कतार में',
        detail: 'राज्य सरकार ने छात्रवृत्ति राशि स्वीकृत कर दी है। अब PFMS (सार्वजनिक वित्तीय प्रबंधन प्रणाली) आपके आधार से जुड़े बैंक खाते में सीधे पैसे भेजने की प्रक्रिया कर रही है।'
      };
    } else if (lang === 'hinglish') {
      return {
        title: 'State Sanction Order jari, PFMS DBT release process mein hai',
        detail: 'Government ne scholarship approve kar di hai. PFMS system aapke Aadhaar-linked bank account mein paise deposit karne ke liye batch bana raha hai.'
      };
    }
    return {
      title: 'State Sanction Order Issued; Queued for PFMS DBT Batch Disbursal',
      detail: 'The financial sanction order has been generated by the State Welfare Directorate. The payment mandate is queued in the automated PFMS Aadhaar Payment Bridge for credit directly to your linked account.'
    };
  };

  const explanation = selectedApp ? getSimpleReasonExplanation(selectedApp, language) : { title: '', detail: '' };

  const CHARTER_MILESTONES = [
    { range: 'Days 1 - 7', title: 'Institute Verification', desc: 'College Principal / Nodal verification of student roll' },
    { range: 'Days 8 - 18', title: 'District Welfare Scrutiny', desc: 'Tehsildar & District Magistrate document scrutiny' },
    { range: 'Days 19 - 25', title: 'State Directorate Sanction', desc: 'State merit allocation & financial sanction order' },
    { range: 'Days 26 - 30', title: 'PFMS APB Bank Disbursal', desc: 'Direct Benefit Transfer credit to bank account' }
  ];

  return (
    <div className="py-4 px-2 sm:px-4 max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-950/40 via-slate-900 to-emerald-950/40 border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold uppercase tracking-wider">
              {t.charterClockTag}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              Statutory 30-Day SLA
            </span>
          </div>
          <h2 className="text-base sm:text-xl font-bold text-white">
            {t.charterTitle}
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            {t.charterSubtitle}
          </p>
        </div>

        {/* Application Selector */}
        {applications.length > 1 && (
          <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-700 shrink-0">
            <span className="text-xs text-slate-400 font-semibold">Track Application:</span>
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="bg-slate-800 text-xs text-white rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              {applications.map(a => (
                <option key={a.id} value={a.id}>
                  {a.applicationNumber} ({a.schemeName.substring(0, 18)}...)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedApp ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: 30-Day Clock Meter & Milestone Timeline */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* 30-Day Circular & Linear SLA Meter */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Citizen's Charter 30-Day Processing Clock
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Ref: {selectedApp.applicationNumber} • Applied: {selectedApp.appliedDate}
                    </p>
                  </div>
                </div>

                <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                  selectedApp.status === 'Disbursed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : isOverdue 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                    : isPriority 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {selectedApp.status === 'Disbursed' 
                    ? 'Completed within SLA' 
                    : isOverdue 
                    ? t.charterSlaBreached 
                    : t.charterSlaHealthy}
                </span>
              </div>

              {/* Day Counter Large Display */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="space-y-1">
                  <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                    Charter Elapsed Time
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                      Day {elapsedDays}
                    </span>
                    <span className="text-sm font-bold text-slate-400">
                      / 30 Days Guaranteed SLA
                    </span>
                  </div>
                </div>

                <div className="sm:text-right space-y-1">
                  <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                    Statutory Window Left
                  </span>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                    {selectedApp.status === 'Disbursed' ? '0 Days (Disbursed)' : `${remainingDays} Days Remaining`}
                  </p>
                </div>
              </div>

              {/* 30-Day Segmented Milestone Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Day 1 (Submission)</span>
                  <span>Day 15 (Midpoint)</span>
                  <span>Day 30 (Legal SLA Limit)</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/80">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      selectedApp.status === 'Disbursed'
                        ? 'bg-emerald-500'
                        : isOverdue
                        ? 'bg-rose-500'
                        : isPriority
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, (elapsedDays / 30) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* 4 Milestones Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
                {CHARTER_MILESTONES.map((m, idx) => {
                  const isActive = (idx === 0 && elapsedDays <= 7) ||
                                  (idx === 1 && elapsedDays > 7 && elapsedDays <= 18) ||
                                  (idx === 2 && elapsedDays > 18 && elapsedDays <= 25) ||
                                  (idx === 3 && elapsedDays > 25);
                  const isDone = (idx === 0 && elapsedDays > 7) ||
                                 (idx === 1 && elapsedDays > 18) ||
                                 (idx === 2 && elapsedDays > 25) ||
                                 (idx === 3 && selectedApp.status === 'Disbursed');

                  return (
                    <div 
                      key={idx} 
                      className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                        isDone 
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
                          : isActive 
                          ? 'bg-orange-950/30 border-orange-500/50 text-orange-300' 
                          : 'bg-slate-800/40 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold">{m.range}</span>
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <p className="font-bold text-white text-[11px] truncate">{m.title}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-2">{m.desc}</p>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Simple-Language Reason Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-orange-400">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
                  {t.charterWhyPending}
                </h3>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60 space-y-2">
                <h4 className="font-bold text-white text-sm">
                  {explanation.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {explanation.detail}
                </p>
              </div>

              {selectedApp.status === 'Deficient' && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-rose-950/30 border border-rose-600/40 text-xs">
                  <span className="text-rose-300">
                    Deficiency resolution requires updated document upload.
                  </span>
                  <button
                    onClick={() => onResolveDeficiency?.(selectedApp.id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
                  >
                    Resolve Deficiency
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: In-Person Physical Contact Person Desk & Slip */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Designated Physical Officer Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <User className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  {t.charterOfflineContact}
                </h3>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                
                {/* Officer Name & Badge */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      Assigned District Officer
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
                      Shri Rajeshwar Rao
                    </h4>
                    <p className="text-xs text-slate-300">
                      District Welfare Officer (DWO), Social Welfare Department
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Nodal Desk #04
                  </span>
                </div>

                {/* Office Address */}
                <div className="pt-2 border-t border-slate-700/60 space-y-1 text-xs">
                  <div className="flex items-start gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white block">{t.charterOfficeAddress}:</span>
                      <p className="text-slate-400 leading-relaxed text-[11px]">
                        Vikas Bhawan, 2nd Floor, Room No. 204, Near Circuit House, Kutchery Road, Varanasi, Uttar Pradesh - 221002
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone & Timings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-700/60">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-[10px]">Official Desk Phone:</span>
                    </div>
                    <p className="text-white font-mono font-semibold text-xs">0542-2508912</p>
                    <p className="text-slate-400 text-[10px]">Ext: 104 (Scholarship Cell)</p>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[10px]">{t.charterVisitingHours}:</span>
                    </div>
                    <p className="text-white font-semibold text-xs">Mon - Fri • 10:30 AM - 1:30 PM</p>
                    <p className="text-emerald-400 text-[10px]">No Prior Appointment Needed</p>
                  </div>
                </div>

                {/* Grievance Escalation Authority */}
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-700/70 text-[11px] space-y-0.5">
                  <span className="text-slate-400">{t.charterOfficerName}:</span>
                  <p className="text-slate-200 font-semibold">
                    Smt. Ananya Singh, Sub-Divisional Magistrate (SDM Grievances)
                  </p>
                  <p className="text-slate-400 text-[10px]">Room 102, Collectorate Compound, Varanasi</p>
                </div>

              </div>

              {/* Action Button: Print/Download Physical Walk-In Slip */}
              <button
                onClick={() => setShowTokenModal(true)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>{t.charterGenerateSlip}</span>
              </button>

              {/* JAGO AI Prompt Trigger */}
              {onOpenJagoWithPrompt && (
                <button
                  onClick={() => onOpenJagoWithPrompt(`Why is my application ${selectedApp.applicationNumber} taking ${elapsedDays} days under the Citizen Charter, and what offline documents should I take to Vikas Bhawan Room 204?`)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ask JAGO how to expedite with this officer</span>
                </button>
              )}

            </div>

          </div>

        </div>
      ) : (
        <div className="p-8 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
          No submitted applications found to track under the 30-Day Citizen's Charter.
        </div>
      )}

      {/* Physical Grievance Token Modal */}
      {showTokenModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4 ring-1 ring-white/10 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold text-white">
                  Official Citizen's Charter Walk-in Token
                </h3>
              </div>
              <button 
                onClick={() => setShowTokenModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Printable Slip Preview */}
            <div className="p-4 rounded-xl bg-white text-slate-900 space-y-3 font-mono border-2 border-slate-400">
              <div className="text-center border-b border-slate-300 pb-2">
                <p className="text-[10px] font-bold uppercase text-slate-600">GOVERNMENT OF UTTAR PRADESH • DISTRICT WELFARE OFFICE</p>
                <p className="text-xs font-bold text-slate-900">CITIZEN CHARTER TIME-BOUND REDRESSAL TOKEN</p>
                <p className="text-[10px] text-slate-500">Token ID: #CC-VAR-{Math.floor(1000 + Math.random() * 9000)} • Date: {new Date().toLocaleDateString('en-IN')}</p>
              </div>

              <div className="space-y-1 text-[11px]">
                <p><strong>Applicant Name:</strong> {student.fullName}</p>
                <p><strong>APAAR ID:</strong> {student.apaarId}</p>
                <p><strong>Application No:</strong> {selectedApp.applicationNumber}</p>
                <p><strong>Scheme:</strong> {selectedApp.schemeName}</p>
                <p><strong>Elapsed SLA:</strong> Day {elapsedDays} of 30 Statutory Days</p>
                <p><strong>Present Desk:</strong> Room No. 204, Vikas Bhawan, Varanasi</p>
                <p><strong>Officer Assigned:</strong> Shri Rajeshwar Rao, DWO</p>
              </div>

              <div className="p-2 bg-slate-100 rounded text-[10px] text-slate-700 leading-tight">
                * Statutory Clause: As per the Public Services Guarantee Act, this applicant is entitled to in-person status briefing within 24 hours of presenting this token during official visiting hours.
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">Present this digital or printed token at Counter 4.</span>
              <button
                onClick={() => setShowTokenModal(false)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition"
              >
                Close Token Slip
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
