import React, { useMemo, useState, useEffect } from 'react';
import { Sparkles, LayoutDashboard, TrendingUp, ShieldCheck, Repeat, Award, Trophy, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getProStats, mapDBRowToPro } from '../services/userService';
import ProfessionalCard from './ProfessionalCard';
import { Professional } from '../types';

interface ProHomeProps {
  userName: string; profile: any; isNewUser?: boolean; onGoToDashboard: () => void; onEditProfile: () => void; onUpgrade: () => void; onSwitchToExpat: () => void;
}

const ProHome: React.FC<ProHomeProps> = ({ userName, profile, onGoToDashboard, onUpgrade, onSwitchToExpat }) => {
  const { t } = useTranslation();
  const [motivationalPhrase, setMotivationalPhrase] = useState("");
  const [extendedStats, setExtendedStats] = useState<{leads_unlocked: number, profile_views: number, profile_unlocks: number} | null>(null);

  useEffect(() => {
    if (profile?.id) getProStats(profile.id).then(setExtendedStats as any);
    const phrases = t('proHome.motivational', { returnObjects: true }) as string[];
    if (Array.isArray(phrases) && phrases.length > 0) setMotivationalPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
  }, [profile, t]);

  const isFoundingMember = useMemo(() => {
    const plan = profile?.pro_plan?.toLowerCase() || '';
    return plan.includes('early') || plan.includes('founding');
  }, [profile?.pro_plan]);

  const proForCard: Professional = useMemo(() => {
    const basePro = mapDBRowToPro(profile);
    return {
      ...basePro,
      isEarlyMember: isFoundingMember // On force la valeur calculée localement pour la cohérence immédiate
    };
  }, [profile, isFoundingMember]);

  return (
    <div className="animate-in fade-in duration-700 pb-20 bg-[#fbfbfd]">
      <section className="pt-32 pb-16 md:pt-44 px-6 bg-white relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Bloc de texte centré sur mobile */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase mb-6 md:mb-8 border border-emerald-100 shadow-sm">
              <Sparkles size={14} /> {t('auth.welcome').toUpperCase()}
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
              {t('auth.welcome')}, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-500">
                {userName || 'Expert'}
              </span>
            </h1>

            {motivationalPhrase && (
              <div className="mb-8 md:mb-10 p-5 md:p-6 bg-gray-50/50 border border-gray-100 rounded-[28px] w-fit italic font-bold text-gray-500 leading-relaxed shadow-sm">
                "{motivationalPhrase}"
              </div>
            )}

            <p className="text-lg md:text-xl text-gray-400 mb-10 md:mb-12 font-bold max-w-lg leading-relaxed">
              {t('proHome.description')}
            </p>
            
            {/* Boutons centrés sur mobile */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full max-w-md lg:max-w-none">
              <button onClick={onGoToDashboard} className="flex-1 bg-black text-white px-8 py-5 rounded-[22px] font-black text-sm md:text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.97]">
                {t('proHome.dashboardBtn')} <LayoutDashboard size={20} />
              </button>
              <button onClick={onSwitchToExpat} className="flex-1 bg-indigo-50 text-indigo-600 border border-indigo-100 px-8 py-5 rounded-[22px] font-black text-sm md:text-lg hover:bg-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-[0.97]">
                <Repeat size={20} /> {t('proHome.switchToExpat')}
              </button>
            </div>
            
            {/* Stats centrées sur mobile */}
            <div className="flex justify-center lg:justify-start gap-4 md:gap-6 w-full">
              <div className="flex items-center gap-4 px-6 py-4 bg-white border border-gray-100 rounded-[28px] shadow-sm group hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shadow-inner">
                  <TrendingUp size={20} />
                </div>
                <div className="text-left">
                  <div className="text-xl md:text-2xl font-black leading-none">{extendedStats?.profile_views ?? 0}</div>
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">{t('dashboard.stats.views')}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 px-6 py-4 bg-white border border-gray-100 rounded-[28px] shadow-sm group hover:border-emerald-200 transition-colors">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-inner">
                  <ShieldCheck size={20} />
                </div>
                <div className="text-left">
                  <div className="text-xl md:text-2xl font-black leading-none">{extendedStats?.profile_unlocks ?? 0}</div>
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">{t('proHome.qualifiedLeads')}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative mx-auto max-w-[340px] md:max-w-[380px] w-full animate-in fade-in slide-in-from-bottom-8 lg:slide-in-from-right-8 duration-1000">
            <div className="text-center mb-6 lg:hidden">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                {t('dashboard.badges.livePreviewLabel')}
              </span>
            </div>
            <ProfessionalCard professional={proForCard} isUnlocked={true} isAuth={true} onUnlock={() => {}} isStatic={true} hideButtons={true} />
          </div>
        </div>
      </section>

      <section className="py-24 px-4 md:px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">{t('proHome.badgesSection.title')}</h2>
          <p className="text-gray-500 font-bold text-base md:text-lg">{t('proHome.badgesSection.subtitle')}</p>
        </div>
        
        {/* Carrousel mobile / Grille desktop centré */}
        <div className="flex lg:grid lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 -mx-4 md:mx-0 pb-10">
          {[
            { id: 'f', icon: <Trophy size={32} />, label: t('proHome.badgesSection.early'), earned: isFoundingMember, bg: 'bg-blue-50', color: 'text-blue-500' },
            { id: 'v', icon: <ShieldCheck size={32} />, label: t('proHome.badgesSection.verified'), earned: profile?.verification_status === 'verified', bg: 'bg-emerald-50', color: 'text-emerald-500' }, 
            { id: 'r', icon: <Sparkles size={32} />, label: t('proHome.badgesSection.featured'), earned: !!profile?.is_featured, bg: 'bg-violet-50', color: 'text-violet-500' }
          ].map(b => (
            <div key={b.id} className={`snap-center shrink-0 w-[80vw] sm:w-[320px] lg:w-auto apple-card p-10 border-2 transition-all rounded-[40px] flex flex-col items-center text-center ${b.earned ? 'bg-white border-gray-100 shadow-xl opacity-100' : 'bg-gray-50/50 border-transparent opacity-40 grayscale'}`}>
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 shadow-inner ${b.bg} ${b.color}`}>
                {b.icon}
              </div>
              <h3 className="text-xl font-black mb-4">{b.label}</h3>
              <div className={`mt-auto px-5 py-2 rounded-full text-[10px] font-black uppercase ${b.earned ? `${b.bg} ${b.color}` : 'bg-gray-200 text-gray-400'}`}>
                {b.earned ? t('proHome.badgesSection.earnedTag') : t('proHome.badgesSection.lockedTag')}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProHome;