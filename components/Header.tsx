import React, { useState, useRef, useEffect } from 'react';
import Logo from './Logo';
import { 
  Coins, LogOut, User, LayoutDashboard, 
  Globe, ChevronDown, HelpCircle, 
  Sparkles, CreditCard, ArrowRightLeft,
  X
} from 'lucide-react';
import { UserType } from '../types';
import { useTranslation } from 'react-i18next';
import { Language } from '../translations';

interface HeaderProps {
  user?: any;
  profile?: any;
  credits: number;
  onAddCredits: (e: React.MouseEvent) => void;
  userType: UserType | null;
  onLogout: (e: React.MouseEvent) => void;
  onLogoClick: (e: React.MouseEvent) => void;
  onHowItWorksClick: (e: React.MouseEvent) => void;
  currentView?: string;
  onDashboardClick?: (e: React.MouseEvent) => void;
  onProfileClick: (e: React.MouseEvent) => void;
  onSignUpClick?: (e: React.MouseEvent) => void;
  onEarlyMemberClick?: (e: React.MouseEvent) => void;
  onSubscriptionClick?: (e: React.MouseEvent) => void;
  onSwitchMode?: (target: UserType, e?: React.MouseEvent) => void;
  isLocked?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  user,
  profile: dbProfile,
  credits, 
  onAddCredits, 
  userType, 
  onLogout, 
  onLogoClick, 
  onHowItWorksClick,
  currentView,
  onDashboardClick,
  onProfileClick,
  onSignUpClick,
  onEarlyMemberClick,
  onSubscriptionClick,
  onSwitchMode,
  isLocked = false
}) => {
  const { t, i18n } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Restricted to 3 main languages as requested
  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  const activeLangCode = i18n.language ? (i18n.language.split('-')[0] as Language) : 'en';
  const currentLang = languages.find(l => l.code === activeLangCode) || languages[0];

  const finalAvatarUrl = dbProfile?.avatar_url || user?.user_metadata?.avatar_url;
  const isMultiRole = dbProfile?.is_pro && dbProfile?.is_expat;

  const showPublicLinks = (currentView === 'landing' || (!user || !dbProfile?.role_selected)) && currentView !== 'auth';

  const handleMobileNav = (action: (e: any) => void) => {
    return (e: any) => {
      action(e);
      setShowMobileMenu(false);
    };
  };

  const handleLanguageChange = (code: Language) => {
    i18n.changeLanguage(code);
    setShowLangMenu(false);
  };

  const showCredits = user && 
                     userType === 'expat' && 
                     dbProfile?.role_selected && 
                     currentView !== 'landing' && 
                     !isLocked;

  const activeEmerald = "text-[#45a081]";
  const activeIndigo = "text-[#2e75c2]";
  const inactiveBrandClass = "text-gray-400 hover:text-gray-900";

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] apple-blur border-b border-gray-200/50 h-16 md:h-20 transition-all">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 transition-all shrink-0 cursor-pointer group" onClick={(e) => onLogoClick(e)}>
          <Logo className={`w-8 h-8 md:w-9 md:h-9 transition-transform ${!isLocked && 'group-hover:scale-105 active:scale-95'}`} />
          <span className="hidden sm:inline text-xl md:text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#45a081] to-[#2e75c2] animate-brand-text">
            ExpaLink
          </span>
        </div>

        {!isLocked && (
          <nav className="hidden lg:flex items-center justify-center gap-12 overflow-x-auto no-scrollbar whitespace-nowrap py-1 flex-1 px-8">
            {showPublicLinks ? (
              <div className="flex items-center gap-10">
                <button onClick={(e) => onHowItWorksClick(e)} className={`text-sm font-medium transition-all shrink-0 relative py-1 ${currentView === 'how-it-works' ? activeEmerald : inactiveBrandClass}`}>
                  {t('nav.howItWorks')}
                  {currentView === 'how-it-works' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#45a081] to-[#2e75c2] rounded-full" />}
                </button>
                <button onClick={(e) => onEarlyMemberClick && onEarlyMemberClick(e)} className={`text-sm font-medium transition-all flex items-center gap-2 shrink-0 ${currentView === 'early-member' ? 'text-amber-600' : 'text-gray-400 hover:text-[#45a081]'}`}>
                  <span className="flex items-center gap-2">
                    <Sparkles size={14} className={currentView === 'early-member' ? 'text-amber-500' : 'text-gray-300'} /> {t('nav.earlyMember')}
                  </span>
                </button>
              </div>
            ) : currentView !== 'auth' ? (
              <div className="flex items-center gap-8">
                {userType === 'expat' ? (
                    <>
                      <button onClick={(e) => onDashboardClick && onDashboardClick(e)} className={`flex items-center gap-2 text-sm font-medium transition-all shrink-0 ${currentView === 'expat-dashboard' ? activeIndigo : inactiveBrandClass}`}>
                        <Globe size={16} className={currentView === 'expat-dashboard' ? activeIndigo : 'text-gray-300'} /> {t('nav.myRelocation')}
                      </button>
                      <button onClick={(e) => onHowItWorksClick(e)} className={`flex items-center gap-2 text-sm font-medium transition-all shrink-0 ${currentView === 'how-it-works' ? activeEmerald : inactiveBrandClass}`}>
                          <HelpCircle size={16} className={currentView === 'how-it-works' ? activeEmerald : 'text-gray-300'} /> {t('nav.howItWorks')}
                      </button>
                    </>
                ) : userType === 'pro' ? (
                    <>
                      <button onClick={(e) => onDashboardClick && onDashboardClick(e)} className={`flex items-center gap-2 text-sm font-medium transition-all shrink-0 ${currentView === 'pro-dashboard' ? activeEmerald : inactiveBrandClass}`}>
                        <LayoutDashboard size={16} className={currentView === 'pro-dashboard' ? activeEmerald : 'text-gray-300'} /> {t('nav.myBusiness')}
                      </button>
                      <button onClick={(e) => onEarlyMemberClick && onEarlyMemberClick(e)} className={`flex items-center gap-2 text-sm font-medium transition-all shrink-0 ${currentView === 'early-member' ? 'text-amber-600' : inactiveBrandClass}`}>
                        <Sparkles size={16} className={currentView === 'early-member' ? 'text-amber-500' : 'text-gray-300'} /> {t('nav.earlyMember')}
                      </button>
                      <button onClick={(e) => onSubscriptionClick && onSubscriptionClick(e)} className={`flex items-center gap-2 text-sm font-medium transition-all shrink-0 ${currentView === 'subscription' ? activeIndigo : inactiveBrandClass}`}>
                        <CreditCard size={16} className={currentView === 'subscription' ? activeIndigo : 'text-gray-300'} /> {t('nav.plans')}
                      </button>
                    </>
                ) : null}

                {isMultiRole && (
                  <button onClick={(e) => onSwitchMode?.(userType === 'expat' ? 'pro' : 'expat', e)} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-[9px] font-medium hover:bg-gray-800 transition-all shadow-lg active:scale-95 shrink-0">
                    <ArrowRightLeft size={10} />
                    {userType === 'expat' ? t('nav.switchPro') : t('nav.switchExpat')}
                  </button>
                )}
              </div>
            ) : null}
          </nav>
        )}

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {showCredits && (
            <button onClick={(e) => onAddCredits(e)} className="flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-2.5 md:px-4 md:py-2.5 rounded-full border border-amber-100/50 hover:bg-amber-100 transition-all group min-h-[44px]">
              <Coins size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-bold">{credits}</span>
            </button>
          )}

          <div className="relative" ref={langMenuRef}>
            <button onClick={(e) => { e.preventDefault(); setShowLangMenu(!showLangMenu); }} className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-gray-100 transition-all min-h-[44px]">
              <span className="text-xl">{currentLang.flag}</span>
              <ChevronDown size={14} className={`hidden md:block text-gray-400 transition-transform duration-300 ${showLangMenu ? 'rotate-180' : ''}`} />
            </button>
            {showLangMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="py-2">
                  {languages.map((lang) => (
                    <button key={lang.code} onClick={(e) => { e.preventDefault(); handleLanguageChange(lang.code); }} className={`w-full px-4 py-4 text-left text-sm flex items-center justify-between transition-colors min-h-[44px] ${activeLangCode === lang.code ? 'bg-gray-50 text-black font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                      <span className="flex items-center gap-3"><span className="text-lg">{lang.flag}</span><span>{lang.label}</span></span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {!user ? (
            <button onClick={(e) => onSignUpClick && onSignUpClick(e)} className="bg-black text-white px-4 md:px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95 whitespace-nowrap min-h-[40px]">
              {t('nav.login')}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              {!isLocked && (
                <button onClick={(e) => onProfileClick(e)} className={`w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden border-2 border-white shadow-md transition-transform hover:scale-105 active:scale-95 min-h-[40px] ${userType === 'pro' ? 'bg-[#45a081]' : 'bg-[#2e75c2]'}`}>
                  {finalAvatarUrl ? <img src={finalAvatarUrl} alt="Profil" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white"><User size={18} /></div>}
                </button>
              )}
            </div>
          )}

          {!isLocked && (
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="lg:hidden p-2 text-gray-900 transition-all active:scale-90 min-h-[44px] flex items-center justify-center">
              {showMobileMenu ? <X size={26} strokeWidth={2.5} /> : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="8" x2="20" y2="8"></line>
                  <line x1="4" y1="16" x2="20" y2="16"></line>
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {showMobileMenu && !isLocked && (
        <div className="lg:hidden fixed inset-0 top-16 bg-white z-[90] animate-in fade-in slide-in-from-right-4 duration-300 overflow-y-auto no-scrollbar pb-20">
          <div className="p-6 space-y-8">
            {showPublicLinks ? (
              <div className="space-y-4">
                <button onClick={handleMobileNav(onHowItWorksClick)} className={`w-full text-left p-5 rounded-[24px] text-lg font-bold flex items-center justify-between ${currentView === 'how-it-works' ? 'bg-[#45a081]/5 text-[#45a081]' : 'bg-gray-50 text-gray-900'}`}>
                   {t('nav.howItWorks')}
                   <ChevronDown size={20} className={`-rotate-90 ${currentView === 'how-it-works' ? 'text-[#45a081]' : 'text-gray-300'}`} />
                </button>
                <button onClick={handleMobileNav(onEarlyMemberClick!)} className={`w-full text-left p-5 rounded-[24px] text-lg font-bold flex items-center justify-between ${currentView === 'early-member' ? 'bg-amber-50 text-amber-900' : 'bg-gray-50 text-gray-900'}`}>
                   <span className="flex items-center gap-3"><Sparkles size={20} className="text-amber-500" /> {t('nav.earlyMember')}</span>
                   <ChevronDown size={20} className="-rotate-90 text-amber-200" />
                </button>
                <div className="pt-8">
                  <button onClick={handleMobileNav(onSignUpClick!)} className="w-full py-5 bg-black text-white rounded-[24px] font-bold text-xl shadow-xl">{t('nav.login')}</button>
                </div>
              </div>
            ) : currentView !== 'auth' ? (
              <div className="space-y-4">
                {userType === 'expat' ? (
                  <>
                    <button onClick={handleMobileNav(onDashboardClick!)} className={`w-full text-left p-5 rounded-[24px] text-lg font-bold flex items-center gap-4 ${currentView === 'expat-dashboard' ? 'bg-[#2e75c2]/5 text-[#2e75c2]' : 'bg-gray-50 text-gray-900'}`}>
                       <Globe size={24} className={currentView === 'expat-dashboard' ? 'text-[#2e75c2]' : 'text-gray-400'} /> {t('nav.myRelocation')}
                    </button>
                    <button onClick={handleMobileNav(onHowItWorksClick)} className={`w-full text-left p-5 rounded-[24px] text-lg font-bold flex items-center gap-4 ${currentView === 'how-it-works' ? 'bg-[#45a081]/5 text-[#45a081]' : 'bg-gray-50 text-gray-900'}`}>
                       <HelpCircle size={24} className={currentView === 'how-it-works' ? 'text-[#45a081]' : 'text-gray-400'} /> {t('nav.howItWorks')}
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleMobileNav(onDashboardClick!)} className={`w-full text-left p-5 rounded-[24px] text-lg font-bold flex items-center gap-4 ${currentView === 'pro-dashboard' ? 'bg-[#45a081]/5 text-[#45a081]' : 'bg-gray-50 text-gray-900'}`}>
                       <LayoutDashboard size={24} className={currentView === 'pro-dashboard' ? 'text-[#45a081]' : 'text-gray-400'} /> {t('nav.myBusiness')}
                    </button>
                    <button onClick={handleMobileNav(onEarlyMemberClick!)} className={`w-full text-left p-5 rounded-[24px] text-lg font-bold flex items-center gap-4 ${currentView === 'early-member' ? 'bg-amber-50 text-amber-900' : 'bg-gray-50 text-gray-900'}`}>
                       <Sparkles size={24} className="text-amber-500" /> {t('nav.earlyMember')}
                    </button>
                    <button onClick={handleMobileNav(onSubscriptionClick!)} className={`w-full text-left p-5 rounded-[24px] text-lg font-bold flex items-center gap-4 ${currentView === 'subscription' ? 'bg-[#2e75c2]/5 text-[#2e75c2]' : 'bg-gray-50 text-gray-900'}`}>
                       <CreditCard size={24} className={currentView === 'subscription' ? 'text-[#2e75c2]' : 'text-gray-400'} /> {t('nav.plans')}
                    </button>
                  </>
                )}
                <div className="pt-6 grid grid-cols-1 gap-4">
                   {isMultiRole && (
                     <button onClick={handleMobileNav((e) => onSwitchMode?.(userType === 'expat' ? 'pro' : 'expat', e))} className="w-full py-5 bg-gray-900 text-white rounded-[24px] font-bold text-lg flex items-center justify-center gap-3">
                       <ArrowRightLeft size={20} />
                       {userType === 'expat' ? t('nav.switchPro') : t('nav.switchExpat')}
                     </button>
                   )}
                   <button onClick={handleMobileNav(onProfileClick)} className="w-full py-5 bg-white border-2 border-gray-100 rounded-[24px] font-bold text-lg flex items-center justify-center gap-3">
                     <User size={20} /> {t('nav.myProfile')}
                   </button>
                   <button onClick={handleMobileNav(onLogout)} className="w-full py-5 text-red-500 font-bold text-lg flex items-center justify-center gap-3 hover:bg-red-50 rounded-[24px]">
                     <LogOut size={20} /> {t('nav.logout')}
                   </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;