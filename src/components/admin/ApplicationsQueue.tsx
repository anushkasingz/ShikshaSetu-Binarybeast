import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Eye, 
  ArrowUpDown, 
  ShieldCheck, 
  ChevronRight,
  User,
  Building2,
  FileCheck2
} from 'lucide-react';
import { ApplicationRecord } from '../../types/scholarship';

interface ApplicationsQueueProps {
  applications: ApplicationRecord[];
  onSelectApplication: (app: ApplicationRecord) => void;
  onOpenManualReview: (app: ApplicationRecord) => void;
}

export const ApplicationsQueue: React.FC<ApplicationsQueueProps> = ({
  applications,
  onSelectApplication,
  onOpenManualReview
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = applications.filter(app => {
    const matchesSearch = 
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.apaarId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.schemeName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      
      {/* Search and Filter Controls */}
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, APAAR ID, or app number..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>

          {['ALL', 'Submitted', 'District_Verified', 'Deficient', 'Disbursed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Applicant & APAAR</th>
                <th className="py-3 px-4">Scheme & Ministry</th>
                <th className="py-3 px-4">Sanction Amount</th>
                <th className="py-3 px-4">Status & Stage</th>
                <th className="py-3 px-4">Risk Flag</th>
                <th className="py-3 px-4 text-right">Officer Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 font-sans">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/50 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {app.studentName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{app.studentName}</div>
                        <div className="text-[10px] font-mono text-slate-400">APAAR: {app.apaarId}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{app.applicationNumber}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-semibold text-slate-200 line-clamp-1">{app.schemeName}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Applied: {app.appliedDate}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-emerald-300 text-sm">
                      ₹{app.amountSanctioned.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-400">DBT PFMS</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      app.status === 'Deficient'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : app.status === 'Disbursed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {app.status === 'Deficient' && <AlertTriangle className="w-3 h-3" />}
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      app.riskLevel === 'High'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {app.riskLevel} Risk ({app.matchScore}% Match)
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenManualReview(app)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition"
                      >
                        Review & Act
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No applications match the search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
