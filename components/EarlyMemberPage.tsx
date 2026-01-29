import React from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Award, CheckCircle, Target, Rocket, BarChart3, ShieldCheck, CheckCircle2, Zap, Trophy, CreditCard, Info } from 'lucide-react';
import Logo from './Logo';
import { useTranslation } from 'react-i18next';

interface EarlyMemberPageProps {
  isPro?: boolean; isSubscribed?: boolean; onJoin: () => void; onGoToDashboard: () => void; onBack: () => void;
}

const EarlyMemberPage: React.FC<EarlyMemberPageProps> = ({ isPro = false, isSubscribed = false, onJoin, onBack }) => {
  const { t } = useTranslation();
  const isMember = isPro && isSubscribed;

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <section className="pt-44 pb-24 px-6 max-w-7xl mx-auto">
        <button onClick={onBack} className="mb-12 flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase group transition-colors hover:text-black">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t('common.back')}
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase mb-8 border border-emerald-100/50 shadow-sm"><Award size={14} /> {t('earlyMember.badge')}</div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              {t('earlyMember.title')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-500">{t('earlyMember.subtitle')}</span>
            </h1>
            <p className="text-xl text-gray-500 mb-12 max-w-2xl font-medium leading-relaxed">{t('earlyMember.desc')}</p>
            {isMember ? (
              <div className="mx-auto lg:mx-0 bg-emerald-600 text-white px-10 py-6 rounded-[24px] font-bold text-xl flex items-center justify-center gap-3 shadow-xl animate-in zoom-in duration-500 w-fit">
                <CheckCircle2 size={24} /> {t('earlyMember.status.isMember')}
              </div>
            ) : (
              <button onClick={onJoin} className="mx-auto lg:mx-0 bg-black text-white px-12 py-6 rounded-[24px] font-bold text-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-2xl group active:scale-95 w-fit">
                {t('earlyMember.cta')} <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
          <div className="hidden lg:block h-[500px] rounded-[48px] overflow-hidden shadow-2xl border-8 border-white animate-in slide-in-from-right-8 duration-1000">
            <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Founding Members" />
          </div>
        </div>
      </section>
      
      <section className="py-24 px-6 bg-black text-white rounded-[64px] md:rounded-[100px] mx-4 md:mx-10 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-blue-900/20 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-12">
            <div className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">
              <Target size={14} className="inline mr-3 mb-1" /> {t('earlyMember.program.tag')}
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                {t('earlyMember.program.title')} <br />
                <span className="text-emerald-400">{t('earlyMember.program.subtitle')}</span>
              </h2>
              <div className="flex flex-col gap-1.5 pl-1">
                <p className="text-xs font-black uppercase text-emerald-400/70 tracking-widest">
                  {t('earlyMember.program.cancelAnytime')}
                </p>
                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                  {t('earlyMember.program.limitedOffer')}
                </p>
              </div>
            </div>
            <div className="flex gap-12 pt-4">
              <div>
                <div className="text-5xl font-black mb-2">0€</div>
                <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">{t('earlyMember.stats.fee')}</div>
              </div>
              <div>
                <div className="text-5xl font-black mb-2">0%</div>
                <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">{t('earlyMember.stats.commission')}</div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[48px] p-8 md:p-12 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none transform translate-x-1/2 -translate-y-1/2">
              <Sparkles size={200} />
            </div>
            <h3 className="text-2xl font-black mb-8 border-b border-white/10 pb-6">{t('earlyMember.program.includedTitle')}</h3>
            {[
              { i: <Rocket className="text-emerald-400" />, t: t('earlyMember.program.feature1') }, 
              { i: <BarChart3 className="text-blue-400" />, t: t('earlyMember.program.feature2') }, 
              { i: <ShieldCheck className="text-indigo-400" />, t: t('earlyMember.program.feature3') }, 
              { i: <Award className="text-amber-400" />, t: t('earlyMember.program.feature4') }
            ].map((f, idx) => (
              <div key={idx} className="flex items-center gap-5 group transition-transform hover:translate-x-2">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-white/10 transition-colors">
                  {f.i}
                </div>
                <span className="font-bold text-lg text-gray-300 group-hover:text-white transition-colors">{f.t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-32 pt-24 border-t border-white/10 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/10">
              <CreditCard size={14} className="text-indigo-400" /> {t('earlyMember.plansInfo.subtitle')}
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6">{t('earlyMember.plansInfo.title')}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
              {t('earlyMember.plansInfo.desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-10 flex flex-col items-center text-center transition-all hover:bg-white/10 hover:border-white/20 group">
              <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-black mb-4">{t('earlyMember.plansInfo.monthlyTitle')}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black">25€</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">/ {t('subscription.billing.perMonth')}</span>
              </div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{t('subscription.plans.monthly.desc')}</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-600/10 to-emerald-600/10 border border-white/20 rounded-[40px] p-8 md:p-10 flex flex-col items-center text-center transition-all hover:from-indigo-600/20 hover:to-emerald-600/20 group relative">
              <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-emerald-500 text-black px-4 py-6 rounded-full rotate-12 font-black text-[10px] uppercase shadow-lg z-20">
                -60€
              </div>
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                <Trophy size={28} />
              </div>
              <h3 className="text-xl font-black mb-4">{t('earlyMember.plansInfo.annualTitle')}</h3>
              <div className="flex flex-col items-center mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">20€</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">/ {t('subscription.billing.perMonth')}</span>
                </div>
                <span className="text-[10px] font-black text-emerald-400/60 uppercase tracking-widest mt-1">
                  {t('subscription.billing.for12Months')}
                </span>
              </div>
              <p className="text-sm text-emerald-400 font-black uppercase tracking-widest">{t('subscription.billing.savings')}</p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] opacity-50">{t('subscription.confirmReactivateMsg')}</p>
          </div>
        </div>
      </section>
      
      <div className="h-24"></div>
    </div>
  );
};

export default EarlyMemberPage;