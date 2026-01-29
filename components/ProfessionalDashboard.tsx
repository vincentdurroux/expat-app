import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Eye, Unlock, Star, ShieldCheck, Zap, Sparkles, X, Info, CreditCard, RefreshCw, Edit3, MapPin, Globe, ArrowLeft, Briefcase, Repeat, Clock, CheckCircle2, ShieldAlert, FileCheck, Signal, SignalLow, PieChart, ArrowUpRight, Camera, FileUp, Trophy, AlertCircle, Loader2, XCircle, User, MessageSquareQuote, Ghost, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Professional, UserType, Review } from '../types';
import ProProfileForm from './ProProfileForm';
import ProfessionalCard from './ProfessionalCard';
import { getProStats, uploadVerificationDocs, mapDBRowToPro, getProfessionalReviews } from '../services/userService';
import VerificationBanner from './VerificationBanner';
import ConfirmationModal from './ConfirmationModal';

interface ProfessionalDashboardProps {
  profile: any; 
  currentPlan?: string | null; 
  planStatus?: 'active' | 'cancelling' | null; 
  subscriptionEndsAt?: string | null; 
  cancelAtPeriodEnd?: boolean; 
  onUpgradeClick?: () => void; 
  onCancelPlan?: () => Promise<void>; 
  onReactivatePlan?: () => Promise<void>; 
  onUpdateFeatured?: (status: boolean) => Promise<void>;
  onBack?: () => void; 
  onUpdateComplete?: (data: any) => Promise<void>; 
  onUpdateProfile?: (data: any) => Promise<void>; 
  onSwitchRole?: (targetRole: UserType, e?: React.MouseEvent) => void; 
  onViewProfile: (pro: Professional) => void;
}

const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ 
  profile, 
  currentPlan, 
  planStatus,
  subscriptionEndsAt, 
  cancelAtPeriodEnd, 
  onUpgradeClick, 
  onCancelPlan, 
  onReactivatePlan, 
  onUpdateFeatured,
  onBack, 
  onUpdateComplete, 
  onUpdateProfile, 
  onSwitchRole, 
  onViewProfile 
}) => {
  const { t, i18n } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isForcingUpload, setIsForcingUpload] = useState(false);
  const [extendedStats, setExtendedStats] = useState<{profileViews: number, profileUnlocks: number} | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCancelFeaturedConfirm, setShowCancelFeaturedConfirm] = useState(false);
  const [isUpdatingFeatured, setIsUpdatingFeatured] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States pour les avis
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const fetchStats = async () => {
    if (profile?.id) {
      try {
        const stats = await getProStats(profile.id);
        setExtendedStats({
          profileViews: stats.profile_views,
          profileUnlocks: stats.profile_unlocks
        });
      } catch (err) {
        console.warn("Could not refresh stats", err);
      }
    }
  };

  // Chargement initial et Polling des stats toutes les 30 secondes
  useEffect(() => { 
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [profile?.id]);

  const completionPercentage = useMemo(() => {
    if (!profile) return 0;
    let score = 0;
    if (profile.full_name?.trim()) score += 10;
    if (profile.pro_image_url || profile.avatar_url) score += 10;
    if (profile.nationality || (Array.isArray(profile.nationality) && profile.nationality.length > 0)) score += 10;
    if (profile.phone?.trim()) score += 10;
    if (profile.professions?.length > 0) score += 10;
    if (profile.years_experience) score += 5;
    if (profile.bio?.length >= 20) score += 20; 
    if (profile.all_cities?.length > 0) score += 10;
    if (profile.languages?.length > 0) score += 10;
    if (profile.specialties?.length > 0) score += 5; 
    return Math.min(100, score);
  }, [profile]);

  const handleOpenReviews = async () => {
    if (!profile?.id) return;
    setShowReviewsModal(true);
    setIsLoadingReviews(true);
    try {
      const res = await getProfessionalReviews(profile.id, profile.id);
      setReviews(res);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const stats = useMemo(() => [
    { id: 'views', label: t('dashboard.stats.views'), value: extendedStats?.profileViews ?? Number(profile?.profileViews || profile?.profile_views || 0), icon: <Eye size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'leads', label: t('dashboard.stats.leads'), value: extendedStats?.profileUnlocks ?? Number(profile?.profileUnlocks || profile?.profile_unlocks || 0), icon: <Unlock size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'rating', label: t('dashboard.stats.rating'), value: (profile?.reviews_count || profile?.reviews) > 0 ? (profile?.rating || 5.0).toFixed(1) : t('common.noReviewsYet'), icon: <Star size={16} />, color: 'text-amber-600', bg: 'bg-amber-50', isClickable: true },
    { id: 'score', label: t('dashboard.completion.label'), value: `${completionPercentage}%`, icon: <PieChart size={16} />, color: 'text-indigo-600', bg: 'bg-indigo-50', isScore: true },
  ], [profile, extendedStats, completionPercentage, t]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !profile?.id) return;
    const files = Array.from(e.target.files) as File[];
    
    if (files.length > 3) {
      setUploadError(t('dashboard.verification.section.errorLimit'));
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    try {
      await uploadVerificationDocs(profile.id, files);
      if (onUpdateProfile) await onUpdateProfile({ verification_status: 'pending' });
      setIsForcingUpload(false);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("Erreur lors de l'envoi des fichiers.");
    } finally {
      setIsUploading(false);
    }
  };

  const normalizedPlanKey = useMemo(() => {
    if (!currentPlan) return null;
    const p = currentPlan.toLowerCase();
    if (p.includes('early') || p.includes('founding')) return 'early';
    if (p.includes('monthly')) return 'monthly';
    if (p.includes('elite') || p.includes('annual')) return 'elite';
    return p;
  }, [currentPlan]);

  const isElite = normalizedPlanKey === 'elite';
  const isFeatured = !!profile?.is_featured;
  const isEarly = normalizedPlanKey === 'early';
  
  // Featured possible si plan actif, et que ce n'est pas le plan gratuit (Membre Fondateur)
  const canBuyFeatured = planStatus === 'active' && !isFeatured && !isElite && !isEarly;

  const handleToggleFeatured = async () => {
    if (isUpdatingFeatured || !onUpdateFeatured) return;
    
    if (isFeatured) {
      setShowCancelFeaturedConfirm(true);
    } else {
      if (onUpgradeClick) onUpgradeClick();
    }
  };

  const confirmCancelFeatured = async () => {
    if (!onUpdateFeatured) return;
    setIsUpdatingFeatured(true);
    try {
      await onUpdateFeatured(false);
      setShowCancelFeaturedConfirm(false);
    } finally {
      setIsUpdatingFeatured(false);
    }
  };

  const proForCard: Professional = useMemo(() => mapDBRowToPro(profile), [profile, i18n.language]);

  if (isEditing) return <ProProfileForm initialData={proForCard} onComplete={async (d) => { if(onUpdateComplete) await onUpdateComplete(d); setIsEditing(false); }} onCancel={() => setIsEditing(false)} />;

  const verificationStatus = profile?.verification_status || 'none';

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-20 animate-in fade-in overflow-x-hidden">
      {onBack && <button onClick={onBack} className="mb-8 flex items-center gap-2 text-gray-400 hover:text-black font-black text-[10px] uppercase tracking-widest min-h-[44px]"><ArrowLeft size={16} /> {t('common.back')}</button>}
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div className="max-w-xl">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#1d1d1f] mb-2">{t('dashboard.proTitle')}</h1>
          <p className="text-gray-500 text-sm md:text-base font-bold">{t('dashboard.proSubtitle')}</p>
        </div>
        <div className={`px-4 py-3 rounded-2xl flex items-center gap-3 border shadow-sm self-start lg:self-center ${profile?.is_profile_online ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
          {profile?.is_profile_online ? <Signal size={18} className="animate-pulse" /> : <SignalLow size={18} />}
          <div>
            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-60 leading-none mb-1">{t('dashboard.visibility.label')}</div>
            <div className="text-xs font-black">{profile?.is_profile_online ? t('dashboard.visibility.online') : t('dashboard.visibility.masked')}</div>
          </div>
        </div>
      </div>

      <VerificationBanner 
        status={verificationStatus} 
        onAction={() => { 
          document.getElementById('verification-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }} 
      />

      <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 mb-10">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            onClick={() => {
              if (stat.isScore) setIsEditing(true);
              else if (stat.isClickable) handleOpenReviews();
            }} 
            className={`snap-center shrink-0 w-[65vw] sm:w-[280px] md:w-auto apple-card p-5 border border-gray-100 flex flex-col justify-between transition-all ${stat.isScore || stat.isClickable ? 'cursor-pointer hover:border-indigo-200 hover:shadow-md' : ''} bg-white`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center shadow-sm`}>{stat.icon}</div>
              {stat.isClickable && <ArrowUpRight size={14} className="text-gray-300" />}
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900 mb-0.5 truncate">{stat.value}</div>
              <div className="text-[10px] text-gray-400 font-black tracking-widest uppercase leading-tight">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-10">
          <div className="apple-card border border-gray-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-[22px] flex items-center justify-center shrink-0 shadow-inner"><CreditCard size={28} /></div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 leading-tight">{t('dashboard.plan.title')}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-3 py-1 rounded-lg text-[9px] font-black bg-gray-100 text-gray-500 uppercase tracking-widest">
                      {normalizedPlanKey ? t(`subscription.plans.${normalizedPlanKey}.name`) : t('dashboard.plan.none')}
                    </span>
                    {normalizedPlanKey && subscriptionEndsAt && (
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border ${cancelAtPeriodEnd ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        <Clock size={12} />
                        <span className="text-[9px] font-black uppercase tracking-tight">
                          {t('dashboard.plan.expires', { date: new Date(subscriptionEndsAt).toLocaleDateString() })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:items-center gap-3">
                {cancelAtPeriodEnd ? (
                  <button onClick={onReactivatePlan} className="bg-emerald-600 text-white px-6 py-3.5 rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-lg active:scale-0.97 flex items-center justify-center gap-2">
                    <RefreshCw size={18} /> {t('dashboard.plan.reactivate')}
                  </button>
                ) : normalizedPlanKey ? (
                  <button onClick={onCancelPlan} className="bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 px-6 py-3.5 rounded-2xl font-black text-sm transition-all active:scale-0.97">
                    {t('dashboard.plan.cancel')}
                  </button>
                ) : null}
                <button onClick={onUpgradeClick} className="bg-black text-white px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-gray-800 transition-all shadow-xl active:scale-0.97">
                  {normalizedPlanKey ? t('dashboard.plan.manage') : t('dashboard.plan.view')}
                </button>
              </div>
            </div>
          </div>

          <div className="apple-card border border-gray-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center shrink-0 shadow-inner ${isFeatured || isElite ? 'bg-violet-50 text-violet-600' : 'bg-gray-50 text-gray-400'}`}>
                  {isEarly ? <Lock size={28} className="text-gray-300" /> : <Sparkles size={28} fill={isFeatured || isElite ? "currentColor" : "none"} />}
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 leading-tight">{t('subscription.featuredBadge.title')}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {isElite ? t('subscription.featuredBadge.included') : isEarly ? t('subscription.featuredBadge.unavailable') : t('subscription.featuredBadge.desc')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {isElite ? (
                  <div className="px-6 py-3.5 bg-violet-50 text-violet-600 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 border border-violet-100">
                    <CheckCircle2 size={16} /> {t('subscription.featuredBadge.included')}
                  </div>
                ) : isFeatured ? (
                  <button 
                    onClick={handleToggleFeatured}
                    disabled={isUpdatingFeatured}
                    className="bg-white border border-red-100 text-red-500 hover:bg-red-50 px-6 py-3.5 rounded-2xl font-black text-sm transition-all active:scale-0.97 flex items-center justify-center gap-2"
                  >
                    {isUpdatingFeatured ? <Loader2 size={18} className="animate-spin" /> : <><XCircle size={18} /> {t('subscription.featuredBadge.deactivate')}</>}
                  </button>
                ) : isEarly ? (
                   <div className="px-6 py-3.5 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-gray-100 flex items-center gap-2">
                     <Lock size={12} /> {t('subscription.featuredBadge.unavailable')}
                   </div>
                ) : canBuyFeatured ? (
                  <button 
                    onClick={onUpgradeClick}
                    className="bg-violet-600 text-white hover:bg-violet-700 px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-xl shadow-violet-200 active:scale-0.97 flex items-center justify-center gap-2"
                  >
                    <Sparkles size={18} /> {t('subscription.featuredBadge.activate')}
                  </button>
                ) : (
                  <div className="px-6 py-3.5 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest border border-gray-100">
                    {t('subscription.launchOffer')}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="apple-card border border-gray-100 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-8">{t('proHome.badgesSection.title')}</h3>
            <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
              {[
                { id: 'f', icon: <Trophy size={24} />, label: t('proHome.badgesSection.early'), earned: normalizedPlanKey === 'early', color: 'text-blue-500', bg: 'bg-blue-50' },
                { id: 'v', icon: <ShieldCheck size={24} />, label: t('proHome.badgesSection.verified'), earned: verificationStatus === 'verified', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { id: 'r', icon: <Sparkles size={24} />, label: t('proHome.badgesSection.featured'), earned: isFeatured || isElite, color: 'text-violet-500', bg: 'bg-violet-50' }
              ].map(b => (
                <div key={b.id} className={`snap-center shrink-0 w-[70vw] sm:w-[240px] md:w-auto p-5 rounded-[28px] border-2 flex items-center gap-4 transition-all ${b.earned ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50 border-transparent opacity-40 grayscale'}`}>
                  <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center shrink-0 shadow-inner ${b.bg} ${b.color}`}>{b.icon}</div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-black text-gray-900 leading-tight truncate">{b.label}</span>
                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest mt-0.5">{b.earned ? t('proHome.badgesSection.earnedTag') : t('proHome.badgesSection.lockedTag')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {(verificationStatus !== 'verified' || isForcingUpload) && (
            <div id="verification-section" className="apple-card border border-gray-100 bg-white p-8 shadow-sm overflow-hidden relative transition-all duration-700">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-22 flex items-center justify-center shrink-0 shadow-inner ${
                      verificationStatus === 'pending' && !isForcingUpload ? 'bg-amber-50 text-amber-600' :
                      verificationStatus === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {verificationStatus === 'pending' && !isForcingUpload ? <Clock size={28} /> :
                       verificationStatus === 'rejected' ? <XCircle size={28} /> : <FileCheck size={28} />}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 leading-tight">{t('dashboard.verification.section.title')}</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{t('dashboard.verification.section.subtitle')}</p>
                    </div>
                  </div>
                  {isForcingUpload && (
                    <button 
                      onClick={() => setIsForcingUpload(false)}
                      className="p-3 text-gray-400 hover:text-black transition-all bg-gray-50 rounded-full"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>

                {verificationStatus === 'none' || verificationStatus === 'rejected' || isForcingUpload ? (
                  <div className="space-y-6">
                    <div 
                      className={`border-2 border-dashed rounded-[32px] p-12 flex flex-col items-center justify-center transition-all group ${isUploading ? 'bg-gray-50 border-gray-200' : 'bg-emerald-50/10 border-gray-100 cursor-pointer hover:bg-emerald-50/20 hover:border-emerald-200'}`}
                      onClick={() => !isUploading && fileInputRef.current?.click()}
                    >
                      <div className={`w-20 h-20 bg-white rounded-[24px] shadow-sm flex items-center justify-center mb-6 transition-all ${isUploading ? '' : 'text-gray-300 group-hover:scale-110 group-hover:text-emerald-500'}`}>
                        {isUploading ? <Loader2 className="animate-spin text-emerald-500" size={32} /> : <FileUp size={36} />}
                      </div>
                      <div className="text-center">
                        <p className="text-base font-black text-gray-900 mb-2">{isUploading ? t('auth.processing') : t('dashboard.verification.section.uploadBtn')}</p>
                        <p className="text-[10px] font-bold text-gray-400 max-w-sm mx-auto leading-relaxed">
                          {t('dashboard.verification.section.support')}
                        </p>
                      </div>
                      <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*,application/pdf" onChange={handleFileUpload} disabled={isUploading} />
                    </div>
                    {uploadError && (
                      <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-black uppercase tracking-widest animate-in slide-in-from-top-2">
                        <AlertCircle size={18} />
                        {uploadError}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-amber-50/50 border border-amber-100 rounded-[32px] p-10 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-white rounded-[24px] shadow-sm flex items-center justify-center mb-8 text-amber-500">
                      <Clock size={40} className="animate-pulse" />
                    </div>
                    <h4 className="text-xl font-black text-amber-900 mb-4">{t('dashboard.verification.banner.pending')}</h4>
                    <p className="text-sm text-amber-700/70 font-bold leading-relaxed max-w-sm mb-10">
                      {t('dashboard.verification.banner.pendingDesc')}
                    </p>
                    <button 
                      onClick={() => setIsForcingUpload(true)}
                      className="px-8 py-4 bg-white text-amber-600 border border-amber-200 rounded-[22px] font-black text-xs hover:bg-amber-50 transition-all shadow-sm flex items-center gap-3 active:scale-95"
                    >
                      <RefreshCw size={16} /> {t('dashboard.verification.section.editBtn')}
                    </button>
                  </div>
                )}
            </div>
          )}

          {verificationStatus === 'verified' && !isForcingUpload && (
            <div id="verification-section" className="apple-card border border-gray-100 bg-white p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-22 flex items-center justify-center shrink-0 shadow-inner">
                      <ShieldCheck size={28} />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl font-black text-gray-900 leading-tight">{t('dashboard.verification.banner.verified')}</h3>
                      <p className="text-xs text-gray-400 font-bold mt-1">Status: {t('common.verified')}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsForcingUpload(true)}
                    className="w-full sm:w-auto px-6 py-4 bg-gray-50 text-gray-500 rounded-22 font-black text-[11px] hover:bg-gray-100 hover:text-black transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={14} /> {t('dashboard.verification.section.editBtn')}
                  </button>
                </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 flex flex-col items-center gap-8 pb-24 lg:pb-0">
           <div className="apple-card border border-gray-100 bg-white p-4 md:p-8 shadow-sm flex flex-col w-full max-w-[320px] md:max-w-[340px] lg:sticky lg:top-28">
              <h4 className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4 md:mb-8 px-1 text-center">{t('dashboard.badges.livePreviewLabel')}</h4>
              <div className="w-full transition-transform hover:scale-[1.02] duration-500">
                <ProfessionalCard professional={proForCard} isUnlocked={true} isAuth={true} currentUserId={profile?.id} onUnlock={() => {}} onViewProfile={onViewProfile} isStatic={true} hideButtons={true} />
              </div>
              <div className="mt-4 md:mt-10 space-y-3 md:space-y-4 relative z-20">
                 <button onClick={() => onViewProfile(proForCard)} className="w-full px-6 py-4 md:px-8 md:py-5 bg-white border-2 border-gray-100 text-gray-900 rounded-[18px] md:rounded-[22px] font-black text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-3 md:gap-4 shadow-sm active:scale-0.97">
                   <User size={18} /> {t('common.viewProfile')}
                 </button>
                 <button onClick={() => setIsEditing(true)} className="w-full px-6 py-4 md:px-8 md:py-5 bg-black text-white rounded-[18px] md:rounded-[22px] font-black text-sm hover:bg-gray-800 transition-all flex items-center justify-center gap-3 md:gap-4 shadow-xl active:scale-0.97">
                   <Edit3 size={18} /> {t('dashboard.modifyProfile')}
                 </button>
              </div>
           </div>
        </div>
      </div>

      {showReviewsModal && (
        <div className="fixed inset-0 z-[600] flex items-end md:items-center justify-center p-0 md:p-6 transition-all animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowReviewsModal(false)} />
          
          <div className="relative w-full max-w-2xl h-[90vh] md:h-auto md:max-h-[85vh] bg-white rounded-t-[40px] md:rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
            <div className="md:hidden w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 shrink-0" />
            
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-50 bg-white sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shadow-inner">
                  <MessageSquareQuote size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 leading-tight">{t('common.reviews')}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {reviews.length} {t('expatHome.expertsOnSite').toLowerCase()}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowReviewsModal(false)}
                className="p-3 bg-gray-50 text-gray-400 hover:text-black rounded-full transition-all active:scale-90"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-10 space-y-6">
              {isLoadingReviews ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-indigo-500" size={40} />
                  <p className="text-xs font-black text-gray-300 uppercase tracking-[0.2em]">{t('admin.loading')}</p>
                </div>
              ) : reviews.length > 0 ? (
                reviews.map(review => (
                  <div key={review.id} className={`p-6 bg-white rounded-[32px] border shadow-sm relative overflow-hidden group transition-all hover:border-amber-100 ${
                    review.status === 'rejected' ? 'border-red-200 bg-red-50/20' : 
                    review.status === 'pending' ? 'border-amber-50 bg-amber-50/5' : 
                    'border-gray-100'
                  }`}>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex flex-col gap-1">
                        <div className={`text-xs font-black text-gray-900 ${review.isAnonymous ? 'flex items-center gap-2' : ''}`}>
                          {review.isAnonymous && <Ghost size={12} className="text-gray-300" />}
                          {review.isAnonymous ? t('common.anonymousExpat') : review.userName}
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={12} className={s <= review.stars ? 'fill-amber-400 text-amber-400' : 'text-gray-100'} />
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className={`w-9 h-9 rounded-full overflow-hidden bg-gray-50 border border-gray-100 shadow-sm flex items-center justify-center`}>
                          {review.isAnonymous ? (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50"><Ghost size={16} /></div>
                          ) : review.userAvatar ? (
                            <img src={review.userAvatar} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50"><User size={16} /></div>
                          )}
                        </div>
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className={`text-gray-700 text-sm md:text-base leading-relaxed italic font-medium ${review.status === 'rejected' ? 'opacity-50' : ''}`}>"{review.testimonies}"</p>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {review.status === 'pending' && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-wider border border-amber-100 animate-pulse">
                          <Clock size={12} /> {t('expatDashboard.reviews.status.pending')}
                        </div>
                      )}
                      {review.status === 'rejected' && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[9px] font-black uppercase tracking-wider border border-red-100">
                          <XCircle size={12} /> {t('expatDashboard.reviews.status.rejected')}
                        </div>
                      )}
                      {review.status === 'verified' && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-wider border border-emerald-100">
                          <ShieldCheck size={12} /> {t('common.verifiedReview')}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-100">
                  <MessageSquareQuote size={48} className="mx-auto text-gray-200 mb-6" />
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    {t('common.noReviewsYet')}
                  </p>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-gray-900 shrink-0 rounded-b-[40px] hidden md:block">
               <button 
                onClick={() => setShowReviewsModal(false)}
                className="w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-0.98"
               >
                 {t('common.close')}
               </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal 
        isOpen={showCancelFeaturedConfirm} 
        onClose={() => setShowCancelFeaturedConfirm(false)} 
        onConfirm={confirmCancelFeatured} 
        title={t('subscription.confirmCancelTitle')} 
        message={t('subscription.featuredBadge.cancelConfirm')} 
        confirmLabel={t('common.confirm')} 
        type="expat" 
      />
    </div>
  );
};

export default ProfessionalDashboard;