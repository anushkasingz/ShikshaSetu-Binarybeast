import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  CheckCircle2, 
  AlertCircle, 
  IndianRupee, 
  Calendar, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Award,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { ScholarshipScheme, StudentProfile } from '../../types/scholarship';
import { evaluateSchemeEligibility } from '../../services/smartEngines';
import { Language, TRANSLATIONS } from '../../data/translations';

interface ScholarshipSearchEngineProps {
  schemes: ScholarshipScheme[];
  student: StudentProfile;
  language?: Language;
  onSelectScheme: (scheme: ScholarshipScheme) => void;
}

export const ScholarshipSearchEngine: React.FC<ScholarshipSearchEngineProps> = ({
  schemes,
  student,
  language = 'en',
  onSelectScheme
}) => {
  const t = TRANSLATIONS[language];

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMinistry, setSelectedMinistry] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<'All' | 'Female'>('All');
  const [minBenefit, setMinBenefit] = useState<number>(0);
  const [onlyEligible, setOnlyEligible] = useState<boolean>(false);

  // Dynamic Simulation Criteria (defaults to student's verified profile)
  const [simIncome, setSimIncome] = useState<number>(student.annualFamilyIncome);
  const [simMarks, setSimMarks] = useState<number>(student.marksPercentage);
  const [simCategory, setSimCategory] = useState<string>(student.category);
  const [showSimulator, setShowSimulator] = useState<boolean>(true);

  // Simulated student profile for matching calculation
  const simulatedStudent: StudentProfile = useMemo(() => ({
    ...student,
    annualFamilyIncome: simIncome,
    marksPercentage: simMarks,
    category: simCategory as any
  }), [student, simIncome, simMarks, simCategory]);

  // Extract unique ministries
  const ministries = useMemo(() => {
    const list = Array.from(new Set(schemes.map(s => s.ministry)));
    return ['All', ...list];
  }, [schemes]);

  // Filter schemes
  const filteredSchemes = useMemo(() => {
    return schemes.map(scheme => {
      const match = evaluateSchemeEligibility(simulatedStudent, scheme);
      return { scheme, match };
    }).filter(({ scheme, match }) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery = 
          scheme.name.toLowerCase().includes(q) ||
          scheme.shortName.toLowerCase().includes(q) ||
          scheme.code.toLowerCase().includes(q) ||
          scheme.ministry.toLowerCase().includes(q) ||
          scheme.description.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Ministry filter
      if (selectedMinistry !== 'All' && scheme.ministry !== selectedMinistry) {
        return false;
      }

      // Gender filter
      if (selectedGender === 'Female' && scheme.criteria.genderRestriction !== 'Female') {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && !scheme.criteria.allowedCategories.includes(selectedCategory) && !scheme.criteria.allowedCategories.includes('All')) {
        return false;
      }

      // Benefit filter
      if (scheme.annualBenefit < minBenefit) {
        return false;
      }

      // Only eligible toggle
      if (onlyEligible && !match.isEligible) {
        return false;
      }

      return true;
    }).sort((a, b) => b.match.matchScore - a.match.matchScore);
  }, [schemes, simulatedStudent, searchQuery, selectedMinistry, selectedGender, selectedCategory, minBenefit, onlyEligible]);

  const handleResetSimulator = () => {
    setSimIncome(student.annualFamilyIncome);
    setSimMarks(student.marksPercentage);
    setSimCategory(student.category);
  };

  return (
    <div className="py-4 px-2 sm:px-4 max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-950/40 via-slate-900 to-emerald-950/40 border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold uppercase tracking-wider">
              AI Matching Engine
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              National Scholarship Search
            </span>
          </div>
          <h2 className="text-base sm:text-xl font-bold text-white">
            {t.searchEngineTitle}
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            {t.searchEngineSubtitle}
          </p>
        </div>

        <button
          onClick={() => setShowSimulator(!showSimulator)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
          <span>{showSimulator ? 'Hide Eligibility Simulator' : 'Simulate My Criteria'}</span>
        </button>
      </div>

      {/* Dynamic Eligibility Simulation Panel */}
      {showSimulator && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-orange-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Simulate Demographic & Academic Criteria
              </h3>
            </div>
            <button
              onClick={handleResetSimulator}
              className="text-[11px] text-slate-400 hover:text-orange-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to My Verified Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            {/* Income Slider */}
            <div className="space-y-2 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Annual Family Income:</span>
                <span className="font-mono text-emerald-300 font-bold">₹{simIncome.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="800000"
                step="25000"
                value={simIncome}
                onChange={(e) => setSimIncome(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>₹50K (EWS)</span>
                <span>₹2.5L (Post-Matric)</span>
                <span>₹8L (Central)</span>
              </div>
            </div>

            {/* Marks Slider */}
            <div className="space-y-2 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Academic Score (12th / Course):</span>
                <span className="font-mono text-orange-300 font-bold">{simMarks}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="1"
                value={simMarks}
                onChange={(e) => setSimMarks(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>50% Min</span>
                <span>75% (Distinction)</span>
                <span>100% Top Merit</span>
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-2 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
              <span className="text-slate-300 font-semibold">Social Category:</span>
              <select
                value={simCategory}
                onChange={(e) => setSimCategory(e.target.value)}
                className="bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-orange-500 text-xs cursor-pointer"
              >
                <option value="General">General (UR)</option>
                <option value="OBC">OBC (Non-Creamy Layer)</option>
                <option value="SC">Scheduled Caste (SC)</option>
                <option value="ST">Scheduled Tribe (ST)</option>
                <option value="EWS">Economically Weaker Section (EWS)</option>
              </select>
              <span className="text-[10px] text-slate-400">Simulating reservation quota match</span>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar & Multi-Filter Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 shadow-inner"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Ministry selector */}
          <select
            value={selectedMinistry}
            onChange={(e) => setSelectedMinistry(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-[11px] cursor-pointer"
          >
            {ministries.map(m => (
              <option key={m} value={m}>{m === 'All' ? 'All Ministries' : m}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-[11px] cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="SC">SC (Post-Matric)</option>
            <option value="ST">ST Tribal</option>
            <option value="OBC">OBC Central</option>
            <option value="EWS">EWS</option>
          </select>

          {/* Gender */}
          <button
            onClick={() => setSelectedGender(selectedGender === 'Female' ? 'All' : 'Female')}
            className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition ${
              selectedGender === 'Female'
                ? 'bg-purple-600 border-purple-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            Girls Only Schemes (AICTE Pragati)
          </button>

          {/* Only Eligible Checkbox */}
          <label className="flex items-center gap-2 ml-auto cursor-pointer text-[11px] text-slate-300">
            <input
              type="checkbox"
              checked={onlyEligible}
              onChange={(e) => setOnlyEligible(e.target.checked)}
              className="rounded border-slate-700 text-orange-500 focus:ring-0"
            />
            <span>Show Only Eligible Schemes ({filteredSchemes.filter(s => s.match.isEligible).length})</span>
          </label>
        </div>
      </div>

      {/* Schemes Results Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Found {filteredSchemes.length} matching scholarship schemes</span>
          <span className="font-mono">Ranked by Match Score %</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSchemes.map(({ scheme, match }) => {
            return (
              <div
                key={scheme.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition shadow-lg flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  
                  {/* Top tags */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {scheme.code}
                    </span>
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full font-mono ${
                      match.matchScore >= 80
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : match.matchScore >= 60
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {match.matchScore}% Match
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base">
                      {scheme.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{scheme.ministry}</span>
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                      <span className="text-[10px] text-slate-400">{t.annualBenefit}:</span>
                      <p className="font-bold text-emerald-300 font-mono text-sm">
                        ₹{scheme.annualBenefit.toLocaleString('en-IN')}/year
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                      <span className="text-[10px] text-slate-400">{t.deadline}:</span>
                      <p className="font-semibold text-amber-300 text-xs mt-0.5">
                        {scheme.deadlineDate}
                      </p>
                    </div>
                  </div>

                  {/* Eligibility Match breakdown checklist */}
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5 text-[11px]">
                    <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] block">
                      Engine Eligibility Checklist:
                    </span>
                    {match.reasons.map((r, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </div>
                    ))}
                    {match.blockers.map((b, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-rose-300">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Action button */}
                <button
                  onClick={() => onSelectScheme(scheme)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Inspect Scheme & 1-Click Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
