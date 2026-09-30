import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  GraduationCap, 
  KeyRound, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Smartphone,
  Info,
  Zap,
  Globe,
  Mail,
  IndianRupee,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { StudentProfile } from '../../types/scholarship';
import { Language, TRANSLATIONS } from '../../data/translations';

export interface UserSession {
  userId: string;
  userName: string;
  role: 'student' | 'officer' | 'admin';
  roleTitle: string;
  identifier: string; // APAAR ID or Officer ID
  sessionId: string;
  loginTime: string;
  isTrial: boolean;
}

interface AuthScreenProps {
  onLoginSuccess: (session: UserSession, updatedStudent?: Partial<StudentProfile>) => void;
  student: StudentProfile;
  language?: Language;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  student,
  language = 'en'
}) => {
  const t = TRANSLATIONS[language];
  // Show Sign Up feature first before accessing the app
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [authRole, setAuthRole] = useState<'student' | 'officer'>('student');
  
  // Sign In state
  const [identifier, setIdentifier] = useState(student.apaarId);
  const [password, setPassword] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Sign Up form state
  const [signUpRole, setSignUpRole] = useState<'student' | 'officer'>('student');
  const [fullName, setFullName] = useState('');
  const [signUpIdentifier, setSignUpIdentifier] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [category, setCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'EWS'>('OBC');
  const [annualIncome, setAnnualIncome] = useState<number>(180000);
  const [academicLevel, setAcademicLevel] = useState('B.Tech 1st Year (Govt Engg College)');
  const [district, setDistrict] = useState('Varanasi');
  const [officerDesignation, setOfficerDesignation] = useState('District Welfare Officer (Varanasi)');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpSuccessMsg, setSignUpSuccessMsg] = useState<string | null>(null);

  const generateSession = (
    role: 'student' | 'officer' | 'admin', 
    userName: string, 
    roleTitle: string, 
    idNum: string, 
    isTrial: boolean = false
  ): UserSession => {
    return {
      userId: `USR-${Math.floor(100000 + Math.random() * 900000)}`,
      userName,
      role,
      roleTitle,
      identifier: idNum,
      sessionId: `SES-2026-IN-${Math.floor(1000 + Math.random() * 9000)}`,
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTrial
    };
  };

  // Sign In Handler
  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (authRole === 'student') {
        const session = generateSession(
          'student', 
          student.fullName, 
          'Undergraduate Student', 
          identifier || student.apaarId, 
          false
        );
        onLoginSuccess(session);
      } else {
        const session = generateSession(
          'officer', 
          'Dr. Rajeshwar Rao', 
          'District Welfare Officer (Varanasi)', 
          identifier || 'OFF-UP-VAR-9912', 
          false
        );
        onLoginSuccess(session);
      }
    }, 500);
  };

  // Sign Up Handler
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);

    if (!fullName.trim()) {
      setSignUpError('Please enter your full name as registered on Aadhaar.');
      return;
    }

    if (signUpPassword !== confirmPassword) {
      setSignUpError('Passwords do not match. Please re-enter confirm password.');
      return;
    }

    if (signUpPassword.length < 6) {
      setSignUpError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSignUpSuccessMsg('Account registered successfully! Initiating session token...');

      setTimeout(() => {
        if (signUpRole === 'student') {
          const updatedData: Partial<StudentProfile> = {
            fullName: fullName.trim(),
            apaarId: signUpIdentifier.trim() || `9845-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
            category: category,
            annualFamilyIncome: Number(annualIncome) || 180000,
            district: district,
            currentEducationLevel: academicLevel
          };

          const session = generateSession(
            'student',
            fullName.trim(),
            `${academicLevel} • ${district}`,
            updatedData.apaarId || student.apaarId,
            false
          );

          onLoginSuccess(session, updatedData);
        } else {
          const session = generateSession(
            'officer',
            fullName.trim(),
            officerDesignation,
            signUpIdentifier.trim() || `OFF-UP-${Math.floor(1000 + Math.random() * 9000)}`,
            false
          );

          onLoginSuccess(session);
        }
      }, 600);
    }, 800);
  };

  // 1-Click Trial Logins
  const handleTrialLogin = (type: 'student' | 'officer_district' | 'officer_state') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (type === 'student') {
        const session = generateSession(
          'student', 
          student.fullName, 
          'Student • B.Tech 1st Year (Govt Engg College)', 
          student.apaarId, 
          true
        );
        onLoginSuccess(session);
      } else if (type === 'officer_district') {
        const session = generateSession(
          'officer', 
          'Dr. Rajeshwar Rao', 
          'District Welfare Officer (Varanasi)', 
          'OFF-UP-VAR-8841', 
          true
        );
        onLoginSuccess(session);
      } else {
        const session = generateSession(
          'officer', 
          'Smt. Sunita Verma, IAS', 
          'State Nodal Officer (Uttar Pradesh Welfare Directorate)', 
          'IAS-UP-NODAL-1002', 
          true
        );
        onLoginSuccess(session);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-orange-500 selection:text-white relative overflow-hidden">
      
      {/* Tricolor National Top Ribbon */}
      <div className="h-1.5 w-full flex shrink-0">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#000080]"></div>
        </div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container */}
      <div className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center w-full z-10">
        
        {/* Emblem & Portal Brand */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-emerald-600 shadow-xl shadow-orange-500/20 ring-2 ring-white/20 mb-1">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 via-amber-200 to-emerald-400 bg-clip-text text-transparent">
              {t.authTitle}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            {t.authSubtitle}
          </p>
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <span className="text-orange-400">Digital Public Infrastructure</span>
            <span>•</span>
            <span className="text-emerald-400">One-User-One-Login Authenticated</span>
          </div>
        </div>

        {/* Main Mode Toggle: Sign In vs Sign Up */}
        <div className="max-w-md mx-auto w-full mb-6">
          <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-700/80 shadow-lg text-xs">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setSignUpError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                authMode === 'signin'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t.authSignInTab}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setSignUpError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                authMode === 'signup'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.authSignUpTab}</span>
            </button>
          </div>
        </div>

        {/* Auth Box & Trial Panel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Form Box (Sign In OR Sign Up) */}
          <div className="md:col-span-7 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 flex flex-col justify-between">
            
            {/* SIGN IN VIEW */}
            {authMode === 'signin' ? (
              <div className="space-y-4">
                
                {/* Role Toggle Tabs */}
                <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthRole('student');
                      setIdentifier(student.apaarId);
                    }}
                    className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                      authRole === 'student'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{t.authStudentRole}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthRole('officer');
                      setIdentifier('OFF-UP-VAR-9912');
                    }}
                    className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                      authRole === 'officer'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t.authOfficerRole}</span>
                  </button>
                </div>

                {/* One-User-One-Login Notice */}
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-start gap-2.5 text-xs text-slate-300">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">One-User-One-Login Enforced</span>
                    <span className="text-[11px] text-slate-400">
                      {t.authOneUserNotice}
                    </span>
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleStandardLogin} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block mb-1 font-semibold text-slate-300">
                      {authRole === 'student' ? t.authIdentifierLabel : 'Officer ID / e-Pramaan Username'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        placeholder={authRole === 'student' ? 'e.g. 9845-2104-6729' : 'e.g. OFF-UP-VAR-9912'}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-slate-300">{t.authPasswordLabel}</label>
                      <button type="button" onClick={() => setOtpSent(true)} className="text-[11px] text-orange-400 hover:underline">
                        Login via Mobile OTP
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
                      />
                    </div>
                  </div>

                  {otpSent && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-600/50 text-[11px] text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>6-Digit OTP dispatched to linked mobile ending in •••• 3210</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition shadow-lg flex items-center justify-center gap-2 ${
                      authRole === 'student'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white shadow-orange-500/20'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/20'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isLoading ? 'Verifying Credentials...' : t.authSignInButton}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

              </div>
            ) : (
              /* SIGN UP VIEW (New Registration) */
              <div className="space-y-4">
                
                {/* Role Switcher for Registration */}
                <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setSignUpRole('student');
                      setSignUpError(null);
                    }}
                    className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                      signUpRole === 'student'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Student Registration</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSignUpRole('officer');
                      setSignUpError(null);
                    }}
                    className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                      signUpRole === 'officer'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Officer Registration</span>
                  </button>
                </div>

                {/* Feedback Alerts */}
                {signUpError && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-600/50 flex items-center gap-2 text-xs text-rose-300">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{signUpError}</span>
                  </div>
                )}

                {signUpSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-600/50 flex items-center gap-2 text-xs text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{signUpSuccessMsg}</span>
                  </div>
                )}

                {/* Sign Up Form */}
                <form onSubmit={handleSignUpSubmit} className="space-y-3 text-xs max-h-[360px] overflow-y-auto pr-1">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block mb-1 font-semibold text-slate-300">
                      {t.authSignUpFullName} *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder="e.g. Aarti Kumari"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Student Specific Fields */}
                  {signUpRole === 'student' ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block mb-1 font-semibold text-slate-300">
                            APAAR ID / Aadhaar No.
                          </label>
                          <input
                            type="text"
                            value={signUpIdentifier}
                            onChange={(e) => setSignUpIdentifier(e.target.value)}
                            placeholder="e.g. 9845-3120-9981"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono text-xs"
                          />
                        </div>

                        <div>
                          <label className="block mb-1 font-semibold text-slate-300">
                            {t.authSignUpMobile} *
                          </label>
                          <div className="relative">
                            <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="tel"
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value)}
                              required
                              placeholder="e.g. 9876543210"
                              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block mb-1 font-semibold text-slate-300">
                            {t.authSignUpCategory}
                          </label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as any)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs cursor-pointer"
                          >
                            <option value="General">General (UR)</option>
                            <option value="OBC">OBC (Non-Creamy Layer)</option>
                            <option value="SC">Scheduled Caste (SC)</option>
                            <option value="ST">Scheduled Tribe (ST)</option>
                            <option value="EWS">Economically Weaker Section (EWS)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block mb-1 font-semibold text-slate-300">
                            {t.authSignUpIncome}
                          </label>
                          <div className="relative">
                            <IndianRupee className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="number"
                              value={annualIncome}
                              onChange={(e) => setAnnualIncome(Number(e.target.value))}
                              placeholder="180000"
                              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block mb-1 font-semibold text-slate-300">
                            {t.authSignUpAcademic}
                          </label>
                          <input
                            type="text"
                            value={academicLevel}
                            onChange={(e) => setAcademicLevel(e.target.value)}
                            placeholder="e.g. B.Tech 1st Year"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block mb-1 font-semibold text-slate-300">
                            {t.authSignUpDistrict}
                          </label>
                          <input
                            type="text"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            placeholder="e.g. Varanasi, UP"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Officer Specific Registration Fields */
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block mb-1 font-semibold text-slate-300">
                            Govt Officer ID *
                          </label>
                          <input
                            type="text"
                            value={signUpIdentifier}
                            onChange={(e) => setSignUpIdentifier(e.target.value)}
                            required
                            placeholder="e.g. OFF-UP-VAR-5520"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
                          />
                        </div>

                        <div>
                          <label className="block mb-1 font-semibold text-slate-300">
                            Official Email (@gov.in / @nic.in)
                          </label>
                          <input
                            type="email"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                            placeholder="officer@up.gov.in"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 font-semibold text-slate-300">
                          Designation & Jurisdiction
                        </label>
                        <select
                          value={officerDesignation}
                          onChange={(e) => setOfficerDesignation(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs cursor-pointer"
                        >
                          <option value="District Welfare Officer (Varanasi)">District Welfare Officer (Varanasi)</option>
                          <option value="State Nodal Officer (Uttar Pradesh)">State Nodal Officer (Uttar Pradesh)</option>
                          <option value="Institute Nodal Officer (AKTU/GEC)">Institute Nodal Officer (AKTU/GEC)</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1 font-semibold text-slate-300">
                        Create Password *
                      </label>
                      <input
                        type="password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        required
                        placeholder="Min 6 characters"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-semibold text-slate-300">
                        {t.authSignUpPasswordConfirm} *
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Re-enter password"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl font-bold text-xs transition shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/20 mt-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isLoading ? 'Creating Account & Session...' : t.authSignUpButton}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

              </div>
            )}

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>National Informatics Centre (NIC) Standards</span>
              <span>AES-256 GCM</span>
            </div>
          </div>

          {/* Right Column: 1-Click Instant Trial Feature */}
          <div className="md:col-span-5 bg-gradient-to-b from-slate-900/90 to-slate-900 border border-orange-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  <Zap className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">{t.authTrialHeader}</h3>
                  <p className="text-[11px] text-slate-400">{t.authTrialSubheader}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Test the platform immediately with pre-loaded digital credentials, live schemes, and officer queues:
              </p>

              {/* 3 Trial Buttons */}
              <div className="space-y-2.5 pt-1">
                
                {/* Trial 1: Student */}
                <button
                  type="button"
                  onClick={() => handleTrialLogin('student')}
                  disabled={isLoading}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-orange-500/50 transition group space-y-1 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-orange-300 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-orange-400" />
                      <span>{t.authTrialStudent}</span>
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono">
                      Student Desk
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    B.Tech Student with CBSE 12th marksheet (84.6%), DigiLocker, JAGO voice guide & 1-click Pragati application.
                  </p>
                </button>

                {/* Trial 2: District Officer */}
                <button
                  type="button"
                  onClick={() => handleTrialLogin('officer_district')}
                  disabled={isLoading}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 transition group space-y-1 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.authTrialDistrictOfficer}</span>
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      District Desk
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Inspect verification queues, reconcile side-by-side mismatches, and release PFMS DBT batches.
                  </p>
                </button>

                {/* Trial 3: State Officer */}
                <button
                  type="button"
                  onClick={() => handleTrialLogin('officer_state')}
                  disabled={isLoading}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/50 transition group space-y-1 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-teal-300 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-teal-400" />
                      <span>{t.authTrialStateOfficer}</span>
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono">
                      State Analytics
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    View Recharts application distribution, district saturation heatmaps, and dropout outreach desks.
                  </p>
                </button>

              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-orange-950/20 border border-orange-500/30 text-[10px] text-orange-200/90 text-center">
              💡 No password needed for Trial users. One-click session initialization.
            </div>
          </div>

        </div>

      </div>

      {/* Tricolor Bottom Footer Note */}
      <footer className="py-4 border-t border-slate-900 bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Government of India • Ministry of Education & Social Welfare</span>
          <div className="flex items-center gap-3 text-[11px]">
            <span>DigiLocker Integration</span>
            <span>•</span>
            <span>APAAR / ABC Academic Bank</span>
            <span>•</span>
            <span>NPCI Aadhaar Payment Bridge</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
