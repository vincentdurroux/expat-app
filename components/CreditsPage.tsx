import React, { useState, useRef } from 'react';
import { Coins, Check, Zap, ShieldCheck, CreditCard, ArrowLeft, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StripePayment from './StripePayment'; // Assure-toi que le chemin est correct

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
      alert("Une erreur est survenue lors de la mise à jour des crédits.");
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center px-6 pt-24 pb-20 animate-in fade-in duration-700 relative">
      <div className="w-full max-w-6xl">
        <button 
          onClick={onBack}
          className="mb-12 flex items-center gap-2 text-gray-400 hover:text-black transition-colors font-bold text-[10px] uppercase tracking-[0.2em] group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {t('common.back')}
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-amber-100/50 shadow-sm">
            <Coins size={14} />
            {t('credits.balance', { amount: currentCredits })}
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#1d1d1f]
