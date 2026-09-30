import React, { useState } from 'react';
import { 
  Users, 
  Baby, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  IndianRupee, 
  Calendar, 
  Phone, 
  School, 
  Heart, 
  Sparkles, 
  Lock, 
  Plus, 
  Check, 
  Clock, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { StudentProfile, ScholarshipScheme, ApplicationRecord } from '../../types/scholarship';
import { Language, TRANSLATIONS } from '../../data/translations';

interface ParentModeViewProps {
  student: StudentProfile;
  schemes: ScholarshipScheme[];
  applications: ApplicationRecord[];
  language?: Language;
  onOpenJagoWithPrompt?: (prompt: string) => void;
}

interface WardChild {
  id: string;
  name: string;
  relation: string;
  classGrade: string;
  institution: string;
  apaarId: string;
  attendancePercent: number;
  activeScheme: string;
  benefitAmount: number;
  dbtStatus: string;
}

export const ParentModeView: React.FC<ParentModeViewProps> = ({
  student,
  schemes,
  applications,
  language = 'en',
  onOpenJagoWithPrompt
}) => {
  const t = TRANSLATIONS[language];

  // List of children registered under this parent/guardian
  const [children, setChildren] = useState<WardChild[]>([
    {
      id: 'child_1',
      name: student.fullName,
      relation: 'Daughter (पुत्री)',
      classGrade: student.currentEducationLevel,
      institution: student.institutionName,
      apaarId: student.apaarId,
      attendancePercent: 88.5,
      activeScheme: 'AICTE Pragati Scholarship for Girls',
      benefitAmount: 50000,
      dbtStatus: 'District Approved • DBT Queued'
    },
    {
      id: 'child_2',
      name: 'Rohan Sharma',
      relation: 'Son (पुत्र)',
      classGrade: 'Class 9th (Science)',
      institution: 'Govt Model Inter College, Varanasi',
      apaarId: '9845-7721-3310',
      attendancePercent: 91.2,
      activeScheme: 'National Means-cum-Merit Scholarship (NMMS)',
      benefitAmount: 12000,
      dbtStatus: 'School Principal Verified'
    }
  ]);

  const [selectedChildId, setSelectedChildId] = useState<string>('child_1');
  const [parentConsentGiven, setParentConsentGiven] = useState<boolean>(true);
  const [showAddChildModal, setShowAddChildModal] = useState<boolean>(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildApaar, setNewChildApaar] = useState('');
  const [newChildClass, setNewChildClass] = useState('Class 10th');

  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;

    const newChild: WardChild = {
      id: `child_${Date.now()}`,
      name: newChildName.trim(),
      relation: 'Ward (बच्चा)',
      classGrade: newChildClass,
      institution: 'Varanasi District Secondary School',
      apaarId: newChildApaar.trim() || `9845-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      attendancePercent: 85.0,
      activeScheme: 'Post-Matric Scholarship Scheme',
      benefitAmount: 25000,
      dbtStatus: 'Draft Application'
    };

    setChildren(prev => [...prev, newChild]);
    setSelectedChildId(newChild.id);
    setShowAddChildModal(false);
    setNewChildName('');
    setNewChildApaar('');
  };

  return (
    <div className="py-4 px-2 sm:px-4 max-w-7xl mx-auto space-y-6">
      
      {/* Parent Mode Welcome Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-orange-950/40 border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase tracking-wider">
              {t.parentModeTitle}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              Parent & Guardian Desk
            </span>
          </div>
          <h2 className="text-base sm:text-xl font-bold text-white">
            {t.parentModeTitle}
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            {t.parentModeSubtitle}
          </p>
        </div>

        <button
          onClick={() => setShowAddChildModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Another Child (दूसरा बच्चा जोड़ें)</span>
        </button>
      </div>

      {/* Ward / Children Selection Tabs */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          {t.parentSwitchChild} ({children.length} Wards Linked)
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {children.map((child) => {
            const isSelected = child.id === selectedChild.id;
            return (
              <div
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-slate-800/90 border-purple-500 shadow-lg ring-1 ring-purple-500/50'
                    : 'bg-slate-900/80 hover:bg-slate-800/60 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">
                      {child.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{child.name}</h4>
                      <p className="text-[10px] text-purple-300">{child.relation}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{child.classGrade}</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400 text-[11px]">Scholarship Entitlement:</span>
                  <span className="font-bold text-emerald-300 font-mono">₹{child.benefitAmount.toLocaleString('en-IN')}/yr</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Child Parent Control Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Plain-Language Parent Overview & Money Tracker */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Plain-Language Explainer Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Parent Summary for {selectedChild.name}
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                {selectedChild.dbtStatus}
              </span>
            </div>

            {/* Simple Parent Explanation */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs">
              <p className="font-semibold text-white text-sm">
                What scholarship is your child receiving?
              </p>
              <p className="text-slate-300 leading-relaxed">
                <strong>{selectedChild.name}</strong> is registered for <strong>{selectedChild.activeScheme}</strong>. Under this scheme, the government provides an annual educational grant of <strong>₹{selectedChild.benefitAmount.toLocaleString('en-IN')}</strong> directly for tuition, books, and educational expenses.
              </p>
              <p className="text-slate-400 text-[11px] pt-1">
                💡 The money will be deposited directly into your child's Aadhaar-linked bank account without any middlemen or bank branch visits.
              </p>
            </div>

            {/* 3 Status Metrics for Parents */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-[10px] text-slate-400">Child's Attendance</span>
                <p className="text-base font-bold text-emerald-300 font-mono mt-0.5">
                  {selectedChild.attendancePercent}% Verified
                </p>
                <p className="text-[10px] text-slate-400">Minimum 75% required</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-[10px] text-slate-400">School Clearance</span>
                <p className="text-base font-bold text-blue-300 font-mono mt-0.5">
                  Principal Verified
                </p>
                <p className="text-[10px] text-slate-400">Roll authenticated</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-[10px] text-slate-400">Bank Seed Status</span>
                <p className="text-base font-bold text-teal-300 font-mono mt-0.5">
                  NPCI Active
                </p>
                <p className="text-[10px] text-slate-400">Aadhaar Bridge ready</p>
              </div>
            </div>

          </div>

          {/* Parental / Guardian Legal Consent Desk */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {t.parentConsentTitle}
              </h3>
            </div>

            <p className="text-xs text-slate-300">
              {t.parentConsentSubtitle}
            </p>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={parentConsentGiven}
                  onChange={(e) => setParentConsentGiven(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-purple-600 focus:ring-0"
                />
                <div className="text-slate-200">
                  <span className="font-semibold text-white block">Parent / Guardian Legal Declaration</span>
                  <span className="text-[11px] text-slate-400">
                    I confirm that I am the legal parent/guardian of {selectedChild.name}. I verify our declared annual family income of ₹{student.annualFamilyIncome.toLocaleString('en-IN')} and authorize the release of Direct Benefit Transfer funds to the ward's account.
                  </span>
                </div>
              </label>

              {parentConsentGiven && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Digital Parent Signature Token: #PAR-SIG-{Math.floor(1000 + Math.random() * 9000)} active</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Parent Helpline & Direct JAGO Guidance */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Toll-Free Parent Helpline */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Phone className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                National Parent Scholarship Helpline
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Toll-Free Parent Line</span>
                  <p className="text-base font-extrabold text-orange-400 font-mono mt-0.5">
                    1800-180-5511 / 14431
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-semibold">
                  Toll-Free 24x7
                </span>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-700/60">
                <p>• Language Support: हिन्दी, English, and regional dialects</p>
                <p>• Assistance for parents without smartphones or bank internet access</p>
                <p>• SMS Alerts enabled for every step of your child's application</p>
              </div>
            </div>

            {/* Ask JAGO in simple parent terms */}
            {onOpenJagoWithPrompt && (
              <button
                onClick={() => onOpenJagoWithPrompt(`I am the parent of ${selectedChild.name}. In simple words, what is the status of my child's scholarship, when will the ₹${selectedChild.benefitAmount.toLocaleString('en-IN')} be deposited in the bank, and do I need to visit any office?`)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Ask JAGO in simple words for parents</span>
              </button>
            )}

          </div>

          {/* School Details */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <School className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-white">Registered Educational Institution:</span>
            </div>
            <p className="text-slate-300 pl-6">
              {selectedChild.institution}
            </p>
            <p className="text-[11px] text-slate-400 pl-6">
              UDISE Code: {student.institutionUdiseCode} • Principal Nodal Desk Active
            </p>
          </div>

        </div>

      </div>

      {/* Add Child Modal */}
      {showAddChildModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 space-y-4 ring-1 ring-white/10 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Link New Child / Ward (नया बच्चा जोड़ें)</h3>
              <button onClick={() => setShowAddChildModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddChild} className="space-y-3">
              <div>
                <label className="block mb-1 font-semibold text-slate-300">Child's Full Name (as in School Roll) *</label>
                <input
                  type="text"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  required
                  placeholder="e.g. Rohan Sharma"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-slate-300">APAAR ID / Aadhaar Number</label>
                <input
                  type="text"
                  value={newChildApaar}
                  onChange={(e) => setNewChildApaar(e.target.value)}
                  placeholder="e.g. 9845-7721-3310"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-slate-300">Current Class / Standard</label>
                <select
                  value={newChildClass}
                  onChange={(e) => setNewChildClass(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="Class 8th">Class 8th</option>
                  <option value="Class 9th">Class 9th (NMMS Scheme)</option>
                  <option value="Class 10th">Class 10th (Secondary)</option>
                  <option value="Class 11th">Class 11th (Higher Sec)</option>
                  <option value="Class 12th">Class 12th (Senior Sec)</option>
                  <option value="Undergraduate">Undergraduate / College</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow-lg shadow-purple-600/20"
              >
                Link Child & Load Eligible Schemes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
