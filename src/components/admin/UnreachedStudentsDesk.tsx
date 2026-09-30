import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Send, 
  MessageSquare, 
  PhoneCall, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  TrendingDown, 
  Flame,
  Radio,
  Layers
} from 'lucide-react';
import { OutreachStudent, DistrictMetric } from '../../types/scholarship';
import { OUTREACH_STUDENTS, DISTRICT_SATURATION_DATA } from '../../data/outreachData';

export const UnreachedStudentsDesk: React.FC = () => {
  const [students, setStudents] = useState<OutreachStudent[]>(OUTREACH_STUDENTS);
  const [districts, setDistricts] = useState<DistrictMetric[]>(DISTRICT_SATURATION_DATA);
  const [selectedChannel, setSelectedChannel] = useState<'SMS' | 'WhatsApp' | 'IVR'>('WhatsApp');
  const [isCampaignRunning, setIsCampaignRunning] = useState(false);
  const [campaignSuccess, setCampaignSuccess] = useState('');

  const handleTriggerCampaign = () => {
    setIsCampaignRunning(true);
    setTimeout(() => {
      setIsCampaignRunning(false);
      const newStatus = selectedChannel === 'WhatsApp' ? 'WhatsApp_Delivered' : selectedChannel === 'SMS' ? 'SMS_Dispatched' : 'IVR_Called';
      
      setStudents(prev => prev.map(s => ({
        ...s,
        outreachStatus: s.outreachStatus === 'Not_Contacted' ? newStatus : s.outreachStatus,
        lastCampaignDate: new Date().toISOString().split('T')[0]
      })));

      setCampaignSuccess(`Proactive campaign triggered via ${selectedChannel} to all unreached students in target districts. Messages dispatched in localized Hindi/Bhojpuri.`);
      setTimeout(() => setCampaignSuccess(''), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-5">
      
      {/* Overview Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-800/90 via-slate-800 to-rose-950/40 border border-slate-700/80 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Unreached & Drop-Out Risk Students (Saturation Radar)
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                AI Drop-Out Prevention
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Cross-referencing UDISE+ enrollment and Ration Card databases to identify students eligible for scholarships who haven't applied
            </p>
          </div>
        </div>

        {/* Campaign Controls */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-700 text-xs">
            <button
              onClick={() => setSelectedChannel('WhatsApp')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedChannel === 'WhatsApp' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => setSelectedChannel('SMS')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedChannel === 'SMS' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>SMS Blast</span>
            </button>
            <button
              onClick={() => setSelectedChannel('IVR')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedChannel === 'IVR' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>IVR Call</span>
            </button>
          </div>

          <button
            onClick={handleTriggerCampaign}
            disabled={isCampaignRunning}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition disabled:opacity-50"
          >
            <Radio className={`w-3.5 h-3.5 ${isCampaignRunning ? 'animate-spin' : ''}`} />
            <span>{isCampaignRunning ? 'Broadcasting...' : 'Launch Outreach'}</span>
          </button>
        </div>
      </div>

      {campaignSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-600 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{campaignSuccess}</span>
        </div>
      )}

      {/* District Heatmap / Saturation Table */}
      <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              District Scheme Saturation Heatmap
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Targeting districts with &lt; 70% saturation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {districts.map((dist) => (
            <div
              key={dist.district}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-xs">{dist.district}</span>
                  <span className="text-[10px] text-slate-400">({dist.state})</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.2 rounded font-mono ${
                  dist.saturationRate >= 75 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : dist.saturationRate >= 60
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {dist.saturationRate}% Saturated
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    dist.saturationRate >= 75 ? 'bg-emerald-500' : dist.saturationRate >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${dist.saturationRate}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Eligible: {dist.totalEligible.toLocaleString('en-IN')}</span>
                <span className="font-semibold text-rose-300">Unreached: {dist.unreachedCount.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                Top Gap Scheme: <strong className="text-slate-300">{dist.topUrgentScheme}</strong>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* High-Risk Unreached Students Table */}
      <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Identified High-Risk Students Pending Outreach ({students.length})
            </h4>
          </div>
          <span className="text-[10px] text-slate-400">Filtered from UDISE+ and Revenue data</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Student & School</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Income & Marks</th>
                <th className="py-3 px-4">AI Risk Factor</th>
                <th className="py-3 px-4">Eligible Schemes</th>
                <th className="py-3 px-4 text-right">Outreach Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 font-sans">
              {students.map((st) => (
                <tr key={st.id} className="hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{st.name}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-xs">{st.schoolName}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-200 font-medium">{st.district}</span>
                    <span className="text-[10px] text-slate-400 block">{st.state}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-mono text-emerald-300">₹{st.annualIncome.toLocaleString('en-IN')}/yr</div>
                    <div className="text-[10px] text-slate-400 font-mono">{st.marksPercent}% Score</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {st.riskFactor}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] text-indigo-300 font-medium line-clamp-1">
                      {st.eligibleSchemes.join(', ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      st.outreachStatus === 'Not_Contacted'
                        ? 'bg-slate-700 text-slate-300'
                        : st.outreachStatus === 'WhatsApp_Delivered'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {st.outreachStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
