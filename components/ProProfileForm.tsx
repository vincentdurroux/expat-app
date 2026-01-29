import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin, User, X, ChevronDown, Loader2, CheckCircle, Mail, Info, Camera, Plus, Sparkles, Globe, Search, Trash2, Award, Fingerprint, Languages } from 'lucide-react';
import { PROFESSION_CATEGORIES, LANGUAGES, SPECIALTIES_MAP, POPULAR_CITIES, SPANISH_CITIES, COUNTRY_DIAL_CODES, ISO_COUNTRIES, getFlagEmoji, LANGUAGE_FLAGS } from '../constants';
import { Gender, Professional } from '../types';
import { useTranslation } from 'react-i18next';

interface ProProfileFormProps {
  onComplete: (profileData: any) => void;
  initialData?: Partial<Professional> & { avatar_url?: string };
  onCancel?: () => void;
}

const ProProfileForm: React.FC<ProProfileFormProps> = ({ onComplete, initialData, onCancel }) => {
  const { t, i18n } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMapsLoaded, setIsMapsLoaded] = useState(false);
  const [mapsError, setMapsError] = useState<string | null>(null);
  
  const [customSpecialty, setCustomSpecialty] = useState('');
  const [showDialSelector, setShowDialSelector] = useState(false);
  const [dialSearch, setDialSearch] = useState('');
  const [showNationalitySelector, setShowNationalitySelector] = useState(false);
  const [natSearch, setNatSearch] = useState('');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [citySearch, setCitySearch] = useState('');

  const addressInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nationalityRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<any>(null);

  const countryNames = useMemo(() => {
    try { return new Intl.DisplayNames([i18n.language], { type: 'region' }); } catch (e) { return { of: (code: string) => code }; }
  }, [i18n.language]);

  const parsePhone = (rawPhone?: string) => {
    const raw = rawPhone || '';
    if (!raw) return { code: '+34', number: '' };
    const sortedCodes = [...COUNTRY_DIAL_CODES].sort((a, b) => b.code.length - a.code.length);
    const found = sortedCodes.find(c => raw.startsWith(c.code));
    if (found) return { code: found.code, number: raw.replace(found.code, '').trim() };
    return { code: '+34', number: raw };
  };

  const [formData, setFormData] = useState({
    name: initialData?.name || '', 
    companyName: initialData?.companyName || '', 
    gender: (initialData?.gender as Gender) || 'prefer-not-to-say', 
    nationalities: (initialData?.nationalities || []) as string[], 
    dialCode: parsePhone(initialData?.phone).code, 
    phoneMain: parsePhone(initialData?.phone).number, 
    email: initialData?.email || initialData?.email_pro || '', 
    websiteUrl: initialData?.websiteUrl || '', 
    address: initialData?.address || '', 
    latitude: initialData?.latitude || null,
    longitude: initialData?.longitude || null,
    profession: initialData?.professions?.[0] || '', 
    yearsOfExperience: initialData?.yearsOfExperience ?? 5, 
    bio: initialData?.bio || '', 
    specialties: (initialData?.specialties || []) as string[], 
    cities: (initialData?.cities || []) as string[], 
    languages: (initialData?.languages || []) as string[], 
    image: initialData?.image || initialData?.avatar_url || ''
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const initAutocomplete = () => {
      if (addressInputRef.current && (window as any).google?.maps?.places) {
        if (autocompleteRef.current) {
          (window as any).google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }

        const input = addressInputRef.current;
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            const pacContainer = document.querySelector('.pac-container');
            if (pacContainer && window.getComputedStyle(pacContainer).display !== 'none') {
               e.preventDefault();
            }
          }
        };
        input.addEventListener('keydown', handleKeyDown);

        autocompleteRef.current = new (window as any).google.maps.places.Autocomplete(input, {
          types: ['address'],
          fields: ['formatted_address', 'geometry', 'name'],
          componentRestrictions: { country: 'es' } 
        });

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          if (place?.geometry?.location) {
            const formatted = place.formatted_address || place.name || '';
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            
            setFormData(prev => ({ 
              ...prev, 
              address: formatted,
              latitude: lat,
              longitude: lng
            }));
          }
        });
        setIsMapsLoaded(true);
        
        return () => input.removeEventListener('keydown', handleKeyDown);
      }
    };

    const handleMapsFailure = () => { 
      setMapsError(t('forms.mapsError')); 
      setIsMapsLoaded(false); 
    };
    
    window.addEventListener('google-maps-loaded', initAutocomplete);
    window.addEventListener('google-maps-auth-failure', handleMapsFailure);
    if ((window as any).google?.maps?.places) initAutocomplete();
    
    return () => { 
      window.removeEventListener('google-maps-loaded', initAutocomplete); 
      window.removeEventListener('google-maps-auth-failure', handleMapsFailure); 
    };
  }, [t, i18n.language]);

  const completionPercentage = useMemo(() => {
    let score = 0;
    if (formData.name?.trim()) score += 10;
    if (formData.image) score += 10;
    if (formData.nationalities?.length > 0) score += 10;
    if (formData.phoneMain?.trim()) score += 10;
    if (formData.profession) score += 10;
    if (formData.yearsOfExperience >= 0) score += 5;
    if (formData.bio?.length >= 20) score += 20;
    if (formData.cities?.length > 0) score += 10;
    if (formData.languages?.length > 0) score += 10;
    if (formData.specialties?.length > 0) score += 5;
    return Math.min(100, score);
  }, [formData]);

  const toggleArrayItem = (field: 'specialties' | 'cities' | 'languages' | 'nationalities', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const addCustomSpecialty = () => {
    if (customSpecialty.trim() && !formData.specialties.includes(customSpecialty.trim())) {
      toggleArrayItem('specialties', customSpecialty.trim());
      setCustomSpecialty('');
    }
  };

  const deletePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    const newErrors: Record<string, string | null> = {};
    if (!formData.name.trim()) newErrors.name = 'nameRequired';
    if (!formData.phoneMain.trim()) newErrors.phone = 'phoneRequired';
    if (!formData.profession) newErrors.profession = 'professionsRequired';
    if (formData.bio.length < 20) newErrors.bio = 'bioTooShort';
    if (formData.cities.length === 0) newErrors.cities = 'citiesRequired';
    if (formData.languages.length === 0) newErrors.languages = 'languagesRequired';
    
    if (Object.keys(newErrors).length > 0) { 
      setErrors(newErrors); 
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
      return; 
    }
    
    setIsProcessing(true);
    try { 
      await onComplete({ 
        ...formData, 
        phone: `${formData.dialCode} ${formData.phoneMain.trim()}`, 
        professions: [formData.profession] 
      }); 
    } catch (err) { 
      setIsProcessing(false); 
    }
  };

  const filteredNationalities = useMemo(() => {
    const search = natSearch.toLowerCase();
    return ISO_COUNTRIES.filter(iso => 
      iso.toLowerCase().includes(search) || 
      (countryNames.of(iso) || '').toLowerCase().includes(search)
    );
  }, [natSearch, countryNames]);

  const filteredLanguages = useMemo(() => {
    const search = langSearch.toLowerCase();
    return LANGUAGES.filter(l => 
      l.toLowerCase().includes(search) || 
      t(`languages.${l}`).toLowerCase().includes(search)
    );
  }, [langSearch, t]);

  const filteredCities = useMemo(() => {
    const search = citySearch.toLowerCase();
    return SPANISH_CITIES.filter(c => 
      c.toLowerCase().includes(search) || 
      t(`cities.${c}`).toLowerCase().includes(search)
    );
  }, [citySearch, t]);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 pt-24 md:pt-36 pb-20 animate-in fade-in">
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-md z-[100] px-6">
        <div className="bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.1)] rounded-full p-1.5 flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden ml-3">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full ${completionPercentage < 85 ? 'bg-amber-400' : 'bg-emerald-500'}`} 
              style={{ width: `${completionPercentage}%` }} 
            />
          </div>
          <div className="flex items-center justify-center bg-gray-900 text-white rounded-full px-3 py-1 min-w-[50px]">
            <span className="text-[10px] font-bold tracking-tight">{completionPercentage}%</span>
          </div>
        </div>
      </div>

      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-0.5 rounded-full text-[9px] font-bold mb-3 border border-indigo-100">
          <Fingerprint size={10} /> {t('forms.title')}
        </div>
        <h1 className="text-xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">{t('forms.subtitle')}</h1>
        <p className="text-gray-400 max-w-sm mx-auto font-medium text-[11px] leading-relaxed">
          {t('forms.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`apple-card p-6 md:p-8 border border-gray-100 bg-white shadow-sm relative transition-all duration-300 ${showNationalitySelector ? 'z-[100] !overflow-visible ring-4 ring-indigo-50/50' : 'z-10'}`}>
          <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
             <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <User size={16} />
             </div>
             <h3 className="text-sm font-bold text-gray-900 tracking-tight">{t('forms.identity')}</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
            <div className="relative group shrink-0">
              <div 
                className="w-28 h-28 rounded-[32px] overflow-hidden bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/20 transition-all duration-500 relative"
                onClick={() => fileInputRef.current?.click()}
              >
                {formData.image ? (
                  <>
                    <img src={formData.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Profile" />
                    <button 
                      type="button" 
                      onClick={deletePhoto}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/90 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 scale-90"
                    >
                      <Trash2 size={12} />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-3">
                    <Camera size={20} className="text-gray-300 mx-auto mb-1" />
                    <span className="text-[8px] font-bold text-gray-400 tracking-tighter">Photo</span>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                const f = e.target.files?.[0];
                if(f) {
                  const r = new FileReader();
                  r.onloadend = () => setFormData({...formData, image: r.result as string});
                  r.readAsDataURL(f);
                }
              }} />
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 w-full">
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 ml-1">{t('forms.fullName')} *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className={`w-full bg-gray-50/50 border ${errors.name ? 'border-red-200 focus:border-red-400' : 'border-transparent focus:border-indigo-400'} rounded-2xl px-5 py-3 text-sm font-bold focus:bg-white outline-none transition-all placeholder:text-gray-300`}
                  placeholder={t('forms.fullNamePlaceholder')}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1">{t('forms.company')}</label>
                <input 
                  type="text" 
                  value={formData.companyName} 
                  onChange={e => setFormData({...formData, companyName: e.target.value})} 
                  className="w-full bg-gray-50/50 border border-transparent focus:border-indigo-400 rounded-2xl px-5 py-3 text-sm font-bold focus:bg-white outline-none transition-all placeholder:text-gray-300"
                  placeholder={t('forms.companyPlaceholder')}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1">{t('forms.genderLabel')}</label>
                <div className="relative">
                  <select 
                    value={formData.gender} 
                    onChange={e => setFormData({...formData, gender: e.target.value as Gender})} 
                    className="w-full bg-gray-50/50 border border-transparent focus:border-indigo-400 rounded-2xl px-5 py-3 text-sm font-bold focus:bg-white outline-none appearance-none cursor-pointer"
                  >
                    <option value="male">{t('common.male')}</option>
                    <option value="female">{t('common.female')}</option>
                    <option value="prefer-not-to-say">{t('common.notSpecified')}</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 relative" ref={nationalityRef}>
            <label className="text-[10px] font-bold text-gray-400 ml-1">{t('forms.nationality')}</label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50/50 rounded-2xl border border-gray-100 min-h-[48px] items-center">
               {formData.nationalities.map(iso => (
                 <button 
                  key={iso}
                  type="button" 
                  onClick={() => toggleArrayItem('nationalities', iso)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 rounded-xl border border-gray-100 text-[11px] font-bold shadow-sm hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all group"
                 >
                   <span className="text-sm leading-none">{getFlagEmoji(iso)}</span>
                   <span>{countryNames.of(iso) || iso}</span>
                   <X size={10} className="opacity-40 group-hover:opacity-100" />
                 </button>
               ))}
               <button 
                  type="button"
                  onClick={() => setShowNationalitySelector(!showNationalitySelector)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${showNationalitySelector ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50'}`}
                >
                  <Plus size={12} /> {t('forms.add')}
                </button>
            </div>
            
            {showNationalitySelector && (
              <div className="absolute left-0 right-0 top-full mt-2 p-3 bg-white border border-gray-100 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[200] animate-in fade-in zoom-in-95 duration-200">
                <div className="relative mb-2">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input 
                    value={natSearch} 
                    onChange={e => setNatSearch(e.target.value)} 
                    autoFocus
                    className="w-full bg-gray-50 border-none rounded-xl pl-9 pr-3 py-2.5 text-sm font-bold outline-none ring-1 ring-transparent focus:ring-indigo-100 transition-all" 
                    placeholder={t('forms.searchNationality')} 
                  />
                </div>
                <div className="max-h-48 overflow-y-auto no-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-1 px-1">
                  {filteredNationalities.length > 0 ? (
                    filteredNationalities.map(iso => (
                      <button 
                        key={iso} 
                        type="button" 
                        onClick={() => { toggleArrayItem('nationalities', iso); setShowNationalitySelector(false); }} 
                        className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-bold flex items-center justify-between transition-all ${formData.nationalities.includes(iso) ? 'bg-indigo-600 text-white shadow-sm' : 'hover:bg-gray-50 text-gray-500'}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base leading-none">{getFlagEmoji(iso)}</span>
                          <span className="truncate">{countryNames.of(iso) || iso}</span>
                        </div>
                        {formData.nationalities.includes(iso) && <CheckCircle size={12} />}
                      </button>
                    ))
                  ) : (
                    <div className="py-6 text-center text-[11px] text-gray-300 font-bold sm:col-span-2">{t('search.noResultsTitle')}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="apple-card p-6 md:p-8 border border-gray-100 bg-white shadow-sm relative z-[15]">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
             <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                <Award size={16} />
             </div>
             <h3 className="text-sm font-bold text-gray-900 tracking-tight">{t('forms.expertise')}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 ml-1">{t('forms.mainProfession')} *</label>
              <div className="relative">
                <select 
                  value={formData.profession} 
                  onChange={e => setFormData({...formData, profession: e.target.value})} 
                  className={`w-full bg-gray-50/50 border ${errors.profession ? 'border-red-200' : 'border-transparent'} focus:border-emerald-400 rounded-2xl px-5 py-3 text-sm font-bold appearance-none outline-none focus:bg-white transition-all`}
                >
                  <option value="">{t('forms.profSelectPlaceholder')}</option>
                  {Object.entries(PROFESSION_CATEGORIES).map(([catKey, profs]) => (
                    <optgroup key={catKey} label={t(`search.categories.${catKey}`)} className="text-[10px] font-bold text-gray-300">
                      {profs.map(p => <option key={p} value={p} className="text-sm font-bold text-gray-900">{t(`professions.${p}`)}</option>)}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-gray-400">{t('forms.yearsOfExperience')} *</label>
                <div className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                   {formData.yearsOfExperience} {t('common.yearsExp')}
                </div>
              </div>
              <div className="relative py-2">
                <input 
                  type="range" 
                  min="0" 
                  max="40" 
                  value={formData.yearsOfExperience} 
                  onChange={e => setFormData({...formData, yearsOfExperience: parseInt(e.target.value)})} 
                  className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-emerald-500" 
                />
                <div className="flex justify-between mt-2 text-[8px] font-bold text-gray-300">
                  <span>{t('forms.expBeginner')}</span>
                  <span>{t('forms.expExpert')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <label className="text-[10px] font-bold text-gray-400 ml-1">{t('forms.services')}</label>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {(formData.profession ? SPECIALTIES_MAP[formData.profession] || [] : []).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleArrayItem('specialties', s)}
                  className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all active:scale-95 ${formData.specialties.includes(s) ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white border-gray-50 text-gray-400 hover:border-emerald-100 hover:text-emerald-600'}`}
                >
                  {t(`specialties.${s}`) || s}
                </button>
              ))}
              {formData.specialties.filter(s => !(formData.profession && SPECIALTIES_MAP[formData.profession]?.includes(s))).map(cs => (
                 <button 
                  key={cs} 
                  type="button"
                  onClick={() => toggleArrayItem('specialties', cs)}
                  className="bg-indigo-600 text-white border border-indigo-600 px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                 >
                    {t(`specialties.${cs}`) || cs}
                    <X size={10} className="opacity-60" />
                 </button>
              ))}
            </div>
            
            <div className="relative group">
              <input 
                type="text" 
                value={customSpecialty} 
                onChange={e => setCustomSpecialty(e.target.value)} 
                className="w-full bg-gray-50/50 border border-transparent focus:border-emerald-400 rounded-2xl px-5 py-3 pr-24 text-sm font-bold outline-none focus:bg-white transition-all placeholder:text-gray-300" 
                placeholder={t('forms.specialtiesPlaceholder')} 
              />
              <button 
                type="button" 
                onClick={addCustomSpecialty}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-black transition-all active:scale-90 shadow-sm text-[10px] font-bold"
              >
                {t('forms.add')}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-bold text-gray-400">{t('forms.profDescription')} *</label>
              <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${formData.bio.length < 20 ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'}`}>
                {formData.bio.length} / 20 {t('forms.minChars')}
              </div>
            </div>
            <div className="relative">
               <textarea 
                value={formData.bio} 
                onChange={e => setFormData({...formData, bio: e.target.value})} 
                className={`w-full bg-gray-50/50 border ${errors.bio ? 'border-red-200' : 'border-transparent focus:border-emerald-400'} rounded-[24px] p-6 text-sm font-medium h-40 resize-none outline-none focus:bg-white transition-all shadow-inner`} 
                placeholder={t('forms.bioPlaceholder')} 
              />
              <div className="absolute bottom-4 right-5 flex items-center gap-1.5 bg-white/70 backdrop-blur-md px-2 py-1 rounded-full border border-gray-100 shadow-sm">
                 <Sparkles size={12} className="text-amber-500" />
                 <span className="text-[9px] font-bold text-gray-500">{t('forms.aiTranslation')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`apple-card p-6 md:p-8 border border-gray-100 bg-white shadow-sm relative transition-all duration-300 ${showDialSelector || showLanguageSelector || showCitySelector ? 'z-[100] !overflow-visible ring-4 ring-blue-50/50' : 'z-10'}`}>
          <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
             <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <Globe size={16} />
             </div>
             <h3 className="text-sm font-bold text-gray-900 tracking-tight">{t('forms.contactZones')}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1 relative">
              <label className="text-[10px] font-bold text-gray-400 ml-1">{t('forms.phoneMain')} *</label>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => { setShowDialSelector(!showDialSelector); setShowLanguageSelector(false); setShowCitySelector(false); }}
                  className="px-3 py-2.5 bg-gray-50/50 border border-transparent hover:border-blue-100 hover:bg-white rounded-2xl text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <span className="text-base leading-none">{COUNTRY_DIAL_CODES.find(c => c.code === formData.dialCode)?.flag}</span>
                  {formData.dialCode} 
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
                <input 
                  type="tel" 
                  value={formData.phoneMain} 
                  onChange={e => setFormData({...formData, phoneMain: e.target.value.replace(/\s/g, '')})} 
                  className={`flex-1 bg-gray-50/50 border ${errors.phone ? 'border-red-200' : 'border-transparent focus:border-blue-400'} rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:bg-white transition-all`} 
                  placeholder={t('forms.phonePlaceholder')}
                />
              </div>
              {showDialSelector && (
                <div className="mt-2 p-3 bg-white border border-gray-100 rounded-2xl shadow-xl absolute z-[200] w-full max-w-xs animate-in fade-in zoom-in-95 duration-200">
                   <div className="relative mb-2">
                     <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                     <input value={dialSearch} onChange={e => setDialSearch(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl pl-9 pr-3 py-2 text-[11px] font-bold outline-none" placeholder={t('forms.dialSearchPlaceholder')} />
                   </div>
                   <div className="max-h-48 overflow-y-auto no-scrollbar space-y-1 px-1">
                      {COUNTRY_DIAL_CODES.filter(c => c.name.toLowerCase().includes(dialSearch.toLowerCase()) || c.code.includes(dialSearch)).map(c => (
                        <button key={`${c.name}-${c.code}`} type="button" onClick={() => { setFormData({...formData, dialCode: c.code}); setShowDialSelector(false); }} className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 text-[11px] font-bold flex items-center justify-between group transition-all">
                           <span className="flex items-center gap-2">
                              <span className="text-base leading-none grayscale group-hover:grayscale-0 transition-all">{c.flag}</span> 
                              <span className="text-gray-500">{c.name}</span>
                           </span>
                           <span className="text-blue-500 font-bold">{c.code}</span>
                        </button>
                      ))}
                   </div>
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 ml-1">{t('forms.emailPro')}</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  className="w-full bg-gray-50/50 border border-transparent focus:border-blue-400 rounded-2xl px-5 py-3 pl-11 text-sm font-bold outline-none focus:bg-white transition-all" 
                  placeholder={t('forms.emailPlaceholder')}
                />
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 ml-1">{t('forms.website')}</label>
              <div className="relative">
                <input 
                  type="url" 
                  value={formData.websiteUrl} 
                  onChange={e => setFormData({...formData, websiteUrl: e.target.value})} 
                  className="w-full bg-gray-50/50 border border-transparent focus:border-blue-400 rounded-2xl px-5 py-3 pl-11 text-sm font-bold outline-none focus:bg-white transition-all" 
                  placeholder={t('forms.websitePlaceholder')}
                />
                <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 ml-1">{t('forms.address')} *</label>
              <div className="relative">
                <input 
                  type="text" 
                  ref={addressInputRef}
                  value={formData.address} 
                  onChange={e => {
                    const val = e.target.value;
                    setFormData(prev => ({ 
                      ...prev, 
                      address: val,
                      ...(val === '' ? { latitude: null, longitude: null } : {})
                    }));
                  }} 
                  className="w-full bg-gray-50/50 border border-transparent focus:border-blue-400 rounded-2xl px-5 py-3 pl-11 text-sm font-bold outline-none focus:bg-white transition-all" 
                  placeholder={t('forms.addressPlaceholder')}
                />
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
                {formData.latitude && formData.longitude && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-50 text-emerald-600 p-1 rounded-lg border border-emerald-100 animate-in fade-in scale-90">
                     <CheckCircle size={14} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3 relative" ref={cityRef}>
              <label className="text-[10px] font-bold text-gray-400 ml-1">{t('forms.cities')} *</label>
              <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50/50 rounded-2xl border border-gray-100 min-h-[48px] items-center">
                {formData.cities.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleArrayItem('cities', c)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 rounded-xl border border-gray-100 text-[11px] font-bold shadow-sm hover:bg-red-50 hover:text-red-500 transition-all group"
                  >
                    <span>{t(`cities.${c}`) || c}</span>
                    <X size={10} className="opacity-40 group-hover:opacity-100" />
                  </button>
                ))}
                <button 
                  type="button"
                  onClick={() => { setShowCitySelector(!showCitySelector); setShowDialSelector(false); setShowLanguageSelector(false); }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${showCitySelector ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-blue-600 border border-blue-100 hover:bg-blue-50'}`}
                >
                  <Plus size={12} /> {t('forms.add')}
                </button>
              </div>

              {showCitySelector && (
                <div className="absolute left-0 right-0 top-full mt-2 p-3 bg-white border border-gray-100 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[200] animate-in fade-in zoom-in-95 duration-200">
                  <div className="relative mb-2">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input 
                      value={citySearch} 
                      onChange={e => setCitySearch(e.target.value)} 
                      autoFocus
                      className="w-full bg-gray-50 border-none rounded-xl pl-9 pr-3 py-2 text-sm font-bold outline-none" 
                      placeholder={t('forms.searchCity')} 
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto no-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-1 px-1">
                    {filteredCities.map(c => (
                      <button 
                        key={c} 
                        type="button" 
                        onClick={() => { toggleArrayItem('cities', c); setShowCitySelector(false); }} 
                        className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-bold flex items-center justify-between transition-all ${formData.cities.includes(c) ? 'bg-blue-600 text-white' : 'hover:bg-gray-50 text-gray-500'}`}
                      >
                        <span className="truncate">{t(`cities.${c}`) || c}</span>
                        {formData.cities.includes(c) && <CheckCircle size={12} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 relative" ref={languageRef}>
              <label className="text-[10px] font-bold text-gray-400 ml-1">{t('forms.languages')} *</label>
              <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50/50 rounded-2xl border border-gray-100 min-h-[48px] items-center">
                {formData.languages.map(l => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => toggleArrayItem('languages', l)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 rounded-xl border border-gray-100 text-[11px] font-bold shadow-sm hover:bg-red-50 hover:text-red-500 transition-all group"
                  >
                    <span className="text-sm leading-none">{LANGUAGE_FLAGS[l]}</span> 
                    <span>{t(`languages.${l}`)}</span>
                    <X size={10} className="opacity-40 group-hover:opacity-100" />
                  </button>
                ))}
                <button 
                  type="button"
                  onClick={() => { setShowLanguageSelector(!showLanguageSelector); setShowDialSelector(false); setShowCitySelector(false); }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${showLanguageSelector ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50'}`}
                >
                  <Plus size={12} /> {t('forms.add')}
                </button>
              </div>

              {showLanguageSelector && (
                <div className="absolute left-0 right-0 top-full mt-2 p-3 bg-white border border-gray-100 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[200] animate-in fade-in zoom-in-95 duration-200">
                  <div className="relative mb-2">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input 
                      value={langSearch} 
                      onChange={e => setLangSearch(e.target.value)} 
                      autoFocus
                      className="w-full bg-gray-50 border-none rounded-xl pl-9 pr-3 py-2 text-sm font-bold outline-none" 
                      placeholder={t('search.placeholderLang')} 
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto no-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-1 px-1">
                    {filteredLanguages.map(l => (
                      <button 
                        key={l} 
                        type="button" 
                        onClick={() => { toggleArrayItem('languages', l); setShowLanguageSelector(false); }} 
                        className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-bold flex items-center justify-between transition-all ${formData.languages.includes(l) ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50 text-gray-500'}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base leading-none">{LANGUAGE_FLAGS[l]}</span>
                          <span className="truncate">{t(`languages.${l}`)}</span>
                        </div>
                        {formData.languages.includes(l) && <CheckCircle size={12} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row gap-4">
          {onCancel && (
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 h-[54px] rounded-2xl font-bold text-xs text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 transition-all active:scale-95"
            >
              {t('common.close')}
            </button>
          )}
          <button 
            type="submit" 
            disabled={isProcessing || completionPercentage < 85} 
            className={`flex-[1.8] h-[54px] rounded-2xl font-bold text-sm transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 group ${completionPercentage < 85 ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none' : 'bg-gray-900 text-white hover:bg-black shadow-black/10'}`}
          >
            {isProcessing ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {t('forms.finalize')} 
                <Sparkles size={18} className={`transition-all duration-700 ${completionPercentage >= 85 ? 'text-amber-400 animate-pulse' : 'text-gray-400'}`} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProProfileForm;