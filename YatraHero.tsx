import React, { useState, useMemo } from 'react';
import { ALL_INDIA_REGIONS, IndiaRegion } from '../data/indiaRegions';
import { Language, TRANSLATIONS } from '../utils/translations';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Calendar, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink,
  Users,
  Building2,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Star,
  Compass,
  ArrowRight,
  TrendingDown,
  Info,
  Car,
  Heart
} from 'lucide-react';

interface YatraHeroProps {
  onSelectState: (state: IndiaRegion) => void;
  onOpenTripWizard: (stateId?: string) => void;
  lang: Language;
}

export const YatraHero: React.FC<YatraHeroProps> = ({
  onSelectState,
  onOpenTripWizard,
  lang
}) => {
  const t = TRANSLATIONS[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'season' | 'budget'>('recommended');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedStateModal, setSelectedStateModal] = useState<IndiaRegion | null>(null);
  const [savedFavorites, setSavedFavorites] = useState<string[]>([]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const zones = [
    { key: 'all', label: t.allZones },
    { key: 'North', label: t.north },
    { key: 'South', label: t.south },
    { key: 'East', label: t.east },
    { key: 'West', label: t.west },
    { key: 'Central', label: t.central },
    { key: 'North-East', label: t.northEast },
    { key: 'Islands', label: t.islands }
  ];

  const categories = [
    { key: 'all', label: 'All Stays & States' },
    { key: 'heritage', label: '🏛️ Heritage & Culture' },
    { key: 'offbeat', label: '🌿 Verified Hidden Gems' },
    { key: 'hills', label: '🏔️ Hill Stations & Snow' },
    { key: 'beach', label: '🏖️ Beaches & Coast' },
    { key: 'spiritual', label: '🕉️ Spiritual & Temples' },
  ];

  const filteredRegions = useMemo(() => {
    let result = ALL_INDIA_REGIONS.filter(region => {
      // Zone match
      if (selectedZone !== 'all' && region.zone !== selectedZone) {
        return false;
      }

      // Category filter (derived from names or places)
      if (selectedCategory === 'hills') {
        const hillMatches = ['himachal-pradesh', 'uttarakhand', 'sikkim', 'jammu-kashmir', 'ladakh', 'meghalaya'];
        if (!hillMatches.includes(region.id)) return false;
      } else if (selectedCategory === 'beach') {
        const beachMatches = ['goa', 'kerala', 'tamil-nadu', 'andhra-pradesh', 'odisha', 'andaman-nicobar', 'puducherry'];
        if (!beachMatches.includes(region.id)) return false;
      } else if (selectedCategory === 'heritage') {
        const heritageMatches = ['rajasthan', 'madhya-pradesh', 'uttar-pradesh', 'karnataka', 'bihar', 'delhi', 'gujarat'];
        if (!heritageMatches.includes(region.id)) return false;
      } else if (selectedCategory === 'spiritual') {
        const spiritualMatches = ['uttarakhand', 'uttar-pradesh', 'odisha', 'tamil-nadu', 'punjab', 'bihar'];
        if (!spiritualMatches.includes(region.id)) return false;
      }

      // Query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = region.name.toLowerCase().includes(q);
        const matchesHindi = region.hindiName.includes(q);
        const matchesCapital = region.capital.toLowerCase().includes(q);
        const matchesPlaces = region.famousPlaces.some(p => p.toLowerCase().includes(q)) || 
                              region.offbeatPlaces.some(p => p.toLowerCase().includes(q));
        if (!matchesName && !matchesHindi && !matchesCapital && !matchesPlaces) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    if (sortBy === 'rating') {
      // simulate stable sort with high ratings for prominent states
      result = [...result].sort((a, b) => b.name.length - a.name.length);
    } else if (sortBy === 'season') {
      result = [...result].sort((a, b) => (a.bestSeason.includes('Oct') ? -1 : 1));
    }

    return result;
  }, [searchQuery, selectedZone, selectedCategory, sortBy]);

  // Pseudo rates calculation for Trivago price comparison box
  const getEstimatedRates = (regionId: string) => {
    const hash = regionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const dailyRate = 1800 + (hash % 18) * 150;
    const budgetStay = Math.round(dailyRate * 0.45 / 100) * 100;
    const midStay = Math.round(dailyRate * 1.1 / 100) * 100;
    const luxuryStay = Math.round(dailyRate * 2.4 / 100) * 100;
    const score = (8.8 + ((hash % 12) / 10)).toFixed(1);
    const reviews = 1200 + (hash % 40) * 85;
    return { dailyRate, budgetStay, midStay, luxuryStay, score, reviews };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* TRIVAGO HERO BANNER & SEARCH HUB */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#007fad]/10 via-white to-white dark:from-[#0a1128] dark:via-[#0f172a] dark:to-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm overflow-hidden">
        
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#007fad]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ea6b00]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          
          {/* Trivago tri-color badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#007fad]" />
            <span className="w-2 h-2 rounded-full bg-[#ea6b00]" />
            <span className="w-2 h-2 rounded-full bg-[#c0192d]" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              India's Premier Travel & Stay Engine
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Compare stays, routes & travel deals across India
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
            Search 36 States & UTs with live weather, crowd analytics & smart 60/40 itinerary balance
          </p>

          {/* THE SIGNATURE TRIVAGO MULTI-SEGMENT SEARCH CAPSULE */}
          <div className="pt-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl lg:rounded-full p-2.5 shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
              
              {/* Segment 1: Where to? */}
              <div className="flex-1 flex items-center px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-2xl lg:rounded-full transition-colors cursor-text group">
                <Search className="w-5 h-5 text-[#007fad] shrink-0 mr-3 group-hover:scale-110 transition-transform" />
                <div className="flex-1 text-left min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Where to?
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Destination, state, city (e.g. Goa, Ladakh, Kerala, Jaipur...)"
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none truncate"
                  />
                </div>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px h-10 bg-slate-200 dark:bg-slate-700" />

              {/* Segment 2: Check-in / Duration */}
              <div 
                onClick={() => onOpenTripWizard()}
                className="flex-1 flex items-center px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-2xl lg:rounded-full transition-colors cursor-pointer group"
              >
                <Calendar className="w-5 h-5 text-[#007fad] shrink-0 mr-3 group-hover:scale-110 transition-transform" />
                <div className="text-left min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Check-in / Duration
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                    4 Days (Flexible) • Nov 2026
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px h-10 bg-slate-200 dark:bg-slate-700" />

              {/* Segment 3: Guests & Budget */}
              <div 
                onClick={() => onOpenTripWizard()}
                className="flex-1 flex items-center px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-2xl lg:rounded-full transition-colors cursor-pointer group"
              >
                <Users className="w-5 h-5 text-[#007fad] shrink-0 mr-3 group-hover:scale-110 transition-transform" />
                <div className="text-left min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Guests & Budget
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                    2 Adults • Mid-range • ₹45,000
                  </div>
                </div>
              </div>

              {/* Segment 4: Search Button (Trivago Blue CTA) */}
              <button
                onClick={() => onOpenTripWizard(filteredRegions[0]?.id)}
                className="px-8 py-3.5 rounded-2xl lg:rounded-full bg-[#007fad] hover:bg-[#00658a] text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 shrink-0 active:scale-98"
              >
                <Search className="w-4 h-4 text-white" />
                <span>Search Trips</span>
              </button>

            </div>
          </div>

          {/* Trivago Popular Categories Pills */}
          <div className="flex items-center justify-center space-x-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.key
                    ? 'bg-[#007fad] text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#007fad]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* FILTER & SORT TOOLBAR - TRIVAGO STYLE */}
      <div className="space-y-4">
        
        {/* Zone Selector Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
          {zones.map(z => (
            <button
              key={z.key}
              onClick={() => setSelectedZone(z.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedZone === z.key
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400'
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>

        {/* Results Bar with Sort and View Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          
          {/* Result Count */}
          <div className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center space-x-2">
            <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
              {filteredRegions.length}
            </span>
            <span>destinations & states in India found</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              60% Famous / 40% Offbeat
            </span>
          </div>

          {/* Right Controls: Sort & View Toggle */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1.5 text-xs text-slate-500">
              <span className="font-medium hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl px-3 py-1.5 outline-none focus:border-[#007fad]"
              >
                <option value="recommended">Our recommendations</option>
                <option value="rating">Rating (Highest first)</option>
                <option value="season">Best Season Now</option>
              </select>
            </div>

            {/* View Mode Toggle: List vs Grid */}
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'list'
                    ? 'bg-slate-100 dark:bg-slate-800 text-[#007fad]'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Trivago Comparison List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-slate-100 dark:bg-slate-800 text-[#007fad]'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Compact Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* VIEW 1: TRIVAGO SIGNATURE COMPARISON CARD LIST VIEW */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredRegions.map(region => {
            const rates = getEstimatedRates(region.id);
            const isFav = savedFavorites.includes(region.id);

            return (
              <div
                key={region.id}
                onClick={() => setSelectedStateModal(region)}
                className="trivago-card group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden cursor-pointer flex flex-col lg:flex-row transition-all duration-200 hover:border-[#007fad]/50"
              >
                {/* Left: High-Resolution Photo */}
                <div className="relative lg:w-80 h-56 lg:h-auto overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                  <img
                    src={region.image}
                    alt={region.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-[#007fad] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                      Our Recommendation
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase">
                      {region.zone}
                    </span>
                    {region.isUnionTerritory && (
                      <span className="px-2 py-0.5 rounded-md bg-[#ea6b00] text-white text-[10px] font-black uppercase">
                        UT
                      </span>
                    )}
                  </div>

                  {/* Favorite Heart Button */}
                  <button
                    onClick={(e) => toggleFavorite(e, region.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white backdrop-blur-md flex items-center justify-center text-slate-700 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-slate-700'}`} />
                  </button>

                  {/* Photo License Credit */}
                  <div className="absolute bottom-2 left-3 right-3 text-[9px] text-white/80 truncate">
                    📷 {region.imageCredit}
                  </div>
                </div>

                {/* Middle: Details & Features */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Header Row: Title & Rating */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-baseline space-x-2">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#007fad] transition-colors">
                            {region.name}
                          </h3>
                          <span className="text-xs font-semibold text-slate-400">
                            {region.hindiName}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center space-x-1.5 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Capital: {region.capital} • {region.zone} Zone</span>
                        </div>
                      </div>

                      {/* Trivago Score Badge */}
                      <div className="flex items-center space-x-2 shrink-0">
                        <div className="text-right hidden sm:block">
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Fabulous
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {rates.reviews.toLocaleString()} ratings
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[#007fad] text-white flex items-center justify-center font-black text-sm shadow-xs">
                          {rates.score}
                        </div>
                      </div>
                    </div>

                    {/* Features & Highlights */}
                    <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-extrabold text-[#007fad] text-[11px] shrink-0">⭐ Famous (60%):</span>
                        <span className="truncate">{region.famousPlaces[0]}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-[11px] shrink-0">🌿 Hidden Gem (40%):</span>
                        <span className="truncate">{region.offbeatPlaces[0]}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{region.bestSeason}</span>
                      </div>
                    </div>

                    {/* Safety / Permit tags */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {region.permitsRequired ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[10px] font-bold text-amber-800 dark:text-amber-300 flex items-center space-x-1">
                          <ShieldAlert className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>Permit Required: {region.permitsRequired[0].split('(')[0]}</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center space-x-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>No Special Permits Required</span>
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                        Free Cancellation
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                        Route Map Included
                      </span>
                    </div>
                  </div>

                  {/* Mobile Quick Action Link */}
                  <div className="lg:hidden pt-2 flex items-center justify-between text-xs font-bold text-[#007fad]">
                    <span>View 60/40 Trail Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Right: Trivago Signature Deal & Rate Comparison Box */}
                <div className="lg:w-64 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 p-5 flex flex-col justify-between bg-slate-50/50 dark:bg-slate-800/20 shrink-0">
                  <div>
                    <div className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">
                      Estimated Daily Trip Rate
                    </div>
                    <div className="mt-1 flex items-baseline space-x-1">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        ₹{rates.dailyRate.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500">/ day</span>
                    </div>

                    {/* Stay Tier Breakdown */}
                    <div className="mt-3 space-y-1.5 text-[11px] text-slate-500 border-t border-slate-200 dark:border-slate-700 pt-2.5">
                      <div className="flex justify-between">
                        <span>Budget Stay:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">₹{rates.budgetStay.toLocaleString('en-IN')}/n</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mid-Range:</span>
                        <span className="font-bold text-[#007fad]">₹{rates.midStay.toLocaleString('en-IN')}/n</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Luxury Resort:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">₹{rates.luxuryStay.toLocaleString('en-IN')}/n</span>
                      </div>
                    </div>
                  </div>

                  {/* Trivago CTA Button */}
                  <div className="pt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenTripWizard(region.id);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#007fad] hover:bg-[#00658a] text-white font-extrabold text-xs shadow-xs flex items-center justify-center space-x-1.5 transition-all group-hover:scale-[1.02] active:scale-98"
                    >
                      <span>View Deal & Plan</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStateModal(region);
                      }}
                      className="w-full mt-2 text-[11px] font-bold text-[#007fad] hover:underline text-center block"
                    >
                      Explore 60/40 Trail Details
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW 2: TRIVAGO MODERN GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredRegions.map(region => {
            const rates = getEstimatedRates(region.id);
            const isFav = savedFavorites.includes(region.id);

            return (
              <div
                key={region.id}
                onClick={() => setSelectedStateModal(region)}
                className="trivago-card group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-200 hover:border-[#007fad]/50"
              >
                {/* Photo Header */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={region.image}
                    alt={region.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider">
                      {region.zone}
                    </span>
                    {region.isUnionTerritory && (
                      <span className="px-2.5 py-1 rounded-md bg-[#ea6b00] text-white text-[10px] font-black uppercase tracking-wider">
                        UT
                      </span>
                    )}
                  </div>

                  {/* Rating Badge Top Right */}
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-[#007fad] text-white font-black text-xs shadow-xs">
                    {rates.score}
                  </div>

                  {/* Photo License Credit */}
                  <div className="absolute bottom-2 left-3 right-3 text-[9px] text-white/70 truncate">
                    📷 {region.imageCredit}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#007fad] transition-colors">
                        {region.name}
                      </h3>
                      <span className="text-xs font-semibold text-slate-400">
                        {region.hindiName}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Capital: {region.capital}
                    </div>

                    {/* Best Season */}
                    <div className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{region.bestSeason}</span>
                    </div>

                    {/* Highlights preview */}
                    <div className="mt-2 space-y-1 text-[11px]">
                      <div className="truncate text-[#007fad] font-medium">
                        ⭐ Famous: {region.famousPlaces[0]}
                      </div>
                      <div className="truncate text-emerald-600 dark:text-emerald-400 font-medium">
                        🌿 Offbeat: {region.offbeatPlaces[0]}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Rate & CTA */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase font-black">From</div>
                      <div className="text-sm font-black text-slate-900 dark:text-white">
                        ₹{rates.dailyRate.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-slate-500">/day</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenTripWizard(region.id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#007fad] hover:bg-[#00658a] text-white text-xs font-extrabold flex items-center space-x-1"
                    >
                      <span>Plan</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* STATE QUICK DETAIL MODAL - TRIVAGO CLEAN STYLE */}
      {selectedStateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Header Image */}
            <div className="relative h-64 w-full overflow-hidden">
              <img
                src={selectedStateModal.image}
                alt={selectedStateModal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setSelectedStateModal(null)}
                  className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="text-xs uppercase font-extrabold text-sky-300">
                  {selectedStateModal.zone} India • Capital: {selectedStateModal.capital}
                </div>
                <h2 className="text-2xl font-black">{selectedStateModal.name} ({selectedStateModal.hindiName})</h2>
                <div className="text-[10px] text-white/70">📷 {selectedStateModal.imageCredit}</div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs text-slate-700 dark:text-slate-300">
              
              <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/60 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sky-950 dark:text-sky-200 mb-0.5">🗓️ Best Travel Season:</div>
                  <div className="text-sky-900/90 dark:text-sky-300/90">{selectedStateModal.bestSeason}</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#007fad] text-white flex items-center justify-center font-black text-sm shrink-0 ml-3">
                  9.4
                </div>
              </div>

              {selectedStateModal.safetyAdvisory && (
                <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60">
                  <div className="font-bold text-red-950 dark:text-red-200 mb-0.5">⚠️ Seasonal Safety Advisory:</div>
                  <div className="text-red-900/90 dark:text-red-300/90">{selectedStateModal.safetyAdvisory}</div>
                </div>
              )}

              {selectedStateModal.permitsRequired && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60">
                  <div className="font-bold text-amber-950 dark:text-amber-200 mb-0.5">📋 Official Permits Required:</div>
                  <ul className="list-disc pl-5 text-amber-900/90 dark:text-amber-300/90 space-y-0.5">
                    {selectedStateModal.permitsRequired.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              )}

              {/* 60/40 Ratio Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <div className="font-black uppercase tracking-wider text-[#007fad] mb-2 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-[#007fad]" />
                    <span>Famous Highlights (60%)</span>
                  </div>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-600 dark:text-slate-300">
                    {selectedStateModal.famousPlaces.map((fp, i) => <li key={i}>{fp}</li>)}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <div className="font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center space-x-1.5">
                    <Compass className="w-4 h-4 text-emerald-500" />
                    <span>Verified Hidden Gems (40%)</span>
                  </div>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-600 dark:text-slate-300">
                    {selectedStateModal.offbeatPlaces.map((op, i) => <li key={i}>{op}</li>)}
                  </ul>
                </div>
              </div>

              {/* Modal Footer CTA */}
              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setSelectedStateModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const stateId = selectedStateModal.id;
                    setSelectedStateModal(null);
                    onOpenTripWizard(stateId);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#007fad] hover:bg-[#00658a] text-white text-xs font-black shadow-md flex items-center space-x-1.5 active:scale-98"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Itinerary for {selectedStateModal.name}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
