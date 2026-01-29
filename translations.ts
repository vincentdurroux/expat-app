export type Language = 'en' | 'fr' | 'es';

const en = {
  nav: {
    brandSub: "ExpaLink Global", explore: "Explore", howItWorks: "How it Works", professionals: "Professionals",
    findPro: "Find a Pro", myRelocation: "My Relocation", buyCredits: "Buy Credits", myBusiness: "My Business",
    plans: "Plans & Visibility", earlyMember: "Founding Member", login: "Log in", signup: "Sign Up",
    logout: "Log out", switchPro: "Pro Mode", switchExpat: "Expat Mode", myProfile: "My Profile", brandSubName: "ExpaLink",
    brandSubNameFull: "ExpaLink Global Network"
  },
  hero: {
    badge: "Trusted by 50,000+ Expats", title: "Premium expat directory.", subtitle: "Finally.",
    description: "Find, unlock and connect with verified professionals who truly understand you.",
    cta: "Get My Access", ctaExpat: "I am an Expatriate", ctaPro: "I am a Professional", creditInfo: "1 Credit per profile unlock"
  },
  search: {
    title: "Find your local expert", badge: "EXPERT SEARCH",
    placeholderProf: "What professional?", placeholderCity: "City or location", placeholderLang: "Preferred language",
    btn: "Search", nearMe: "Near me", 
    categories: { 
      expatServices: "Relocation & Expat Services", health: "Health & Medical", wellness: "Wellness & Sport", 
      legal: "Legal & Juridical", realEstate: "Housing & Real Estate", home: "Home & Craftsmanship", 
      family: "Family & Education", pets: "Pets & Animals" 
    },
    noResultsTitle: "No experts found"
  },
  landing: {
    presence: { title: "We are present in Spain", cities: "Madrid • Barcelona • Valencia • Malaga • Seville • Alicante • Zaragoza" },
    results: { searchOrigin: "Search Results", close: "Close", noneTitle: "No experts found", noneDesc: "Try adjusting your filters or searching a larger area." },
    testimonialTag: "Testimonials", testimonialTitle: "Trusted by the community",
    testimonial1: { quote: "ExpaLink made my transition to Madrid so much easier. I found a tax expert who saved me thousands.", user: "Sarah J.", role: "Digital Nomad" },
    testimonial2: { quote: "The verification process is serious. I finally feel safe hiring local pros in Spain.", user: "Mark D.", role: "Expatriate in Valencia" },
    earlyCTA: { title: "Are you a Pro?", subtitle: "Get 6 months for free", desc: "Join our exclusive Founding Member program and grow your business with the expat community.", btn: "Join Now" }
  },
  howItWorks: {
    title: "How it Works",
    subtitle: "ExpaLink connects you with the best local experts in Spain in 5 simple steps.",
    step1: { title: "Search", desc: "Use our search engine to find the exact expert you need.", badge: "Discovery" },
    step2: { title: "Buy Credits", desc: "Purchase credits to unlock verified contact information securely.", badge: "Access" },
    step3: { title: "Unlock", desc: "Select the professional and unlock their phone, email, and address.", badge: "Connection" },
    step4: { title: "Contact", desc: "Get in touch directly with the expert to discuss your needs.", badge: "Action" },
    step5: { title: "Review", desc: "Share your experience with the community to help other expats.", badge: "Trust" },
    experience: {
      tag: "Premium Experience", title: "Built for Expats",
      desc1: "We understand the challenges of moving abroad. That's why we personally verify our top professionals.",
      desc2: "Our network only includes experts who have a proven track record with the international community.",
      visualTag: "Verified", visualText: "Quality of service guaranteed."
    }
  },
  forms: {
    title: "Professional Profile", subtitle: "Complete your profile", identity: "Identity & Photo", expertise: "Expertise & Services", contactZones: "Contact & Location",
    fullName: "Full Name", fullNamePlaceholder: "John Doe", company: "Company Name", companyPlaceholder: "Doe Consulting SL",
    genderLabel: "Gender", nationality: "Nationality", searchNationality: "Search a country...", languages: "Languages", add: "Add",
    mainProfession: "Main Profession", profSelectPlaceholder: "Select your main activity", yearsOfExperience: "Years of Experience",
    expBeginner: "Beginner", expExpert: "Expert", services: "Services & Specialties", specialtiesPlaceholder: "Add a custom specialty...",
    profDescription: "Professional Bio", minChars: "min.", bioPlaceholder: "Describe your path, your expertise and how you help expats...",
    phoneMain: "Professional Phone", phonePlaceholder: "612 345 678", dialSearchPlaceholder: "Search code...",
    emailPro: "Professional Email", emailPlaceholder: "contact@pro.com", website: "Website URL", websitePlaceholder: "https://www.pro.com",
    address: "Business Address", addressPlaceholder: "Street, Number, Floor...", cities: "Geographic Coverage", searchCity: "Search a city...",
    finalize: "Save Profile", mapsError: "Google Maps could not be loaded."
  },
  profileModal: { businessAddress: "Business Address", about: "About", specialties: "Specialties", unlockPrompt: "Unlock this contact" },
  credits: {
    title: "Unlock Connections", subtitle: "Buy credits to access verified professional contact details.", balance: "{{amount}} Credits",
    unit: "Credits", billingNote: "One-time payment", buyCTA: "Buy Now", secure: "Secure Payment", instant: "Instant Delivery", noExp: "Never Expires",
    packages: {
      starter: { label: "Starter Pack", desc: "Perfect for a quick need" },
      popular: { label: "Standard Pack", desc: "Best for a full relocation" },
      value: { label: "Premium Pack", desc: "Maximum flexibility" }
    }
  },
  notifications: {
    noCredits: "You don't have enough credits.", unlocked: "Expert unlocked successfully!", unlockError: "Error unlocking expert.",
    profileSaved: "Profile updated successfully!", creatingProfile: "Creating your professional space..."
  },
  profile: {
    save: "Save", edit: "Edit Profile", personalDetails: "Personal Details", joinedOn: "Joined ExpaLink on",
    dangerZone: "Danger Zone", deleteAccount: "Permanently delete your account and all data.", deleteBtn: "Delete My Account",
    deleteConfirmTitle: "Are you sure?", deleteConfirmMessagePro: "Your professional profile and visibility will be removed forever.",
    deleteConfirmMessageExpat: "Your unlocked contacts and reviews will be lost.", confirmInputLabel: "Type '{{text}}' to confirm",
    roleNotSelected: "Role not selected", proProfile: "Professional Profile", expatProfile: "Expatriate Profile", ownerAccess: "My Profile",
    switchToProTitle: "Switch to Pro Mode?", switchToProMsg: "You will be able to manage your visibility and services.",
    switchToExpatTitle: "Switch to Expat Mode?", switchToExpatMsg: "You will return to the directory to find professionals."
  },
  expatHome: {
    relocationSpace: "My Relocation Space", switchToPro: "I am also a Pro", credits: "Available Credits", saved: "Unlocked Experts",
    quickExplore: "QUICK EXPLORE", expertsOnSite: "Experts on ExpaLink",
    areYouExpert: "Are you a professional?", joinNetwork: "Join our global network", becomePro: "Switch to Pro Mode"
  },
  proHome: {
    description: "Grow your business with the expatriate community in Spain.", dashboardBtn: "My Dashboard", switchToExpat: "I am an Expatriate", qualifiedLeads: "Qualified Leads",
    motivational: ["Your expertise changes lives.", "Ready to meet your next client?", "Excellence is your trademark."],
    badgesSection: {
      title: "Your Trust Assets", subtitle: "These badges reinforce your credibility with the community.",
      verified: "Verified Profile", featured: "Featured Pro", early: "Founding Member", earnedTag: "Active", lockedTag: "To Unlock"
    }
  },
  expatDashboard: {
    title: "Relocation Dashboard", subtitle: "Manage your contacts and your transition to Spain.", creditsLabel: "My Credits", unlockedTitle: "My Unlocked Experts", noExpertsTitle: "No experts yet", noExpertsDesc: "Start your search to find the best local professionals.",
    citySection: { title: "Your destination", desc: "Select your destination city to receive personalized recommendations." },
    accessDirectory: "Access Directory",
    reviews: {
      sectionTitle: "Reviews & Feedback", waitingTitle: "Pending reviews", evaluateBtn: "Rate now", historyTitle: "My review history", modalTitle: "Rate this Expert", modalSubtitle: "Your experience with {{name}}",
      ratingLabel: "Score", commentLabel: "Your testimonial (min. 20 chars)", placeholder: "Tell the community about the quality of service...", anonymousToggle: "Post as anonymous", submitBtn: "Post Review", postedOn: "Posted on", empty: "No reviews yet.",
      status: { pending: "Under Moderation", verified: "Published", rejected: "Rejected" },
      anonymous: "Anonymous", manualVerification: "Manual Verification"
    },
    toolsTitle: "Tools & Help", support: "Personalized Support",
    proInvite: {
      titleExpat: "Are you a professional?", descExpat: "Offer your services to the expat community.", btnExpat: "Create Pro Profile",
      titlePro: "Manage your business", descPro: "Access your dashboard to see your performance.", btnPro: "Pro Dashboard"
    }
  },
  dashboard: {
    proTitle: "Professional Dashboard", proSubtitle: "Track your performance and manage your visibility.", modifyProfile: "Edit Profile", modifyBio: "Edit Bio",
    stats: { views: "Profile Views", leads: "Contact Unlocks", rating: "Average Rating" }, completion: { label: "Profile Completion" },
    visibility: { label: "Visibility", online: "Public", masked: "Hidden" },
    plan: { title: "Current Plan", none: "No active plan", expires: "Active until {{date}}", manage: "Manage Plan", view: "View Plans", reactivate: "Reactivate", cancel: "Cancel" },
    badges: { livePreviewLabel: "DIRECTORY PREVIEW", early: "FOUNDING MEMBER" },
    verification: {
      banner: { none: "Profile not verified", pending: "Verification pending", pendingDesc: "Our team is reviewing your documents. This usually takes 24-48h.", verified: "Profile Verified", rejected: "Verification rejected", cta: "Verify Now" },
      section: { title: "Trust & Verification", subtitle: "Official Identity & Diplomas", uploadBtn: "Upload Documents", editBtn: "Update Documents", support: "PDF, JPG or PNG (Max 3 files).", errorLimit: "Maximum 3 files allowed." }
    }
  },
  subscription: {
    chooseVisibility: "Boost your visibility", launchOffer: "Early Access Offer", freeDuration: "6 Months Free", launchPhaseDesc: "", comingSoon: "Coming Soon",
    whyDisabledTitle: "Premium Plans", whyDisabledDesc: "Additional plans will be available after the initial launch phase.",
    confirmCancelTitle: "Cancel Subscription", confirmCancelMsg: "Your subscription will remain active until the end of the current period.",
    confirmReactivateTitle: "Reactivate Subscription", confirmReactivateMsg: "Your subscription will continue normally.",
    plans: {
      early: { 
        name: "Founding Member", desc: "Limited early bird offer", 
        features: ["Full access for 6 months", "Profile visibility & creation", "Standard city positioning", "Founding Member Badge", "Priority on future features", "Standard support"], 
        cta: "Join Now" 
      },
      monthly: { 
        name: "Monthly Pro", desc: "Monthly flexibility", 
        features: ["Full access to platform", "Verified Pro Badge", "Lead reception", "Performance stats", "Real-time notifications", "Standard support", "Cancel anytime"], 
        cta: "Select" 
      },
      elite: { 
        name: "Annual Pro", desc: "Best value - Save 60€/year", 
        features: ["Everything in Monthly Pro", "Priority positioning in city", "Monthly bonus credits", "Verified Pro Badge", "Priority support", "Guaranteed price for 1 year", "Discount on Featured badge"], 
        cta: "Go Annual" 
      }
    },
    billing: { 
      free: "0€ — Limited time offer", monthly: "25€ / month", annual: "240€ / year (20€/mo)", perMonth: "mo", total: "{{amount}}€ / year", savings: "Save 60€ / year vs Monthly", fullYear: "Total for 12 months", halfYear: "Total for 6 months", for12Months: "for 12 months", for6Months: "for 6 months"
    },
    featuredBadge: { title: "Featured Badge", desc: "Appearance at the top of search results", included: "Reduced price with Annual Pro", activate: "Activate Boost", deactivate: "Deactivate", cancelConfirm: "Do you want to deactivate your Featured status at the end of the period?", unavailable: "Not available for free plans" },
    summary: { planPrice: "Plan Price", badgePrice: "Visibility Option", totalMonthly: "Total / month", totalUpfront: "Total to pay", payBtn: "Confirm Access" }
  },
  admin: {
    title: "Administration", subtitle: "Moderation of reviews and experts.", loading: "Loading...", tabs: { reviews: "Reviews", profiles: "Experts" },
    reviews: { colExpat: "Expat", colPro: "Professional", colRating: "Rating", colComment: "Comment", colStatus: "Status", publishBtn: "Approve", rejectBtn: "Reject", empty: "No reviews to moderate.", pending: "Pending", verified: "Verified", rejected: "Rejected" },
    experts: { colName: "Expert", colCompany: "Company", colStatus: "Status", empty: "No experts found.", verifyBtn: "Verify", unverifyBtn: "Reject", none: "None", pending: "Pending", verified: "Verified", rejected: "Rejected" },
    errorStatus: "Error updating status", errorValidation: "Error updating validation"
  },
  common: {
    expert: "Expert", male: "Male", female: "Female", other: "Other", "prefer-not-to-say": "Not specified", na: "N/A", yearsExp: "years exp", verified: "Verified", featuredBadge: "Featured", unlock: "Unlock Contact", viewProfile: "View Profile", back: "Back", confirm: "Confirm", reactivate: "Reactivate", close: "Close", mostPopular: "Most Popular", guestUnlock: "Log in to Unlock", or: "or", verifiedReview: "Verified Review", noReviewsYet: "No reviews yet.", anonymousExpat: "Anonymous Expat", loaderPhrases: ["Preparing your space...", "Looking for matches...", "Connecting to experts..."], activePlan: "Active Plan", notSpecified: "Not specified", reviews: "Reviews", anonymousToggle: "Post as anonymous", action: "Action"
  },
  auth: {
    welcome: "Welcome", processing: "Processing...", secureBy: "Secure by ExpaLink", fillFields: "Please fill all required fields.", passLength: "Password must be at least 6 characters.", signUpSuccess: "Registration successful!", confirmEmail: "Please check your email to confirm your account.", invalidCreds: "Invalid login credentials.", genericError: "An error occurred. Please try again.", emailNotFound: "No account found with this email.", changeEmail: "Change email", title: "Authentication", subtitle: "Access your account or create one to continue.", signinTitle: "Welcome Back", signinSubtitle: "Log in to access your dashboard and saved experts.", signupTitle: "Join ExpaLink", signupSubtitle: "Create your account to start your relocation journey.", email: "Email Address", emailPlaceholder: "your@email.com", continueLogin: "Continue to Login", continueSignup: "Create an Account", pass: "Password", passPlaceholder: "••••••••", loginBtn: "Log In", signupBtn: "Sign Up"
  },
  professions: {
    Handyman: "Handyman", Plumber: "Plumber", Electrician: "Electrician", "Real Estate Agent": "Real Estate Agent", "Immigration Lawyer": "Immigration Lawyer", "International Tax Expert": "International Tax Expert", "Chartered Accountant": "Chartered Accountant", "Relocation Specialist": "Relocation Specialist",
    Nanny: "Nanny", "Language Teacher": "Language Teacher", AuPair: "Au Pair", "General Practitioner": "General Practitioner", Pediatrician: "Pediatrician", Gynecologist: "Gynecologist", Dentist: "Dentist", Orthodontist: "Orthodontist", 
    Ophthalmologist: "Ophthalmologist", Dermatologist: "Dermatologist", Osteopath: "Osteopath", Physiotherapist: "Physiotherapist", Chiropractor: "Chiropractor", 
    Acupuncturist: "Acupuncturist", "Speech Therapist": "Speech Therapist", Psychologist: "Psychologist", Psychotherapist: "Psychotherapist", Nutritionist: "Nutritionist", Midwife: "Midwife",
    "Yoga Teacher": "Yoga Teacher", "Pilates Instructor": "Pilates Instructor", "Personal Trainer": "Personal Trainer", Sophrologist: "Sophrologist", "Life Coach": "Life Coach", "Career Coach": "Career Coach", Naturopath: "Naturopath", "Massage Therapist": "Massage Therapist", Beautician: "Beautician",
    Painter: "Painter", Carpenter: "Carpenter", Locksmith: "Locksmith", Mason: "Mason", "Kitchen Designer": "Kitchen Designer", Gardener: "Gardener", "Pool Technician": "Pool Technician", "AC Technician": "AC Technician",
    "Real Estate Lawyer": "Real Estate Lawyer", "Property Hunter": "Property Hunter", "Sworn Translator": "Sworn Translator", "Baby-sitter": "Baby-sitter", "School Tutor": "School Tutor", "Educational Consultant": "Educational Consultant", "Parent Coach": "Parent Coach", "Birthday Entertainer": "Birthday Entertainer",
    ChildcareAssistant: "Childcare Assistant", Doula: "Doula", Veterinarian: "Veterinarian", DogTrainer: "Dog Trainer", AnimalBehaviorist: "Animal Behaviorist", DogWalker: "Dog Walker", PetSitter: "Pet Sitter", PetBoarding: "Pet Boarding", PetGroomer: "Pet Groomer", PetRelocation: "Pet Relocation Specialist", HolisticVeterinarian: "Holistic Veterinarian",
    InternationalMover: "International Mover", GlobalMobilityExpert: "Global Mobility Expert", ExpatCoach: "Expat Coach", InterculturalExpert: "Intercultural Expert", ExpatConcierge: "Expat Concierge", InterpreterAssistant: "Interpreter/Assistant", HomologationExpert: "Degree Homologation Expert"
  },
  cities: {
    Madrid: "Madrid", Barcelona: "Barcelona", Valencia: "Valencia", Sevilla: "Seville", Malaga: "Malaga", Alicante: "Alicante", Zaragoza: "Zaragoza", Murcia: "Murcia", Palma: "Palma de Mallorca", Bilbao: "Bilbao"
  },
  languages: {
    English: "English", French: "French", Spanish: "Spanish", German: "German", Italian: "Italian", Dutch: "Dutch", Portuguese: "Portuguese", Russian: "Russian", Ukrainian: "Ukrainian",
    Arabic: "Arabic", Chinese: "Chinese", Japanese: "Japanese", Korean: "Korean", Polish: "Polish", Turkish: "Turkish", Swedish: "Swedish", Danish: "Danish", Norwegian: "Norwegian", Finnish: "Finnish", Greek: "Greek", Hebrew: "Hebrew", Hindi: "Hindi", Romanian: "Romanian", Hungarian: "Hungarian", Czech: "Czech", Slovak: "Slovak", Bulgarian: "Bulgarian"
  },
  specialties: {
    InstallationPack: "Installation Pack", HousingSearch: "Housing Search", BankOpening: "Bank Opening", UtilitySetup: "Utility Setup", MoverIntTransport: "International Transport", customsManagement: "Customs Management", transitInsurance: "Transit Insurance", specialPacking: "Special Packing",
    expatContracts: "Expat Contracts", employeeSecondment: "Employee Secondment", packageOptimization: "Package Optimization", expatCompliance: "Expat Compliance", departurePrep: "Departure Preparation", cultureShock: "Culture Shock", impatriation: "Impatriation", familyCoaching: "Family Coaching",
    workPlaceCodes: "Workplace Codes", culturalMediation: "Cultural Mediation", localManagement: "Local Management", vipServices: "VIP Services", lastMinuteBooking: "Last Minute Booking", dailyAdmin: "Daily Administration", assistance247: "24/7 Assistance",
    adminAppointments: "Administrative Appointments", oralTranslation: "Oral Translation", liveSupport: "Live Support", degreeRecognition: "Degree Recognition", titleEquivalence: "Title Equivalence", skillsValidation: "Skills Validation",
    digitalNomadVisa: "Digital Nomad Visa", goldenVisa: "Golden Visa", tieAssistance: "TIE Assistance", nieApplication: "NIE Application", spanishNationality: "Spanish Nationality", notaSimple: "Nota Simple", purchaseContracts: "Purchase Contracts", rentalDisputes: "Rental Disputes", propertyVerification: "Property Verification",
    officialTranslation: "Official Translation", diplomas: "Diplomas", notaryActs: "Notary Acts", civilStatus: "Civil Status", longTermRental: "Long Term Rental", priceNegotiation: "Price Negotiation", remoteInspection: "Remote Inspection", districtExpert: "District Expert"
  },
  earlyMember: {
    badge: "Founding Member", title: "Be among the first.", subtitle: "Founding Member Program", desc: "Join our exclusive program for professionals who help us build the future of expat relocation in Spain.", status: { isMember: "You are a Founding Member" }, cta: "Join the Program", 
    program: { tag: "Exclusive Offer", title: "Founding Member", subtitle: "Free for 6 months", cancelAnytime: "Cancel anytime", limitedOffer: "Limited availability & limited time offer", includedTitle: "What's included", feature1: "Zero platform fees", feature2: "Priority in results", feature3: "Verified badge", feature4: "Founding member badge" }, 
    stats: { fee: "Monthly Fee", commission: "Commission" },
    plansInfo: {
      title: "A long-term vision", subtitle: "Your options after the 6 months", desc: "The Founding Member program is our way of thanking you for building this network with us. Here is an overview of the simplified structure that will take over to support your continued growth.",
      monthlyTitle: "Total Flexibility", annualTitle: "Commitment & Performance", cancelNote: "No commitment: you can cancel your profile at any time, even after the 6 months."
    }
  }
};

const fr = {
  ...en,
  nav: {
    ...en.nav,
    brandSub: "ExpaLink Global", howItWorks: "Comment ça marche", professionals: "Professionnels", findPro: "Trouver un expert", myRelocation: "Ma Relocation", buyCredits: "Acheter des crédits", myBusiness: "Mon Activité", plans: "Plans & Visibilité", earlyMember: "Membre Fondateur", login: "Connexion", logout: "Déconnexion", switchPro: "Mode Pro", switchExpat: "Mode Expat", myProfile: "Mon Profil"
  },
  hero: {
    ...en.hero,
    badge: "Approuvé par 50,000+ Expats", title: "L'annuaire premium pour expatriés.", subtitle: "Enfin.",
    description: "Trouvez, débloquez et connectez-vous avec des experts locaux qui vous comprennent vraiment.",
    cta: "Accéder au réseau", ctaExpat: "Je suis expatrié", ctaPro: "Je suis professionnel"
  },
  search: {
    ...en.search,
    title: "Trouvez votre expert local", placeholderProf: "Quel professionnel ?", placeholderCity: "Ville ou lieu", placeholderLang: "Langue préférée", btn: "Rechercher", nearMe: "Autour de moi", categories: { expatServices: "Services Expatriés", health: "Santé & Médical", wellness: "Bien-être & Sport", legal: "Juridique & Fiscal", realEstate: "Logement & Immo", home: "Maison & Artisanat", family: "Famille & Éducation", pets: "Animaux" }
  },
  landing: {
    ...en.landing,
    presence: { title: "Nous sommes présents en Espagne", cities: "Madrid • Barcelone • Valence • Malaga • Séville • Alicante • Saragosse" },
    results: { searchOrigin: "Résultats de recherche", close: "Fermer", noneTitle: "Aucun expert trouvé", noneDesc: "Essayez d'ajuster vos filtres ou d'élargir votre zone de recherche." },
    testimonialTag: "Témoignages", testimonialTitle: "Approuvé par la communauté",
    testimonial1: { quote: "ExpaLink a rendu ma transition à Madrid tellement plus simple. J'ai trouvé un expert fiscal qui m'a fait économiser des milliers d'euros.", user: "Sarah J.", role: "Nomade Digital" },
    testimonial2: { quote: "Le processus de vérification est sérieux. Je me sens enfin en sécurité pour embaucher des pros locaux en Espagne.", user: "Mark D.", role: "Expatrié à Valence" },
    earlyCTA: { title: "Vous êtes Pro ?", subtitle: "Profitez de 6 mois offerts", desc: "Rejoignez notre programme exclusif Membre Fondateur et développez votre activité auprès de la communauté expatriée.", btn: "Rejoindre maintenant" }
  },
  howItWorks: {
    ...en.howItWorks,
    title: "Comment ça marche",
    subtitle: "ExpaLink vous connecte aux meilleurs experts locaux en Espagne en 5 étapes simples.",
    step1: { title: "Recherche", desc: "Utilisez notre moteur de recherche pour trouver l'expert exact dont vous avez besoin.", badge: "Découverte" },
    step2: { title: "Crédits", desc: "Achetez des crédits pour débloquer les coordonnées vérifiées en toute sécurité.", badge: "Accès" },
    step3: { title: "Déblocage", desc: "Sélectionnez le professionnel et débloquez son téléphone, email et adresse.", badge: "Connexion" },
    step4: { title: "Contact", desc: "Entrez en contact direct avec l'expert pour discuter de vos besoins.", badge: "Action" },
    step5: { title: "Avis", desc: "Partagez votre expérience avec la communauté pour aider les autres expatriés.", badge: "Confiance" },
    experience: {
      tag: "Expérience Premium", title: "Conçu pour les Expats",
      desc1: "Nous comprenons les défis d'une installation à l'étranger. C'est pourquoi nous vérifions personnellement nos meilleurs professionnels.",
      desc2: "Notre réseau ne comprend que des experts ayant une expérience prouvée avec la communauté internationale.",
      visualTag: "Vérifié", visualText: "Qualité de service garantie."
    }
  },
  forms: {
    ...en.forms,
    title: "Profil Professionnel", subtitle: "Complétez votre profil", identity: "Identité & Photo", expertise: "Expertise & Services", contactZones: "Contact & Localisation",
    fullName: "Nom Complet", fullNamePlaceholder: "Jean Dupont", company: "Nom de l'entreprise", companyPlaceholder: "Dupont Consulting SL",
    genderLabel: "Genre", nationality: "Nationalité", searchNationality: "Chercher un pays...", languages: "Langues parlées", add: "Ajouter",
    mainProfession: "Métier Principal", profSelectPlaceholder: "Sélectionnez votre activité principale", yearsOfExperience: "Années d'expérience",
    expBeginner: "Débutant", expExpert: "Expert", services: "Services & Spécialités", specialtiesPlaceholder: "Ajouter une spécialité personnalisée...",
    profDescription: "Bio Professionnelle", minChars: "min.", bioPlaceholder: "Décrivez votre parcours, votre expertise et comment vous aidez les expatriés...",
    phoneMain: "Téléphone Professionnel", phonePlaceholder: "612 345 678", dialSearchPlaceholder: "Chercher un code...",
    emailPro: "Email Professionnel", emailPlaceholder: "contact@pro.com", website: "Site Internet", websitePlaceholder: "https://www.pro.com",
    address: "Adresse de l'activité", addressPlaceholder: "Rue, Numéro, Étage...", cities: "Zones de couverture", searchCity: "Chercher une ville...",
    finalize: "Enregistrer le Profil", mapsError: "Google Maps n'a pas pu être chargé."
  },
  profileModal: { ...en.profileModal, businessAddress: "Adresse Professionnelle", about: "À propos", specialties: "Spécialités", unlockPrompt: "Débloquer ce contact" },
  credits: {
    ...en.credits,
    title: "Accédez au Réseau", subtitle: "Achetez des crédits pour débloquer les coordonnées des experts vérifiés.",
    unit: "Crédits", billingNote: "Paiement unique", buyCTA: "Acheter", secure: "Paiement Sécurisé", instant: "Livraison Instantanée", noExp: "Sans Expiration",
    packages: {
      starter: { label: "Pack Découverte", desc: "Idéal pour un besoin ponctuel" },
      popular: { label: "Pack Standard", desc: "Parfait pour une relocation complète" },
      value: { label: "Pack Premium", desc: "Flexibilité maximale" }
    }
  },
  notifications: {
    ...en.notifications,
    noCredits: "Vous n'avez pas assez de crédits.", unlocked: "Expert débloqué avec succès !", unlockError: "Erreur lors du déblocage.",
    profileSaved: "Profil mis à jour avec succès !", creatingProfile: "Création de votre espace pro..."
  },
  profile: {
    ...en.profile,
    save: "Enregistrer", edit: "Modifier le Profil", personalDetails: "Informations Personnelles", joinedOn: "Membre depuis le",
    dangerZone: "Zone de Danger", deleteAccount: "Supprimer définitivement votre compte et vos données.", deleteBtn: "Supprimer mon compte",
    deleteConfirmTitle: "Êtes-vous sûr ?", deleteConfirmMessagePro: "Votre profil professionnel et votre visibilité seront supprimés à jamais.",
    deleteConfirmMessageExpat: "Vos contacts débloqués et vos avis seront perdus.", confirmInputLabel: "Tapez '{{text}}' pour confirmer",
    roleNotSelected: "Rôle non sélectionné", proProfile: "Profil Professionnel", expatProfile: "Profil Expatrié", ownerAccess: "Mon Profil",
    switchToProTitle: "Passer en Mode Pro ?", switchToProMsg: "Vous pourrez gérer votre visibilité et vos services.",
    switchToExpatTitle: "Passer en Mode Expat ?", switchToExpatMsg: "Vous reviendrez à l'annuaire pour trouver des experts."
  },
  expatHome: {
    ...en.expatHome
  },
  expatDashboard: {
    title: "Relocation Dashboard", subtitle: "Gérez vos contacts et votre installation en Espagne.", creditsLabel: "Mes Crédits", unlockedTitle: "Mes Experts Débloqués", noExpertsTitle: "Aucun expert pour l'instant", noExpertsDesc: "Commencez votre recherche pour trouver les meilleurs pros locaux.",
    citySection: { title: "Votre destination", desc: "Sélectionnez votre ville de destination pour recevoir des recommandations personnalisées." },
    accessDirectory: "Accéder à l'annuaire",
    reviews: {
      sectionTitle: "Avis & Retours", waitingTitle: "Avis en attente", evaluateBtn: "Noter maintenant", historyTitle: "Mon historique d'avis", modalTitle: "Noter cet Expert", modalSubtitle: "Votre expérience avec {{name}}",
      ratingLabel: "Note", commentLabel: "Votre témoignage (min. 20 chars)", placeholder: "Parlez à la communauté de la qualité de service...", anonymousToggle: "Poster en anonyme", submitBtn: "Publier l'avis", postedOn: "Publié le", empty: "Aucun avis pour l'instant.",
      status: { pending: "En modération", verified: "Publié", rejected: "Refusé" },
      anonymous: "Anonyme", manualVerification: "Vérification manuelle"
    },
    toolsTitle: "Outils & Aide", support: "Support Personnalisé",
    proInvite: {
      titleExpat: "Vous êtes professionnel ?", descExpat: "Proposez vos services à la communauté expatriée.", btnExpat: "Créer un profil pro",
      titlePro: "Gérez votre activité", descPro: "Accédez à votre dashboard pour voir vos performances.", btnPro: "Dashboard Pro"
    }
  },
  professions: {
    ...en.professions,
    Handyman: "Bricoleur", Plumber: "Plombier", Electrician: "Électricien", "Real Estate Agent": "Agent Immobilier", "Immigration Lawyer": "Avocat Immigration", "International Tax Expert": "Expert Fiscal Int.", "Chartered Accountant": "Expert-Comptable", "Relocation Specialist": "Expert Relocation",
    Nanny: "Nounou", "Language Teacher": "Prof de Langue", AuPair: "Au Pair", "General Practitioner": "Généraliste", Pediatrician: "Pédiatre", Gynecologist: "Gynécologue", Dentist: "Dentiste", Orthodontist: "Orthodontiste", 
    Ophthalmologist: "Ophtalmologue", Dermatologist: "Dermatologue", Osteopath: "Ostéopathe", Physiotherapist: "Kinésithérapeute", Chiropractor: "Chiropracteur", 
    Acupuncturist: "Acupuncteur", "Speech Therapist": "Orthophoniste", Psychologist: "Psychologue", Psychotherapist: "Psychothérapeute", Nutritionist: "Nutritionniste", Midwife: "Sage-Femme",
    "Yoga Teacher": "Prof de Yoga", "Pilates Instructor": "Prof de Pilates", "Personal Trainer": "Coach Sportif", Sophrologist: "Sophrologue", "Life Coach": "Coach de Vie", "Career Coach": "Coach Carrière", Naturopath: "Naturopathe", "Massage Therapist": "Massothérapeute", Beautician: "Esthéticienne",
    Painter: "Peintre", Carpenter: "Menuisier", Locksmith: "Serrurier", Mason: "Maçon", "Kitchen Designer": "Cuisiniste", Gardener: "Jardinier", "Pool Technician": "Pisciniste", "AC Technician": "Climatisation",
    "Real Estate Lawyer": "Avocat Immobilier", "Property Hunter": "Chasseur Immo", "Sworn Translator": "Traducteur Assermenté", "Baby-sitter": "Baby-sitter", "School Tutor": "Soutien Scolaire", "Educational Consultant": "Conseiller Éducation", "Parent Coach": "Coach Parental", "Birthday Entertainer": "Animateur",
    ChildcareAssistant: "Assistance Maternelle", Doula: "Doula", Veterinarian: "Vétérinaire", DogTrainer: "Éducateur Canin", AnimalBehaviorist: "Comportementaliste", DogWalker: "Promeneur Chiens", PetSitter: "Pet Sitter", PetBoarding: "Pension Animaux", PetGroomer: "Toilettage", PetRelocation: "Relocation Animaux", HolisticVeterinarian: "Vétérinaire Holistique",
    InternationalMover: "Déménageur Int.", GlobalMobilityExpert: "Expert Mobilité", ExpatCoach: "Coach Expat", InterculturalExpert: "Expert Interculturel", ExpatConcierge: "Concierge Expat", InterpreterAssistant: "Interprète/Assistant", HomologationExpert: "Homologation Diplômes"
  },
  cities: {
    Madrid: "Madrid", Barcelona: "Barcelone", Valencia: "Valence", Sevilla: "Séville", Malaga: "Malaga", Alicante: "Alicante", Zaragoza: "Saragosse", Murcia: "Murcie", Palma: "Palma de Majorque", Bilbao: "Bilbao"
  },
  earlyMember: {
    ...en.earlyMember,
    badge: "Membre Fondateur", title: "Soyez parmi les premiers.", subtitle: "Programme Membre Fondateur", desc: "Rejoignez notre programme exclusif pour les professionnels qui bâtissent avec nous le futur de l'expatriation en Espagne.", status: { isMember: "Vous êtes Membre Fondateur" }, cta: "Rejoindre le Programme", 
    program: { tag: "Offre Exclusive", title: "Membre Fondateur", subtitle: "Gratuit pendant 6 mois", cancelAnytime: "Annulable à tout moment", limitedOffer: "Offre limitée dans le temps", includedTitle: "Ce qui est inclus", feature1: "Zéro frais de plateforme", feature2: "Priorité dans les résultats", feature3: "Badge vérifié offert", feature4: "Badge Membre Fondateur" }, 
    stats: { fee: "Frais Mensuels", commission: "Commission" },
    plansInfo: {
      title: "Une vision à long terme", subtitle: "Vos options après les 6 mois", desc: "Le programme Membre Fondateur est notre façon de vous remercier. Voici un aperçu de la structure simplifiée qui prendra le relais.",
      monthlyTitle: "Flexibilité Totale", annualTitle: "Engagement & Performance", cancelNote: "Sans engagement : résiliez votre profil à tout moment, même après les 6 mois."
    }
  },
  common: {
    expert: "Expert", male: "Homme", female: "Femme", other: "Autre", "prefer-not-to-say": "Non spécifié", na: "N/A", yearsExp: "ans exp", verified: "Vérifié", featuredBadge: "Mis en avant", unlock: "Débloquer contact", viewProfile: "Voir le profil", back: "Retour", confirm: "Confirmer", reactivate: "Réactiver", close: "Fermer", mostPopular: "Plus Populaire", guestUnlock: "Connexion requise", or: "ou", verifiedReview: "Avis vérifié", noReviewsYet: "Aucun avis", anonymousExpat: "Expatrié Anonyme", loaderPhrases: ["Préparation de votre espace...", "Recherche de correspondances...", "Connexion aux experts..."], activePlan: "Plan Actif", notSpecified: "Non spécifié", reviews: "Avis", anonymousToggle: "Poster en anonyme", action: "Action"
  }
}; 

const es = {
  ...en,
  nav: {
    ...en.nav,
    brandSub: "ExpaLink Global", howItWorks: "Cómo funciona", professionals: "Profesionales", findPro: "Buscar Experto", myRelocation: "Mi Relocación", buyCredits: "Comprar Créditos", myBusiness: "Mi Negocio", plans: "Planes & Visibilidad", earlyMember: "Miembro Fundador", login: "Acceder", logout: "Cerrar sesión", switchPro: "Modo Pro", switchExpat: "Modo Expat", myProfile: "Mi Perfil"
  },
  hero: {
    ...en.hero,
    badge: "Confiado par 50,000+ Expats", title: "El directorio premium para expatriados.", subtitle: "Por fin.",
    description: "Encuentra, desbloquea y conecta con expertos locales que realmente te entienden.",
    cta: "Acceder a la red", ctaExpat: "Soy expatriado", ctaPro: "Soy profesional"
  },
  landing: {
    ...en.landing,
    presence: { title: "Estamos presentes en España", cities: "Madrid • Barcelona • Valencia • Málaga • Sevilla • Alicante • Zaragoza" },
    results: { searchOrigin: "Resultados de búsqueda", close: "Cerrar", noneTitle: "No se encontraron expertos", noneDesc: "Intente ajustar sus filtros o buscar en un área más grande." },
    testimonialTag: "Testimonios", testimonialTitle: "Confiado por la comunidad",
    testimonial1: { quote: "ExpaLink facilitó mucho mi mudanza a Madrid. Encontré a un asesor fiscal que me ahorró miles de euros.", user: "Sarah J.", role: "Nómada Digital" },
    testimonial2: { quote: "El proceso de verificación est sérieux. Por fin me siento seguro contratando profesionales locales en España.", user: "Mark D.", role: "Expatriado en Valencia" },
    earlyCTA: { title: "¿Eres un Profesional?", subtitle: "Consigue 6 meses gratis", desc: "Únase a nuestro exclusivo programa de Miembro Fundador y haga crecer su negocio con la comunidad de expatriados.", btn: "Unirse ahora" }
  },
  howItWorks: {
    ...en.howItWorks,
    title: "Cómo funciona",
    subtitle: "ExpaLink te conecta con los mejores expertos locales en España en 5 pasos sencillos.",
    step1: { title: "Búsqueda", desc: "Usa nuestro buscador para encontrar al experto exacto que necesitas.", badge: "Descubrimiento" },
    step2: { title: "Créditos", desc: "Compra créditos para desbloquear información de contacto verificada de forma segura.", badge: "Acceso" },
    step3: { title: "Desbloqueo", desc: "Selecciona al profesional y desbloquea su teléfono, email y dirección.", badge: "Conexión" },
    step4: { title: "Contacto", desc: "Ponte en contacto directo con el experto para discutir tus necesidades.", badge: "Acción" },
    step5: { title: "Reseña", desc: "Comparte tu experiencia con la comunidad para ayudar a otros expatriados.", badge: "Confianza" },
    experience: {
      tag: "Experiencia Premium", title: "Hecho para Expats",
      desc1: "Entendemos los retos de mudarse al extranjero. Por eso verificamos personalmente a nuestros mejores profesionales.",
      desc2: "Nuestra red solo incluye expertos con trayectoria probada en la comunidad internacional.",
      visualTag: "Verificado", visualText: "Calidad de servicio garantizada."
    }
  },
  forms: {
    ...en.forms,
    title: "Perfil Profesional", subtitle: "Completa tu perfil", identity: "Identidad & Foto", expertise: "Experience & Services", contactZones: "Contacto & Ubicación",
    fullName: "Nombre Completo", fullNamePlaceholder: "Juan Pérez", company: "Nombre de la empresa", companyPlaceholder: "Pérez Consulting SL",
    genderLabel: "Género", nationality: "Nacionalidad", searchNationality: "Buscar un país...", languages: "Idiomas hablados", add: "Añadir",
    mainProfession: "Profesión Principal", profSelectPlaceholder: "Selecciona tu actividad principal", yearsOfExperience: "Años de experiencia",
    expBeginner: "Principiante", expExpert: "Experto", services: "Servicios & Especialidades", specialtiesPlaceholder: "Añadir especialidad personalizada...",
    profDescription: "Bio Profesional", minChars: "mín.", bioPlaceholder: "Describe tu trayectoria, tu experiencia y cómo ayudas a los expatriados...",
    phoneMain: "Teléfono Profesional", phonePlaceholder: "612 345 678", dialSearchPlaceholder: "Buscar código...",
    emailPro: "Email Profesional", emailPlaceholder: "contacto@pro.com", website: "Sitio Web", websitePlaceholder: "https://www.pro.com",
    address: "Dirección comercial", addressPlaceholder: "Calle, Número, Piso...", cities: "Zonas de cobertura", searchCity: "Buscar una ciudad...",
    finalize: "Guardar Perfil", mapsError: "No se pudo cargar Google Maps."
  },
  profileModal: { ...en.profileModal, businessAddress: "Dirección Comercial", about: "Acerca de", specialties: "Especialidades", unlockPrompt: "Desbloquear este contacto" },
  credits: {
    ...en.credits,
    title: "Accede a la Red", subtitle: "Compra créditos para acceder a los datos de contacto de expertos verificados.",
    unit: "Créditos", billingNote: "Pago único", buyCTA: "Comprar", secure: "Pago Seguro", instant: "Entrega Instantánea", noExp: "Sin Expiración",
    packages: {
      starter: { label: "Pack Inicial", desc: "Ideal para una necesidad puntual" },
      popular: { label: "Pack Estándar", desc: "Perfecto para una mudanza completa" },
      value: { label: "Pack Premium", desc: "Máxima flexibilidad" }
    }
  },
  notifications: {
    ...en.notifications,
    noCredits: "No tienes suficientes créditos.", unlocked: "¡Experto desbloqueado con éxito!", unlockError: "Error al desbloquear.",
    profileSaved: "¡Perfil actualizado con éxito!", creatingProfile: "Creando tu espacio profesional..."
  },
  profile: {
    ...en.profile,
    save: "Guardar", edit: "Editar Perfil", personalDetails: "Detalles Personales", joinedOn: "Miembro desde",
    dangerZone: "Zona de Peligro", deleteAccount: "Eliminar permanentemente tu cuenta y todos tus datos.", deleteBtn: "Eliminar mi cuenta",
    deleteConfirmTitle: "¿Estás seguro?", deleteConfirmMessagePro: "Tu perfil profesional y tu visibilité se eliminarán para siempre.",
    deleteConfirmMessageExpat: "Tus contactos desbloqueados y reseñas se perderán.", confirmInputLabel: "Escribe '{{text}}' para confirmar",
    roleNotSelected: "Rol no seleccionado", proProfile: "Perfil Profesional", expatProfile: "Perfil de Expatriado", ownerAccess: "Mi Perfil",
    switchToProTitle: "¿Pasar al Modo Pro?", switchToProMsg: "Podrás gestionar tu visibilidad y tus servicios.",
    switchToExpatTitle: "¿Pasar al Modo Expat?", switchToExpatMsg: "Volverás al directorio para buscar profesionales."
  },
  expatHome: {
    ...en.expatHome
  },
  expatDashboard: {
    title: "Panel de Relocación", subtitle: "Gestiona tus contactos y tu transition a España.", creditsLabel: "Mis Créditos", unlockedTitle: "Mis Expertos Desbloqueados", noExpertsTitle: "Sin expertos por ahora", noExpertsDesc: "Comienza tu búsqueda para encontrar los mejores profesionales locales.",
    citySection: { title: "Tu destino", desc: "Selecciona tu ciudad de destino para recibir recomendaciones personalizadas." },
    accessDirectory: "Acceder al directorio",
    reviews: {
      sectionTitle: "Reseñas & Comentarios", waitingTitle: "Reseñas pendientes", evaluateBtn: "Calificar ahora", historyTitle: "Mi historial de reseñas", modalTitle: "Calificar a este Experto", modalSubtitle: "Tu experiencia con {{name}}",
      ratingLabel: "Puntuación", commentLabel: "Tu testimonio (mín. 20 chars)", placeholder: "Cuéntale a la comunidad sobre la calidad del servicio...", anonymousToggle: "Publicar como anónimo", submitBtn: "Publicar reseña", postedOn: "Publicado el", empty: "Sin reseñas aún.",
      status: { pending: "En moderación", verified: "Publicado", rejected: "Rechazado" },
      anonymous: "Anónimo", manualVerification: "Verificación manual"
    },
    toolsTitle: "Herramientas & Ayuda", support: "Soporte Personalizado",
    proInvite: {
      titleExpat: "¿Eres un profesional?", descExpat: "Ofrece tus servicios a la comunidad de expatriados.", btnExpat: "Crear perfil pro",
      titlePro: "Gestiona tu negocio", descPro: "Accede a tu panel para ver tu rendimiento.", btnPro: "Panel Pro"
    }
  },
  professions: {
    ...en.professions,
    Handyman: "Manitas", Plumber: "Fontanero", Electrician: "Electricista", "Real Estate Agent": "Agente Inmobiliario", "Immigration Lawyer": "Abogado Extranjería", "International Tax Expert": "Asesor Fiscal Int.", "Chartered Accountant": "Contador Colegiado", "Relocation Specialist": "Especialista Relocación",
    Nanny: "Niñera", "Language Teacher": "Profesor de Idiomas", AuPair: "Au Pair", "General Practitioner": "Médico de Cabecera", Pediatrician: "Pediatra", Gynecologist: "Ginecólogo", Dentist: "Dentista", Orthodontist: "Ortodoncista", 
    Ophthalmologist: "Oftalmólogo", Dermatologist: "Dermatólogo", Osteopath: "Osteópata", Physiotherapist: "Fisioterapeuta", Chiropractor: "Quiropráctico", 
    Acupuncturist: "Acupuntor", "Speech Therapist": "Logopeda", Psychologist: "Psicólogo", Psychotherapist: "Psicoterapeuta", Nutritionist: "Nutritionista", Midwife: "Partera",
    "Yoga Teacher": "Profesor de Yoga", "Pilates Instructor": "Profesor de Pilates", "Personal Trainer": "Entrenador Personal", Sophrologist: "Sofrólogo", "Life Coach": "Coach de Vida", "Career Coach": "Coach de Carrera", Naturopath: "Naturópata", "Massage Therapist": "Masajista", Beautician: "Esteticista",
    Painter: "Pintor", Carpenter: "Carpintero", Locksmith: "Cerrajero", Mason: "Albañil", "Kitchen Designer": "Diseñador de Cocinas", Gardener: "Jardinero", "Pool Technician": "Técnico de Piscinas", "AC Technician": "Técnico de AC",
    "Real Estate Lawyer": "Abogado Inmobiliario", "Property Hunter": "Buscador de Inmuebles", "Sworn Translator": "Traductor Jurado", "Baby-sitter": "Baby-sitter", "School Tutor": "Tutor Escolar", "Educational Consultant": "Consultor Educativo", "Parent Coach": "Coach Parental", "Birthday Entertainer": "Animador",
    ChildcareAssistant: "Asistente Infantil", Doula: "Doula", Veterinarian: "Veterinario", DogTrainer: "Adiestrador Canino", AnimalBehaviorist: "Etólogo", DogWalker: "Paseador de Perros", PetSitter: "Cuidador de Mascotas", PetBoarding: "Residencia Mascotas", PetGroomer: "Peluquero Canino", PetRelocation: "Relocalización Mascotas", HolisticVeterinarian: "Veterinario Holístico",
    InternationalMover: "Mudanzas Int.", GlobalMobilityExpert: "Experto en Movilidad", ExpatCoach: "Coach Expat", InterculturalExpert: "Experto Intercultural", ExpatConcierge: "Conserje Expat", InterpreterAssistant: "Intérprete/Asistente", HomologationExpert: "Homologación Títulos"
  },
  cities: {
    Madrid: "Madrid", Barcelona: "Barcelona", Valencia: "Valencia", Sevilla: "Sevilla", Malaga: "Málaga", Alicante: "Alicante", Zaragoza: "Zaragoza", Murcia: "Murcia", Palma: "Palma de Mallorca", Bilbao: "Bilbao"
  },
  earlyMember: {
    ...en.earlyMember,
    badge: "Miembro Fundador", title: "Sé de los premiers.", subtitle: "Programa Miembro Fundador", desc: "Únete a nuestro programa exclusivo para profesionales que construyen con nosotros el futuro de la relocalización en España.", status: { isMember: "Eres Miembro Fundador" }, cta: "Unirse al Programa", 
    program: { tag: "Oferta Exclusiva", title: "Miembro Fundador", subtitle: "Gratis durante 6 meses", cancelAnytime: "Cancela en cualquier momento", limitedOffer: "Oferta limitada", includedTitle: "Qué incluye", feature1: "Cero comisiones", feature2: "Prioridad en résultats", feature3: "Distintivo verificado", feature4: "Distintivo Miembro Fundador" }, 
    stats: { fee: "Cuota Mensual", commission: "Comisión" },
    plansInfo: {
      title: "Una visión a largo plazo", subtitle: "Tus opciones tras los 6 meses", desc: "El programa Miembro Fundador es nuestra forma de agradecerte por construir esta red con nosotros.",
      monthlyTitle: "Flexibilité Totale", annualTitle: "Compromiso & Rendimiento", cancelNote: "Sin compromiso: puedes cancelar en cualquier momento, incluso tras los 6 meses."
    }
  },
  common: {
    expert: "Experto", male: "Hombre", female: "Mujer", other: "Otro", "prefer-not-to-say": "No especificado", na: "N/A", yearsExp: "años exp", verified: "Verificado", featuredBadge: "Destacado", unlock: "Desbloquear contacto", viewProfile: "Ver perfil", back: "Atrás", confirm: "Confirmar", reactivate: "Reactivar", close: "Cerrar", mostPopular: "Más Popular", guestUnlock: "Acceder para desbloquear", or: "o", verifiedReview: "Avis verificado", noReviewsYet: "Sin reseñas", anonymousExpat: "Expatriado Anónimo", loaderPhrases: ["Preparando su espacio...", "Buscando coincidencias...", "Conectando con expertos..."], activePlan: "Plan Activo", notSpecified: "No especificado", reviews: "Reseñas", anonymousToggle: "Publicar como anónimo", action: "Action"
  }
};

export const translations = {
  en,
  fr,
  es
};