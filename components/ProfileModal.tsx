import { X, MapPin, Phone, Mail, ShieldCheck, Star, Lock, Coins, User, Building2, Globe, ExternalLink, Navigation, Award, Briefcase, GraduationCap, Sparkles, Loader2, CheckCircle2, MessageSquareQuote, Ghost, Clock, User2, AlertCircle, Languages } from 'lucide-react';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Professional, Review } from '../types';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_FLAGS, getFlagEmoji } from '../constants';
import { getProfessionalReviews } from '../services/userService';

interface ProfileModalProps {
  pro: Professional; 
  isUnlocked: boolean; 
  isAuth: boolean; 
  isOwner?: boolean; 
  currentUserId?: string;
  refreshTrigger?: number;
  onClose: () => void; 
  onUnlock: (id: string, e: React.MouseEvent) => void | Promise<void>;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ pro, isUnlocked, isAuth, isOwner, currentUserId, refreshTrigger = 0, onClose, onUnlock }) => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const currentLang = useMemo(() => {
    return i18n.language ? i18n.language.split('-')[0] : 'en';
  }, [i18n.language]);

  const fetchReviews = useCallback(() => {
    if (pro.id) {
      setLoadingReviews(true);
      getProfessionalReviews(pro.id, currentUserId).then(res => {
        setReviews(res);
        setLoadingReviews(false);
      });
    }
  }, [pro.id, currentUserId]);

  useEffect(() => { 
    setIsVisible(true); 
    document.body.style.overflow = 'hidden'; 
    fetchReviews();
    return () => { document.body.style.overflow = 'unset'; }; 
  }, [fetchReviews, refreshTrigger]);

  const handleClose = () => { 
    setIsVisible(false); 
    setTimeout(onClose, 300); 
  };

  const canSeePrivateData = isUnlocked || isOwner;
  const displayName = canSeePrivateData ? (pro?.name || t('common.expert')) : `${pro?.name?.trim().charAt(0) || 'E'}.`;
  
  const proEmail = pro?.email_pro || pro?.email || '';
  const proPhone = pro?.phone || '';
  const displayBio = pro?.bios?.[currentLang] || pro?.bio || "";
  
  const isVerified = pro?.verificationStatus === 'verified' || pro?.verified;
  const isEarly = !!pro?.isEarlyMember;
  const isFeatured = !!pro?.isFeatured;
  const hasValidatedReviews = Number(pro.reviews) > 0;

  const displayGender = useMemo(() => {
    if (!pro.gender || pro.gender === 'prefer-not-to-say') return t('common.prefer-not-to-say');
    return t(`common.${pro.gender}`);
  }, [pro.gender, t]);

  const mapsUrl = useMemo(() => {
    if (!pro.address) return '#';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pro.address)}`;
  }, [pro.address]);

  return (
    <div className={`fixed inset-0 z-[2000] flex items-end md:items-center justify-center p-0 md:p-6 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer" 
        onClick={handleClose} 
      />
      
      <div className={`relative w-full max-w-2xl h-[94vh] md:h-auto md:max-h-[90vh] bg-white rounded-t-[40px] md:rounded-[40px] shadow-2xl flex flex-col overflow-hidden transition-all duration-500 transform ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="absolute top-4 md:top-6 right-6 z-[100] pointer-events-auto">
          <button 
            onClick={(e) => { e.stopPropagation(); handleClose(); }} 
            className="p-2.5 md:p-3 bg-gray-100/80 md:bg-white/90 text-gray-400 hover:text-black rounded-full shadow-lg border border-white/50 backdrop-blur-md transition-all active:scale-90"
          >
            <X size={24} className="md:w-6 md:h-6" />
          </button>
        </div>

        <div className="md:hidden w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 shrink-0 opacity-50" />

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 md:p-12 pb-32">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 mb-10">
            <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-[32px] md:rounded-[40px] overflow-hidden ring-4 md:ring-8 ring-gray-50 shadow-xl bg-gray-100 relative shrink-0">
              {pro.image ? (
                <img src={pro.image} className={`w-full h-full object-cover transition-all duration-700 ${canSeePrivateData ? '' : 'blur-3xl opacity-40 scale-125'}`} alt="" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-white bg-[#45a081] transition-all duration-700 ${canSeePrivateData ? '' : 'blur-3xl opacity-40 scale-125'}`}>
                  <User2 size={64} className="md:w-24 md:h-24" />
                </div>
              )}
              {!canSeePrivateData && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock size={28} className="text-gray-400 opacity-50" />
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left pt-1">
              <div className="flex flex-wrap justify-center md:justify-start gap-1.5 mb-3 md:mb-4">
                {isFeatured && <span className="bg-violet-600 text-white px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm"><Sparkles size={10} fill="currentColor" /> {t('common.featuredBadge')}</span>}
                {isVerified && <span className="bg-emerald-600 text-white px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm"><ShieldCheck size={10} /> {t('common.verified')}</span>}
                {isEarly && <span className="bg-blue-600 text-white px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm"><Award size={10} /> {t('dashboard.badges.early')}</span>}
              </div>
              
              <div className="flex flex-col items-center md:items-start gap-1.5 mb-3">
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">{displayName}</h2>
                {hasValidatedReviews && (
                  <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100 shadow-sm">
                    <Star size={14} className="fill-amber-400 text-amber-400 md:w-4 md:h-4" />
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-black text-gray-900">{(pro.rating || 5.0).toFixed(1)}</span>
                      <span className="text-[10px] font-bold text-amber-600/70">({pro.reviews})</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                <div className="flex items-center gap-1.5 text-indigo-600 text-[10px] md:text-sm font-black uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-100">
                  <Briefcase size={14} className="md:w-4 md:h-4" />
                  <span>{t(`professions.${pro?.professions?.[0]}`) || pro?.professions?.[0]}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-xl text-gray-500 border border-gray-100 shadow-sm">
                  <GraduationCap size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-tight">{pro.yearsOfExperience} {t('common.yearsExp')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div className={`flex items-center gap-3 md:gap-4 p-4 bg-gray-50 rounded-[24px] border border-gray-100 transition-all ${!canSeePrivateData ? 'opacity-30 grayscale' : 'hover:bg-white hover:border-indigo-100 shadow-sm'}`}>
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm shrink-0"><Phone size={18} /></div>
              <div className="flex-1 overflow-hidden">
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('forms.phoneMain')}</div>
                {canSeePrivateData && proPhone ? (
                  <a href={`tel:${proPhone}`} className="text-xs md:text-sm font-black text-gray-900 truncate hover:text-indigo-600 transition-colors block">
                    {proPhone}
                  </a>
                ) : (
                  <div className="text-xs md:text-sm font-black text-gray-900 truncate opacity-40">
                    +34 ••• ••• •••
                  </div>
                )}
              </div>
            </div>
            <div className={`flex items-center gap-3 md:gap-4 p-4 bg-gray-50 rounded-[24px] border border-gray-100 transition-all ${!canSeePrivateData ? 'opacity-30 grayscale' : 'hover:bg-white hover:border-indigo-100 shadow-sm'}`}>
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm shrink-0"><Mail size={18} /></div>
              <div className="flex-1 overflow-hidden">
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('forms.emailPro')}</div>
                {canSeePrivateData && proEmail ? (
                  <a href={`mailto:${proEmail}`} className="text-xs md:text-sm font-black text-gray-900 truncate hover:text-indigo-600 transition-colors block">
                    {proEmail}
                  </a>
                ) : (
                  <div className="text-xs md:text-sm font-black text-gray-900 truncate opacity-40">
                    ••••@••••.••
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Languages size={14} className="text-indigo-400" /> {t('forms.languages')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {pro.languages?.map(l => (
                      <div key={l} className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl shadow-sm transition-transform hover:scale-105">
                         <span className="text-lg leading-none">{LANGUAGE_FLAGS[l]}</span>
                         <span className="text-[11px] font-bold text-gray-700">{t(`languages.${l}`)}</span>
                      </div>
                    ))}
                  </div>
               </div>
               <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Globe size={14} className="text-blue-400" /> {t('forms.nationality')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {pro.nationalities?.map(iso => (
                      <div key={iso} className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl shadow-sm transition-transform hover:scale-105">
                         <span className="text-lg leading-none">{getFlagEmoji(iso)}</span>
                         <span className="text-[11px] font-bold text-gray-700">{iso}</span>
                      </div>
                    ))}
                    {(!pro.nationalities || pro.nationalities.length === 0) && <span className="text-xs text-gray-400 font-medium italic">{t('common.notSpecified')}</span>}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><MapPin size={14} className="text-red-400" /> {t('forms.cities')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {pro.cities?.map(c => (
                      <div key={c} className="flex items-center gap-2 px-3 py-2 bg-indigo-50/50 border border-indigo-100 rounded-xl shadow-sm transition-transform hover:scale-105">
                         <span className="text-[11px] font-bold text-indigo-700">{t(`cities.${c}`) || c}</span>
                      </div>
                    ))}
                    {(!pro.cities || pro.cities.length === 0) && <span className="text-xs text-gray-400 font-medium italic">{t('common.notSpecified')}</span>}
                  </div>
               </div>
               
               {pro.address && pro.address.trim() !== "" && (
                  <div className="animate-in fade-in">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Navigation size={14} className="text-emerald-400" /> {t('profileModal.businessAddress')}</h3>
                    
                    {canSeePrivateData ? (
                      <a 
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-[20px] border border-gray-100 shadow-sm bg-white hover:border-indigo-200 hover:shadow-md transition-all group/address"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 group-hover/address:scale-110 transition-transform"><MapPin size={16} /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-gray-800 leading-tight pt-1 break-words pr-6 relative">
                              {pro.address}
                              <ExternalLink size={12} className="absolute top-1 right-0 text-gray-300 group-hover/address:text-indigo-500 transition-colors" />
                            </p>
                            <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-1 opacity-0 group-hover/address:opacity-100 transition-opacity">Voir sur Google Maps</p>
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="p-4 rounded-[20px] border border-gray-100 shadow-sm bg-gray-50/50 opacity-40 grayscale">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center shrink-0"><MapPin size={16} /></div>
                          <p className="text-xs font-bold text-gray-800 leading-tight pt-1">
                            ••••••••••••••••••••
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
               )}
            </div>

            <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{t('profileModal.about')}</h3>
              <p className="text-gray-700 leading-relaxed font-medium text-sm md:text-base bg-gray-50/30 p-6 rounded-[28px] border border-gray-50">
                {displayBio}
              </p>
            </div>

            {pro.specialties && pro.specialties.length > 0 && (
              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{t('profileModal.specialties')}</h3>
                <div className="flex flex-wrap gap-2">
                  {pro.specialties.map(s => {
                    const translationKey = `specialties.${s}`;
                    const translatedLabel = pro.specialtyTranslations?.[s]?.[currentLang] || (t(translationKey) !== translationKey ? t(translationKey) : s);
                    return (
                      <span key={s} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black uppercase tracking-wider border border-emerald-100 shadow-sm transition-transform hover:scale-105">
                        {translatedLabel}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <MessageSquareQuote size={16} className="text-amber-500" /> {t('common.reviews')} ({reviews.length})
              </h3>
              {loadingReviews ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-500" /></div>
              ) : reviews.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {reviews.map(review => (
                    <div key={review.id} className="p-5 bg-white rounded-[24px] border border-gray-100 shadow-sm group hover:border-amber-100 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 text-[10px] font-black overflow-hidden border border-gray-100 shadow-inner">
                              {review.isAnonymous ? <Ghost size={14} /> : (review.userAvatar ? <img src={review.userAvatar} className="w-full h-full object-cover" /> : <User size={14} />)}
                           </div>
                           <div className="text-xs font-black text-gray-900">{review.isAnonymous ? t('common.anonymousExpat') : review.userName}</div>
                        </div>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= review.stars ? 'fill-amber-400 text-amber-400' : 'text-gray-100'} />)}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 italic leading-relaxed">"{review.testimonies}"</p>
                      <div className="mt-3 text-[8px] font-black text-gray-300 uppercase tracking-widest">{new Date(review.date).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50/50 rounded-[32px] border border-dashed border-gray-200">
                   <MessageSquareQuote size={32} className="mx-auto text-gray-200 mb-3" />
                   <p className="text-xs text-gray-400 font-bold italic">{t('common.noReviewsYet')}</p>
                </div>
              )}
            </div>
          </div>

          {!canSeePrivateData && (
            <div className="mt-12 p-8 bg-gray-900 rounded-[36px] text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4"><Lock size={120} className="text-white" /></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-amber-500 rounded-[22px] flex items-center justify-center mx-auto mb-6 text-white shadow-lg animate-bounce">
                  <Coins size={32} />
                </div>
                <h4 className="text-white text-xl font-black mb-4 tracking-tight uppercase tracking-widest">{t('profileModal.unlockPrompt')}</h4>
                <button 
                  onClick={(e) => onUnlock(pro.id, e)} 
                  className="w-full sm:w-auto bg-white text-gray-900 px-12 py-4 rounded-xl font-black text-sm hover:bg-emerald-50 transition-all flex items-center justify-center gap-3 mx-auto shadow-xl active:scale-95"
                >
                  <Lock size={18} /> {t('common.unlock')}
                </button>
                <div className="mt-6 flex items-center justify-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]"><ShieldCheck size={12} /> {t('auth.secureBy')}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;