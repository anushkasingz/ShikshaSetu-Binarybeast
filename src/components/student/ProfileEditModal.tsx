import React, { useState } from 'react';
import { X, Save, RefreshCw, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { StudentProfile } from '../../types/scholarship';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  onSave: (updated: StudentProfile) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  student,
  onSave
}) => {
  const [formData, setFormData] = useState<StudentProfile>({ ...student });
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Edit Student Profile (Engine Simulator)</h3>
              <p className="text-[11px] text-slate-400">Modify attributes to observe live changes in Readiness Score & Eligibility</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-300">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-semibold text-slate-200">Full Name (Legal)</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-200">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-semibold text-slate-200">Social Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="General">General</option>
                <option value="OBC">OBC (Other Backward Classes)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-200">Annual Family Income (₹)</label>
              <input
                type="number"
                step="5000"
                value={formData.annualFamilyIncome}
                onChange={(e) => setFormData({ ...formData, annualFamilyIncome: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
              <span className="text-[10px] text-slate-400">Try ₹95,000, ₹1,85,000, or ₹9,00,000</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-semibold text-slate-200">Academic Score (% Marks)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.marksPercentage}
                onChange={(e) => setFormData({ ...formData, marksPercentage: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
              <span className="text-[10px] text-slate-400">Affects Central Sector & NMMS</span>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-200">APAAR ID (12-Digit)</label>
              <input
                type="text"
                value={formData.apaarId}
                onChange={(e) => setFormData({ ...formData, apaarId: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Toggle Switches for Real-Time Risk Simulation */}
          <div className="pt-2 border-t border-slate-800 space-y-2.5">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              Hardware & Bank Simulation Flags
            </h4>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <div>
                <p className="font-semibold text-slate-200">NPCI Aadhaar DBT Seeding</p>
                <p className="text-[11px] text-slate-400">Toggle off to simulate Aadhaar Payment Bridge (APB) failure</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  bankAccount: {
                    ...formData.bankAccount,
                    npciAadhaarSeeded: !formData.bankAccount.npciAadhaarSeeded
                  }
                })}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                  formData.bankAccount.npciAadhaarSeeded ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <div>
                <p className="font-semibold text-slate-200">DigiLocker Linked Status</p>
                <p className="text-[11px] text-slate-400">Connects with MeitY digital credential repository</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, digiLockerLinked: !formData.digiLockerLinked })}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                  formData.digiLockerLinked ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/30 transition"
            >
              {savedNotice ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{savedNotice ? 'Engines Recalculated!' : 'Save & Recalculate Engines'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
