import React, { useState } from 'react';
import { 
  History, 
  FileCheck2, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  CreditCard, 
  Clock, 
  Lock, 
  Download, 
  Printer, 
  Sparkles, 
  Search, 
  Filter,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { StudentProfile, ApplicationRecord } from '../../types/scholarship';
import { Language, TRANSLATIONS } from '../../data/translations';

interface UserHistoryTrackerProps {
  student: StudentProfile;
  applications: ApplicationRecord[];
  language?: Language;
  onOpenJagoWithPrompt?: (prompt: string) => void;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  category: 'APPLICATION' | 'VERIFICATION' | 'OFFICER' | 'DBT' | 'SECURITY';
  title: string;
  description: string;
  actor: string;
  status: 'SUCCESS' | 'PENDING' | 'ACTION_REQUIRED';
  refNumber?: string;
  cryptoHash: string;
}

export const UserHistoryTracker: React.FC<UserHistoryTrackerProps> = ({
  student,
  applications,
  language = 'en',
  onOpenJagoWithPrompt
}) => {
  const t = TRANSLATIONS[language];
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [showSlipModal, setShowSlipModal] = useState<boolean>(false);

  // Pre-seeded comprehensive activity events for the student profile
  const events: ActivityEvent[] = [
    {
      id: 'evt_1',
      timestamp: 'Today, 10:14 AM',
      category: 'SECURITY',
      title: 'One-User-One-Login Authenticated',
      description: 'Single session token SES-2026-IN-8812 verified via UIDAI OTP authentication.',
      actor: 'Student (Self)',
      status: 'SUCCESS',
      refNumber: 'SES-2026-IN-8812',
      cryptoHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    {
      id: 'evt_2',
      timestamp: 'Today, 09:30 AM',
      category: 'VERIFICATION',
      title: 'Pre-Flight Document Audit Cleared',
      description: 'Automated 3-way check passed for Income, Marksheet, and NPCI Bank passbook.',
      actor: 'ShikshaSetu Pre-Flight Engine',
      status: 'SUCCESS',
      refNumber: 'AUDIT-2026-0929',
      cryptoHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
    },
    {
      id: 'evt_3',
      timestamp: '28-Sep-2026, 04:22 PM',
      category: 'APPLICATION',
      title: 'Application Submitted: AICTE Pragati for Girls',
      description: `Application ${applications[0]?.applicationNumber || 'SS-2026-UP-884912'} registered and forwarded to Institute Nodal Officer desk.`,
      actor: 'Student (Self)',
      status: 'SUCCESS',
      refNumber: applications[0]?.applicationNumber || 'SS-2026-UP-884912',
      cryptoHash: 'cb49d7990c768e404bb15c54c30c3ad342e472620fcfdf8e3f60f6de98453472'
    },
    {
      id: 'evt_4',
      timestamp: '27-Sep-2026, 02:15 PM',
      category: 'VERIFICATION',
      title: 'DigiLocker Marksheet Verified via QR Seal',
      description: 'Class 12th Board marksheet (CBSE 84.6%) cryptographically validated against NAD repository.',
      actor: 'DigiLocker Gateway API',
      status: 'SUCCESS',
      refNumber: 'DL-DOC-CBSE-4491',
      cryptoHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
    },
    {
      id: 'evt_5',
      timestamp: '25-Sep-2026, 11:40 AM',
      category: 'OFFICER',
      title: 'Institute Attendance & Roll Verified',
      description: 'College Nodal Officer confirmed 88.5% academic attendance and bonafide student status.',
      actor: 'Prof. S.K. Srivastava (Institute Nodal Desk)',
      status: 'SUCCESS',
      refNumber: 'INST-VERIF-UP-331',
      cryptoHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'
    },
    {
      id: 'evt_6',
      timestamp: '24-Sep-2026, 03:10 PM',
      category: 'DBT',
      title: 'NPCI Aadhaar Payment Bridge Mandate Active',
      description: `Bank account (${student.bankAccount.bankName}) successfully verified for Direct Benefit Transfer.`,
      actor: 'NPCI National Gateway',
      status: 'SUCCESS',
      refNumber: 'NPCI-APB-MANDATE-771',
      cryptoHash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d'
    },
    {
      id: 'evt_7',
      timestamp: '22-Sep-2026, 10:05 AM',
      category: 'APPLICATION',
      title: 'Statutory 30-Day Citizen Charter Clock Started',
      description: 'Application tracking initialized with Day 1 SLA guarantee under Public Services Delivery Act.',
      actor: 'Citizen Charter Controller',
      status: 'SUCCESS',
      refNumber: 'CC-SLA-30D-8910',
      cryptoHash: '1b852f504e9c70c1103c8091807d4b4a39b4b025d57b297b8d80c06f71d53a92'
    }
  ];

  const filteredEvents = filterCategory === 'ALL'
    ? events
    : events.filter(e => e.category === filterCategory);

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'APPLICATION': return { label: 'Application', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'VERIFICATION': return { label: 'Verification', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'OFFICER': return { label: 'Officer Desk', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'DBT': return { label: 'DBT & PFMS', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' };
      case 'SECURITY': return { label: 'Security & Auth', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      default: return { label: cat, color: 'bg-slate-700 text-slate-300' };
    }
  };

  return (
    <div className="py-4 px-2 sm:px-4 max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-950/40 via-slate-900 to-emerald-950/40 border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold uppercase tracking-wider">
              Audit Transparency Trail
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              SHA-256 Cryptographic Log
            </span>
          </div>
          <h2 className="text-base sm:text-xl font-bold text-white">
            {t.historyTitle}
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            {t.historySubtitle}
          </p>
        </div>

        <button
          onClick={() => setShowSlipModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition shrink-0"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{t.historyDownloadSlip}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-x-auto text-xs">
        <button
          onClick={() => setFilterCategory('ALL')}
          className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
            filterCategory === 'ALL' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Activity Events ({events.length})
        </button>

        <button
          onClick={() => setFilterCategory('APPLICATION')}
          className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
            filterCategory === 'APPLICATION' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Applications
        </button>

        <button
          onClick={() => setFilterCategory('VERIFICATION')}
          className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
            filterCategory === 'VERIFICATION' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          DigiLocker & Verifications
        </button>

        <button
          onClick={() => setFilterCategory('OFFICER')}
          className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
            filterCategory === 'OFFICER' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Officer Actions
        </button>

        <button
          onClick={() => setFilterCategory('DBT')}
          className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
            filterCategory === 'DBT' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          DBT & Bank Credits
        </button>

        <button
          onClick={() => setFilterCategory('SECURITY')}
          className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
            filterCategory === 'SECURITY' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Security & Logins
        </button>
      </div>

      {/* Chronological Activity Timeline */}
      <div className="space-y-4">
        {filteredEvents.map((evt, idx) => {
          const badge = getCategoryBadge(evt.category);
          return (
            <div
              key={evt.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border font-mono ${badge.color}`}>
                    {badge.label}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {evt.timestamp}
                  </span>
                  {evt.refNumber && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Ref: {evt.refNumber}
                    </span>
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white">
                  {evt.title}
                </h3>
                <p className="text-xs text-slate-300">
                  {evt.description}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span>Authorized by: <strong className="text-slate-200">{evt.actor}</strong></span>
                  <span>•</span>
                  <span className="font-mono text-[10px] text-slate-500 truncate max-w-[260px]" title={evt.cryptoHash}>
                    SHA-256: {evt.cryptoHash.substring(0, 16)}...
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Audited</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Printable Activity Statement Slip Modal */}
      {showSlipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4 ring-1 ring-white/10 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold text-white">
                  Official Public Services Activity Statement
                </h3>
              </div>
              <button 
                onClick={() => setShowSlipModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white text-slate-900 space-y-3 font-mono border-2 border-slate-400 max-h-[400px] overflow-y-auto">
              <div className="text-center border-b border-slate-300 pb-2">
                <p className="text-[10px] font-bold uppercase text-slate-600">GOVERNMENT OF INDIA • NATIONAL SCHOLARSHIP PORTAL</p>
                <p className="text-xs font-bold text-slate-900">STUDENT AUDIT & ACTIVITY TRANSACTION STATEMENT</p>
                <p className="text-[10px] text-slate-500">Applicant: {student.fullName} • APAAR ID: {student.apaarId} • Date: {new Date().toLocaleDateString('en-IN')}</p>
              </div>

              <div className="space-y-2 text-[11px]">
                {events.map((e, i) => (
                  <div key={i} className="border-b border-slate-200 pb-1.5">
                    <p className="font-bold text-slate-900">{i + 1}. [{e.category}] {e.title} - {e.timestamp}</p>
                    <p className="text-slate-700">{e.description}</p>
                    <p className="text-[9px] text-slate-500">Actor: {e.actor} | Hash: {e.cryptoHash.substring(0, 24)}...</p>
                  </div>
                ))}
              </div>

              <div className="p-2 bg-slate-100 rounded text-[10px] text-slate-700 leading-tight">
                * Cryptographic Seal: This audit statement is protected under IT Act 2000 & NIC Digital Signature standard.
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">Statement generated for official RTI / verification review.</span>
              <button
                onClick={() => setShowSlipModal(false)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition"
              >
                Close Statement Slip
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
