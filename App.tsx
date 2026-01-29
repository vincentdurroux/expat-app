import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import ExpatHome from './components/ExpatHome';
import ProHome from './components/ProHome';
import ProfileModal from './components/ProfileModal';
import AuthView from './components/AuthView';
import ExpatDashboard from './components/ExpatDashboard';
import ProfessionalDashboard from './components/ProfessionalDashboard';
import HowItWorks from './components/HowItWorks';
import CreditsPage from './components/CreditsPage';
import ProfilePage from './components/ProfilePage';
import ProSubscriptionPage from './components/ProSubscriptionPage';
import EarlyMemberPage from './components/EarlyMemberPage';
import ProProfileForm from './components/ProProfileForm';
import Toast, { ToastType } from './components/Toast';
import ConfirmationModal from './components/ConfirmationModal';
import ThinkingLoader from './components/ThinkingLoader';
import { UserType, Professional, SearchFilters, UnlockToken, Review } from './types';
import { useTranslation } from 'react-i18next';
import { authService } from './services/authService';
import { SPANISH_CITY_DATA } from './constants';
import { 
  getUserProfile, 
  updateUserProfile, 
  getUnlockedPros, 
  getUserReviews, 
  getActiveProfessionalProfiles,
  getProfessionalsByIds,
  updateUserPlan,
  saveCompleteProProfile,
  updateUserCredits,
  saveUnlock,
  submitProfessionalReview,
  setUserRole,
  deleteUserProfile,
  cancelUserPlan,
  reactivateUserPlan,
  updateFeaturedStatus,
  incrementProfileViews,
  incrementProfileUnlocks,
  getProfessionalsWithDistance,
  calculateDistance,
  getFullProfessionalDetails,
  initMockProfessionals
} from './services/userService';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentView, _setCurrentView] = useState<string>('landing');
  const [user, setUser] = useState<any>(null);
  const [dbProfile, setDbProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [toast, setToast] = useState<{message: string, type: ToastType} | null>(null);
  const [credits, setCredits] = useState(0); 
  const [preferredCity, setPreferredCity] = useState('');
  const [unlockedPros, setUnlockedPros] = useState<Record<string, UnlockToken>>({});
  const [unlockedProfessionalList, setUnlockedProfessionalList] = useState<Professional[]>([]);
  const [userReviews, setReviewList] = useState<Review[]>([]);
  const [allRealPros, setAllRealPros] = useState<Professional[]>([]);
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  const [homeSearchResults, setHomeSearchResults] = useState<Professional[] | null>(null);
  const [lastSearchOrigin, setLastSearchOrigin] = useState<string | undefined>(undefined);

  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [processingMessage, setProcessingMessage] = useState<string | undefined>(undefined);
  
  const [pendingProUnlock, setPendingProUnlock] = useState<string | null>(null);
  const [showSwitchToProConfirm, setShowSwitchToProConfirm] = useState(false);
  const [showSwitchToExpatConfirm, setShowSwitchToExpatConfirm] = useState(false);
  const [showCancelPlanConfirm, setShowCancelPlanConfirm] = useState(false);
  const [showReactivatePlanConfirm, setShowReactivatePlanConfirm] = useState(false);

  const currentViewRef = useRef(currentView);
  const isSyncing = useRef(false);
  const mapsInjectedRef = useRef(false);
  const initialProsLoaded = useRef(false);

  const DEFAULT_COORDS = { lat: 40.4168, lng: -3.7038 };

  const setCurrentView = (view: string) => {
    currentViewRef.current = view;
    _setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (mapsInjectedRef.current) return;
    const lang = i18n.language ? i18n.language.split('-')[0] : 'en';
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAYj0jSQ1UkZURN0xB9RN4fSXZQSuV_llM&libraries=places&language=${lang}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    mapsInjectedRef.current = true;
  }, [i18n.language]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserCoords(DEFAULT_COORDS),
        { enableHighAccuracy: false, timeout: 5000 }
      );
    } else {
      setUserCoords(DEFAULT_COORDS);
    }
  }, []);

  useEffect(() => {
    initMockProfessionals();
  }, []);

  useEffect(() => {
    if (initialProsLoaded.current) return;
    const loadData = async () => {
      try {
        const pros = await getActiveProfessionalProfiles();
        setAllRealPros(pros);
        initialProsLoaded.current = true;
      } catch (e) {}
    };
    loadData();
  }, []);

  const updateListWithDistances = useCallback((list: Professional[], center?: {lat: number, lng: number}) => {
    const origin = center || userCoords || DEFAULT_COORDS;
    
    return list.map(p => {
      let lat = p.latitude ? Number(p.latitude) : null;
      let lng = p.longitude ? Number(p.longitude) : null;

      if ((lat === null || lng === null || isNaN(lat)) && p.cities && p.cities.length > 0) {
        const cityName = p.cities[0];
        const cityData = SPANISH_CITY_DATA[cityName];
        if (cityData) {
          lat = Number(cityData.lat);
          lng = Number(cityData.lng);
        }
      }

      if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
        return { 
          ...p, 
          distance_km: calculateDistance(Number(origin.lat), Number(origin.lng), lat, lng) 
        };
      }
      return p;
    });
  }, [userCoords]);

  const syncIdentity = useCallback(async (session: any) => {
    if (isSyncing.current) return;
    isSyncing.current = true;
    
    try {
      if (!session?.user) {
        setUser(null); setDbProfile(null); setUserType(null);
        setLoading(false);
        return;
      }

      setUser(session.user);
      const profile = await getUserProfile(session.user.id);
      if (profile) {
        setDbProfile(profile);
        setCredits(profile.credits || 0);
        setPreferredCity(profile.preferred_city || '');
        const role = profile.is_pro ? 'pro' : 'expat';
        setUserType(role);

        const current = currentViewRef.current;
        if (current === 'auth' || current === 'landing') {
          if (profile.role_selected) {
            setCurrentView(profile.is_pro ? (profile.is_pro_complete ? 'pro-home' : 'pro-onboarding') : 'expat-home');
          } else if (current === 'auth') {
            setCurrentView('landing');
          }
        }

        const [unlockedRes, reviewsRes] = await Promise.allSettled([
          getUnlockedPros(session.user.id),
          getUserReviews(session.user.id)
        ]);
        
        if (unlockedRes.status === 'fulfilled') {
          setUnlockedPros(unlockedRes.value);
          const ids = Object.keys(unlockedRes.value);
          if (ids.length > 0) {
            const details = await getProfessionalsByIds(ids);
            setUnlockedProfessionalList(updateListWithDistances(details));
          }
        }
        if (reviewsRes.status === 'fulfilled') setReviewList(reviewsRes.value);
      } else {
        if (currentViewRef.current === 'auth') setCurrentView('landing');
      }
    } finally { 
      setLoading(false); 
      setIsProcessingAction(false);
      isSyncing.current = false; 
    }
  }, [updateListWithDistances]);

  useEffect(() => {
    let mounted = true;
    authService.getSession().then(session => { if (mounted) syncIdentity(session); });
    const sub = authService.onAuthStateChange((session) => { if (mounted) syncIdentity(session); });
    return () => { mounted = false; if(sub) sub.unsubscribe(); };
  }, [syncIdentity]);

  const handleLogout = async () => {
    setIsProcessingAction(true);
    try {
      await authService.signOut();
      setUser(null); setDbProfile(null); setUserType(null); setCredits(0);
      setUnlockedPros({}); setUnlockedProfessionalList([]); setHomeSearchResults(null);
      setCurrentView('landing');
    } finally { setIsProcessingAction(false); }
  };

  const handleSearch = async (filters: SearchFilters & { lat?: number; lng?: number; locationName?: string }) => {
    setIsSearching(true);
    try {
      const searchLat = Number(filters.lat || userCoords?.lat || DEFAULT_COORDS.lat);
      const searchLng = Number(filters.lng || userCoords?.lng || DEFAULT_COORDS.lng);
      const results = await getProfessionalsWithDistance(searchLat, searchLng, filters.profession, filters.language);
      
      setLastSearchOrigin(filters.locationName || undefined);
      setHomeSearchResults(updateListWithDistances(results, { lat: searchLat, lng: searchLng }));
    } catch (err) { 
      setHomeSearchResults([]); 
    } finally { 
      setIsSearching(false); 
    }
  };

  const handleUnlock = (proId: string) => {
    if (!user) { setCurrentView('auth'); return; }
    if (user.id === proId) return;
    if (credits < 1) { setToast({ message: t('notifications.noCredits'), type: 'error' }); setCurrentView('credits'); return; }
    setPendingProUnlock(proId);
  };

  const handleConfirmUnlock = async () => {
    if (!pendingProUnlock || !user) return;
    const proId = pendingProUnlock;
    setPendingProUnlock(null);
    setIsProcessingAction(true);
    try {
      await saveUnlock(user.id, proId);
      await updateUserCredits(user.id, credits - 1);
      setCredits(credits - 1);
      
      await incrementProfileUnlocks(proId);
      
      const session = await authService.getSession();
      await syncIdentity(session);
      setRefreshTrigger(prev => prev + 1);
      setToast({ message: t('notifications.unlocked'), type: 'success' });
    } catch (err) { 
      setToast({ message: t('notifications.unlockError'), type: 'error' }); 
    } finally { 
      setIsProcessingAction(false); 
    }
  };

  const handleViewProfile = async (pro: Professional) => {
    setSelectedPro(pro);
    
    if (pro.id) {
      incrementProfileViews(pro.id).catch(e => console.warn("Stats increment error:", e));
    }

    try {
      const fullDetails = await getFullProfessionalDetails(pro.id);
      if (fullDetails) {
        setSelectedPro(fullDetails);
      }
    } catch (err) {}
  };

  const handleUpdateProfile = async (data: any) => {
    if (!user) return;
    setIsProcessingAction(true);
    try {
      const updated = await updateUserProfile(user.id, data);
      setDbProfile(updated);
      setToast({ message: t('notifications.profileSaved'), type: 'success' });
    } finally { setIsProcessingAction(false); }
  };

  const handleProUpdateComplete = async (proData: any) => {
    if (!user) return;
    setIsProcessingAction(true); 
    setProcessingMessage(t('notifications.creatingProfile'));
    try {
      await saveCompleteProProfile(user.id, { 
        ...proData, 
        is_pro: true, 
        is_pro_complete: true, 
        role_selected: true
      });
      const updated = await getUserProfile(user.id);
      setDbProfile(updated); 
      setUserType('pro');
      setCurrentView(updated.is_pro_complete ? 'pro-home' : 'pro-dashboard');
      setToast({ message: t('notifications.profileSaved'), type: 'success' });
    } finally { 
      setIsProcessingAction(false); 
      setProcessingMessage(undefined); 
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    setIsProcessingAction(true);
    try {
      await deleteUserProfile(user.id);
      await authService.signOut();
      setUser(null); setDbProfile(null); setCredits(0);
      setCurrentView('landing');
    } finally { setIsProcessingAction(false); }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <Header user={user} profile={dbProfile} credits={credits} userType={userType} currentView={currentView} onLogoClick={() => setCurrentView(!user || !dbProfile?.role_selected ? 'landing' : (dbProfile.is_pro ? 'pro-home' : 'expat-home'))} onHowItWorksClick={() => setCurrentView('how-it-works')} onDashboardClick={() => setCurrentView(userType === 'pro' ? 'pro-dashboard' : 'expat-dashboard')} onAddCredits={() => setCurrentView('credits')} onSignUpClick={() => setCurrentView('auth')} onEarlyMemberClick={() => setCurrentView('early-member')} onSubscriptionClick={() => setCurrentView('subscription')} onSwitchMode={(target) => target === 'pro' ? setShowSwitchToProConfirm(true) : setShowSwitchToExpatConfirm(true)} onLogout={handleLogout} onProfileClick={() => setCurrentView('profile')} />
      <main className="min-h-[calc(100vh-80px)]">
        {loading && <ThinkingLoader />}
        {currentView === 'landing' && <LandingPage onSignUp={(role) => { if(!user) setCurrentView('auth'); else { setIsProcessingAction(true); setUserRole(user.id, role).then(() => authService.getSession().then(syncIdentity)); } }} onSearch={handleSearch} onLearnEarlyMember={() => setCurrentView('early-member')} searchResults={homeSearchResults} searchOriginName={lastSearchOrigin} onClearSearch={() => setHomeSearchResults(null)} isSearching={isSearching} onUnlock={handleUnlock} isAuth={!!user} onViewProfile={handleViewProfile} currentUserId={user?.id} unlockedPros={unlockedPros} />}
        {currentView === 'auth' && <AuthView onAuthSuccess={() => { setIsProcessingAction(true); }} onBack={() => setCurrentView('landing')} />}
        {currentView === 'expat-home' && <ExpatHome userName={dbProfile?.full_name || user?.user_metadata?.full_name} credits={credits} unlockedCount={Object.keys(unlockedPros).length} preferredCity={preferredCity} allRealPros={updateListWithDistances(allRealPros)} onSearch={handleSearch} onGoToDashboard={() => setCurrentView('expat-dashboard')} onAddCredits={() => setCurrentView('credits')} onSwitchToPro={() => setShowSwitchToProConfirm(true)} searchResults={homeSearchResults} searchOriginName={lastSearchOrigin} onClearSearch={() => setHomeSearchResults(null)} unlockedPros={unlockedPros} onUnlock={handleUnlock} onViewProfile={handleViewProfile} isSearching={isSearching} onMessagePro={() => {}} onSetSearchResults={(pros, origin) => { setHomeSearchResults(pros); setLastSearchOrigin(origin); }} currentUserId={user?.id} />}
        {currentView === 'pro-home' && <ProHome userName={dbProfile?.full_name || user?.user_metadata?.full_name} profile={dbProfile} onGoToDashboard={() => setCurrentView('pro-dashboard')} onEditProfile={() => setCurrentView('pro-onboarding')} onUpgrade={() => setCurrentView('subscription')} onSwitchToExpat={() => setShowSwitchToExpatConfirm(true)} />}
        {currentView === 'expat-dashboard' && <ExpatDashboard credits={credits} unlockedPros={unlockedPros} unlockedProfessionalList={unlockedProfessionalList} userReviews={userReviews} preferredCity={preferredCity} onUpdateCity={(city) => { updateUserProfile(user.id, { preferred_city: city }); setPreferredCity(city); }} onFindPros={() => setCurrentView('expat-home')} onAddCredits={() => setCurrentView('credits')} onMessagePro={() => {}} onSubmitReview={async (proId, stars, comment, type, anon) => { setIsProcessingAction(true); try { await submitProfessionalReview(user.id, proId, stars, comment, type, anon); const session = await authService.getSession(); await syncIdentity(session); } finally { setIsProcessingAction(false); } }} onSwitchToPro={() => setShowSwitchToProConfirm(true)} onViewProfile={handleViewProfile} onBack={() => setCurrentView('expat-home')} onTriggerSearch={handleSearch} />}
        {currentView === 'pro-dashboard' && <ProfessionalDashboard profile={dbProfile} currentPlan={dbProfile?.pro_plan} planStatus={dbProfile?.plan_status} subscriptionEndsAt={dbProfile?.subscription_ends_at} cancelAtPeriodEnd={dbProfile?.cancel_at_period_end} onUpgradeClick={() => setCurrentView('subscription')} onCancelPlan={async () => setShowCancelPlanConfirm(true)} onReactivatePlan={async () => setShowReactivatePlanConfirm(true)} onUpdateFeatured={(s) => updateFeaturedStatus(user.id, s).then(setDbProfile)} onUpdateComplete={handleProUpdateComplete} onUpdateProfile={handleUpdateProfile} onSwitchRole={() => setShowSwitchToExpatConfirm(true)} onViewProfile={handleViewProfile} />}
        {currentView === 'pro-onboarding' && <ProProfileForm initialData={dbProfile} onComplete={handleProUpdateComplete} onCancel={() => setCurrentView(dbProfile?.role_selected ? (dbProfile.is_pro ? 'pro-home' : 'expat-home') : 'landing')} />}
        {currentView === 'how-it-works' && <HowItWorks onBack={() => setCurrentView(dbProfile?.role_selected ? (dbProfile.is_pro ? 'pro-home' : 'expat-home') : 'landing')} onBuyCredits={() => setCurrentView('credits')} />}
        {currentView === 'credits' && <CreditsPage currentCredits={credits} isAuth={!!user} isRoleSelected={!!dbProfile?.role_selected} onAuthRequired={() => setCurrentView('auth')} onPurchase={async (amount) => { if (!dbProfile?.role_selected) return; setIsProcessingAction(true); try { await updateUserCredits(user.id, credits + amount); setCredits(credits + amount); setCurrentView(dbProfile.is_pro ? 'pro-dashboard' : 'expat-dashboard'); } finally { setIsProcessingAction(false); } }} onBack={() => setCurrentView(dbProfile?.role_selected ? (dbProfile.is_pro ? 'pro-dashboard' : 'expat-dashboard') : 'landing')} />}
        {currentView === 'profile' && <ProfilePage user={user} userType={userType} onUpdateProfile={handleUpdateProfile} onSwitchRole={async (role) => { setIsProcessingAction(true); try { await setUserRole(user.id, role); const updated = await getUserProfile(user.id); setDbProfile(updated); setUserType(role); } finally { setIsProcessingAction(false); } }} onDeleteProfile={handleDeleteAccount} onBack={() => setCurrentView(dbProfile?.role_selected ? (dbProfile.is_pro ? 'pro-home' : 'expat-home') : 'landing')} onLogout={handleLogout} />}
        {currentView === 'subscription' && <ProSubscriptionPage profile={dbProfile} onSelect={async (p, f) => { setIsProcessingAction(true); try { await updateUserPlan(user.id, p); if (f !== undefined) await updateFeaturedStatus(user.id, f); const updated = await getUserProfile(user.id); setDbProfile(updated); setCurrentView('pro-dashboard'); } finally { setIsProcessingAction(false); } }} onReactivate={() => setShowReactivatePlanConfirm(true)} onBack={() => setCurrentView('pro-dashboard')} onGoToEdit={() => setCurrentView('pro-onboarding')} currentPlan={dbProfile?.pro_plan} planStatus={dbProfile?.plan_status} cancelAtPeriodEnd={dbProfile?.cancel_at_period_end} isFeatured={dbProfile?.is_featured} />}
        {currentView === 'early-member' && <EarlyMemberPage isPro={userType === 'pro'} isSubscribed={!!dbProfile?.is_subscribed} onJoin={() => setCurrentView(user ? 'pro-onboarding' : 'auth')} onGoToDashboard={() => setCurrentView('pro-dashboard')} onBack={() => setCurrentView(dbProfile?.role_selected ? (dbProfile.is_pro ? 'pro-home' : 'expat-home') : 'landing')} />}
      </main>
      <Footer />
      {selectedPro && <ProfileModal pro={selectedPro} isUnlocked={!!unlockedPros[selectedPro.id]} isAuth={!!user} isOwner={user?.id === selectedPro.id} currentUserId={user?.id} refreshTrigger={refreshTrigger} onClose={() => setSelectedPro(null)} onUnlock={handleUnlock} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {isProcessingAction && <ThinkingLoader message={processingMessage} />}
      <ConfirmationModal isOpen={!!pendingProUnlock} onClose={() => setPendingProUnlock(null)} onConfirm={handleConfirmUnlock} title={t('common.unlock')} message={t('common.confirmUnlock')} confirmLabel={t('common.confirm')} type="pro" />
      <ConfirmationModal isOpen={showSwitchToProConfirm} onClose={() => setShowSwitchToProConfirm(false)} onConfirm={async () => { setIsProcessingAction(true); try { await setUserRole(user.id, 'pro'); const updated = await getUserProfile(user.id); setDbProfile(updated); setUserType('pro'); setShowSwitchToProConfirm(false); setCurrentView(updated.is_pro_complete ? 'pro-home' : 'pro-onboarding'); } finally { setIsProcessingAction(false); } }} title={t('profile.switchToProTitle')} message={t('profile.switchToProMsg')} confirmLabel={t('common.confirm')} type="pro" />
      <ConfirmationModal isOpen={showSwitchToExpatConfirm} onClose={() => setShowSwitchToExpatConfirm(false)} onConfirm={async () => { setIsProcessingAction(true); try { await setUserRole(user.id, 'expat'); const updated = await getUserProfile(user.id); setDbProfile(updated); setUserType('expat'); setShowSwitchToExpatConfirm(false); setCurrentView('expat-home'); } finally { setIsProcessingAction(false); } }} title={t('profile.switchToExpatTitle')} message={t('profile.switchToExpatMsg')} confirmLabel={t('common.confirm')} type="expat" />
      <ConfirmationModal isOpen={showCancelPlanConfirm} onClose={() => setShowCancelPlanConfirm(false)} onConfirm={async () => { setIsProcessingAction(true); try { await cancelUserPlan(user.id); setDbProfile(await getUserProfile(user.id)); setShowCancelPlanConfirm(false); } finally { setIsProcessingAction(false); } }} title={t('subscription.confirmCancelTitle')} message={t('subscription.confirmCancelMsg')} confirmLabel={t('common.confirm')} type="expat" />
      <ConfirmationModal isOpen={showReactivatePlanConfirm} onClose={() => setShowReactivatePlanConfirm(false)} onConfirm={async () => { setIsProcessingAction(true); try { await reactivateUserPlan(user.id); setDbProfile(await getUserProfile(user.id)); setShowReactivatePlanConfirm(false); } finally { setIsProcessingAction(false); } }} title={t('subscription.confirmReactivateTitle')} message={t('subscription.confirmReactivateMsg')} confirmLabel={t('common.reactivate')} type="pro" />
    </div>
  );
};

export default App;