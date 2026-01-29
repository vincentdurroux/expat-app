import React, { useState } from 'react';
import { Sparkles, ArrowRight, Globe, Search, Briefcase, X, Award, Navigation, MessageSquare, User, Star } from 'lucide-react';
import SearchBar from './SearchBar';
import ProfessionalCard from './ProfessionalCard';
import { CardSkeleton } from './Skeleton';
import { SearchFilters, Professional, UserType, UnlockToken } from '../types';
import { useTranslation } from 'react-i18next';

interface LandingPageProps {
  onSignUp: (role: UserType, e?: React.MouseEvent) => void; 
  onSearch: (filters: SearchFilters, e?: React.FormEvent) => void; 
  onLearnEarlyMember: () => void; 
  searchResults: Professional[] | null; 
  searchOriginName?: string; 
  onClearSearch: () => void; 
  isSearching: boolean; 
  onUnlock: (id: string, e?: React.MouseEvent) => void; 
  isAuth?: boolean; 
  onViewProfile: (pro: Professional) => void;
  currentUserId?: string;
  unlockedPros?: Record<string, UnlockToken>;
}

const LandingPage: React.FC<LandingPageProps> = ({ 
  onSignUp, 
  onSearch, 
  onLearnEarlyMember, 
  searchResults, 
  searchOriginName, 
  onClearSearch, 
  isSearching, 
  onUnlock, 
  isAuth = false, 
  onViewProfile,
  currentUserId,
  unlockedPros = {}
}) => {
  const { t } = useTranslation();

  const displayedResults = searchResults ? searchResults.slice(0, 8) : [];

  return (
    <div className="animate-in fade-in duration-700">
      <section className="pt-32 pb-8 md:pt-44 md:pb-12 px-6 bg-white relative overflow-hidden">
        {/* FADED LOGO BACKGROUND BEHIND HERO TITLE */}
        <div className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-[4] md:scale-[6] pointer-events-none transform-gpu z-0">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-64 h-64">
            <defs>
              <linearGradient id="hero-bg-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#45a081" />
                <stop offset="100%" stopColor="#2e75c2" />
              </linearGradient>
            </defs>
            <path d="M50 10 C65 10, 75 25, 75 40 C75 45, 60 45, 50 40 C40 35, 35 10, 50 10Z" fill="url(#hero-bg-logo-gradient)" />
            <path d="M40 85 C25 85, 15 70, 15 55 C15 50, 30 50, 40 55 C50 60, 55 85, 40 85Z" fill="url(#hero-bg-logo-gradient)" fillOpacity={0.85} />
            <path d="M85 55 C85 70, 70 80, 55 80 C50 80, 50 65, 55 55 C60 45, 85 40, 85 55Z" fill="url(#hero-bg-logo-gradient)" fillOpacity={0.7} />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8"><Globe size={14} className="text-blue-400" /> {t('nav.brandSub')}</div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">{t('hero.title')} <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">{t('hero.subtitle')}</span></h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-12">{t('hero.description')}</p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-20">
            <button 
              onClick={(e) => onSignUp('expat', e)} 
              className="bg-gradient-to-r from-[#45a081] to-[#2e75c2] text-white px-10 py-5 rounded-2xl font-bold text-lg hover:brightness-110 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
            >
              {t('hero.ctaExpat')} <ArrowRight size={20} />
            </button>
            <button 
              onClick={(e) => onSignUp('pro', e)} 
              className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
            >
              <Briefcase size={20} /> {t('hero.ctaPro')}
            </button>
          </div>
        </div>

        {/* SECTION PRÉSENCE GÉOGRAPHIQUE */}
        <div className="max-w-5xl mx-auto text-center relative z-10 mt-48 mb-36 animate-in fade-in duration-1000 slide-in-from-bottom-4">
           <div className="flex flex-col items-center gap-6">
             <div className="inline-flex items-center gap-3 bg-gray-50/50 border border-gray-100 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 shadow-sm">
                <Navigation size={14} className="text-[#2e75c2]" />
                {t('landing.presence.title').split(/(Spain|Espagne|España|Spanje|Spagna|Испании|Іспанії)/gi).map((part, i) => 
                  /^(Spain|Espagne|España|Spanje|Spagna|Испании|Іспанії)$/i.test(part) ? (
                    <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-[#45a081] to-[#2e75c2] ml-1">
                      {part}
                    </span>
                  ) : part
                )}
             </div>
             <p className="text-lg md:text-2xl font-black tracking-tight leading-relaxed max-w-4xl mx-auto px-4 text-transparent bg-clip-text bg-gradient-to-r from-[#45a081] to-[#2e75c2]">
               {t('landing.presence.cities')}
             </p>
           </div>
        </div>

        <div className="relative z-20 mt-32 max-w-6xl mx-auto">
          <div className="text-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm">
                <Search size={12} /> {t('search.badge')}
             </div>
          </div>
          <SearchBar onSearch={onSearch} />
        </div>
      </section>

      {searchResults !== null && (
        <div className="px-4 md:px-6 py-12 bg-gray-50/50 overflow-hidden">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-10 px-2 md:px-0">
              <div className="flex items-center gap-3 bg-white px-4 md:px-6 py-3 rounded-[18px] md:rounded-[24px] border border-gray-100 shadow-sm">
                <Navigation size={18} className="text-blue-500 md:w-5 md:h-5" />
                <div>
                  <p className="text-[8px] md:text-[10px] font-black uppercase text-gray-400 leading-none mb-1">{t('landing.results.searchOrigin')}</p>
                  <p className="text-xs md:text-base font-black">{searchOriginName || t('search.nearMe')}</p>
                </div>
              </div>
              <button onClick={onClearSearch} className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white border border-gray-200 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase text-gray-400 hover:text-red-500 transition-all shadow-sm active:scale-95"><X size={14} className="md:w-4 md:h-4" /> {t('landing.results.close')}</button>
            </div>
            
            {isSearching ? (
              <div className="md:grid md:grid-cols-2 flex overflow-x-auto no-scrollbar gap-4 md:gap-10 pb-8 px-2 md:px-0">
                {[1,2,3,4].map(i => (
                  <div key={i} className="shrink-0 w-[85vw] md:w-full">
                    <CardSkeleton />
                  </div>
                ))}
              </div>
            ) : displayedResults.length > 0 ? (
              <div className="md:grid md:grid-cols-2 flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 md:gap-8 lg:gap-10 pb-12 px-2 md:px-0 -mx-4 md:mx-0">
                {displayedResults.map(pro => (
                  <div key={pro.id} className="snap-center shrink-0 w-[85vw] md:w-full ml-4 md:ml-0 last:mr-4 md:last:mr-0">
                    <ProfessionalCard 
                      professional={pro} 
                      isUnlocked={!!unlockedPros[pro.id]} 
                      isAuth={isAuth} 
                      currentUserId={currentUserId}
                      onUnlock={(id, e) => onUnlock(id, e)} 
                      onViewProfile={onViewProfile} 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-gray-200 mx-2 md:mx-0"><Search size={48} className="mx-auto text-gray-200 mb-6" /><h3 className="text-xl font-bold">{t('landing.results.noneTitle')}</h3></div>
            )}
          </div>
        </div>
      )}

      {/* DUAL TESTIMONIALS SECTION */}
      <section className="py-24 md:py-36 bg-gray-50 px-6 border-y border-gray-100 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
           <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-emerald-50/50 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[120px]"></div>
           
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-[4] md:scale-[6] pointer-events-none transform-gpu">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-64 h-64">
                <defs>
                  <linearGradient id="bg-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#45a081" />
                    <stop offset="100%" stopColor="#2e75c2" />
                  </linearGradient>
                </defs>
                <path d="M50 10 C65 10, 75 25, 75 40 C75 45, 60 45, 50 40 C40 35, 35 10, 50 10Z" fill="url(#bg-logo-gradient)" />
                <path d="M40 85 C25 85, 15 70, 15 55 C15 50, 30 50, 40 55 C50 60, 55 85, 40 85Z" fill="url(#bg-logo-gradient)" fillOpacity={0.85} />
                <path d="M85 55 C85 70, 70 80, 55 80 C50 80, 50 65, 55 55 C60 45, 85 40, 85 55Z" fill="url(#bg-logo-gradient)" fillOpacity={0.7} />
              </svg>
           </div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 bg-white text-[#45a081] border border-[#45a081]/10 px-5 py-2 rounded-full text-[10px] font-black uppercase mb-6 shadow-sm">
              <Sparkles size={14} /> {t('landing.testimonialTag')}
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">{t('landing.testimonialTitle')}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
            <div className="lg:translate-y-[-2rem] animate-in slide-in-from-left-8 duration-1000">
              <div className="bg-white p-8 md:p-12 rounded-[48px] border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative overflow-hidden group hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.12)] transition-all">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none rotate-12 transition-transform group-hover:scale-110">
                  <MessageSquare size={160} />
                </div>
                <div className="relative z-10">
                  <div className="flex gap-1 mb-8">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <blockquote className="text-xl md:text-2xl font-bold leading-tight mb-10 italic text-gray-800">
                    "{t('landing.testimonial1.quote')}"
                  </blockquote>
                  <div className="flex items-center gap-5 pt-8 border-t border-gray-50">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-inner">
                      <User size={28} />
                    </div>
                    <div>
                      <div className="font-black text-gray-900 text-lg">{t('landing.testimonial1.user')}</div>
                      <div className="text-xs text-indigo-600 font-black uppercase tracking-widest">{t('landing.testimonial1.role')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:translate-y-[2rem] animate-in slide-in-from-right-8 duration-1000 delay-200">
              <div className="bg-white p-8 md:p-12 rounded-[48px] border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative overflow-hidden group hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.12)] transition-all">
                <div className="absolute top-0 left-0 p-12 opacity-[0.03] pointer-events-none -rotate-12 transition-transform group-hover:scale-110">
                  <MessageSquare size={160} />
                </div>
                <div className="relative z-10">
                  <div className="flex gap-1 mb-8">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <blockquote className="text-xl md:text-2xl font-bold leading-tight mb-10 italic text-gray-800">
                    "{t('landing.testimonial2.quote')}"
                  </blockquote>
                  <div className="flex items-center gap-5 pt-8 border-t border-gray-50">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                      <User size={28} />
                    </div>
                    <div>
                      <div className="font-black text-gray-900 text-lg">{t('landing.testimonial2.user')}</div>
                      <div className="text-xs text-emerald-600 font-black uppercase tracking-widest">{t('landing.testimonial2.role')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto bg-black rounded-[48px] p-12 md:p-20 text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
          <div className="max-w-xl text-center md:text-left"><div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase mb-6"><Award size={14} /> {t('earlyMember.badge')}</div><h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">{t('landing.earlyCTA.title')} <br /><span className="text-emerald-400">{t('landing.earlyCTA.subtitle')}</span></h2><p className="text-gray-400 text-lg">{t('landing.earlyCTA.desc')}</p></div>
          <button onClick={onLearnEarlyMember} className="bg-white text-black px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-3 shadow-xl">{t('landing.earlyCTA.btn')} <ArrowRight size={20} /></button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;