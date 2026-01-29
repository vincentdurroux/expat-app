import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Languages, Briefcase, ChevronDown, Navigation, X } from 'lucide-react';
import { SearchFilters } from '../types';
import { PROFESSION_CATEGORIES, LANGUAGES, LANGUAGE_FLAGS } from '../constants';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  onSearch: (filters: SearchFilters & { lat?: number; lng?: number; locationName?: string }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const { t, i18n } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const [profession, setProfession] = useState('');
  const [language, setLanguage] = useState('');
  
  // Valeur par défaut traduite
  const [locationInput, setLocationInput] = useState(t('search.nearMe'));
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  // Mettre à jour "Autour de vous" dynamiquement si la langue change
  useEffect(() => {
    const nearMeTranslations = [
      'Near me', 
      'Autour de vous', 
      'Cerca de mí', 
      'Vicino a me', 
      'Dichtbij mij', 
      'Рядом со мной', 
      'Поруч зі мною'
    ];
    
    // Si l'input actuel correspond à l'une des versions de "Near me", on le met à jour vers la nouvelle langue
    if (nearMeTranslations.includes(locationInput)) {
      setLocationInput(t('search.nearMe'));
    }
  }, [i18n.language, t]);

  // Le bouton n'est actif que si une profession est choisie
  const isSearchDisabled = !profession.trim();

  useEffect(() => {
    const initAutocomplete = () => {
      if (addressInputRef.current && (window as any).google?.maps?.places) {
        if (autocompleteRef.current) {
          (window as any).google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }

        autocompleteRef.current = new (window as any).google.maps.places.Autocomplete(addressInputRef.current, {
          fields: ['formatted_address', 'geometry', 'name'],
          types: ['(regions)'],
          componentRestrictions: { country: 'es' } // Restriction Espagne
        });

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          if (place?.geometry?.location) {
            setSelectedCoords({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            });
            setLocationInput(place.formatted_address || place.name || '');
          }
        });
      }
    };

    if ((window as any).google?.maps?.places) {
      initAutocomplete();
    } else {
      window.addEventListener('google-maps-loaded', initAutocomplete);
    }

    return () => {
      window.removeEventListener('google-maps-loaded', initAutocomplete);
    };
  }, [i18n.language]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSearchDisabled) return;

    onSearch({
      profession,
      language,
      city: '',
      lat: selectedCoords?.lat,
      lng: selectedCoords?.lng,
      locationName: locationInput
    });
    setIsFocused(false);
  };

  const clearLocation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocationInput('');
    setSelectedCoords(null);
    addressInputRef.current?.focus();
  };

  return (
    <>
      <div className={`fixed inset-0 z-0 bg-black/5 backdrop-blur-[2px] transition-opacity duration-500 pointer-events-none ${isFocused ? 'opacity-100' : 'opacity-0'}`} />
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        <form 
          onSubmit={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setIsFocused(false);
          }}
          className={`bg-white p-2 rounded-[32px] md:rounded-[40px] transition-all duration-500 flex flex-col md:flex-row items-stretch md:items-center border border-gray-100/50 ${isFocused ? 'shadow-[0_40px_80px_rgba(0,0,0,0.15)] scale-[1.01] ring-1 ring-black/5' : 'shadow-[0_20px_50px_rgba(0,0,0,0.1)]'}`}
        >
          {/* Métier */}
          <div className={`flex-[1.2] min-w-0 flex items-center px-4 md:px-5 py-4 border-b md:border-b-0 md:border-r border-gray-100 relative group min-h-[56px] transition-colors ${profession ? 'bg-blue-50/10' : ''}`}>
            <Briefcase className={`mr-3 shrink-0 transition-colors ${profession ? 'text-[#2e75c2]' : 'text-gray-300'}`} size={20} />
            <div className="relative flex-1 min-w-0">
              <select 
                className="w-full bg-transparent outline-none text-base md:text-sm font-bold text-gray-800 appearance-none cursor-pointer pr-6 truncate min-h-[44px]"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
              >
                <option value="">{t('search.placeholderProf')}</option>
                {Object.entries(PROFESSION_CATEGORIES).map(([catKey, profs]) => (
                  <optgroup key={catKey} label={t(`search.categories.${catKey}`)}>
                    {profs.map(p => (
                      <option key={p} value={p}>{t(`professions.${p}`)}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Localisation */}
          <div className={`flex-[1.5] min-w-0 flex items-center px-4 md:px-5 py-4 border-b md:border-b-0 md:border-r border-gray-100 relative group min-h-[56px] transition-colors ${selectedCoords || locationInput === t('search.nearMe') ? 'bg-emerald-50/30' : ''}`}>
            {selectedCoords || locationInput === t('search.nearMe') ? <Navigation className="mr-3 shrink-0 text-[#45a081] animate-pulse" size={20} /> : <MapPin className={`mr-3 shrink-0 transition-colors ${locationInput ? 'text-[#45a081]' : 'text-gray-300'} group-hover:text-[#45a081]`} size={20} />}
            <div className="relative flex-1 min-w-0 flex items-center">
              <input 
                ref={addressInputRef}
                type="text"
                value={locationInput}
                onChange={(e) => {
                  setLocationInput(e.target.value);
                  if (selectedCoords) setSelectedCoords(null);
                }}
                className="w-full bg-transparent outline-none text-base md:text-sm font-bold text-gray-800 placeholder:text-gray-400 placeholder:font-medium"
                placeholder={t('search.placeholderCity')}
              />
              {locationInput && (
                <button type="button" onClick={clearLocation} className="p-1 hover:bg-gray-100 rounded-full transition-all text-gray-300 hover:text-gray-900">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Langue */}
          <div className="flex-1 min-w-0 flex items-center px-4 md:px-5 py-4 relative group md:border-r md:border-gray-100 min-h-[56px]">
            <Languages className={`mr-3 shrink-0 transition-colors ${language ? 'text-indigo-500' : 'text-gray-300'}`} size={20} />
            <div className="relative flex-1 min-w-0">
              <select 
                className="w-full bg-transparent outline-none text-base md:text-sm font-bold text-gray-800 appearance-none cursor-pointer pr-6 truncate min-h-[44px]"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="">{t('search.placeholderLang')}</option>
                {LANGUAGES.map((l: string) => <option key={l} value={l}>{LANGUAGE_FLAGS[l] || '🌐'} {t(`languages.${l}`)}</option>)}
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Bouton */}
          <div className="p-1.5 md:p-0">
            <button 
              type="submit"
              disabled={isSearchDisabled}
              className={`w-full md:w-auto px-8 py-5 md:py-4 rounded-2xl md:rounded-[32px] font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg md:ml-2 min-h-[56px] ${
                isSearchDisabled 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60 shadow-none' 
                : `bg-gradient-to-r from-[#45a081] to-[#2e75c2] text-white ${isFocused ? 'md:scale-105 shadow-emerald-200/50' : 'hover:brightness-110 shadow-black/10'}`
              }`}
            >
              <Search size={20} />
              <span className="whitespace-nowrap text-lg md:text-sm tracking-widest font-bold">{t('search.btn')}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SearchBar;