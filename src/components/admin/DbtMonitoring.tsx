import React, { useState } from 'react';
import { 
  IndianRupee, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  ArrowUpRight, 
  Download,
  Layers,
  Banknote
} from 'lucide-react';
import { ApplicationRecord } from '../../types/scholarship';

interface DbtMonitoringProps {
  applications: ApplicationRecord[];
  onTriggerDisbursalBatch: () => void;
}

export const DbtMonitoring: React.FC<DbtMonitoringProps> = ({
  applications,
  onTriggerDisbursalBatch
}) => {
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  const totalSanctioned = applications.reduce((acc, a) => acc + (a.status !== 'Rejected' ? a.amountSanctioned : 0), 0);
  const totalCredited = applications.filter(a => a.status === 'Disbursed').reduce((acc, a) => acc + a.amountSanctioned, 0);
  const queuedCount = applications.filter(a => a.dbtStatus === 'PFMS_Batch_Queued' || a.status === 'District_Verified').length;

  const handleRunBatch = () => {
    setIsProcessingBatch(true);
    setTimeout(() => {
      setIsProcessingBatch(false);
      onTriggerDisbursalBatch();
      setSuccessBanner('PFMS Batch #2026-UP-DBT-99214 executed successfully via NPCI APB. Funds released to student bank accounts.');
      setTimeout(() => setSuccessBanner(''), 5000);
    }, 1500);
  };

  return (
    <div className="space-y-5">
      
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Sanctioned Pool</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-extrabold text-white font-mono">
            ₹{totalSanctioned.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400">Approved by District Welfare desks</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Credited via Aadhaar Bridge</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xl font-extrabold text-emerald-300 font-mono">
            ₹{totalCredited.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400">100% Aadhaar-seeded accounts</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Pending PFMS Queue</span>
            <RefreshCw className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-extrabold text-amber-300 font-mono">
            {queuedCount} Applications
          </p>
          <span className="text-[10px] text-slate-400">Ready for batch disbursal file</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>NPCI Success Rate</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl font-extrabold text-purple-300 font-mono">
            99.2%
          </p>
          <span className="text-[10px] text-slate-400">0.8% rejected (Account unseeded)</span>
        </div>

      </div>

      {successBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-600 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Disbursal Action Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-800/90 via-slate-800 to-indigo-950/60 border border-slate-700/80 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Banknote className="w-4 h-4 text-emerald-400" />
            <span>Generate & Push PFMS DBT Batch</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Groups all district-verified applications and generates encrypted XML for RBI/NPCI settlement
          </p>
        </div>

        <button
          onClick={handleRunBatch}
          disabled={isProcessingBatch || queuedCount === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isProcessingBatch ? 'animate-spin' : ''}`} />
          <span>{isProcessingBatch ? 'Communicating with PFMS Gateway...' : 'Trigger PFMS Disbursal Batch'}</span>
        </button>
      </div>

      {/* Active Transactions Table */}
      <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            DBT Aadhaar Bridge Transaction Ledger
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">
            NPCI Aadhaar Payment Bridge (APB) Core
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Application & Student</th>
                <th className="py-3 px-4">Scheme</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">PFMS Batch ID</th>
                <th className="py-3 px-4">DBT Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 font-sans">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/50 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{app.studentName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{app.applicationNumber}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200 line-clamp-1">{app.schemeName}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-300">
                    ₹{app.amountSanctioned.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                    {app.pfmsTransactionId || 'QUEUED-BATCH-GEN'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      app.status === 'Disbursed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : app.dbtStatus === 'PFMS_Batch_Queued'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {app.status === 'Disbursed' ? 'Funds Credited (UTR-OK)' : app.dbtStatus.replace(/_/g, ' ')}
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
