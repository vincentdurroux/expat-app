import React from 'react';
import { Search, Coins, Unlock, MessageSquare, Globe, ShieldCheck, Sparkles, ArrowLeft, Zap, Star, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HowItWorksProps {
  onBack: () => void;
  onBuyCredits: () => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onBack }) => {
  const { t } = useTranslation();

  const steps = [
    {
      number: "01",
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.desc'),
      icon: <Search className="text-blue-600" size={28} />,
      bgClass: "bg-blue-50/50 border-blue-100",
      bubbleClass: "bg-blue-600 text-white",
      badge: t('howItWorks.step1.badge')
    },
    {
      number: "02",
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.desc'),
      icon: <Coins className="text-amber-500" size={28} />,
      bgClass: "bg-amber-50/50 border-amber-100",
      bubbleClass: "bg-amber-500 text-white",
      badge: t('howItWorks.step2.badge')
    },
    {
      number: "03",
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.desc'),
      icon: <Unlock className="text-indigo-600" size={28} />,
      bgClass: "bg-indigo-50/50 border-indigo-100",
      bubbleClass: "bg-indigo-600 text-white",
      badge: t('howItWorks.step3.badge')
    },
    {
      number: "04",
      title: t('howItWorks.step4.title'),
      description: t('howItWorks.step4.desc'),
      icon: <Phone className="text-emerald-600" size={28} />,
      bgClass: "bg-emerald-50/50 border-emerald-100",
      bubbleClass: "bg-emerald-600 text-white",
      badge: t('howItWorks.step4.badge')
    },
    {
      number: "05",
      title: t('howItWorks.step5.title'),
      description: t('howItWorks.step5.desc'),
      icon: <Star className="text-violet-600" size={28} />,
      bgClass: "bg-violet-50/50 border-violet-100",
      bubbleClass: "bg-violet-600 text-white",
      badge: t('howItWorks.step5.badge')
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-32 animate-in fade-in duration-700 overflow-x-hidden relative">
      {/* FADED LOGO BACKGROUND */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] scale-[5] md:scale-[8] pointer-events-none transform-gpu z-0">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-64 h-64">
          <defs>
            <linearGradient id="how-bg-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#45a081" />
              <stop offset="100%" stopColor="#2e75c2" />
            </linearGradient>
          </defs>
          <path d="M50 10 C65 10, 75 25, 75 40 C75 45, 60 45, 50 40 C40 35, 35 10, 50 10Z" fill="url(#how-bg-logo-gradient)" />
          <path d="M40 85 C25 85, 15 70, 15 55 C15 50, 30 50, 40 55 C50 60, 55 85, 40 85Z" fill="url(#how-bg-logo-gradient)" fillOpacity={0.85} />
          <path d="M85 55 C85 70, 70 80, 55 80 C50 80, 50 65, 55 55 C60 45, 85 40, 85 55Z" fill="url(#how-bg-logo-gradient)" fillOpacity={0.7} />
        </svg>
      </div>

      <div className="relative z-10">
        <button 
          onClick={onBack}
          className="mb-12 flex items-center gap-2 text-gray-400 hover:text-black transition-colors font-black text-[10px] uppercase tracking-[0.2em] group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {t('common.back')}
        </button>

        <div className="text-center mb-32 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-50/50 rounded-full blur-[120px] -z-10"></div>
          <div className="inline-flex items-center gap-2 bg-white border border-gray-100 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-8 shadow-sm">
            <Zap size={14} className="text-amber-500 fill-amber-500" /> 
            {t('nav.brandSub')}
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#1d1d1f] mb-8 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#45a081] to-[#2e75c2]">ExpaLink</span> : {t('howItWorks.title')}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto mb-40">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-100 via-indigo-100 to-violet-100 -translate-x-1/2"></div>
          <div className="flex overflow-x-auto pb-12 gap-8 snap-x snap-mandatory no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0 lg:block lg:space-y-32">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex-none w-[85vw] sm:w-[400px] snap-center relative flex flex-col lg:flex-row items-center lg:gap-24 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''} lg:w-auto`}
              >
                <div className="flex-1 w-full">
                  <div className={`apple-card p-10 md:p-12 border ${step.bgClass} backdrop-blur-sm transition-all group relative overflow-hidden h-full lg:h-auto`}>
                    <div className={`absolute top-0 right-0 p-12 opacity-[0.05] transition-transform duration-700 group-hover:scale-125 group-hover:rotate-12`}>
                      {step.icon}
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        {step.icon}
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{step.badge}</span>
                        <h3 className="text-2xl font-black text-gray-900 leading-tight">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>
                <div className="relative z-10 my-8 lg:my-0">
                  <div className={`w-16 h-16 rounded-full ${step.bubbleClass} border-4 border-white flex items-center justify-center text-xl font-black shadow-xl group-hover:scale-110 transition-transform`}>
                     {step.number}
                  </div>
                </div>
                <div className="hidden lg:block flex-1"></div>
              </div>
            ))}
          </div>
        </div>

        <section className="relative overflow-hidden rounded-[64px] bg-gray-900 text-white p-12 md:p-24 shadow-2xl">
          <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none transform translate-x-20 -translate-y-20">
             <Globe size={400} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 bg-white/10 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">
                <Sparkles size={16} className="text-amber-400" /> {t('howItWorks.experience.tag')}
              </div>
              <h2 className="text-4xl md:text-6xl font-black leading-[1.1]">
                {t('howItWorks.experience.title')}
              </h2>
              <div className="space-y-8 max-w-lg">
                <p className="text-xl text-gray-400 font-medium leading-relaxed">
                  {t('howItWorks.experience.desc1')}
                </p>
                <div className="p-8 bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-xl">
                   <p className="text-sm italic leading-relaxed text-gray-300">
                    {t('howItWorks.experience.desc2')}
                   </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="apple-card p-3 bg-white/10 border border-white/20 backdrop-blur-md rotate-2 hover:rotate-0 transition-transform duration-700">
                 <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800" className="w-full h-[600px] object-cover rounded-[32px]" alt="Experience" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-[32px]"></div>
                 <div className="absolute bottom-10 left-10 right-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg">
                        <ShieldCheck size={24} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-black uppercase tracking-widest text-xs">{t('howItWorks.experience.visualTag')}</h4>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-amber-400 text-amber-400" />)}
                        </div>
                      </div>
                    </div>
                    <p className="text-lg font-bold leading-tight opacity-90">{t('howItWorks.experience.visualText')}</p>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowItWorks;