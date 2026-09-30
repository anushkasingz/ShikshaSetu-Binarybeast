import React, { useState } from 'react';
import { 
  Layers, 
  Terminal, 
  Database, 
  Server, 
  Smartphone, 
  Bot, 
  Cpu, 
  ShieldCheck, 
  Cloud, 
  Bell, 
  Mic, 
  Lock, 
  Play, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  Code2
} from 'lucide-react';
import { 
  queryMockDigiLocker, 
  queryMockUdise, 
  queryMockApaar, 
  queryMockNpciDbt 
} from '../../data/mockExternalApis';

export const ArchitectureViewer: React.FC = () => {
  const [selectedApi, setSelectedApi] = useState<'digilocker' | 'udise' | 'apaar' | 'npci'>('digilocker');
  const [apiTesting, setApiTesting] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'stack' | 'sandbox' | 'database'>('stack');

  const handleTestApi = async (endpoint: 'digilocker' | 'udise' | 'apaar' | 'npci') => {
    setSelectedApi(endpoint);
    setApiTesting(true);
    setApiResponse(null);
    try {
      let res;
      if (endpoint === 'digilocker') {
        res = await queryMockDigiLocker('9845-2104-6729');
      } else if (endpoint === 'udise') {
        res = await queryMockUdise('09630504102');
      } else if (endpoint === 'apaar') {
        res = await queryMockApaar('9845-2104-6729');
      } else if (endpoint === 'npci') {
        res = await queryMockNpciDbt('XXXX-XXXX-7391');
      }
      setApiResponse(res);
    } catch (e) {
      console.error(e);
    } finally {
      setApiTesting(false);
    }
  };

  const STACK_LAYERS = [
    {
      id: 1,
      title: 'Student Mobile App',
      tech: 'Flutter + Dart',
      color: 'border-blue-500 bg-blue-950/20 text-blue-300',
      icon: Smartphone,
      points: ['Login & Student Profile', '5-Scheme Dashboard', 'Document Wallet & DigiLocker', 'JAGO Voice & Multilingual UI', 'Readiness Score & Risk Radar']
    },
    {
      id: 2,
      title: 'Backend API Gateway',
      tech: 'Python + FastAPI',
      color: 'border-emerald-500 bg-emerald-950/20 text-emerald-300',
      icon: Server,
      points: ['High-throughput Async REST APIs', 'Authentication & JWT Middleware', 'Workflow State Machine Orchestrator', 'Audit Log Ingestion Pipeline']
    },
    {
      id: 3,
      title: 'Main Relational DB & Vectors',
      tech: 'PostgreSQL + pgvector',
      color: 'border-indigo-500 bg-indigo-950/20 text-indigo-300',
      icon: Database,
      points: ['16 Core Tables (users, profiles, schemes, mismatches, dbt, etc.)', 'pgvector for Scheme Rules Semantic Search', 'ACID compliant transaction guarantees']
    },
    {
      id: 4,
      title: 'Document Cloud Storage',
      tech: 'Cloudinary / Firebase Storage',
      color: 'border-cyan-500 bg-cyan-950/20 text-cyan-300',
      icon: Cloud,
      points: ['Encrypted object store for student certificates', 'Thumbnails & responsive image generation', 'Storage URLs mapped in PostgreSQL documents table']
    },
    {
      id: 5,
      title: 'AI Conversational & RAG (JAGO)',
      tech: 'Gemini 3.8 Flash + RAG',
      color: 'border-amber-500 bg-amber-950/20 text-amber-300',
      icon: Bot,
      points: ['Gemini 3.8 Flash model invocation', 'RAG retrieval from government scheme rulebooks', 'Vernacular language support (Hindi, Hinglish, English)']
    },
    {
      id: 6,
      title: '6 Smart AI Engines',
      tech: 'Python NumPy/Pandas + ML',
      color: 'border-purple-500 bg-purple-950/20 text-purple-300',
      icon: Cpu,
      points: ['Match Engine (Profile → Scheme Rules)', 'Recommendation Engine (Ranking by benefit & deadline)', 'Readiness Score (0-100% circular meter)', 'Risk Radar (Proactive warnings)', 'Next-Best-Action Engine', 'Mismatch Detection (Student vs Government truth)']
    },
    {
      id: 7,
      title: 'Verification & Mock Sandbox Layer',
      tech: 'REST Connectors (Mock / Live)',
      color: 'border-teal-500 bg-teal-950/20 text-teal-300',
      icon: ShieldCheck,
      points: ['DigiLocker Sandbox Connector (/mock/digilocker)', 'UDISE+ School Registry (/mock/udise)', 'APAAR Academic Account Registry (/mock/apaar)', 'NPCI Aadhaar Payment Bridge (/mock/npci)']
    },
    {
      id: 8,
      title: 'Officer & Admin Portal',
      tech: 'React.js + Tailwind CSS',
      color: 'border-emerald-500 bg-emerald-950/20 text-emerald-300',
      icon: Code2,
      points: ['Multi-role verification queues', 'Side-by-side mismatch reconciliation desk', 'DBT PFMS batch execution', 'District saturation heatmap & dropout outreach']
    },
    {
      id: 9,
      title: 'Real-Time Notifications',
      tech: 'Firebase Cloud Messaging (FCM)',
      color: 'border-orange-500 bg-orange-950/20 text-orange-300',
      icon: Bell,
      points: ['Push alerts for expiring certificates', 'Deficiency notice broadcasts with 15-day cure timer', 'Payment disbursement SMS/WhatsApp receipts']
    },
    {
      id: 10,
      title: 'Voice JAGO Pipeline',
      tech: 'STT → Gemini → TTS',
      color: 'border-yellow-500 bg-yellow-950/20 text-yellow-300',
      icon: Mic,
      points: ['Speech-to-Text (Web Speech / Whisper)', 'Gemini 3.8 Flash Contextual Reasoning', 'Natural Text-to-Speech audio feedback']
    },
    {
      id: 11,
      title: 'Security & Consent Architecture',
      tech: 'JWT + SHA-256 + RBAC',
      color: 'border-rose-500 bg-rose-950/20 text-rose-300',
      icon: Lock,
      points: ['Masked sensitive Aadhaar PII', 'Role-Based Access Control (Student, Officer, Admin)', 'Immutable audit trail on every adjudication']
    }
  ];

  const PG_TABLES = [
    { name: 'users', desc: 'Authentication, hashed credentials, roles (Student, Officer, Admin)' },
    { name: 'student_profiles', desc: 'APAAR ID, masked Aadhaar, family income, category, institution UDISE' },
    { name: 'scholarships', desc: 'Scheme criteria, benefits, quotas, deadline, ministry rules' },
    { name: 'eligibility_rules', desc: 'Configurable rules evaluated by Python rule engine' },
    { name: 'applications', desc: 'Application number, workflow state, sanctioned amount, officer notes' },
    { name: 'documents', desc: 'Cloudinary storage URL, doc type, issued date, expiry date, DigiLocker ref' },
    { name: 'verification_records', desc: 'Automated verification check results with timestamp and seal ID' },
    { name: 'mismatch_records', desc: 'Discrepancies found between student input and official sandbox sources' },
    { name: 'manual_reviews', desc: 'Officer approval, defect notices, rejection justification audit logs' },
    { name: 'payments', desc: 'PFMS batch number, transaction UTR, Aadhaar bridge status, credit date' },
    { name: 'notifications', desc: 'FCM push messages, SMS/WhatsApp delivery receipts' },
    { name: 'chat_sessions & messages', desc: 'JAGO conversation transcripts and query embeddings' },
    { name: 'recommendations', desc: 'Ranked list of eligible schemes generated for student' },
    { name: 'readiness_scores', desc: 'Snapshot of calculated 0-100% readiness breakdown' },
    { name: 'outreach_students', desc: 'Unreached vulnerable students flagged for proactive SMS campaigns' },
    { name: 'audit_logs', desc: 'Tamper-proof HMAC signed event stream for all portal activities' }
  ];

  return (
    <div className="py-4 px-2 sm:px-4 max-w-7xl mx-auto space-y-5">
      
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-800 via-indigo-950 to-slate-900 border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono">
              SIH Flagship Blueprint
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
              11 Unified Components
            </span>
          </div>
          <h2 className="text-base sm:text-xl font-extrabold text-white mt-0.5">
            ShikshaSetu Production Tech Stack & Sandbox APIs
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Flutter (Student) + React (Admin) + FastAPI Backend + PostgreSQL/pgvector + Gemini 3.8 Flash + Government Mock Sandbox
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('stack')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'stack' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            11 Stack Layers
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'sandbox' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mock API Sandbox
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'database' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            PostgreSQL Schemas
          </button>
        </div>
      </div>

      {/* Tab 1: 11 Stack Layers Grid */}
      {activeTab === 'stack' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {STACK_LAYERS.map((layer) => {
            const IconComponent = layer.icon;
            return (
              <div
                key={layer.id}
                className={`p-4 rounded-2xl border ${layer.color} shadow-lg space-y-3 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                        #{layer.id}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold">{layer.tech}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2">{layer.title}</h3>

                  <ul className="space-y-1.5 text-[11px] text-slate-300">
                    {layer.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-slate-500">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Live Mock API Sandbox Tester */}
      {activeTab === 'sandbox' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Government Sandbox Connector Simulator</span>
              </h3>
              <p className="text-xs text-slate-400">
                Official SIH prototype disclaimer: Uses mock/sandbox connectors where live government API access is restricted.
              </p>
            </div>

            {/* API Trigger Buttons */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <button
                onClick={() => handleTestApi('digilocker')}
                className={`px-3 py-1.5 rounded-lg font-mono font-semibold transition ${
                  selectedApi === 'digilocker' ? 'bg-teal-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                /mock/digilocker
              </button>
              <button
                onClick={() => handleTestApi('udise')}
                className={`px-3 py-1.5 rounded-lg font-mono font-semibold transition ${
                  selectedApi === 'udise' ? 'bg-teal-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                /mock/udise
              </button>
              <button
                onClick={() => handleTestApi('apaar')}
                className={`px-3 py-1.5 rounded-lg font-mono font-semibold transition ${
                  selectedApi === 'apaar' ? 'bg-teal-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                /mock/apaar
              </button>
              <button
                onClick={() => handleTestApi('npci')}
                className={`px-3 py-1.5 rounded-lg font-mono font-semibold transition ${
                  selectedApi === 'npci' ? 'bg-teal-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                /mock/npci
              </button>
            </div>
          </div>

          {/* Terminal Output */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                <span className="ml-2 text-slate-400">REST Client: GET https://api.shikshasetu.gov.in/mock/{selectedApi}</span>
              </div>
              <button
                onClick={() => handleTestApi(selectedApi)}
                disabled={apiTesting}
                className="flex items-center gap-1 text-teal-400 hover:text-teal-300 cursor-pointer"
              >
                <Play className="w-3 h-3" />
                <span>{apiTesting ? 'Calling Endpoint...' : 'Send Request'}</span>
              </button>
            </div>

            {apiTesting && (
              <div className="py-6 text-center text-teal-400 animate-pulse">
                Simulating network latency & cryptographic signature verification...
              </div>
            )}

            {apiResponse && !apiTesting && (
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>Status: <strong className="text-emerald-400 font-bold">{apiResponse.statusCode} {apiResponse.status}</strong></span>
                  <span>Latency: <strong className="text-slate-200">{apiResponse.latencyMs}ms</strong></span>
                  <span>Signature: <strong className="text-indigo-400 font-mono">{apiResponse.auditSignature}</strong></span>
                </div>
                <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 overflow-x-auto text-[11px] leading-relaxed">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            )}

            {!apiResponse && !apiTesting && (
              <div className="py-8 text-center text-slate-600">
                Click "Send Request" above to test the {selectedApi} sandbox endpoint.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: PostgreSQL Database Schema */}
      {activeTab === 'database' && (
        <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                PostgreSQL + pgvector Core Relational Tables
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">16 Tables Configured</span>
          </div>

          <div className="divide-y divide-slate-700/60 font-sans text-xs">
            {PG_TABLES.map((tbl, i) => (
              <div key={i} className="p-3.5 hover:bg-slate-800/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <span className="font-mono font-bold text-purple-300 text-xs">{tbl.name}</span>
                </div>
                <span className="text-slate-400 text-[11px]">{tbl.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
