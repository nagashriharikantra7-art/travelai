import React from 'react';
import { 
  Compass, 
  MapPin, 
  CalendarDays, 
  IndianRupee, 
  ShieldAlert, 
  Sparkles, 
  Sun, 
  Moon, 
  Languages, 
  Menu, 
  X,
  FileCheck,
  Building2,
  Route,
  Globe,
  SlidersHorizontal
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface NavbarProps {
  activeTab: 'explore' | 'itinerary' | 'routes' | 'budget' | 'checklists';
  setActiveTab: (tab: 'explore' | 'itinerary' | 'routes' | 'budget' | 'checklists') => void;
  onOpenWizard: () => void;
  onOpenEmergencyMode: () => void;
  lang: Language;
  onToggleLang: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  hasPlan: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenWizard,
  onOpenEmergencyMode,
  lang,
  onToggleLang,
  darkMode,
  onToggleDarkMode,
  hasPlan
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const t = TRANSLATIONS[lang];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#0a1128] text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Creative Yatra Logo & Brand */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setActiveTab('explore')}
              className="flex items-center space-x-3 text-left group"
              title="yatra — India Smart Travel & Stay Meta-Search"
            >
              {/* Creative Emblem Badge */}
              <div className="relative flex items-center justify-center">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-400 to-amber-500 opacity-20 blur-sm group-hover:opacity-70 transition duration-300" />
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0052D4] via-[#4364F7] to-[#00c6ff] p-[2px] shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                  <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#0a1128] flex items-center justify-center overflow-hidden">
                    <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="yatraGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#0052D4" />
                          <stop offset="50%" stopColor="#00B4D8" />
                          <stop offset="100%" stopColor="#FF5E36" />
                        </linearGradient>
                        <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#F59E0B" />
                          <stop offset="100%" stopColor="#EF4444" />
                        </linearGradient>
                      </defs>
                      {/* Geometric Pin & Circuit Wave */}
                      <path
                        d="M20 6C14.477 6 10 10.477 10 16C10 23.2 20 34 20 34C20 34 30 23.2 30 16C30 10.477 25.523 6 20 6Z"
                        fill="url(#yatraGlowGrad)"
                        fillOpacity="0.14"
                      />
                      {/* Dynamic Compass / Flight Wings forming 'Y' */}
                      <path
                        d="M13 13.5L20 22.5L27 13.5"
                        stroke="url(#yatraGlowGrad)"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20 22.5V29"
                        stroke="url(#yatraGlowGrad)"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                      />
                      {/* Horizon Sun / Waypoint Star */}
                      <circle cx="20" cy="11.5" r="2.8" fill="url(#sunGrad)" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Typographic Wordmark & Live Micro-Tag */}
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight select-none">
                    <span className="bg-gradient-to-r from-[#0052D4] via-[#0084d1] to-[#007fad] bg-clip-text text-transparent">ya</span>
                    <span className="text-[#f59e0b] relative">
                      t
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 blur-[0.5px]" />
                    </span>
                    <span className="bg-gradient-to-r from-[#ea580c] to-[#e11d48] bg-clip-text text-transparent">ra</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-400/20 dark:to-orange-400/20 text-[#ea580c] dark:text-amber-300 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                    IN
                  </span>
                </div>
                <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 -mt-0.5 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  <span>Travel Meta-Search</span>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links - Trivago Clean Style */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'explore'
                  ? 'bg-sky-50 dark:bg-[#007fad]/20 text-[#007fad] dark:text-sky-300 border border-[#007fad]/30 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? '36 राज्य व केंद्र शासित प्रदेश' : 'Stays & 36 States'}</span>
            </button>

            <button
              onClick={() => setActiveTab('itinerary')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative flex items-center space-x-1.5 ${
                activeTab === 'itinerary'
                  ? 'bg-sky-50 dark:bg-[#007fad]/20 text-[#007fad] dark:text-sky-300 border border-[#007fad]/30 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'स्मार्ट यात्रा कार्यक्रम' : 'Smart Itinerary'}</span>
              {hasPlan && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block ml-1 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('routes')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'routes'
                  ? 'bg-sky-50 dark:bg-[#007fad]/20 text-[#007fad] dark:text-sky-300 border border-[#007fad]/30 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Route className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'मार्ग एवं मैप्स' : 'Routes & Maps'}</span>
            </button>

            <button
              onClick={() => setActiveTab('budget')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'budget'
                  ? 'bg-sky-50 dark:bg-[#007fad]/20 text-[#007fad] dark:text-sky-300 border border-[#007fad]/30 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'बजट एवं व्यय' : 'Budget & Fuel'}</span>
            </button>

            <button
              onClick={() => setActiveTab('checklists')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'checklists'
                  ? 'bg-sky-50 dark:bg-[#007fad]/20 text-[#007fad] dark:text-sky-300 border border-[#007fad]/30 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'परमिट एवं पैकिंग' : 'Permits & Packing'}</span>
            </button>
          </nav>

          {/* Right Action Icons & Trivago Controls */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* Currency Pill */}
            <div className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
              <span>INR</span>
              <span className="text-slate-400">|</span>
              <span className="text-[#007fad] font-black">₹</span>
            </div>

            {/* Language Toggle */}
            <button
              onClick={onToggleLang}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center space-x-1.5"
              title="Switch Language: English / हिन्दी"
            >
              <Globe className="w-3.5 h-3.5 text-[#007fad]" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Toggle Dark / Light Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Emergency Mode Button */}
            <button
              onClick={onOpenEmergencyMode}
              className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800 text-[#c0192d] text-xs font-extrabold flex items-center space-x-1.5 transition-all"
              title="One-click access to SOS numbers and emergency services"
            >
              <ShieldAlert className="w-4 h-4 text-[#c0192d] animate-pulse" />
              <span>SOS</span>
            </button>

            {/* Plan Trip CTA Button (Trivago Blue) */}
            <button
              onClick={onOpenWizard}
              className="px-4 py-2 rounded-xl bg-[#007fad] hover:bg-[#00658a] text-white font-extrabold text-xs shadow-sm hover:shadow-md transition-all flex items-center space-x-1.5 active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.planNewTrip}</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onOpenEmergencyMode}
              className="p-2 rounded-xl bg-red-50 text-[#c0192d] border border-red-200"
              title="SOS Emergency Mode"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-2 animate-in fade-in">
            <button
              onClick={() => { setActiveTab('explore'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {lang === 'hi' ? '36 राज्य व केंद्र शासित प्रदेश' : '🏨 Stays & 36 States'}
            </button>
            <button
              onClick={() => { setActiveTab('itinerary'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {lang === 'hi' ? 'स्मार्ट यात्रा कार्यक्रम' : '📅 Smart Itinerary'}
            </button>
            <button
              onClick={() => { setActiveTab('routes'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {lang === 'hi' ? '🗺️ मार्ग एवं मैप्स' : '🗺️ Routes & Maps'}
            </button>
            <button
              onClick={() => { setActiveTab('budget'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {lang === 'hi' ? 'बजट एवं ईंधन' : '💳 Budget & Fuel'}
            </button>
            <button
              onClick={() => { setActiveTab('checklists'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {lang === 'hi' ? 'परमिट एवं पैकिंग' : '📋 Permits & Packing'}
            </button>

            <div className="pt-2 flex items-center justify-between px-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={onToggleLang}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-[#007fad]"
              >
                {lang === 'en' ? '🇮🇳 हिन्दी में बदलें' : 'Switch to English'}
              </button>
              <button
                onClick={onOpenWizard}
                className="px-4 py-2 rounded-xl bg-[#007fad] text-white text-xs font-black"
              >
                {t.planNewTrip}
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
