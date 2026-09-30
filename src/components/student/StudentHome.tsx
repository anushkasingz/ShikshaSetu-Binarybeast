import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Flame, 
  TrendingUp, 
  IndianRupee, 
  Calendar, 
  ChevronRight, 
  Edit3, 
  Layers,
  Lock,
  ExternalLink,
  BookOpen,
  Award,
  FileCheck2
} from 'lucide-react';
import { 
  StudentProfile, 
  ScholarshipScheme, 
  ApplicationRecord, 
  RiskAlert, 
  NextBestAction,
  MismatchRecord
} from '../../types/scholarship';
import { 
  calculateReadinessScore, 
  detectStudentRisks, 
  generateNextBestActions,
  evaluateSchemeEligibility 
} from '../../services/smartEngines';
import { Language, TRANSLATIONS } from '../../data/translations';

interface StudentHomeProps {
  student: StudentProfile;
  schemes: ScholarshipScheme[];
  applications: ApplicationRecord[];
  mismatches: MismatchRecord[];
  language?: Language;
  onSelectScheme: (scheme: ScholarshipScheme) => void;
  onOpenProfileEdit: () => void;
  onOpenJagoWithPrompt: (prompt: string) => void;
  onNavigateToTab: (tab: 'home' | 'wallet' | 'applications' | 'preflight' | 'charter') => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  student,
  schemes,
  applications,
  mismatches,
  language = 'en',
  onSelectScheme,
  onOpenProfileEdit,
  onOpenJagoWithPrompt,
  onNavigateToTab
}) => {
  const t = TRANSLATIONS[language];
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high_match' | 'applied'>('all');

  const readiness = calculateReadinessScore(student, mismatches);
  const risks = detectStudentRisks(student, mismatches);
  const nextActions = generateNextBestActions(student, schemes, risks);

  // Evaluate schemes with match engine
  const evaluatedSchemes = schemes.map(scheme => ({
    scheme,
    match: evaluateSchemeEligibility(student, scheme),
    hasApplied: applications.some(a => a.schemeId === scheme.id)
  }));

  const filteredSchemes = evaluatedSchemes.filter(({ scheme, match, hasApplied }) => {
    if (selectedFilter === 'high_match') return match.matchScore >= 80;
    if (selectedFilter === 'applied') return hasApplied;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Student Welcome Banner */}
      <div className="relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-800 via-indigo-950/80 to-slate-900 border border-slate-700/80 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                APAAR ID: {student.apaarId}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>DigiLocker Linked</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                {student.category} • ₹{student.annualFamilyIncome.toLocaleString('en-IN')}/yr
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              {student.fullName}
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              {student.currentEducationLevel} at {student.institutionName} • {student.marksPercentage}% Score
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onNavigateToTab('preflight')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-semibold transition shadow-sm"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.navPreFlight}</span>
            </button>

            <button
              onClick={() => onNavigateToTab('charter')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition shadow-sm"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.navCharter}</span>
            </button>

            <button
              onClick={onOpenProfileEdit}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5 text-orange-400" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 2 Columns: Readiness Score (Left) & Risk Radar / Next-Best-Action (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Readiness Score Gauge Card */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  {t.readinessTitle}
                </h3>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                readiness.level === 'High' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : readiness.level === 'Moderate'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {readiness.level.replace('_', ' ')}
              </span>
            </div>

            {/* Circular Gauge Display */}
            <div className="flex items-center gap-5 my-2">
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-700"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={readiness.totalScore >= 80 ? 'text-emerald-500' : readiness.totalScore >= 60 ? 'text-amber-500' : 'text-rose-500'}
                    strokeDasharray={`${readiness.totalScore}, 100`}
                    strokeLinecap="round"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-extrabold text-white font-mono">
                    {readiness.totalScore}%
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Score</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-semibold text-slate-200">
                  {readiness.totalScore >= 80 ? 'Sanction Ready' : 'Optimization Required'}
                </p>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {readiness.summary}
                </p>
              </div>
            </div>

            {/* Breakdown Bars */}
            <div className="space-y-2 mt-4 pt-3 border-t border-slate-700/60 text-xs">
              {Object.entries(readiness.breakdown).map(([k, item]) => {
                const pct = (item.score / item.max) * 100;
                return (
                  <div key={k} className="space-y-0.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="font-mono text-slate-300 font-semibold">{item.score}/{item.max}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct >= 85 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-2 flex items-center gap-2">
            <button
              onClick={() => onNavigateToTab('wallet')}
              className="flex-1 py-2 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <span>{t.tabWallet}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateToTab('preflight')}
              className="flex-1 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 text-blue-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-blue-500/30"
            >
              <span>{t.tabPreFlight}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Risk Radar & Next-Best-Action Cards (Right) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Risk Radar Banner */}
          {risks.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
                  <h3 className="text-xs sm:text-sm font-bold text-amber-200 uppercase tracking-wide">
                    {t.riskRadarTitle} ({risks.length} Flags)
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  AI Proactive Alert
                </span>
              </div>

              <div className="space-y-2">
                {risks.map((risk) => (
                  <div key={risk.id} className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${risk.severity === 'high' ? 'bg-rose-500' : 'bg-amber-400'}`}></span>
                        <h4 className="text-xs font-bold text-white">{risk.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-tight">{risk.description}</p>
                    </div>

                    <button
                      onClick={() => {
                        if (risk.actionType === 'digilocker' || risk.actionType === 'upload') {
                          onNavigateToTab('wallet');
                        } else {
                          onOpenJagoWithPrompt(`How do I resolve this issue: ${risk.title}?`);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition"
                    >
                      {risk.actionLabel}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next-Best-Action Cards */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  {t.nextActionTitle}
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">Contextual Next Steps</span>
            </div>

            <div className="space-y-2">
              {nextActions.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between gap-3 hover:border-slate-600 transition"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                        {act.badge}
                      </span>
                      <h4 className="text-xs font-bold text-white">{act.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400">{act.subtitle}</p>
                  </div>

                  <button
                    onClick={() => {
                      if (act.actionType === 'apply' && act.targetSchemeId) {
                        const target = schemes.find(s => s.id === act.targetSchemeId);
                        if (target) onSelectScheme(target);
                      } else if (act.actionType === 'upload_doc' || act.actionType === 'verify_digilocker') {
                        onNavigateToTab('wallet');
                      } else {
                        onOpenJagoWithPrompt(act.title);
                      }
                    }}
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shrink-0 transition"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 5-Scheme Dashboard */}
      <div className="space-y-4">
        
        {/* Section Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                {t.schemesTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              {t.schemesSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                selectedFilter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.filterAll} ({schemes.length})
            </button>
            <button
              onClick={() => setSelectedFilter('high_match')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                selectedFilter === 'high_match' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.filterEligible}
            </button>
            <button
              onClick={() => setSelectedFilter('applied')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                selectedFilter === 'applied' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.alreadyApplied}
            </button>
          </div>
        </div>

        {/* Scheme Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchemes.map(({ scheme, match, hasApplied }) => {
            return (
              <div
                key={scheme.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-800/70 border border-slate-700/70 hover:border-slate-500/80 transition-all shadow-md flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                      {scheme.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      match.matchScore >= 80 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {match.matchScore}% Match
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-blue-300 transition">
                      {scheme.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                      {scheme.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-700/60">
                    <div>
                      <span className="text-[10px] text-slate-400">{t.annualBenefit}</span>
                      <p className="font-bold text-emerald-300 font-mono">
                        ₹{scheme.annualBenefit.toLocaleString('en-IN')}/yr
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">{t.deadline}</span>
                      <p className="font-semibold text-amber-300 text-[11px]">
                        {scheme.deadlineDate}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => onSelectScheme(scheme)}
                    className="flex-1 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <span>{hasApplied ? t.alreadyApplied : t.applyNow}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
