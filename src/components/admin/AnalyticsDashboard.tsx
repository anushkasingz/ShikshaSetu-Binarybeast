import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  Award, 
  BarChart3, 
  PieChart, 
  ShieldCheck, 
  Zap,
  CheckCircle2,
  Users
} from 'lucide-react';
import { ScholarshipScheme, ApplicationRecord } from '../../types/scholarship';

interface AnalyticsDashboardProps {
  schemes: ScholarshipScheme[];
  applications: ApplicationRecord[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  schemes,
  applications
}) => {
  const totalSanctioned = applications.reduce((acc, curr) => acc + (curr.status !== 'Rejected' ? curr.amountSanctioned : 0), 0);

  return (
    <div className="space-y-5">
      
      {/* Top Benchmark Metric */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-800 to-indigo-950/60 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                SIH Impact Benchmark
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                45x Speedup
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
              Turnaround Time: 180 Days Reduced to 4 Days
            </h2>
            <p className="text-xs text-slate-300">
              DigiLocker zero-trust verification and APAAR identity graph eliminate physical paperwork and verification bottlenecks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 text-center">
            <span className="text-[10px] text-slate-400 block">Manual Workflow</span>
            <span className="text-sm font-bold text-rose-400 line-through">180 Days</span>
          </div>
          <span className="text-slate-500 text-lg">→</span>
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600/60 text-center">
            <span className="text-[10px] text-emerald-300 block">ShikshaSetu AI</span>
            <span className="text-sm font-extrabold text-emerald-300">3.8 Days</span>
          </div>
        </div>
      </div>

      {/* Grid: Scheme Saturation & Verification Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Verification Funnel */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Application Pipeline Throughput
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Current Academic Cycle</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Applications Submitted', count: '142,500', pct: 100, color: 'bg-blue-500' },
              { label: 'Institute Desk Cleared', count: '128,400', pct: 90.1, color: 'bg-indigo-500' },
              { label: 'District Welfare Verified', count: '114,800', pct: 80.5, color: 'bg-purple-500' },
              { label: 'State Sanction Order Issued', count: '98,200', pct: 68.9, color: 'bg-emerald-500' },
              { label: 'DBT Credited to Aadhaar Bank', count: '92,100', pct: 64.6, color: 'bg-teal-400' }
            ].map((step, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{step.label}</span>
                  <span className="font-mono text-white font-bold">{step.count} ({step.pct}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${step.color} rounded-full transition-all duration-500`}
                    style={{ width: `${step.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheme Quota Saturation */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Flagship Scheme Quota Utilization
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">Total Seats Allocated</span>
          </div>

          <div className="space-y-3">
            {schemes.slice(0, 5).map((scheme) => (
              <div key={scheme.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-xs truncate max-w-[220px]">
                    {scheme.shortName}
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-300">
                    {scheme.quotaFilledPercent}% Filled
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    style={{ width: `${scheme.quotaFilledPercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Seats: {scheme.totalSeats.toLocaleString('en-IN')}</span>
                  <span>Grant: ₹{scheme.annualBenefit.toLocaleString('en-IN')}/yr</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
