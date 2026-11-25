import React, { useState, useEffect } from 'react';
import { 
  TripWizardPreferences, 
  GeneratedYatraPlan,
  YatraDestination
} from './types/yatra';
import { generateYatraItinerary, swapTimeSlotActivity } from './utils/itineraryEngine';
import { Language, TRANSLATIONS } from './utils/translations';
import { Navbar } from './components/Navbar';
import { YatraHero } from './components/YatraHero';
import { TripWizardModal } from './components/TripWizardModal';
import { ItineraryView } from './components/ItineraryView';
import { RouteMapHub } from './components/RouteMapHub';
import { BudgetEstimator } from './components/BudgetEstimator';
import { ChecklistsView } from './components/ChecklistsView';
import { EmergencyModeModal } from './components/EmergencyModeModal';
import { PhotoModal } from './components/PhotoModal';
import { YATRA_DESTINATIONS } from './data/yatraDestinations';
import { IndiaRegion, ALL_INDIA_REGIONS } from './data/indiaRegions';
import { 
  Sparkles, 
  Download, 
  Share2, 
  RotateCcw, 
  CheckCircle2, 
  Compass, 
  MapPin, 
  IndianRupee, 
  Printer, 
  Calendar,
  Layers,
  ArrowRight,
  Route
} from 'lucide-react';

export function App() {
  // Navigation & Theme
  const [activeTab, setActiveTab] = useState<'explore' | 'itinerary' | 'routes' | 'budget' | 'checklists'>('explore');
  const [lang, setLang] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Modals
  const [wizardOpen, setWizardOpen] = useState<boolean>(false);
  const [wizardInitialState, setWizardInitialState] = useState<string | undefined>(undefined);
  const [emergencyOpen, setEmergencyOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Photo Lightbox Modal
  const [photoModalData, setPhotoModalData] = useState<{
    isOpen: boolean;
    photoUrl: string;
    title: string;
    location: string;
    credit: string;
    coordinates?: [number, number];
  }>({
    isOpen: false,
    photoUrl: '',
    title: '',
    location: '',
    credit: '',
  });

  // Current Yatra Plan (Pre-initialized with an exemplary 4-day Karnataka journey)
  const [currentPlan, setCurrentPlan] = useState<GeneratedYatraPlan>(() => {
    return generateYatraItinerary({
      startCity: 'Bengaluru',
      destinationStateIds: ['karnataka'],
      startDate: new Date().toISOString().split('T')[0],
      daysCount: 4,
      group: {
        adults: 2,
        children: 0,
        seniors: 0,
        mobilityNeeds: false
      },
      totalBudgetINR: 45000,
      budgetStyle: 'mid-range',
      transportMode: 'own_car',
      interests: ['heritage', 'nature', 'food'],
      crowdPreference: 'avoid_crowds',
      famousRatio: 60,
      mustVisitText: 'Hampi Stone Chariot',
      avoidPlacesText: '',
      foodPreference: 'all',
      healthIssuesText: '',
      comfortRemote: 'moderate'
    });
  });

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenWizardWithState = (stateId?: string) => {
    setWizardInitialState(stateId);
    setWizardOpen(true);
  };

  const handleGeneratePlan = (prefs: TripWizardPreferences) => {
    const newPlan = generateYatraItinerary(prefs);
    setCurrentPlan(newPlan);
    setActiveTab('itinerary');
    showToast(`✓ Generated ${newPlan.totalDays}-Day ${newPlan.title}!`);
  };

  const handleSwapWeatherSlot = (dayNumber: number, slotIndex: number) => {
    const updated = swapTimeSlotActivity(currentPlan, dayNumber, slotIndex);
    setCurrentPlan(updated);
    showToast(`✓ Swapped activity for bad weather backup on Day ${dayNumber}!`);
  };

  const handleOpenPhoto = (dest: YatraDestination) => {
    setPhotoModalData({
      isOpen: true,
      photoUrl: dest.image,
      title: dest.name,
      location: `${dest.cityOrDistrict}, ${dest.stateName}`,
      credit: dest.imageCredit,
      coordinates: dest.coordinates,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('✓ Shareable trip link copied to clipboard!');
    }
  };

  const t = TRANSLATIONS[lang];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#0a1128] text-slate-100' : 'bg-[#f5f6f8] text-slate-800'} transition-colors duration-200`}>
      
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenWizard={() => handleOpenWizardWithState()}
        onOpenEmergencyMode={() => setEmergencyOpen(true)}
        lang={lang}
        onToggleLang={() => setLang(lang === 'en' ? 'hi' : 'en')}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        hasPlan={!!currentPlan}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 px-4 py-3 rounded-2xl bg-[#007fad] text-white font-bold text-xs shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-sky-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: EXPLORE 36 STATES */}
        {activeTab === 'explore' && (
          <div className="space-y-10">
            <YatraHero
              onSelectState={(state) => handleOpenWizardWithState(state.id)}
              onOpenTripWizard={(stateId) => handleOpenWizardWithState(stateId)}
              lang={lang}
            />
          </div>
        )}

        {/* TAB 2: SMART ITINERARY */}
        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                <Compass className="w-4 h-4 text-[#007fad]" />
                <span>Active Journey: {currentPlan.title}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('routes')}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 text-[#007fad] dark:text-sky-300 text-xs font-bold flex items-center space-x-1.5 hover:bg-sky-100 transition-colors"
                >
                  <Route className="w-3.5 h-3.5 text-[#007fad]" />
                  <span>Show Routes & Map</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-bold flex items-center space-x-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                  title="Print or Save PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300 shrink-0" />
                  <span>{t?.exportTrip || 'Export / Print PDF'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-bold flex items-center space-x-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                  title="Share Trip Link"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300 shrink-0" />
                  <span>{t?.shareTrip || 'Share Yatra Plan'}</span>
                </button>

                <button
                  onClick={() => handleOpenWizardWithState()}
                  className="px-4 py-1.5 rounded-xl bg-[#007fad] hover:bg-[#00658a] text-white text-xs font-extrabold flex items-center space-x-1.5 transition-colors shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Modify Plan</span>
                </button>
              </div>
            </div>

            <ItineraryView
              plan={currentPlan}
              onSwapWeatherSlot={handleSwapWeatherSlot}
              onOpenPhotoModal={handleOpenPhoto}
              onViewRouteOnMap={() => setActiveTab('routes')}
            />
          </div>
        )}

        {/* TAB 3: ROUTES & GOOGLE MAPS HUB */}
        {activeTab === 'routes' && (
          <div className="space-y-6">
            <RouteMapHub
              plan={currentPlan}
              allDestinations={YATRA_DESTINATIONS}
              onOpenPhotoModal={handleOpenPhoto}
            />
          </div>
        )}

        {/* TAB 4: BUDGET & EXPENSE ESTIMATOR */}
        {activeTab === 'budget' && (
          <div className="space-y-6">
            <BudgetEstimator plan={currentPlan} />
          </div>
        )}

        {/* TAB 5: PERMITS & PACKING CHECKLISTS */}
        {activeTab === 'checklists' && (
          <div className="space-y-6">
            <ChecklistsView plan={currentPlan} />
          </div>
        )}

      </main>

      {/* Trip Wizard Modal */}
      <TripWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onGeneratePlan={handleGeneratePlan}
        initialStateId={wizardInitialState}
        lang={lang}
      />

      {/* Emergency Mode Modal */}
      <EmergencyModeModal
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
        plan={currentPlan}
      />

      {/* Authentic Photo Viewer Lightbox Modal */}
      <PhotoModal
        isOpen={photoModalData.isOpen}
        onClose={() => setPhotoModalData(prev => ({ ...prev, isOpen: false }))}
        photoUrl={photoModalData.photoUrl}
        title={photoModalData.title}
        location={photoModalData.location}
        credit={photoModalData.credit}
        coordinates={photoModalData.coordinates}
      />

      {/* Trivago Style Footer */}
      <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a1128] py-12 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0052D4] via-[#4364F7] to-[#00c6ff] p-[1.5px] shadow-xs">
                <div className="w-full h-full rounded-[10px] bg-white dark:bg-[#0a1128] flex items-center justify-center">
                  <span className="text-xs font-black bg-gradient-to-r from-[#0052D4] to-[#f59e0b] bg-clip-text text-transparent">Y</span>
                </div>
              </div>
              <span className="text-2xl font-black tracking-tight select-none">
                <span className="bg-gradient-to-r from-[#0052D4] via-[#0084d1] to-[#007fad] bg-clip-text text-transparent">ya</span>
                <span className="text-[#f59e0b]">t</span>
                <span className="bg-gradient-to-r from-[#ea580c] to-[#e11d48] bg-clip-text text-transparent">ra</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                India Travel & Stay Meta-Search
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
              <a href="#explore" onClick={(e) => { e.preventDefault(); setActiveTab('explore'); }} className="hover:text-[#007fad] transition-colors">Stays & States</a>
              <a href="#itinerary" onClick={(e) => { e.preventDefault(); setActiveTab('itinerary'); }} className="hover:text-[#007fad] transition-colors">Smart Itinerary</a>
              <a href="#routes" onClick={(e) => { e.preventDefault(); setActiveTab('routes'); }} className="hover:text-[#007fad] transition-colors">Routes & Maps</a>
              <a href="#budget" onClick={(e) => { e.preventDefault(); setActiveTab('budget'); }} className="hover:text-[#007fad] transition-colors">Budget Estimator</a>
              <a href="#checklists" onClick={(e) => { e.preventDefault(); setActiveTab('checklists'); }} className="hover:text-[#007fad] transition-colors">Permits & Clearances</a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px]">
            <div>
              © 2026 yatra — All rights reserved. Search and compare real travel stays across India.
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span>28 States & 8 Union Territories</span>
              <span>•</span>
              <span>Real-time Weather & Crowd Analytics</span>
              <span>•</span>
              <span className="text-[#007fad] font-bold">100% Genuine Places & Rates</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
export default App;
