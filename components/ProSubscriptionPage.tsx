import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Check, Sparkles, ArrowLeft, Clock, RefreshCw, ChevronRight, Loader2, Star, Zap, Trophy, CheckCircle2, CreditCard, AlertCircle, Edit3, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProSubscriptionPageProps {
  profile: any;
  onSelect: (planId: string, withRecommended?: boolean) => void | Promise<void>; 
  onBack: () => void; 
  onGoToEdit?: () => void;
  onReactivate?: () => void; 
  currentPlan?: string | null; 
  planStatus?: 'active' | 'cancelling' | null; 
  cancelAtPeriodEnd?: boolean;
  isFeatured?: boolean;
}

const ProSubscriptionPage: React.FC<ProSubscriptionPageProps> = ({ 
  profile,
  onSelect, 
  onBack, 
  onGoToEdit,
  onReactivate, 
  currentPlan, 
  cancelAtPeriodEnd,
  isFeatured = false
}) => {
  const { t } = useTranslation();
  const [isSelecting, setIsSelecting] = useState<string | null>(null);
  
  // Normalisation du plan pour la logique interne
  const normalizedActivePlanKey = useMemo(() => {
    if (!currentPlan) return null;
    const p = currentPlan.toLowerCase();
    if (p.includes('early') || p.includes('founding')) return 'early';
    if (p.includes('monthly')) return 'monthly';
    if (p.includes('elite') || p.includes('annual')) return 'elite';
    return p;
  }, [currentPlan]);

  // États locaux de sélection
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(normalizedActivePlanKey);
  const [withFeaturedBadge, setWithFeaturedBadge] = useState(isFeatured);
  const hasInitialized = useRef(false);

  // Synchronisation avec les données du profil dès qu'elles sont disponibles
  useEffect(() => {
    if (normalizedActivePlanKey && !hasInitialized.current) {
      setSelectedPlanId(normalizedActivePlanKey);
      setWithFeaturedBadge(isFeatured);
      hasInitialized.current = true;
    }
  }, [normalizedActivePlanKey, isFeatured]);

  // Gestion des contraintes métier sur le badge selon le plan sélectionné
  useEffect(() => {
    // Seul le plan Founding (early) bloque le badge
    if (selectedPlanId === 'early') {
      setWithFeaturedBadge(false);
    }
  }, [selectedPlanId]);

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

  const isProfileIncomplete = completionPercentage < 85;

  const plans = useMemo(() => {
    const getFeatures = (key: string) => {
      const f = t(key, { returnObjects: true });
      return Array.isArray(f) ? f : [];
    };

    return [
      { 
        id: 'early', 
        rpcName: 'Founding Member', 
        name: t('subscription.plans.early.name'), 
        basePrice: 0,
        description: t('subscription.plans.early.desc'), 
        features: getFeatures('subscription.plans.early.features'), 
        cta: t('subscription.plans.early.cta'), 
        highlight: true, 
        isAvailable: true, 
        statusBadge: t('subscription.freeDuration'),
        icon: <Clock className="text-emerald-500" size={24} />,
        billingNote: t('subscription.billing.free'),
        months: 6
      },
      { 
        id: 'monthly', 
        rpcName: 'Monthly Pro', 
        name: t('subscription.plans.monthly.name'), 
        basePrice: 25,
        description: t('subscription.plans.monthly.desc'), 
        features: getFeatures('subscription.plans.monthly.features'), 
        cta: t('subscription.plans.monthly.cta'), 
        isAvailable: false, 
        statusBadge: t('subscription.comingSoon'),
        icon: <Zap className="text-blue-500" size={24} />,
        billingNote: t('subscription.billing.monthly'),
        months: 1
      },
      { 
        id: 'elite', 
        rpcName: 'Annual Pro', 
        name: t('subscription.plans.elite.name'), 
        basePrice: 20,
        description: t('subscription.plans.elite.desc'), 
        features: getFeatures('subscription.plans.elite.features'), 
        cta: t('subscription.plans.elite.cta'), 
        isAvailable: false, 
        statusBadge: t('subscription.comingSoon'),
        icon: <Trophy className="text-indigo-500" size={24} />,
        billingNote: t('subscription.billing.savings'),
        months: 12,
        comparePrice: 25 
      }
    ];
  }, [t]);

  const currentSelectedPlan = useMemo(() => {
    return plans.find(p => p.id === selectedPlanId);
  }, [selectedPlanId, plans]);

  // Désactivé uniquement pour le plan early
  const isFeaturedToggleDisabled = selectedPlanId === 'early';

  const currentBadgePrice = useMemo(() => {
    return selectedPlanId === 'elite' ? 5 : 10;
  }, [selectedPlanId]);

  // Montant mensuel unitaire (Plan + Badge)
  const monthlyUnitTotal = useMemo(() => {
    if (!currentSelectedPlan) return withFeaturedBadge ? 10 : 0;
    return currentSelectedPlan.basePrice + (withFeaturedBadge ? currentBadgePrice : 0);
  }, [currentSelectedPlan, withFeaturedBadge, currentBadgePrice]);

  // Montant total à régler immédiatement (Mensuel x Nb mois engagement)
  const upfrontTotalToPay = useMemo(() => {
    if (!currentSelectedPlan) return monthlyUnitTotal;
    return monthlyUnitTotal * currentSelectedPlan.months;
  }, [currentSelectedPlan, monthlyUnitTotal]);

  // On considère que c'est la config active si le plan ET le statut featured correspondent
  const isCurrentActiveConfig = useMemo(() => {
    return selectedPlanId === normalizedActivePlanKey && withFeaturedBadge === isFeatured;
  }, [selectedPlanId, normalizedActivePlanKey, withFeaturedBadge, isFeatured]);

  const handlePay = async () => {
    if (!currentSelectedPlan || !!isSelecting || isProfileIncomplete || (!currentSelectedPlan.isAvailable && !isCurrentActiveConfig) || isCurrentActiveConfig) return;
    
    setIsSelecting(currentSelectedPlan.id);
    try { 
      await onSelect(currentSelectedPlan.rpcName, withFeaturedBadge); 
    } finally { 
      setIsSelecting(null); 
    }
  };

  const isUpfrontPlan = currentSelectedPlan && currentSelectedPlan.months > 1;

  return (
    <div className="min-h-screen bg-[#fbfbfd] px-4 md:px-6 pt-24 md:pt-32 pb-64 animate-in fade-in overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-black font-black text-[10px] uppercase tracking-widest group transition-all">
            <ArrowLeft size={20} className="group-hover:-translate-x-1" /> {t('common.back')}
          </button>
          
          <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md border border-gray-100 px-5 py-2 rounded-full shadow-sm">
             <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('dashboard.completion.label')}</div>
             <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${isProfileIncomplete ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ width: `${completionPercentage}%` }} />
             </div>
             <span className={`text-xs font-black ${isProfileIncomplete ? 'text-amber-600' : 'text-emerald-600'}`}>{completionPercentage}%</span>
          </div>
        </div>
        
        {isProfileIncomplete && (
          <div className="max-w-3xl mx-auto mb-16 p-6 md:p-8 bg-amber-50 border-2 border-amber-200 rounded-[32px] shadow-xl shadow-amber-900/5 flex flex-col md:flex-row items-center gap-6 animate-in slide-in-from-top-4 duration-700">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm shrink-0">
              <AlertCircle size={32} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-black text-amber-900 mb-2">Profil incomplet ({completionPercentage}%)</h3>
              <p className="text-sm text-amber-800/70 font-medium leading-relaxed">
                Pour garantir la qualité de l'annuaire, vous devez compléter votre profil à au moins <b>85%</b> avant de pouvoir souscrire à un plan de visibilité.
              </p>
            </div>
            <button 
              onClick={onGoToEdit}
              className="px-8 py-4 bg-amber-600 text-white rounded-2xl font-black text-sm hover:bg-amber-700 transition-all shadow-lg active:scale-95 flex items-center gap-2 whitespace-nowrap"
            >
              <Edit3 size={18} /> Compléter mon profil
            </button>
          </div>
        )}

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-2 rounded-full text-[10px] font-black uppercase mb-6 shadow-sm border border-emerald-100">
            <Sparkles size={16} /> {t('subscription.launchOffer')}
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">{t('subscription.chooseVisibility')}</h1>
          
          <div className={`max-w-md mx-auto mb-10 p-1.5 bg-white border rounded-[28px] shadow-xl flex items-center justify-between group transition-all duration-300 ${isFeaturedToggleDisabled ? 'opacity-50 grayscale' : ''} ${withFeaturedBadge ? 'border-violet-200' : 'border-gray-100'}`}>
            <div className="flex items-center gap-4 px-6">
              <div className={`p-2 rounded-xl transition-all ${withFeaturedBadge ? 'bg-violet-100 text-violet-600' : 'bg-gray-100 text-gray-400'}`}>
                {isFeaturedToggleDisabled && selectedPlanId === 'early' ? <Lock size={20} /> : <Sparkles size={20} fill={withFeaturedBadge ? "currentColor" : "none"} />}
              </div>
              <div className="text-left">
                <div className="text-xs font-black uppercase tracking-tight text-gray-900">{t('subscription.featuredBadge.title')}</div>
                <div className="text-[9px] font-bold text-violet-500 uppercase tracking-widest">
                  {selectedPlanId === 'early' ? t('subscription.featuredBadge.unavailable') : `${currentBadgePrice}€ / ${t('subscription.billing.perMonth')} — ${t('subscription.featuredBadge.desc')}`}
                </div>
              </div>
            </div>
            <button 
              disabled={isFeaturedToggleDisabled}
              onClick={() => setWithFeaturedBadge(!withFeaturedBadge)}
              className={`relative inline-flex h-9 w-16 items-center rounded-full transition-all duration-500 outline-none ${withFeaturedBadge ? 'bg-violet-600 shadow-lg shadow-violet-200' : 'bg-gray-100'} ${isFeaturedToggleDisabled ? 'cursor-not-allowed' : ''}`}
            >
              <span className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-md transition-all duration-500 ${withFeaturedBadge ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>

          <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: t('subscription.launchPhaseDesc') }} />
        </div>

        <div className="relative">
          <div className="flex overflow-x-auto md:overflow-x-visible pt-8 pb-12 md:pb-0 gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 items-stretch no-scrollbar snap-x snap-mandatory px-2 md:px-0">
            {plans.map(plan => {
              const isActive = plan.id === normalizedActivePlanKey;
              const isSelected = plan.id === selectedPlanId;
              const isCancelling = isActive && cancelAtPeriodEnd;
              
              const badgePriceForThisPlan = plan.id === 'elite' ? 5 : 10;
              const cardPrice = plan.basePrice + (withFeaturedBadge ? badgePriceForThisPlan : 0);
              
              return (
                <div 
                  key={plan.id} 
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`apple-card shrink-0 w-[85vw] sm:w-[320px] md:w-full snap-center p-8 flex flex-col border-2 transition-all duration-500 relative cursor-pointer ${
                    isSelected ? 'border-indigo-600 shadow-2xl z-10 scale-[1.02]' : isActive ? 'border-emerald-500' : 'border-gray-100 shadow-sm opacity-80 hover:opacity-100'
                  } bg-white`}
                >
                  {plan.statusBadge && (
                    <div className={`absolute -top-3 left-6 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md z-20 border-2 border-white ${isSelected ? 'bg-indigo-600 text-white' : plan.highlight ? 'bg-emerald-600 text-white' : 'bg-gray-600 text-white'}`}>
                      {plan.statusBadge}
                    </div>
                  )}

                  <div className="mb-6 flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-black text-gray-900">{plan.name}</h3>
                      <p className="text-gray-400 text-[10px] mt-1 font-bold uppercase tracking-tight">{plan.description}</p>
                    </div>
                    <div className="shrink-0 p-2 bg-gray-50 rounded-xl">{plan.icon}</div>
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      {plan.comparePrice && (
                        <span className="text-2xl font-bold text-gray-300 line-through mr-2">{plan.comparePrice}€</span>
                      )}
                      <span className="text-4xl md:text-5xl font-black text-gray-900 transition-all duration-300">{cardPrice.toFixed(0)}</span>
                      <span className="text-xl font-black text-gray-900">€</span>
                      <span className="text-xs font-bold text-gray-400 ml-1 lowercase">{t('subscription.billing.perMonth')}</span>
                    </div>
                    <div className="mt-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {plan.id === 'elite' 
                        ? t('subscription.billing.total', { amount: plan.basePrice * plan.months }) 
                        : plan.billingNote}
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-10 flex-1">
                    {plan.features.map((f: string) => (
                      <div key={f} className="flex items-start gap-3 text-[13px] font-bold text-gray-600 leading-snug">
                        <div className={`mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${isSelected ? 'bg-indigo-50' : 'bg-gray-50'}`}>
                          <Check size={10} className={isSelected ? 'text-indigo-600' : 'text-gray-400'} />
                        </div>
                        <span>{f}</span>
                      </div>
                    ))}
                    {withFeaturedBadge && plan.id !== 'early' && (
                      <div className="flex items-start gap-3 text-[13px] font-black text-violet-600 leading-snug animate-in fade-in slide-in-from-left-2">
                        <div className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-violet-50 flex items-center justify-center">
                          <Sparkles size={10} fill="currentColor" />
                        </div>
                        <span>+ {t('subscription.featuredBadge.title')}</span>
                      </div>
                    )}
                  </div>

                  {isActive && (
                    <div className="text-center px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                      {isCancelling ? t('common.reactivate') : t('common.activePlan')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 p-10 bg-white/50 rounded-[40px] border border-gray-100 text-center shadow-sm">
          <h4 className="text-xl font-black mb-3 text-gray-900">{t('subscription.whyDisabledTitle')}</h4>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto font-medium leading-relaxed">{t('subscription.whyDisabledDesc')}</p>
        </div>
      </div>

      {selectedPlanId !== null && (
        <div className="fixed bottom-8 left-0 right-0 z-[100] px-4 animate-in slide-in-from-bottom-8 duration-500">
          <div className="max-w-4xl mx-auto bg-white border border-gray-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] rounded-[32px] md:rounded-[40px] p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-8 backdrop-blur-xl bg-white/95">
            <div className="flex flex-col sm:flex-row gap-8 md:gap-12 w-full sm:w-auto">
              <div className="text-center sm:text-left">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('subscription.summary.planPrice')}</div>
                <div className="text-xl font-black text-gray-900">{currentSelectedPlan?.basePrice || 0}€ <span className="text-[10px] text-gray-400 font-bold">/ mois</span></div>
              </div>
              
              {withFeaturedBadge && selectedPlanId !== 'early' && (
                <div className="text-center sm:text-left">
                  <div className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-1 flex items-center justify-center sm:justify-start gap-1">
                    <Sparkles size={10} fill="currentColor" /> {t('subscription.summary.badgePrice')}
                  </div>
                  <div className="text-xl font-black text-violet-600">{currentBadgePrice}€ <span className="text-[10px] text-violet-400 font-bold">/ mois</span></div>
                </div>
              )}

              <div className="text-center sm:text-left border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-8">
                <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">
                  {isUpfrontPlan ? t('subscription.summary.totalUpfront') : t('subscription.summary.totalMonthly')}
                </div>
                <div className="text-3xl font-black text-indigo-700">{upfrontTotalToPay}€</div>
                {isUpfrontPlan && (
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tight mt-1">
                    {currentSelectedPlan?.months === 12 ? t('subscription.billing.fullYear') : t('subscription.billing.halfYear')}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button 
                onClick={handlePay}
                disabled={!!isSelecting || isProfileIncomplete || (!currentSelectedPlan?.isAvailable && !isCurrentActiveConfig) || isCurrentActiveConfig}
                className={`w-full sm:w-auto px-10 py-5 rounded-[22px] font-black text-lg flex items-center justify-center gap-4 transition-all shadow-xl active:scale-95 disabled:opacity-50 ${
                  isCurrentActiveConfig ? 'bg-emerald-50 text-emerald-600 cursor-default shadow-none border border-emerald-100' :
                  isProfileIncomplete || (!currentSelectedPlan?.isAvailable && !isCurrentActiveConfig) ? 'bg-gray-400 cursor-not-allowed' : 
                  'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {isSelecting ? <Loader2 className="animate-spin" /> : 
                 isCurrentActiveConfig ? <><CheckCircle2 size={24} /> {t('common.activePlan')}</> :
                 !currentSelectedPlan?.isAvailable ? t('subscription.comingSoon') :
                 <><CreditCard size={24} /> {t('subscription.summary.payBtn')}</>}
              </button>
              {isProfileIncomplete && (
                <p className="text-[9px] font-bold text-amber-600 text-center uppercase tracking-tighter">Profil incomplet requis (85% min)</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProSubscriptionPage;