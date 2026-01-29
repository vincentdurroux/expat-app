import React, { useMemo } from 'react';
import { Star, ChevronRight, Lock, ShieldCheck, Navigation, User2, Briefcase, Globe, Sparkles, Trophy, MapPin } from 'lucide-react';
import { Professional } from '../types';
import { useTranslation } from 'react-i18next';
import { getFlagEmoji, LANGUAGE_FLAGS } from '../constants';

interface ProfessionalCardProps {
  professional: Professional;
  isUnlocked: boolean;
  isAuth: boolean;
  currentUserId?: string;
  onUnlock: (id: string, e: React.MouseEvent) => void;
  onViewProfile?: (pro: Professional) => void;
  isStatic?: boolean;
  hideButtons?: boolean;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ 
  professional: pro, 
  isUnlocked, 
  isAuth, 
  currentUserId,
  onUnlock, 
  onViewProfile,
  isStatic = false,
  hideButtons = false
}) => {
  const { t } = useTranslation();

  if (!pro) return null;

  const isOwner = currentUserId && pro.id === currentUserId;
  const canSeeInfo = isUnlocked || isStatic || isOwner;
  const canSeePrivateData = isUnlocked || isOwner;

  const safeName = pro.name || t('common.expert');
  const renderedName = canSeeInfo ? safeName : `${safeName.trim().charAt(0)}.`;
  
  const distance = useMemo(() => {
    const dist = pro.distance_km;
    if (dist === null || dist === undefined || isNaN(dist)) return '';
    if (dist < 1) return `${Math.round(dist * 1000)} m`;
    return `${dist.toFixed(1)} km`;
  }, [pro.distance_km]);

  const optimizedImageUrl = useMemo(() => {
    const rawUrl = pro.image;
    if (!rawUrl) return null;
    if (rawUrl.includes('supabase.co')) {
       return `${rawUrl}?width=240&height=240&resize=contain&quality=60`;
    }
    if (rawUrl.includes('unsplash.com')) {
       return `${rawUrl}&w=240&h=240&fit=crop&q=60`;
    }
    return rawUrl;
  }, [pro.image]);

  const handleUnlockClick = (e: React.MouseEvent) => {
    if (isStatic || isOwner) return;
    e.preventDefault(); e.stopPropagation();
    onUnlock(pro.id, e);
  };

  const handleViewProfile = (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (onViewProfile) onViewProfile(pro);
  };

  const displayGender = useMemo(() => {
    if (!pro.gender || pro.gender === 'prefer-not-to-say') return t('common.prefer-not-to-say');
    return t(`common.${pro.gender}`);
  }, [pro.gender, t]);

  const hasValidatedReviews = Number(pro.reviews) > 0;

  return (
    <div className={`apple-card group overflow-hidden flex flex-col h-full bg-white relative border border-gray-100 transition-all duration-300 ${!isStatic ? 'hover:border-[#45a081]/40 shadow-sm hover:shadow-xl hover:-translate-y-1' : ''}`}>
      
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-[60]">
        {(pro.verified || pro.verificationStatus === 'verified') && (
          <div className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-[10px] md:text-xs font-black uppercase shadow-lg border border-white/10">
            <ShieldCheck size={14} /> {t('common.verified')}
          </div>
        )}
        {distance && (
          <span className="bg-[#2e75c2]/90 backdrop-blur-md text-white text-[11px] md:text-xs font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-white/10">
            <Navigation size={14} className="fill-white" />
            {distance}
          </span>
        )}
      </div>

      <div className={`relative h-24 md:h-28 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 overflow-hidden cursor-pointer`} onClick={handleViewProfile}>
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {pro.isFeatured && (
            <div className="bg-violet-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-[10px] md:text-xs font-black uppercase shadow-sm">
              <Sparkles size={14} fill="currentColor" /> {t('common.featuredBadge')}
            </div>
          )}
          {pro.isEarlyMember && (
            <div className="bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-[10px] md:text-xs font-black uppercase shadow-sm">
              <Trophy size={14} /> {t('dashboard.badges.early')}
            </div>
          )}
        </div>
      </div>

      <div className="relative flex justify-center -mt-12 md:-mt-16 mb-6">
        <div className={`relative w-28 h-28 md:w-32 md:h-32 rounded-[36px] md:rounded-[48px] ring-[8px] ring-white shadow-xl bg-gray-50 overflow-hidden shrink-0 cursor-pointer aspect-square`} onClick={handleViewProfile}>
          {optimizedImageUrl ? (
            <img 
              src={optimizedImageUrl} 
              alt={renderedName} 
              loading="lazy"
              decoding="async"
              className={`w-full h-full object-cover transition-all duration-500 ${(!canSeeInfo) ? 'blur-3xl opacity-40 scale-150' : (!isStatic ? 'group-hover:scale-105' : '')}`} 
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-white transition-all duration-500 bg-[#45a081] ${(!canSeeInfo) ? 'blur-3xl opacity-40 scale-150' : ''}`}>
              <User2 size={48} className="md:w-16 md:h-16" />
            </div>
          )}
          {!canSeeInfo && !isStatic && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock size={28} className="text-gray-400 opacity-40" />
            </div>
          )}
        </div>
      </div>

      <div className="px-6 md:px-8 pb-6 md:pb-8 flex flex-col flex-1 text-center items-center">
        <div className="mb-6 w-full min-h-[80px]">
          <div className="flex items-center justify-center gap-3 mb-2 flex-wrap">
            <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
              {renderedName}
            </h3>
            {hasValidatedReviews && (
              <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100/50 shadow-sm">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <div className="flex items-baseline gap-0.5">
                  <span className="text-sm font-black text-gray-900">{(pro.rating || 5.0).toFixed(1)}</span>
                  <span className="text-[10px] font-bold text-gray-400">({pro.reviews})</span>
                </div>
              </div>
            )}
          </div>
          <p className="text-indigo-600 text-[11px] md:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 bg-indigo-50/50 py-2 rounded-2xl px-5 w-fit mx-auto">
            <Briefcase size={14} />
            {pro.professions?.[0] ? t(`professions.${pro.professions[0]}`) : t('common.expert')}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-6 w-full">
          <div className="flex items-start flex-col gap-1 p-3 bg-gray-50/50 rounded-[20px] border border-gray-100/50">
            <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('forms.genderLabel')}</span>
            <div className="flex items-center gap-2 truncate w-full text-[12px] font-bold text-gray-700 capitalize">
              <User2 size={14} className="text-indigo-400 shrink-0" /> {displayGender}
            </div>
          </div>
          <div className="flex items-start flex-col gap-1 p-3 bg-gray-50/50 rounded-[20px] border border-gray-100/50">
            <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('forms.yearsOfExperience')}</span>
            <div className="flex items-center gap-2 truncate w-full text-[12px] font-bold text-gray-700">
              <User2 size={14} className="text-emerald-500 shrink-0" /> {pro.yearsOfExperience} {t('common.yearsExp')}
            </div>
          </div>
          <div className="flex items-start flex-col gap-1 p-3 bg-gray-50/50 rounded-[20px] border border-gray-100/50 w-full overflow-hidden">
            <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('forms.languages')}</span>
            <div className="flex flex-wrap gap-2 w-full">
              {pro.languages?.slice(0, 3).map(l => (
                <div key={l} className="flex flex-col items-center">
                  <span className="text-base leading-tight" title={t(`languages.${l}`)}>{LANGUAGE_FLAGS[l] || '🌐'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-start flex-col gap-1 p-3 bg-gray-50/50 rounded-[20px] border border-gray-100/50 overflow-hidden w-full">
            <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('forms.nationality')}</span>
            <div className="flex flex-wrap gap-2 w-full">
               {pro.nationalities && pro.nationalities.length > 0 ? pro.nationalities.slice(0, 2).map(iso => (
                 <div key={iso} className="flex flex-col items-center">
                   <span className="text-sm filter drop-shadow-sm leading-tight">{getFlagEmoji(iso)}</span>
                 </div>
               )) : <Globe size={14} className="text-gray-300" />}
            </div>
          </div>
        </div>

        <div className="w-full p-3 bg-indigo-50/30 rounded-[20px] border border-indigo-100/20 mb-6 flex items-center gap-3 group/geo">
          <MapPin size={16} className="text-indigo-400 shrink-0 group-hover/geo:scale-110 transition-transform" />
          <div className="flex-1 text-left overflow-hidden">
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">{t('forms.cities')}</span>
            <div className="text-[11px] font-bold text-gray-700 truncate">
              {pro.cities?.slice(0, 2).map(c => t(`cities.${c}`) || c).join(', ') || t('common.notSpecified')}
            </div>
          </div>
        </div>

        <div className="mt-auto w-full flex flex-col gap-3">
          {!hideButtons && (
            !isStatic ? (
              <>
                {!canSeePrivateData && (
                  <button onClick={handleUnlockClick} className="w-full bg-black text-white h-12 md:h-14 rounded-[18px] font-black text-sm shadow-xl active:scale-[0.97] flex items-center justify-center gap-3 hover:bg-gray-800 transition-all">
                    <Lock size={16} /> 
                    <span className="uppercase tracking-[0.05em]">{t('common.unlock')}</span>
                  </button>
                )}
                <button onClick={handleViewProfile} className={`w-full bg-white border-2 border-gray-100 text-gray-900 h-12 md:h-14 rounded-[18px] font-black text-sm shadow-sm active:scale-[0.97] flex items-center justify-center gap-3 hover:bg-gray-50 transition-all`}>
                  {canSeePrivateData ? <ChevronRight size={18} /> : <User2 size={18} />} 
                  <span className="uppercase tracking-[0.05em]">{isOwner ? t('profile.ownerAccess') : t('common.viewProfile')}</span>
                </button>
              </>
            ) : (
              <button onClick={handleViewProfile} className="mt-auto w-full bg-white border-2 border-gray-100 text-gray-900 h-12 md:h-14 rounded-[18px] font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
                 {t('common.viewProfile')}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCard;