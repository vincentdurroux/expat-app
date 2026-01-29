import { supabase } from '../supabaseClient';
import { UserType, UnlockToken, Review, Professional, ReviewStatus, VerificationStatus } from '../types';
import { SPANISH_CITY_DATA, PROFESSIONS, LANGUAGES, SPECIALTIES_MAP } from '../constants';
import i18n from 'i18next';

const MOCK_STORAGE_KEY = 'expalink_local_mocks_v3';

const isValidUUID = (uuid: any): boolean => {
  if (!uuid || typeof uuid !== 'string') return false;
  if (uuid.startsWith('mock-')) return true; 
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Initialisation des 50 mocks
export const initMockProfessionals = () => {
  const existing = localStorage.getItem(MOCK_STORAGE_KEY);
  if (existing) return;

  const firstNames = ['Lucas', 'Emma', 'Marc', 'Sofia', 'Thomas', 'Elena', 'Jean', 'Chloé', 'David', 'Marta', 'Paul', 'Isabella', 'Julian', 'Claire', 'Alex', 'Laura', 'Oliver', 'Camille', 'Daniel', 'Victoria'];
  const lastNames = ['Garcia', 'Smith', 'Dupont', 'Müller', 'Rossi', 'Ivanov', 'Lefebvre', 'Martinez', 'Wilson', 'Schneider', 'Moreau', 'Silva', 'Jones', 'Perez', 'Bakker', 'Novak'];
  const targetCities = ['Madrid', 'Barcelona', 'Valencia', 'Malaga', 'Sevilla', 'Alicante'];
  const streetNames = ['Calle Mayor', 'Gran Via', 'Paseo de Gracia', 'Calle de Alcala', 'Avenida de la Constitucion', 'Calle Sierpes'];

  const mockPros: Professional[] = [];

  for (let i = 1; i <= 50; i++) {
    const city = targetCities[i % targetCities.length];
    const profession = PROFESSIONS[i % PROFESSIONS.length];
    const specs = SPECIALTIES_MAP[profession] || [];
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[(i * 3) % lastNames.length];
    const street = streetNames[i % streetNames.length];
    
    mockPros.push({
      id: `mock-${i}`,
      name: `${firstName} ${lastName}`,
      companyName: `${lastName} & Partners ${i > 25 ? 'Group' : 'Consulting'}`,
      gender: i % 2 === 0 ? 'male' : 'female',
      nationalities: i % 4 === 0 ? ['FR', 'ES'] : i % 5 === 0 ? ['US', 'ES'] : ['GB', 'ES'],
      yearsOfExperience: 3 + (i % 20),
      professions: [profession],
      specialties: specs.slice(0, 3),
      cities: [city],
      languages: ['English', (i % 3 === 0 ? 'French' : (i % 2 === 0 ? 'Spanish' : 'German'))],
      rating: 4.2 + (Math.random() * 0.8),
      reviews: Math.floor(Math.random() * 50) + 2,
      profileViews: Math.floor(Math.random() * 1500) + 200,
      profileUnlocks: Math.floor(Math.random() * 100) + 5,
      image: `https://images.unsplash.com/photo-${1500000000000 + i * 1234567}?auto=format&fit=crop&w=400&q=80`,
      bio: `Highly experienced ${profession} specialized in ${specs[0] || 'relocation services'}. Helping international families and digital nomads since ${2024 - (3 + (i % 20))}. Fluently speaking multiple languages to ensure smooth communication in ${city}.`,
      verified: i % 3 !== 0,
      verificationStatus: i % 3 !== 0 ? 'verified' : 'pending',
      isFeatured: i % 10 === 0,
      isEarlyMember: i % 2 === 0,
      isProfileOnline: true,
      address: `${street}, ${Math.floor(Math.random() * 100) + 1}, ${city}, Spain`,
      latitude: SPANISH_CITY_DATA[city].lat + (Math.random() - 0.5) * 0.08,
      longitude: SPANISH_CITY_DATA[city].lng + (Math.random() - 0.5) * 0.08,
      phone: `+34 6${Math.floor(Math.random() * 89999999 + 10000000)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.pro`
    });
  }

  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockPros));
};

const getLocalMocks = (): Professional[] => {
  const data = localStorage.getItem(MOCK_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const updateLocalMock = (proId: string, updates: Partial<Professional>) => {
  const mocks = getLocalMocks();
  const index = mocks.findIndex(m => m.id === proId);
  if (index !== -1) {
    mocks[index] = { ...mocks[index], ...updates };
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mocks));
  }
};

export const mapDBRowToPro = (row: any): Professional => {
  if (!row) return {} as Professional;
  const currentLang = i18n.language ? i18n.language.split('-')[0] : 'en';
  
  let mappedBio = row.bio || '';
  if (row.bios && typeof row.bios === 'object') {
    mappedBio = row.bios[currentLang] || row.bios['en'] || row.bio || '';
  }

  let lat = Number(row.location_lat ?? row.lat ?? null);
  let lng = Number(row.location_lng ?? row.lng ?? row.lon ?? null);

  if ((!lat || !lng) && row.location) {
    if (typeof row.location === 'string') {
      const match = row.location.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
      if (match) {
        lng = parseFloat(match[1]);
        lat = parseFloat(match[2]);
      }
    } else if (typeof row.location === 'object') {
      lng = Number(row.location.lng || row.location.x);
      lat = Number(row.location.lat || row.location.y);
    }
  }

  const dist = row.dist_meters ? (row.dist_meters / 1000) : row.distance_km;

  return {
    id: row.id,
    name: row.full_name || row.name || 'Expert ExpaLink',
    companyName: row.company_name || row.companyName || '',
    email: row.email_pro || row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    bio: mappedBio,
    bios: row.bios || {}, 
    gender: row.gender || 'prefer-not-to-say',
    nationalities: Array.isArray(row.nationality) ? row.nationality : (row.nationalities || []),
    yearsOfExperience: Number(row.years_experience ?? row.yearsOfExperience) || 0,
    professions: Array.isArray(row.professions) ? row.professions : [],
    languages: Array.isArray(row.languages) ? row.languages : [],
    specialties: Array.isArray(row.specialties) ? row.specialties : [],
    specialtyTranslations: row.specialty_translations || row.specialtyTranslations || {},
    cities: Array.isArray(row.all_cities) ? row.all_cities : (row.cities || []),
    image: row.pro_image_url || row.avatar_url || row.image || '',
    rating: Number(row.rating) || 5.0,
    reviews: Number(row.reviews_count ?? row.reviews) || 0,
    profileViews: Number(row.profile_views ?? row.profileViews) || 0,
    profileUnlocks: Number(row.profile_unlocks ?? row.profileUnlocks) || 0,
    latitude: isNaN(lat) ? undefined : lat,
    longitude: isNaN(lng) ? undefined : lng,
    isProfileOnline: row.is_profile_online !== false,
    verified: row.verification_status === 'verified' || !!row.verified,
    verificationStatus: row.verification_status || (row.verified ? 'verified' : 'none'),
    isFeatured: !!row.is_featured || !!row.isFeatured,
    isEarlyMember: !!(row.pro_plan?.toLowerCase().includes('early')) || !!(row.pro_plan?.toLowerCase().includes('founding')) || !!row.isEarlyMember,
    distance_km: dist !== undefined ? Number(dist) : undefined,
    is_pro_complete: !!row.is_pro_complete
  };
};

export const LIGHT_PRO_COLUMNS = 'id,full_name,professions,all_cities,languages,pro_image_url,avatar_url,verification_status,is_profile_online,pro_plan,is_featured,rating,reviews_count,years_experience,gender,nationality,location,profile_views,profile_unlocks,address';
export const FULL_PRO_COLUMNS = '*, created_at'; 

export const getActiveProfessionalProfiles = async (): Promise<Professional[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select(LIGHT_PRO_COLUMNS)
    .eq('is_pro', true)
    .eq('is_profile_online', true)
    .is('deleted_at', null)
    .limit(50); 
    
  const dbPros = (data || []).map(mapDBRowToPro);
  const localMocks = getLocalMocks();
  
  return [...dbPros, ...localMocks];
};

export const getFullProfessionalDetails = async (id: string): Promise<Professional | null> => {
  if (!isValidUUID(id)) return null;
  
  if (id.startsWith('mock-')) {
    const mock = getLocalMocks().find(m => m.id === id);
    return mock ? mapDBRowToPro(mock) : null;
  }

  const { data, error } = await supabase.from('profiles').select(FULL_PRO_COLUMNS).eq('id', id).maybeSingle();
  return (error || !data) ? null : mapDBRowToPro(data);
};

export const getProfessionalsByIds = async (ids: string[]): Promise<Professional[]> => {
  const validIds = ids.filter(isValidUUID);
  if (!validIds.length) return [];
  
  const dbIds = validIds.filter(id => !id.startsWith('mock-'));
  const mockIds = validIds.filter(id => id.startsWith('mock-'));

  let dbPros: Professional[] = [];
  if (dbIds.length > 0) {
    const { data } = await supabase.from('profiles').select(LIGHT_PRO_COLUMNS).in('id', dbIds);
    dbPros = (data || []).map(mapDBRowToPro);
  }

  const localMocks = getLocalMocks().filter(m => mockIds.includes(m.id)).map(mapDBRowToPro);

  return [...dbPros, ...localMocks];
};

export const getProfessionalsWithDistance = async (lat: number, lng: number, profession?: string, language?: string): Promise<Professional[]> => {
  const { data, error } = await supabase.rpc('get_pros_by_location', { 
    profession_filter: profession || null, 
    language_filter: language || null,
    user_lat: lat, 
    user_lng: lng 
  });
  
  const dbPros = (data || []).map(mapDBRowToPro);
  
  let localMocks = getLocalMocks();
  if (profession) {
    localMocks = localMocks.filter(m => m.professions.includes(profession));
  }
  if (language) {
    localMocks = localMocks.filter(m => m.languages.includes(language));
  }

  const mappedMocks = localMocks.map(m => {
    const dist = calculateDistance(lat, lng, m.latitude || 0, m.longitude || 0);
    return { ...m, distance_km: dist };
  });

  return [...dbPros, ...mappedMocks];
};

export const incrementProfileViews = async (proId: string) => {
  if (!isValidUUID(proId)) return;

  if (proId.startsWith('mock-')) {
    const mock = getLocalMocks().find(m => m.id === proId);
    if (mock) {
      updateLocalMock(proId, { profileViews: (mock.profileViews || 0) + 1 });
    }
    return;
  }

  await supabase.rpc('increment_profile_views', { 
    pro_id: proId,
    pro_id_param: proId 
  });
};

export const incrementProfileUnlocks = async (proId: string) => {
  if (!isValidUUID(proId)) return;

  if (proId.startsWith('mock-')) {
    const mock = getLocalMocks().find(m => m.id === proId);
    if (mock) {
      updateLocalMock(proId, { profileUnlocks: (mock.profileUnlocks || 0) + 1 });
    }
    return;
  }

  await supabase.rpc('increment_profile_unlocks', { 
    pro_id: proId,
    pro_id_param: proId
  });
};

export const getProfessionalReviews = async (proId: string, viewerId?: string): Promise<Review[]> => {
  if (!isValidUUID(proId)) return [];
  if (proId.startsWith('mock-')) return [];

  let query = supabase.from('reviews').select('*, author:profiles!fk_review_author(full_name, avatar_url)').eq('pro_id', proId);
  if (proId !== viewerId) query = query.eq('status', 'verified');
  const { data, error } = await query.order('date', { ascending: false });
  if (error) return [];
  return (data || []).map((item: any) => ({
    id: item.id, proId: item.pro_id, userId: item.user_id, serviceType: item.service_type || '',
    stars: item.stars || 5, testimonies: item.testimonies || '', date: new Date(item.date).getTime(),
    status: item.status as ReviewStatus, isVerified: !!item.is_verified, isAnonymous: !!item.is_anonymous,
    userName: item.is_anonymous ? 'Expatrié Anonyme' : (item.author?.full_name || 'Expatrié'),
    userAvatar: item.is_anonymous ? undefined : item.author?.avatar_url
  }));
};

export const getUserProfile = async (uid: string) => {
  if (!isValidUUID(uid)) return null;
  const { data } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle();
  return data;
};

export const updateUserProfile = async (uid: string, data: any) => {
  const { data: updated, error } = await supabase.from('profiles').update({ ...data, updated_at: new Date().toISOString() }).eq('id', uid).select().single();
  if (error) throw error;
  return updated;
};

export const saveCompleteProProfile = async (uid: string, proData: any) => {
  if (!isValidUUID(uid)) throw new Error("Invalid UID");

  let finalLat = proData.latitude ? parseFloat(String(proData.latitude)) : null;
  let finalLng = proData.longitude ? parseFloat(String(proData.longitude)) : null;

  if (!finalLat || !finalLng) {
    const firstCity = Array.isArray(proData.cities) ? proData.cities[0] : null;
    if (firstCity && SPANISH_CITY_DATA[firstCity]) {
      finalLat = SPANISH_CITY_DATA[firstCity].lat;
      finalLng = SPANISH_CITY_DATA[firstCity].lng;
    }
  }

  const location = (finalLat && finalLng) ? `SRID=4326;POINT(${finalLng} ${finalLat})` : null;

  const payload = {
    full_name: proData.name, 
    company_name: proData.companyName,
    gender: proData.gender,
    nationality: proData.nationalities,
    phone: proData.phone,
    email_pro: proData.email,
    website_url: proData.websiteUrl,
    address: proData.address,
    professions: Array.isArray(proData.professions) ? proData.professions : [proData.profession],
    years_experience: parseInt(String(proData.yearsOfExperience)) || 0,
    bio: proData.bio,
    bios: proData.bios || {}, 
    specialties: proData.specialties, 
    specialty_translations: proData.specialty_translations || {}, 
    all_cities: proData.cities, 
    languages: proData.languages, 
    pro_image_url: proData.image,
    avatar_url: proData.image,
    is_pro: true,
    is_pro_complete: true, 
    is_profile_online: proData.isProfileOnline !== false,
    role_selected: true,
    location: location,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase.from('profiles').update(payload).eq('id', uid);
  if (error) throw error;
  return true;
};

export const updateUserCredits = async (uid: string, credits: number) => {
  await supabase.from('profiles').update({ credits }).eq('id', uid);
  return true;
};

export const getUnlockedPros = async (uid: string): Promise<Record<string, UnlockToken>> => {
  const { data } = await supabase.from('unlocked_pros').select('*').eq('user_id', uid);
  const result: Record<string, UnlockToken> = {};
  data?.forEach((item: any) => { result[item.pro_id] = { id: item.pro_id, unlockDate: new Date(item.unlock_date).getTime(), hasReviewed: !!item.has_reviewed }; });
  return result;
};

export const getUserReviews = async (uid: string): Promise<Review[]> => {
  const { data } = await supabase.from('reviews').select('*, pro:profiles!fk_review_pro(full_name)').eq('user_id', uid).order('date', { ascending: false });
  return (data || []).map((item: any) => ({
    id: item.id, proId: item.pro_id, proName: item.pro?.full_name || 'Expert',
    serviceType: item.service_type || '', stars: item.stars || 5, testimonies: item.testimonies || '', 
    date: new Date(item.date).getTime(), status: item.status || 'pending', 
    isVerified: !!item.is_verified, isAnonymous: !!item.is_anonymous
  }));
};

export const saveUnlock = async (uid: string, proId: string) => {
  await supabase.from('unlocked_pros').insert({ user_id: uid, pro_id: proId });
};

export const submitProfessionalReview = async (uid: string, proId: string, stars: number, testimonies: string, serviceType?: string, isAnonymous: boolean = false) => {
  await supabase.from('reviews').insert({ user_id: uid, pro_id: proId, stars, testimonies, service_type: serviceType, is_anonymous: isAnonymous, status: 'pending', date: new Date().toISOString() });
};

export const getProStats = async (proId: string) => {
  if (proId.startsWith('mock-')) {
    const mock = getLocalMocks().find(m => m.id === proId);
    return { 
      profile_views: Number(mock?.profileViews) || 0, 
      profile_unlocks: Number(mock?.profileUnlocks) || 0 
    };
  }
  const { data } = await supabase.from('profiles').select('profile_views, profile_unlocks').eq('id', proId).maybeSingle();
  return { 
    profile_views: Number(data?.profile_views) || 0, 
    profile_unlocks: Number(data?.profile_unlocks) || 0 
  };
};

export const uploadVerificationDocs = async (uid: string, files: File[]) => {
  const urls = await Promise.all(files.map(async (file, i) => {
    const ext = file.name.split('.').pop();
    const path = `${uid}/v_${i}_${Date.now()}.${ext}`;
    await supabase.storage.from('verification-docs').upload(path, file);
    return supabase.storage.from('verification-docs').getPublicUrl(path).data.publicUrl;
  }));
  await supabase.from('profiles').update({ document_url: urls, verification_status: 'pending' }).eq('id', uid);
  return true;
};

export const deleteUserProfile = async (uid: string) => {
  await supabase.from('delete_requests').insert([{ id: uid }]);
  return { success: true };
};

export const updateUserPlan = async (uid: string, planName: string) => {
  const now = new Date();
  let monthsToAdd = 1;
  const lowerPlan = planName.toLowerCase();
  
  // LOGIQUE DE CALCUL DE L'EXPIRATION STRICTE : 6 MOIS POUR FOUNDING MEMBER
  if (lowerPlan.includes('early') || lowerPlan.includes('founding')) {
    monthsToAdd = 6; 
  } else if (lowerPlan.includes('elite') || lowerPlan.includes('annual')) {
    monthsToAdd = 12;
  }
  
  // Calcul précis : on ajoute le nombre de mois à la date actuelle
  const expirationDate = new Date();
  expirationDate.setMonth(now.getMonth() + monthsToAdd);
  
  // Si le jour du mois dépasse la fin du mois cible (ex: 31 Jan + 1 mois -> 28 Fev), 
  // setMonth gère cela nativement en JS en débordant sur le mois suivant. 
  // On s'assure d'avoir l'ISOString final.
  const subscriptionEndsAt = expirationDate.toISOString();

  const { data, error } = await supabase.from('profiles').update({ 
    pro_plan: planName, 
    is_subscribed: true, 
    plan_status: 'active', 
    subscription_ends_at: subscriptionEndsAt,
    cancel_at_period_end: false,
    updated_at: new Date().toISOString() 
  }).eq('id', uid).select().single();
  
  if (error) throw error;
  return data;
};

export const cancelUserPlan = async (uid: string) => {
  return await supabase.from('profiles').update({ cancel_at_period_end: true }).eq('id', uid);
};

export const reactivateUserPlan = async (uid: string) => {
  return await supabase.from('profiles').update({ cancel_at_period_end: false }).eq('id', uid);
};

export const updateFeaturedStatus = async (uid: string, isFeatured: boolean) => {
  const { data, error } = await supabase.from('profiles').update({ is_featured: isFeatured, updated_at: new Date().toISOString() }).eq('id', uid).select().single();
  if (error) throw error;
  return data;
};

export const getAdminReviews = async (): Promise<Review[]> => {
  const { data } = await supabase.from('reviews').select('*, author:profiles!fk_review_author(full_name, avatar_url), pro:profiles!fk_review_pro(full_name)').order('date', { ascending: false });
  return (data || []).map((item: any) => ({
    id: item.id, proId: item.pro_id, userId: item.user_id, serviceType: item.service_type || '', 
    stars: item.stars || 5, testimonies: item.testimonies || '', date: new Date(item.date).getTime(), 
    status: item.status as ReviewStatus, isVerified: !!item.is_verified, isAnonymous: !!item.is_anonymous,
    userName: item.author?.full_name || 'Expatrié', userAvatar: item.author?.avatar_url, proName: item.pro?.full_name || 'Expert'
  }));
};

export const updateReviewStatus = async (reviewId: string, status: ReviewStatus) => {
  await supabase.from('reviews').update({ status }).eq('id', reviewId);
};

export const getAllProfilesForAdmin = async (): Promise<Professional[]> => {
  const { data } = await supabase.from('profiles').select(FULL_PRO_COLUMNS).eq('is_pro', true).is('deleted_at', null).order('full_name', { ascending: true }); 
  return (data || []).map(mapDBRowToPro);
};

export const updateExpertVerificationStatus = async (userId: string, status: VerificationStatus) => {
  await supabase.from('profiles').update({ verification_status: status, verified: status === 'verified' }).eq('id', userId);
};

export const setUserRole = async (uid: string, role: UserType) => {
  const { data, error } = await supabase.from('profiles').update({ role_selected: true, is_expat: role === 'expat', is_pro: role === 'pro' }).eq('id', uid).select().single();
  if (error) throw error;
  return data;
};