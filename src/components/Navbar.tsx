import React from 'react';
import { 
  GraduationCap, 
  Smartphone, 
  ShieldCheck, 
  Bell, 
  Globe, 
  Sparkles,
  LogOut,
  User,
  Lock
} from 'lucide-react';
import { UserSession } from './auth/AuthScreen';
import { Language, TRANSLATIONS } from '../data/translations';

export type ActivePortal = 'student' | 'admin';

interface NavbarProps {
  activePortal: ActivePortal;
  setActivePortal: (portal: ActivePortal) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenJago: () => void;
  unreadCount?: number;
  session?: UserSession | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePortal,
  setActivePortal,
  language,
  setLanguage,
  onOpenJago,
  unreadCount = 2,
  session,
  onLogout
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Tricolor National Stripe Header */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#000080]"></div>
        </div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Brand & Emblem with Tricolor accents */}
        <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0" onClick={() => setActivePortal('student')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-emerald-600 shadow-lg shadow-orange-500/20 ring-1 ring-white/20">
            <GraduationCap className="w-5 h-5 text-white" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-orange-400 via-amber-200 to-emerald-400 bg-clip-text text-transparent">
                {t.brandTitle}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                {t.brandTag}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 -mt-0.5 hidden md:block">
              {t.brandSubtitle}
            </p>
          </div>
        </div>

        {/* Global Portals Switcher: Student Portal vs Officer Desk */}
        <nav className="hidden sm:flex items-center p-1 bg-slate-800/90 rounded-xl border border-slate-700/60 shadow-inner">
          
          {/* 1. Student Portal */}
          <button
            onClick={() => setActivePortal('student')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activePortal === 'student'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{t.navStudent}</span>
          </button>

          {/* 2. Officer Desk */}
          <button
            onClick={() => setActivePortal('admin')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activePortal === 'admin'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.navOfficer}</span>
          </button>

        </nav>

        {/* Right Action Icons: JAGO AI trigger, User Session, Language, Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* JAGO Quick Trigger */}
          <button
            onClick={onOpenJago}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-all shadow-sm group"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">JAGO AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900"></span>
          </button>

          {/* Language Selector (Working for en, hi, hinglish) */}
          <div className="relative flex items-center bg-slate-800/90 rounded-xl border border-slate-700/80 px-2 py-1 text-xs text-slate-300 shadow-sm">
            <Globe className="w-3.5 h-3.5 mr-1 text-orange-400 shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs font-semibold"
            >
              <option value="en" className="bg-slate-800 text-white">English</option>
              <option value="hi" className="bg-slate-800 text-white">हिन्दी (Hindi)</option>
              <option value="hinglish" className="bg-slate-800 text-white">Hinglish</option>
            </select>
          </div>

          {/* Active User Session Badge */}
          {session && (
            <div className="hidden md:flex items-center gap-2 pl-2.5 pr-1.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-semibold text-slate-200 truncate max-w-[120px]" title={session.userName}>
                  {session.userName}
                </span>
                {session.isTrial && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-orange-500/20 text-orange-300 font-mono">
                    Trial
                  </span>
                )}
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  title={t.navLogout}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 transition ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Mobile Sign Out button */}
          {session && onLogout && (
            <button
              onClick={onLogout}
              title={t.navLogout}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {/* Notifications indicator */}
          <div className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-slate-900 animate-ping"></span>
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-slate-900"></span>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Portal Navigation Bar */}
      <div className="sm:hidden flex items-center justify-around border-t border-slate-800 bg-slate-900/90 px-2 py-1.5 text-xs">
        <button
          onClick={() => setActivePortal('student')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${
            activePortal === 'student' ? 'text-orange-400 font-bold bg-orange-500/10' : 'text-slate-400'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{t.navStudent}</span>
        </button>

        <button
          onClick={() => setActivePortal('admin')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${
            activePortal === 'admin' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t.navOfficer}</span>
        </button>
      </div>
    </header>
  );
};
