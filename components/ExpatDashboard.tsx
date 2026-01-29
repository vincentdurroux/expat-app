import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  Coins, 
  Search, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Star,
  Shield,
  MapPin,
  CheckCircle,
  Loader2,
  Briefcase,
  Repeat,
  ArrowLeft,
  Send,
  MessageSquareQuote,
  PenLine,
  X,
  Ghost,
  Globe,
  HelpCircle,
  ArrowUpRight,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Professional, Review, UnlockToken, SearchFilters } from '../types';
import { POPULAR_CITIES } from '../constants';
import { useTranslation } from 'react-i18next';
import ProfessionalCard from './ProfessionalCard';
import { getUserProfile } from '../services/userService';

interface ExpatDashboardProps {
  credits: number;
  unlockedPros: Record<string, UnlockToken>;
  unlockedProfessionalList: Professional[];
  userReviews: Review[];
  preferredCity: string;
  onUpdateCity: (city: string) => void;
  onFindPros: () => void;
  onAddCredits: () => void;
  onMessagePro: (pro: Professional) => void;
  onSubmitReview: (proId: string, rating: number, comment: string, serviceType: string, isAnonymous: boolean) => void;
  onSwitchToPro: (e?: React.MouseEvent) => void;
  onViewProfile: (pro: Professional) => void;
  onBack: () => void;
  onTriggerSearch: (filters: SearchFilters) => void;
}

const ExpatDashboard: React.FC<ExpatDashboardProps> = ({ 
  credits, 
  unlockedPros, 
  unlockedProfessionalList,
  userReviews,
  preferredCity,
  onUpdateCity,
  onFindPros, 
  onAddCredits,
  onSubmitReview,
  onSwitchToPro,
  onViewProfile,
  onBack
}) => {
  const { t } = useTranslation();
  const [selectedProForReview, setSelectedProForReview] = useState<Professional | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlreadyPro, setIsAlreadyPro] = useState(false);
  
  useEffect(() => {
    const checkProStatus = async () => {
       const { data: { user } } = await (await import('../supabaseClient')).supabase.auth.getUser();
       if (user) {
          const profile = await getUserProfile(user.id);
          setIsAlreadyPro(!!profile?.is_pro);
       }
    };
    checkProStatus();
  }, []);

  /**
   * Un professionnel débloqué attend un avis si :
   * 1. Il est débloqué
   * 2. ET il n'y a PAS encore de review pour lui dans userReviews 
   *    OU s'il y en a, elles ont TOUTES été rejetées (status === 'rejected')
   */
  const prosWaitingForReview = useMemo(() => {
    return unlockedProfessionalList.filter(pro => {
      // On cherche s'il existe une review non-rejetée (en attente ou publiée)
      const existingActiveReview = userReviews.find(
        r => r.proId === pro.id && (r.status === 'verified' || r.status === 'pending')
      );
      // S'il n'y a pas de review active, le pro est prêt à être noté
      return !existingActiveReview;
    });
  }, [unlockedProfessionalList, userReviews]);

  const handleReviewClick = (pro: Professional) => {
    setSelectedProForReview(pro);
    setReviewRating(5);
    setReviewComment('');
    setIsAnonymous(false);
  };

  const submitReview = async () => {
    if (selectedProForReview && reviewComment.length >= 20 && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const serviceType = selectedProForReview.professions?.[0] || 'Expert';
        await onSubmitReview(selectedProForReview.id, reviewRating, reviewComment, serviceType, isAnonymous);
        setSelectedProForReview(null);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-20 animate-in fade-in duration-700">
      <button 
        onClick={onBack}
        className="mb-10 flex items-center justify-center md:justify-start gap-3 text-gray-400 hover:text-black transition-colors font-bold text-sm min-h-[48px] w-full md:w-auto"
      >
        <ArrowLeft size={18} /> {t('common.back')}
      </button>

      {/* Header Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 mb-16 text-center md:text-left">
        <div className="flex flex-col items-center md:items-start px-1">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 mb-6 shadow-sm">
            <User size={14} /> {t('nav.myRelocation')}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#1d1d1f] mb-3">{t('expatDashboard.title')}</h1>
          <p className="text-gray-400 text-sm md:text-base font-bold leading-relaxed max-w-lg">{t('expatDashboard.subtitle')}</p>
        </div>
        
        <div className="apple-card p-6 flex items-center gap-5 border border-gray-100 w-full md:w-auto min-w-[240px] shadow-sm">
          <div className="bg-amber-50 p-4 rounded-2xl text-amber-500 shadow-inner">
            <Coins size={28} />
          </div>
          <div className="flex-1 text-left">
            <div className="text-3xl font-black text-gray-900">{credits}</div>
            <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{t('expatDashboard.creditsLabel')}</div>
          </div>
          <button onClick={onAddCredits} className="p-4 bg-gray-50 hover:bg-amber-100 hover:text-amber-600 rounded-[18px] text-gray-400 transition-all active:scale-95 shadow-sm">
            <Zap size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
        <div className="lg:col-span-8 space-y-16">
          
          {/* SECTION : EXPERTS DÉBLOQUÉS */}
          <div className="space-y-10">
             <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl md:text-3xl font-black flex items-center gap-4"><ShieldCheck className="text-emerald-500" size={32} />{t('expatDashboard.unlockedTitle')}</h2>
                {unlockedProfessionalList.length > 0 && (
                   <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{unlockedProfessionalList.length}</span>
                )}
             </div>

             {unlockedProfessionalList.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {unlockedProfessionalList.map(pro => (
                   <ProfessionalCard 
                    key={pro.id} 
                    professional={pro} 
                    isUnlocked={true} 
                    isAuth={true} 
                    onUnlock={() => {}} 
                    onViewProfile={onViewProfile} 
                   />
                 ))}
               </div>
             ) : (
               <div className="apple-card p-20 text-center border-2 border-dashed border-gray-200 bg-gray-50/30 mx-1">
                 <Search size={48} className="mx-auto text-gray-200 mb-6" />
                 <h3 className="text-xl font-black text-gray-900 mb-2">{t('expatDashboard.noExpertsTitle')}</h3>
                 <p className="text-sm font-bold text-gray-400 mb-10">{t('expatDashboard.noExpertsDesc')}</p>
                 <button onClick={onFindPros} className="bg-black text-white px-10 py-5 rounded-[22px] font-bold text-base hover:bg-gray-800 transition-all shadow-xl active:scale-95">{t('nav.findPro')}</button>
               </div>
             )}
          </div>

          {/* Section Avis */}
          <div className="space-y-10">
            <h2 className="text-2xl md:text-3xl font-black flex items-center justify-center md:justify-start gap-4 px-2"><MessageSquareQuote className="text-amber-500" size={32} />{t('expatDashboard.reviews.sectionTitle')}</h2>
            
            {prosWaitingForReview.length > 0 && (
              <div className="space-y-5 px-1">
                 <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 text-center md:text-left ml-1">{t('expatDashboard.reviews.waitingTitle')} ({prosWaitingForReview.length})</h3>
                 <div className="grid grid-cols-1 gap-5">
                    {prosWaitingForReview.map(pro => (
                      <div key={pro.id} className="apple-card p-6 border border-amber-100 bg-amber-50/20 flex flex-col sm:flex-row items-center justify-between gap-6 group shadow-sm">
                         <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md border-2 border-white shrink-0"><img src={pro.image} className="w-full h-full object-cover" alt="" /></div>
                            <div className="text-center sm:text-left">
                               <div className="font-black text-gray-900 leading-tight text-base">{pro.name}</div>
                               <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1">{t(`professions.${pro.professions[0]}`)}</div>
                            </div>
                         </div>
                         <button onClick={() => handleReviewClick(pro)} className="w-full sm:w-auto bg-white text-amber-600 px-6 py-4 rounded-[18px] text-sm font-bold border-2 border-amber-200 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all shadow-sm flex items-center justify-center gap-3 active:scale-95"><PenLine size={18} /> {t('expatDashboard.reviews.evaluateBtn')}</button>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {userReviews.length > 0 ? (
              <div className="space-y-6 pt-4 px-1">
                 <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 text-center md:text-left ml-1">{t('expatDashboard.reviews.historyTitle')} ({userReviews.length})</h3>
                 <div className="grid grid-cols-1 gap-8">
                   {userReviews.map(review => {
                     return (
                      <div key={review.id} className={`apple-card p-8 border relative overflow-hidden group transition-all shadow-sm ${
                        review.status === 'rejected' ? 'bg-red-50/40 border-red-200 ring-2 ring-red-100' : 
                        review.status === 'pending' ? 'bg-amber-50/10 border-amber-100' : 
                        'bg-white border-gray-100 hover:border-indigo-100'
                      }`}>
                         <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
                            <div className="flex items-center gap-5">
                               <div>
                                  <div className="text-[11px] font-black uppercase tracking-widest text-center sm:text-left text-gray-400 mb-1.5">{t('expatDashboard.reviews.modalSubtitle', { name: review.proName || t('common.expert') })}</div>
                                  <div className="flex justify-center sm:justify-start gap-1.5">{[1,2,3,4,5].map(s => <Star key={s} size={16} className={s <= review.stars ? 'fill-amber-400 text-amber-400' : 'text-gray-100'} />)}</div>
                               </div>
                            </div>
                            <div className="flex items-center gap-2 self-center sm:self-start">
                              {review.isAnonymous && <span className="px-3 py-1.5 bg-gray-50 text-gray-400 rounded-lg text-[9px] font-black uppercase border border-gray-100">{t('expatDashboard.reviews.anonymousToggle')}</span>}
                              
                              <span className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                                review.status === 'verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                review.status === 'rejected' ? 'bg-red-600 text-white border-red-600' : 
                                'bg-amber-50 text-amber-600 border-amber-100'
                              }`}>
                                 {review.status === 'verified' ? <ShieldCheck size={12} /> : 
                                  review.status === 'rejected' ? <AlertCircle size={12} /> : 
                                  <Clock size={12} className="animate-pulse" />}
                                 {t(`expatDashboard.reviews.status.${review.status || 'pending'}`)}
                              </span>
                            </div>
                         </div>
                         <p className={`text-gray-700 italic text-lg leading-relaxed font-medium text-center sm:text-left ${review.status === 'rejected' ? 'line-through decoration-red-300 opacity-60' : ''}`}>"{review.testimonies}"</p>
                         <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                               <div className="text-[11px] text-gray-400 font-black uppercase tracking-widest">{t('expatDashboard.reviews.postedOn')} {new Date(review.date).toLocaleDateString()}</div>
                            </div>
                            {review.status === 'verified' && <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-4 py-1.5 rounded-xl border border-emerald-100/50 shadow-sm"><ShieldCheck size={14} /> {t('common.verifiedReview')}</div>}
                            {review.status === 'rejected' && <div className="flex items-center gap-2 text-[10px] font-black text-red-600 uppercase bg-red-50 px-4 py-1.5 rounded-xl border border-red-100 shadow-sm"><AlertCircle size={14} /> {t('admin.reviews.rejected')}</div>}
                         </div>
                      </div>
                     );
                   })}
                 </div>
              </div>
            ) : prosWaitingForReview.length === 0 && (
              <div className="apple-card p-20 text-center border-2 border-dashed border-gray-200 bg-gray-50/30 mx-1">
                 <MessageSquareQuote size={48} className="mx-auto text-gray-200 mb-6" />
                 <p className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">{t('expatDashboard.reviews.empty')}</p>
              </div>
            )}
          </div>
        </div>

        {/* SECTION : SIDEBAR */}
        <div className="lg:col-span-4 space-y-8 px-1">
           {/* Outils & Aide */}
           <div className="apple-card p-8 border border-gray-100 bg-white shadow-sm h-fit sticky top-28">
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-8 px-1">{t('expatDashboard.toolsTitle')}</h3>
              <div className="space-y-4">
                 <button onClick={onFindPros} className="w-full flex items-center gap-4 p-5 rounded-[22px] bg-indigo-50/30 text-indigo-600 hover:bg-indigo-50 border border-indigo-100/50 transition-all group active:scale-[0.98]">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform"><Search size={20} /></div>
                    <div className="text-left flex-1">
                       <div className="text-sm font-black leading-none mb-1">{t('nav.findPro')}</div>
                       <div className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-tight">{t('expatDashboard.accessDirectory')}</div>
                    </div>
                    <ChevronRight size={16} className="text-indigo-300" />
                 </button>

                 <div className="w-full flex items-center gap-4 p-5 rounded-[22px] bg-gray-50/50 text-gray-900 border border-gray-100 transition-all group opacity-60 cursor-not-allowed">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center"><HelpCircle size={20} className="text-gray-400" /></div>
                    <div className="text-left flex-1">
                       <div className="text-sm font-black leading-none mb-1">{t('expatDashboard.support')}</div>
                       <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{t('subscription.comingSoon')}</div>
                    </div>
                 </div>
              </div>

              {/* Bloc Invitation Pro */}
              <div className="mt-12 pt-8 border-t border-gray-50">
                 <div className="bg-gray-900 rounded-[28px] p-8 text-center relative overflow-hidden group shadow-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none transform translate-x-4 -translate-y-4"><Briefcase size={80} className="text-white" /></div>
                    <div className="relative z-10">
                       <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg animate-pulse"><Zap size={24} fill="currentColor" /></div>
                       <h4 className="text-white text-lg font-black mb-2 leading-tight">
                         {isAlreadyPro ? t('expatDashboard.proInvite.titlePro') : t('expatDashboard.proInvite.titleExpat')}
                       </h4>
                       <p className="text-gray-400 text-xs font-bold mb-8 leading-relaxed">
                         {isAlreadyPro ? t('expatDashboard.proInvite.descPro') : t('expatDashboard.proInvite.descExpat')}
                       </p>
                       <button onClick={onSwitchToPro} className="w-full bg-white text-gray-900 py-4 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95">
                         <Repeat size={16} /> {isAlreadyPro ? t('expatDashboard.proInvite.btnPro') : t('expatDashboard.proInvite.btnExpat')}
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Review Modal - ULTRA COMPACT SINGLE SCREEN */}
      {selectedProForReview && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-2 md:p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="relative w-full max-w-lg bg-white rounded-[28px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 max-h-[95vh]">
              
              {/* Header Ultra Compact */}
              <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between bg-white shrink-0">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-emerald-100 shrink-0">
                      <img src={selectedProForReview?.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-gray-900 leading-none">{t('expatDashboard.reviews.modalTitle')}</h3>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">{selectedProForReview?.name}</p>
                    </div>
                 </div>
                 <button onClick={() => !isSubmitting && setSelectedProForReview(null)} className="p-1.5 text-gray-300 hover:text-black transition-all" disabled={isSubmitting}>
                   <X size={20} />
                 </button>
              </div>

              {/* Body Ultra Compact */}
              <div className="p-4 md:p-6 space-y-4 md:space-y-5 overflow-hidden">
                 {/* Notation */}
                 <div className="flex flex-col items-center gap-1">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-300">{t('expatDashboard.reviews.ratingLabel')}</label>
                    <div className="flex justify-center gap-2">
                       {[1, 2, 3, 4, 5].map(star => (
                          <button key={star} onClick={() => !isSubmitting && setReviewRating(star)} className="transition-all active:scale-90 hover:scale-105" disabled={isSubmitting}>
                             <Star size={28} className={`${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-100'} transition-colors duration-150`} strokeWidth={star <= reviewRating ? 0 : 2} />
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Zone de texte Compacte */}
                 <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1">
                       <label className="text-[8px] font-black uppercase tracking-widest text-gray-300">{t('expatDashboard.reviews.commentLabel')}</label>
                       <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded ${reviewComment.length < 20 ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'}`}>{reviewComment.length}/20 {t('forms.minChars')}</span>
                    </div>
                    <textarea 
                      value={reviewComment} 
                      onChange={e => setReviewComment(e.target.value)} 
                      className="w-full bg-gray-50 border border-gray-100 focus:border-indigo-100 rounded-2xl p-3 md:p-4 text-sm font-medium outline-none focus:bg-white transition-all h-20 md:h-24 resize-none shadow-inner leading-relaxed" 
                      placeholder={t('expatDashboard.reviews.placeholder')} 
                      disabled={isSubmitting} 
                    />
                 </div>
                 
                 {/* Options & Moderation Grid */}
                 <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${isAnonymous ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                    >
                      <div className="flex items-center gap-2">
                        {isAnonymous ? <Ghost size={14} /> : <User size={14} />}
                        <span className="text-[11px] font-bold">{t('expatDashboard.reviews.anonymous')}</span>
                      </div>
                      <div className={`w-6 h-3 rounded-full relative transition-colors ${isAnonymous ? 'bg-indigo-500' : 'bg-gray-200'}`}>
                         <div className={`absolute top-0.5 w-2 h-2 bg-white rounded-full transition-all ${isAnonymous ? 'right-0.5' : 'left-0.5'}`} />
                      </div>
                    </button>

                    <div className="flex items-center gap-2 p-2.5 bg-indigo-50/20 rounded-xl border border-indigo-50">
                       <Shield size={14} className="text-indigo-400 shrink-0" />
                       <p className="text-[7px] font-bold text-indigo-600/70 leading-tight uppercase tracking-tighter">{t('expatDashboard.reviews.manualVerification')}</p>
                    </div>
                 </div>

                 {/* Bouton d'action */}
                 <button 
                  disabled={reviewComment.length < 20 || isSubmitting} 
                  onClick={submitReview} 
                  className="w-full bg-black text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-3 active:scale-[0.98]"
                 >
                    {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <><Send size={16} />{t('expatDashboard.reviews.submitBtn')}</>}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ExpatDashboard;