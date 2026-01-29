import React, { useState } from 'react';
import Logo from './Logo';
import { Mail, Lock, ShieldCheck, AlertCircle, Loader2, CheckCircle2, Eye, EyeOff, ArrowLeft, ChevronRight, UserPlus } from 'lucide-react';
import { authService } from '../services/authService';
import { useTranslation } from 'react-i18next';
import ThinkingLoader from './ThinkingLoader';

interface AuthViewProps {
  onAuthSuccess: () => void;
  onBack: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess, onBack }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info', text: string, showSignupHint?: boolean } | null>(null);

  const validateEmail = (e: string) => {
    return e.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleContinue = (targetMode: 'signin' | 'signup') => {
    if (!email || !validateEmail(email)) {
      setStatusMessage({ type: 'error', text: t('auth.fillFields') });
      return;
    }
    setStatusMessage(null);
    setMode(targetMode);
    setStep('password');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isSuccess) return;
    if (!password) { setStatusMessage({ type: 'error', text: t('auth.fillFields') }); return; }
    
    setIsLoading(true);
    setStatusMessage(null);

    try {
      if (mode === 'signup') {
        if (password.length < 6) { 
          setStatusMessage({ type: 'error', text: t('auth.passLength') }); 
          setIsLoading(false); 
          return; 
        }
        const { user, session, error } = await authService.signUp(email, password);
        if (error) { 
          setStatusMessage({ type: 'error', text: error }); 
          setIsLoading(false); 
        } else if (user) { 
          if (!session) { 
            setStatusMessage({ type: 'info', text: `${t('auth.signUpSuccess')} ${t('auth.confirmEmail')}` }); 
            setIsLoading(false); 
          } else {
            // Signal au parent AVANT de changer l'état local pour permettre le switch de vue
            onAuthSuccess();
            setIsSuccess(true);
          }
        }
      } else {
        const { session, error } = await authService.signIn(email, password);
        if (error) { 
          const isCredsError = error.includes("Invalid login credentials");
          setStatusMessage({ 
            type: 'error', 
            text: isCredsError ? t('auth.invalidCreds') : error,
            showSignupHint: isCredsError
          }); 
          setIsLoading(false); 
        } else {
          onAuthSuccess();
          setIsSuccess(true);
        }
      }
    } catch (err) { 
      setStatusMessage({ type: 'error', text: t('auth.genericError') }); 
      setIsLoading(false); 
    }
  };

  if (isSuccess) {
    return <ThinkingLoader />;
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd] flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[80%] md:w-[50%] h-[50%] bg-emerald-50/60 rounded-full blur-[80px] md:blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[80%] md:w-[50%] h-[50%] bg-indigo-50/60 rounded-full blur-[80px] md:blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md relative z-10">
        <button 
          onClick={step === 'email' ? onBack : () => setStep('email')} 
          className="mb-8 flex items-center gap-3 text-gray-500 hover:text-black font-black text-[11px] uppercase tracking-[0.2em] transition-all group px-2" 
          disabled={isLoading}
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          {step === 'email' ? t('common.back') : t('auth.changeEmail')}
        </button>

        <div className="bg-white border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[40px] md:rounded-[48px] p-10 md:p-12">
          <div className="flex flex-col items-center text-center mb-10 md:mb-12">
            <div className="p-4 md:p-5 bg-white rounded-[24px] md:rounded-[28px] shadow-sm mb-8 md:mb-10 border border-gray-50">
              <Logo className="w-12 h-12 md:w-14 md:h-14" />
            </div>
            <h1 className="text-3xl md:text-4xl text-[#1d1d1f] font-black tracking-tight mb-4 leading-tight">
              {step === 'email' ? t('auth.title') : (mode === 'signin' ? t('auth.signinTitle') : t('auth.signupTitle'))}
            </h1>
            <p className="text-xs md:text-sm text-gray-400 max-w-[280px] leading-relaxed font-bold">
              {step === 'email' 
                ? t('auth.subtitle') 
                : (mode === 'signin' ? t('auth.signinSubtitle') : t('auth.signupSubtitle'))}
            </p>
          </div>

          <form className="space-y-8 md:space-y-10" onSubmit={handleAuth}>
            {step === 'email' ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="space-y-2.5">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 ml-5 font-black">{t('auth.email')}</label>
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-500 transition-colors z-10" size={20} />
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-[22px] pl-16 pr-6 py-5 text-lg outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500 transition-all placeholder:text-gray-300 font-black brand-input-text" 
                      placeholder={t('auth.emailPlaceholder')} 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    type="button"
                    onClick={() => handleContinue('signin')} 
                    className="w-full bg-black text-white py-6 rounded-[24px] text-sm md:text-base font-black hover:bg-gray-800 shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    {t('auth.continueLogin')} <ChevronRight size={20} className="opacity-50" />
                  </button>
                  <div className="flex items-center gap-4 py-2">
                    <div className="h-px bg-gray-100 flex-1" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">{t('common.or')}</span>
                    <div className="h-px bg-gray-100 flex-1" />
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleContinue('signup')} 
                    className="w-full bg-white border-2 border-gray-100 text-gray-900 py-6 rounded-[24px] text-sm md:text-base font-black hover:bg-gray-50 transition-all active:scale-[0.98] shadow-sm"
                  >
                    {t('auth.continueSignup')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center px-5">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">{t('auth.pass')}</label>
                    <span className="text-[10px] font-black text-indigo-500 lowercase opacity-60 truncate max-w-[150px]">{email}</span>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-500 transition-colors z-10" size={20} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      autoFocus
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-[22px] pl-16 pr-16 py-5 text-lg outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500 transition-all placeholder:text-gray-300 font-black brand-input-text" 
                      placeholder={t('auth.passPlaceholder')} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors p-2 z-20"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading} 
                  className={`w-full ${mode === 'signup' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-black hover:bg-gray-800'} text-white py-6 rounded-[24px] text-sm md:text-base font-black disabled:opacity-50 shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3`}
                >
                  {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                    <>
                      {mode === 'signin' ? t('auth.loginBtn') : t('auth.signupBtn')}
                      <ShieldCheck size={20} className="opacity-50" />
                    </>
                  )}
                </button>
              </div>
            )}
          </form>

          {statusMessage && (
            <div className={`mt-10 p-5 rounded-[28px] border-2 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-500 ${statusMessage.type === 'error' ? 'bg-red-50 border-red-100 text-red-900' : 'bg-blue-50 border-blue-100 text-blue-900'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl bg-white shadow-sm shrink-0 ${statusMessage.type === 'error' ? 'text-red-600' : 'text-blue-600'}`}>
                  {statusMessage.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                </div>
                <p className="text-[12px] leading-relaxed font-black">{statusMessage.text}</p>
              </div>
              
              {statusMessage.showSignupHint && (
                <div className="mt-2 pt-4 border-t border-red-200/50">
                  <p className="text-[10px] font-bold text-red-700 mb-3 uppercase tracking-wider">{t('auth.emailNotFound')}</p>
                  <button 
                    onClick={() => { setMode('signup'); setStatusMessage(null); }}
                    className="flex items-center gap-2 text-xs font-black text-red-900 hover:text-red-700 transition-colors uppercase tracking-widest"
                  >
                    <UserPlus size={14} /> {t('auth.continueSignup')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthView;