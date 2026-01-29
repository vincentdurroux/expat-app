import React, { useState, useRef } from 'react';
import { Coins, Check, Zap, ShieldCheck, CreditCard, ArrowLeft, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StripePayment from './StripePayment';

interface CreditsPageProps {
  currentCredits: number;
  isAuth: boolean;
  isRoleSelected: boolean;
  onAuthRequired: () => void;
  onPurchase: (amount: number) => void | Promise<void>;
  onBack: () => void;
}

const CreditsPage: React.FC<CreditsPageProps> = ({ currentCredits, isAuth, isRoleSelected, onAuthRequired, onPurchase, onBack }) => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const packages = [
    { id: 1, amount: 1, price: 2, label: t('credits.packages.starter.label'), description: t('credits.packages.starter.desc'), icon: <Zap size={20} className="text-blue-500" /> },
    { id: 2, amount: 5, price: 9, label: t('credits.packages.popular.label'), description: t('credits.packages.popular.desc'), icon: <Zap size={20} className="text-amber-500" />, popular: true },
    { id: 3, amount: 10, price: 15, label: t('credits.packages.value.label'), description: t('credits.packages.value.desc'), icon: <Zap size={20} className="text-indigo-500" /> },
  ];

  const handleBuySimulation = async (amount: number, id: number) => {
    if (!isAuth) {
      onAuthRequired();
      return;
    }
    if (!isRoleSelected) return;
    setIsProcessing(id);
    try {
      await onPurchase(amount);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center px-6 pt-24 pb-20 animate-in fade-in duration-700 relative">
      <div className="w-full max-w-6xl">
        <button onClick={onBack} className="mb-12 flex items-center gap-2 text-gray-400 hover:text-black transition-colors font-bold text-[10px] uppercase tracking-[0.2em] group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {t('common.back')}
        </button>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-amber-100/50 shadow-sm">
            <Coins size={14} />
            {t('credits.balance', { amount: currentCredits })}
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#1d1d1f] mb-4">{t('credits.title')}</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-base md:text-lg font-medium">{t('credits.subtitle')}</p>
        </div><div className="relative group/carousel">
          <div ref={scrollContainerRef} className="flex overflow-x-auto md:overflow-x-visible pt-6 pb-12 md:pb-0 gap-6 md:grid md:grid-cols-3 md:gap-8 mb-16 no-scrollbar snap-x snap-mandatory">
            {packages.map((pkg) => (
              <div key={pkg.id} className={`apple-card p-8 border-2 flex flex-col shrink-0 w-[85vw] sm:w-[320px] md:w-full snap-center relative transition-all duration-300 ${pkg.popular ? 'border-indigo-600 shadow-2xl md:scale-105 z-10' : 'border-gray-100 shadow-sm'} bg-white`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg z-20 whitespace-nowrap">
                    {t('common.mostPopular')}
                  </div>
                )}
                <div className="flex items-center justify-between mb-8">
                  <div className="p-4 bg-gray-50 rounded-2xl">{pkg.icon}</div>
                  <div className="text-right">
                    <div className="text-4xl font-black">{pkg.amount}</div>
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{t('credits.unit')}</div>
                  </div>
                </div>
                <h3 className="text-xl font-black mb-2">{pkg.label}</h3>
                <p className="text-gray-500 text-sm mb-10 flex-1 leading-relaxed font-medium">{pkg.description}</p>
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                     <span className="text-5xl font-black tracking-tighter">{pkg.price}</span>
                     <span className="text-xl font-bold">€</span>
                  </div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{t('credits.billingNote')}</div>
                </div>
                {pkg.amount === 10 ? (
                  <StripePayment />
                ) : (
                  <button onClick={() => handleBuySimulation(pkg.amount, pkg.id)} disabled={isProcessing !== null || (isAuth && !isRoleSelected)} className={`w-full py-5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 ${pkg.popular ? 'bg-black text-white hover:bg-gray-800 shadow-xl' : 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50'} disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]`}>
                    {isProcessing === pkg.id ? <Loader2 size={18} className="animate-spin" /> : <><CreditCard size={18} />{isAuth ? t('credits.buyCTA') : t('common.guestUnlock')}</>}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 py-10 border-t border-gray-100">
          <div className="flex items-center gap-3 opacity-60"><ShieldCheck size={18} className="text-emerald-500" /><span className="text-[10px] font-black uppercase tracking-widest">{t('credits.secure')}</span></div>
          <div className="flex items-center gap-3 opacity-60"><Check size={18} className="text-emerald-500" /><span className="text-[10px] font-black uppercase tracking-widest">{t('credits.instant')}</span></div>
          <div className="flex items-center gap-3 opacity-60"><Coins size={18} className="text-emerald-500" /><span className="text-[10px] font-black uppercase tracking-widest">{t('credits.noExp')}</span></div>
        </div>
      </div>
    </div>
  );
};

export default CreditsPage;
