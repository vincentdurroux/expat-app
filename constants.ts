import { Professional, Gender, Review } from './types';

// Define the list of professions supported by the platform
export const PROFESSIONS = [
  'Handyman', 'Plumber', 'Electrician', 'Real Estate Agent', 
  'Immigration Lawyer', 'International Tax Expert', 'Chartered Accountant', 'Relocation Specialist', 
  'Nanny', 'Language Teacher', 'AuPair',
  'General Practitioner', 'Pediatrician', 'Gynecologist', 'Dentist', 'Orthodontist', 
  'Ophthalmologist', 'Dermatologist', 'Osteopath', 'Physiotherapist', 'Chiropractor', 
  'Acupuncturist', 'Speech Therapist', 'Psychologist', 'Psychotherapist', 'Nutritionist', 'Midwife',
  'Yoga Teacher', 'Pilates Instructor', 'Personal Trainer', 'Sophrologist', 'Life Coach', 'Career Coach', 'Naturopath', 'Massage Therapist', 'Beautician',
  'Painter', 'Carpenter', 'Locksmith', 'Mason', 'Kitchen Designer', 'Gardener', 'Pool Technician', 'AC Technician',
  'Real Estate Lawyer', 'Property Hunter', 'Sworn Translator',
  'Baby-sitter', 'School Tutor', 'Educational Consultant', 'Parent Coach', 'Birthday Entertainer',
  'ChildcareAssistant', 'Doula',
  'Veterinarian', 'DogTrainer', 'AnimalBehaviorist', 'DogWalker', 'PetSitter', 'PetBoarding', 'PetGroomer', 'PetRelocation', 'HolisticVeterinarian',
  'InternationalMover', 'GlobalMobilityExpert', 'ExpatCoach', 'InterculturalExpert', 'ExpatConcierge', 'InterpreterAssistant', 'HomologationExpert'
];

// Professions that require regulatory documentation for verification
export const QUALIFIED_PROFESSIONS = [
  'Immigration Lawyer', 'Real Estate Lawyer', 'Business Lawyer', 'Family Lawyer', 
  'International Tax Expert', 'Chartered Accountant', 'Private GP', 'Medical Specialist', 
  'Dentist', 'Psychologist', 'Psychiatrist', 'Notary',
  'General Practitioner', 'Pediatrician', 'Gynecologist', 'Orthodontist', 
  'Ophthalmologist', 'Dermatologist', 'Osteopath', 'Physiotherapist', 'Chiropractor', 
  'Acupuncturist', 'Speech Therapist', 'Psychotherapist', 'Nutritionist', 'Midwife',
  'Sworn Translator', 'Educational Consultant', 'ChildcareAssistant',
  'Veterinarian', 'HolisticVeterinarian', 'HomologationExpert', 'GlobalMobilityExpert'
];

// Popular destinations for expatriates - Restricted to Madrid, Barcelona, Valencia
export const POPULAR_CITIES = ['Madrid', 'Barcelona', 'Valencia'];

// Data for Spanish Cities including coordinates for distance calculation fallback
export const SPANISH_CITY_DATA: Record<string, { lat: number, lng: number }> = {
  'Madrid': { lat: 40.4168, lng: -3.7038 },
  'Barcelona': { lat: 41.3851, lng: 2.1734 },
  'Valencia': { lat: 39.4699, lng: -0.3763 },
  'Sevilla': { lat: 37.3891, lng: -5.9845 },
  'Zaragoza': { lat: 41.6488, lng: -0.8891 },
  'Malaga': { lat: 36.7213, lng: -4.4214 },
  'Murcia': { lat: 37.9922, lng: -1.1307 },
  'Palma': { lat: 39.5696, lng: 2.6502 },
  'Las Palmas': { lat: 28.1235, lng: -15.4363 },
  'Bilbao': { lat: 43.2630, lng: -2.9350 },
  'Alicante': { lat: 38.3452, lng: -0.4815 },
  'Cordoba': { lat: 37.8882, lng: -4.7794 },
  'Valladolid': { lat: 41.6523, lng: -4.7245 },
  'Vigo': { lat: 42.2406, lng: -8.7207 },
  'Gijon': { lat: 43.5357, lng: -5.6615 },
  'Hospitalet': { lat: 41.3597, lng: 2.1003 },
  'Vitoria': { lat: 42.8467, lng: -2.6716 },
  'Elche': { lat: 38.2669, lng: -0.6984 },
  'Granada': { lat: 37.1773, lng: -3.5986 },
  'Terrassa': { lat: 41.5632, lng: 2.0189 },
  'Badalona': { lat: 41.4470, lng: 2.2449 },
  'Oviedo': { lat: 43.3614, lng: -5.8493 },
  'Cartagena': { lat: 37.6051, lng: -0.9862 },
  'Sabadell': { lat: 41.5433, lng: 2.1094 },
  'Jerez': { lat: 36.6850, lng: -6.1261 },
  'Mostoles': { lat: 40.3222, lng: -3.8649 },
  'Santa Cruz': { lat: 28.4636, lng: -16.2518 },
  'Pamplona': { lat: 42.8125, lng: -1.6458 },
  'Almeria': { lat: 36.8340, lng: -2.4637 },
  'Alcala de Henares': { lat: 40.4820, lng: -3.3596 },
  'Fuenlabrada': { lat: 40.2842, lng: -3.7939 },
  'Leganes': { lat: 40.3282, lng: -3.7656 },
  'San Sebastian': { lat: 43.3183, lng: -1.9812 },
  'Getafe': { lat: 40.3083, lng: -3.7327 },
  'Burgos': { lat: 42.3439, lng: -3.6969 },
  'Albacete': { lat: 38.9942, lng: -1.8585 },
  'Castellon': { lat: 39.9864, lng: -0.0513 },
  'Santander': { lat: 43.4623, lng: -3.8099 },
  'Alcorcon': { lat: 40.3458, lng: -3.8249 },
  'La Laguna': { lat: 28.4871, lng: -16.3159 },
  'Logrono': { lat: 42.4627, lng: -2.4450 },
  'Badajoz': { lat: 38.8794, lng: -6.9706 },
  'Marbella': { lat: 36.5101, lng: -4.8824 },
  'Salamanca': { lat: 40.9701, lng: -5.6635 },
  'Huelva': { lat: 37.2614, lng: -6.9447 },
  'Lleida': { lat: 41.6176, lng: 0.6200 },
  'Tarragona': { lat: 41.1189, lng: 1.2445 },
  'Dos Hermanas': { lat: 37.2829, lng: -5.9221 },
  'Parla': { lat: 40.2372, lng: -3.7741 },
  'Torrejon': { lat: 40.4589, lng: -3.4797 }
};

export const SPANISH_CITIES = Object.keys(SPANISH_CITY_DATA);

// Destination objects for Landing Page Hubs
export const DESTINATIONS = [
  { name: 'Madrid', ...SPANISH_CITY_DATA['Madrid'] },
  { name: 'Barcelona', ...SPANISH_CITY_DATA['Barcelona'] },
  { name: 'Valencia', ...SPANISH_CITY_DATA['Valencia'] }
];

// Supported languages for expert filter - GREATLY EXPANDED
export const LANGUAGES = [
  'English', 'French', 'Spanish', 'German', 'Italian', 'Dutch', 'Portuguese', 
  'Russian', 'Ukrainian', 'Arabic', 'Chinese', 'Japanese', 'Korean', 
  'Polish', 'Turkish', 'Swedish', 'Danish', 'Norwegian', 'Finnish', 
  'Greek', 'Hebrew', 'Hindi', 'Romanian', 'Hungarian', 'Czech', 'Slovak', 'Bulgarian'
];

/**
 * Transforme un code pays ISO (2 lettres) en emoji drapeau
 */
export const getFlagEmoji = (countryCode: string) => {
  if (!countryCode || countryCode.length !== 2) return '🏳️';
  return countryCode.toUpperCase().replace(/./g, char => 
    String.fromCodePoint(char.charCodeAt(0) + 127397)
  );
};

// Visual flags for languages - UPDATED
export const LANGUAGE_FLAGS: Record<string, string> = {
  'English': '🇬🇧', 'French': '🇫🇷', 'Spanish': '🇪🇸', 'German': '🇩🇪', 'Italian': '🇮🇹', 'Dutch': '🇳🇱', 
  'Portuguese': '🇵🇹', 'Russian': '🇷🇺', 'Ukrainian': '🇺🇦', 'Arabic': '🇦🇪', 'Chinese': '🇨🇳', 
  'Japanese': '🇯🇵', 'Korean': '🇰🇷', 'Polish': '🇵🇱', 'Turkish': '🇹🇷', 'Swedish': '🇸🇪', 
  'Danish': '🇩🇰', 'Norwegian': '🇳🇴', 'Finnish': '🇫🇮', 'Greek': '🇬🇷', 'Hebrew': '🇮🇱', 
  'Hindi': '🇮🇳', 'Romanian': '🇷🇴', 'Hungarian': '🇭🇺', 'Czech': '🇨🇿', 'Slovak': '🇸🇰', 'Bulgarian': '🇧🇬'
};

// Indicateurs téléphoniques étendus
export const COUNTRY_DIAL_CODES = [
  { name: 'Espagne', code: '+34', flag: '🇪🇸' },
  { name: 'France', code: '+33', flag: '🇫🇷' },
  { name: 'Royaume-Uni', code: '+44', flag: '🇬🇧' },
  { name: 'Italie', code: '+39', flag: '🇮🇹' },
  { name: 'Pays-Bas', code: '+31', flag: '🇳🇱' },
  { name: 'USA', code: '+1', flag: '🇺🇸' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' }
];

// Standard ISO 3166-1 alpha-2 country codes
export const ISO_COUNTRIES = [
  'AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BQ', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'CV', 'KH', 'CM', 'CA', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UM', 'UY', 'UZ', 'VU', 'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW'
];

// Groups of professions categorized by sector
export const PROFESSION_CATEGORIES: Record<string, string[]> = {
  expatServices: [
    'Relocation Specialist', 'InternationalMover', 'GlobalMobilityExpert', 'ExpatCoach', 'InterculturalExpert', 'ExpatConcierge', 'InterpreterAssistant', 'HomologationExpert'
  ],
  health: [
    'General Practitioner', 'Pediatrician', 'Gynecologist', 'Dentist', 'Orthodontist', 
    'Ophthalmologist', 'Dermatologist', 'Osteopath', 'Physiotherapist', 'Chiropractor', 
    'Acupuncturist', 'Speech Therapist', 'Psychologist', 'Psychotherapist', 'Nutritionist', 'Midwife'
  ],
  legal: ['Real Estate Lawyer', 'Immigration Lawyer', 'Sworn Translator', 'International Tax Expert', 'Chartered Accountant'],
  realEstate: ['Real Estate Agent', 'Property Hunter'],
  pets: [
    'Veterinarian', 'DogTrainer', 'AnimalBehaviorist', 'DogWalker', 'PetSitter', 'PetBoarding', 'PetGroomer', 'PetRelocation', 'HolisticVeterinarian'
  ],
  family: ['Nanny', 'Baby-sitter', 'Language Teacher', 'School Tutor', 'Educational Consultant', 'Parent Coach', 'Birthday Entertainer', 'AuPair'],
  wellness: [
    'Yoga Teacher', 'Pilates Instructor', 'Personal Trainer', 'Sophrologist', 'Life Coach', 'Career Coach', 'Naturopath', 'Massage Therapist', 'Beautician'
  ],
  home: ['Electrician', 'Plumber', 'Handyman', 'Painter', 'Carpenter', 'Locksmith', 'Mason', 'Kitchen Designer', 'Gardener', 'Pool Technician', 'AC Technician']
};

// Map of common specialties per profession for easy selection
export const SPECIALTIES_MAP: Record<string, string[]> = {
  'Relocation Specialist': ['InstallationPack', 'HousingSearch', 'BankOpening', 'UtilitySetup'],
  'InternationalMover': ['MoverIntTransport', 'CustomsManagement', 'TransitInsurance', 'SpecialPacking'],
  'GlobalMobilityExpert': ['ExpatContracts', 'EmployeeSecondment', 'PackageOptimization', 'ExpatCompliance'],
  'ExpatCoach': ['DeparturePrep', 'CultureShock', 'Impatriation', 'FamilyCoaching'],
  'InterculturalExpert': ['WorkPlaceCodes', 'CulturalMediation', 'LocalManagement'],
  'ExpatConcierge': ['VIPServices', 'LastMinuteBooking', 'DailyAdmin', 'Assistance247'],
  'InterpreterAssistant': ['AdminAppointments', 'OralTranslation', 'LiveSupport'],
  'HomologationExpert': ['DegreeRecognition', 'TitleEquivalence', 'SkillsValidation'],
  'AuPair': ['LightHousekeeping', 'ChildCareSupport', 'LanguageExchange', 'FlexibleHours'],
  'Veterinarian': ['Surgery', 'Emergency24h', 'Imaging', 'Dental'],
  'DogTrainer': ['Obedience', 'BehavioralRehab', 'Agility', 'Puppies'],
  'AnimalBehaviorist': ['SeparationAnxiety', 'Aggression', 'Marking', 'RelocationStress'],
  'DogWalker': ['IndividualWalk', 'PackWalk', 'SportyWalk'],
  'PetSitter': ['CatSitting', 'DailyVisits', 'HouseCare'],
  'PetBoarding': ['NightStay', 'IndividualBox', 'Playground'],
  'PetGroomer': ['ScissorCut', 'Trimming', 'Bath', 'NailTrim'],
  'PetRelocation': ['IntTransport', 'IATACages', 'VaccineCustoms'],
  'HolisticVeterinarian': ['Acupuncture', 'Phytotherapy', 'Osteopathy'],
  'ChildcareAssistant': ['PostNatalCare', 'SleepTraining', 'InfantNutrition', 'BabyAwakening'],
  'Doula': ['PregnancySupport', 'BirthSupport', 'PostPartum', 'Breastfeeding'],
  'Nanny': ['SharedCare', 'ShiftHours', 'Montessori', 'Newborns'],
  'Baby-sitter': ['OccasionalCare', 'Evenings', 'ActivitySupport', 'Weekends'],
  'Language Teacher': ['Spanish', 'CatalanValencian', 'English', 'FrenchFLE'],
  'School Tutor': ['HomeworkHelp', 'ExamPrep', 'Methodology', 'MathScience'],
  'Educational Consultant': ['SchoolChoice', 'Matriculacion', 'Homologation'],
  'Parent Coach': ['ConflictManagement', 'PositiveEducation', 'CultureShockKids'],
  'Birthday Entertainer': ['Magic', 'FacePainting', 'TreasureHunt', 'Themes'],
  'Real Estate Lawyer': ['NotaSimple', 'PurchaseContracts', 'RentalDisputes', 'PropertyVerification'],
  'Immigration Lawyer': ['DigitalNomadVisa', 'GoldenVisa', 'TIEAssistance', 'NIEApplication', 'SpanishNationality'],
  'Sworn Translator': ['OfficialTranslation', 'Diplomas', 'NotaryActs', 'CivilStatus'],
  'Property Hunter': ['LongTermRental', 'PriceNegotiation', 'RemoteInspection', 'DistrictExpert'],
  'Real Estate Agent': ['Sales', 'TouristRental', 'RentalManagement', 'Investment'],
  'General Practitioner': ['Checkup', 'MedicalCertificates', 'SpecialistOrientation', 'ChronicFollowUp'],
  'Pediatrician': ['Newborns', 'Vaccinations', 'GrowthFollowUp', 'PediatricEmergencies'],
  'Gynecologist': ['PregnancyFollowUp', 'Menopause', 'AnnualCheckup', 'Contraception'],
  'Dentist': ['Cavities', 'Implants', 'Whitening', 'Cleaning'],
  'Orthodontist': ['BracesKids', 'BracesAdults', 'Invisalign', 'ClassicBrackets'],
  'Ophthalmologist': ['VisionCheck', 'LaserSurgery', 'ContactLenses', 'Glaucoma'],
  'Dermatologist': ['Moles', 'Acne', 'SunExposure', 'Psoriasis'],
  'Osteopath': ['Cranial', 'Visceral', 'BackPain', 'Posture'],
  'Physiotherapist': ['PostOpRehab', 'SportsPhysio', 'MedicalMassage', 'LymphaticDrainage'],
  'Chiropractor': ['VertebralAdjustment', 'Posture', 'CervicalPain', 'Sciatica'],
  'Acupuncturist': ['EnergyBalance', 'PainManagement', 'StressSleep', 'SmokingCessation'],
  'Speech Therapist': ['Bilingualism', 'SwallowingDisorders', 'LanguageDelay', 'Stuttering'],
  'Psychologist': ['CBT', 'EMDR', 'Depression', 'AnxietyManagement'],
  'Psychotherapist': ['Analysis', 'GroupTherapy', 'CoupleTherapy', 'PsychologicalSupport'],
  'Nutritionist': ['DietPlan', 'FoodAllergies', 'Rebalancing', 'WeightLoss'],
  'Midwife': ['BirthPrep', 'PostPartum', 'Breastfeeding', 'PelvicRehab'],
  'Yoga Teacher': ['Hatha', 'Vinyasa', 'Prenatal', 'GuidedMeditation'],
  'Pilates Instructor': ['Reformer', 'Matwork', 'PostureWork', 'CoreStrength'],
  'Personal Trainer': ['WeightLoss', 'MuscleBuilding', 'HIIT', 'PhysicalPrep'],
  'Sophrologist': ['DynamicRelaxation', 'StressManagement', 'ExamPrep', 'Sleep'],
  'Life Coach': ['LifeTransition', 'SelfConfidence', 'EmotionalManagement', 'WorkLifeBalance'],
  'Career Coach': ['JobSearchSpain', 'CareerChange', 'LinkedInOptimization', 'JobInterview'],
  'Naturopath': ['Phytotherapy', 'EssentialOils', 'Detox', 'NaturalNutrition'],
  'Massage Therapist': ['Swedish', 'Thai', 'Ayurvedic', 'Sports'],
  'Beautician': ['Facials', 'SkinCare', 'LaserHairRemoval', 'Manicure'],
  'Electrician': ['Panels', 'Domotics', 'AC', 'EmergencyRepairs'],
  'Plumber': ['Sanitary', 'WaterHeater', 'Unclogging', 'Leaks'],
  'Painter': ['Coatings', 'Decorative', 'Facades', 'Wallpaper'],
  'Carpenter': ['CustomFurniture', 'Doors', 'Parquet', 'Kitchens'],
  'Locksmith': ['DoorOpening', 'CylinderChange', 'Shielding', 'Safes'],
  'Mason': ['Walls', 'Tiling', 'SmallExtensions', 'Plastering'],
  'Kitchen Designer': ['Installation', 'Worktop', '3DDesign', 'Renovation'],
  'Gardener': ['Pruning', 'LawnLaying', 'VegetableGarden', 'AnnualMaintenance'],
  'Pool Technician': ['Cleaning', 'PumpsFilters', 'Sealing', 'Winterizing'],
  'AC Technician': ['SplitInstallation', 'GasRefill', 'Maintenance', 'HeatPump'],
  'International Tax Expert': ['NHR', 'USSpainTreaty', 'WealthTax', 'CryptoTax'],
  'Chartered Accountant': ['AutonomoSetup', 'VATFilings', 'CorporateTax', 'Payroll', 'TaxOptimization'],
  'Handyman': ['GeneralRepairs', 'FurnitureAssembly', 'WallMounting', 'Painting', 'ApplianceInstall']
};
