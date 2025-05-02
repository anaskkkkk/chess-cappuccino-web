// Translations for multilingual support

export type TranslationKey = keyof typeof translations['en'];

interface Translations {
  [key: string]: {
    [key: string]: string; // Only accepts string values
  };
}

export const translations: Translations = {
  en: {
    // Common
    appName: "Smart Chess",
    loading: "Loading...",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    yes: "Yes",
    no: "No",
    search: "Search",
    
    // Auth
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    
    // Navigation
    play: "Play",
    learn: "Learn",
    community: "Community",
    smartBoard: "SmartBoard",
    store: "Store",
    
    // Game
    quickPlay: "Quick Play",
    playWithFriend: "Play with Friend",
    playWithAI: "Play with AI",
    tournaments: "Tournaments",
    analysis: "Analysis",
    spectate: "Spectate",
    findMatch: "Find Match",
    createGame: "Create Game",
    joinTournament: "Join Tournament",
    watchLive: "Watch Live",
    resign: "Resign",
    offerDraw: "Offer Draw",
    flipBoard: "Flip Board",
    checkmate: "Checkmate",
    stalemate: "Stalemate",
    check: "Check",
    white: "White",
    black: "Black",
    draw: "Draw",
    victory: "Victory",
    defeat: "Defeat",
    
    // Board Status
    boardStatus: "Board Status",
    boardOnline: "Board Online",
    boardOffline: "Board Offline",
    
    // Pages
    homepage: "Homepage",
    dashboard: "Dashboard",
    profile: "Profile",
    settings: "Settings",
    help: "Help",
    faq: "FAQ",
    
    // Message
    findingMatch: "Finding Match...",
    
    // Admin sections
    Core: "Core",
    Content: "Content",
    Business: "Business",
    Hardware: "Hardware",
    Monitoring: "Monitoring",
    Settings: "Settings",
    
    // Admin pages
    "Dashboard": "Dashboard",
    "User Management": "User Management",
    "Game Management": "Game Management",
    "Tournament Manager": "Tournament Manager",
    "Courses": "Courses",
    "Puzzles": "Puzzles",
    "Content Pages": "Content Pages",
    "Orders & Payments": "Orders & Payments",
    "SmartBoard Fleet": "SmartBoard Fleet",
    "Real-Time Logs": "Real-Time Logs", 
    "Notifications": "Notifications",
    "Analytics": "Analytics",
    "Localization": "Localization",
    "Sound & Assets": "Sound & Assets",
    "Roles & Permissions": "Roles & Permissions",
    "Security & Audit": "Security & Audit",
    "System Health": "System Health",
    "Backup & Restore": "Backup & Restore",
    "Integrations": "Integrations",
    "Feature Flags": "Feature Flags", // Ensuring this is a string type
    "Help & Support": "Help & Support"
  },
  ar: {
    // Common
    appName: "شطرنج ذكي",
    loading: "جاري التحميل...",
    submit: "إرسال",
    cancel: "إلغاء",
    save: "حفظ",
    delete: "حذف",
    edit: "تعديل",
    yes: "نعم",
    no: "لا",
    search: "بحث",
    
    // Auth
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    signOut: "تسجيل الخروج",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟",
    
    // Navigation
    play: "العب",
    learn: "تعلم",
    community: "المجتمع",
    smartBoard: "لوحة ذكية",
    store: "المتجر",
    
    // Game
    quickPlay: "لعب سريع",
    playWithFriend: "العب مع صديق",
    playWithAI: "العب مع الذكاء الاصطناعي",
    tournaments: "البطولات",
    analysis: "تحليل",
    spectate: "مشاهدة",
    findMatch: "ابحث عن مباراة",
    createGame: "إنشاء لعبة",
    joinTournament: "انضم إلى البطولة",
    watchLive: "شاهد مباشرة",
    resign: "استسلام",
    offerDraw: "عرض تعادل",
    flipBoard: "قلب اللوحة",
    checkmate: "كش ملك",
    stalemate: "تعادل",
    check: "كش",
    white: "أبيض",
    black: "أسود",
    draw: "تعادل",
    victory: "فوز",
    defeat: "خسارة",
    
    // Board Status
    boardStatus: "حالة اللوحة",
    boardOnline: "اللوحة متصلة",
    boardOffline: "اللوحة غير متصلة",
    
    // Pages
    homepage: "الصفحة الرئيسية",
    dashboard: "لوحة التحكم",
    profile: "الملف الشخصي",
    settings: "الإعدادات",
    help: "المساعدة",
    faq: "الأسئلة الشائعة",
    
    // Message
    findingMatch: "جاري البحث عن مباراة...",
    
    // Admin sections
    Core: "أساسي",
    Content: "المحتوى",
    Business: "الأعمال",
    Hardware: "الأجهزة",
    Monitoring: "المراقبة",
    Settings: "الإعدادات",
    
    // Admin pages
    "Dashboard": "لوحة التحكم",
    "User Management": "إدارة المستخدمين",
    "Game Management": "إدارة الألعاب",
    "Tournament Manager": "مدير البطولات",
    "Courses": "الدورات التعليمية",
    "Puzzles": "الألغاز",
    "Content Pages": "صفحات المحتوى",
    "Orders & Payments": "الطلبات والمدفوعات",
    "SmartBoard Fleet": "أسطول اللوحات الذكية",
    "Real-Time Logs": "سجلات الوقت الفعلي",
    "Notifications": "الإشعارات",
    "Analytics": "التحليلات",
    "Localization": "الترجمة والتوطين",
    "Sound & Assets": "الصوت والأصول",
    "Roles & Permissions": "الأدوار والصلاحيات",
    "Security & Audit": "الأمان والتدقيق",
    "System Health": "صحة النظام",
    "Backup & Restore": "النسخ الاحتياطي والاستعادة",
    "Integrations": "التكاملات",
    "Feature Flags": "ميزات التجريبية", 
    "Help & Support": "المساعدة والدعم"
  }
};

// Now let's enhance our translation system with remote fetching capability
export const useTranslation = (language: string) => {
  const t = (key: TranslationKey): string => {
    const lang = language in translations ? language : 'en';
    return translations[lang][key] || translations.en[key] || key;
  };

  return { t };
};

// New function to fetch translations from remote server
export const fetchRemoteTranslations = async (
  language: string,
  keys: string[]
): Promise<Record<string, string>> => {
  try {
    // Make API call to fetch translations
    const response = await fetch('/api/translations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
        keys,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch translations');
    }

    const data = await response.json();
    return data.translations;
  } catch (error) {
    console.error('Error fetching translations:', error);
    return {};
  }
};

// Function to update translations dynamically
export const updateTranslations = async (language: string): Promise<void> => {
  try {
    // Get all English keys
    const englishKeys = Object.keys(translations.en);
    
    // Fetch translations for these keys
    const remoteTranslations = await fetchRemoteTranslations(language, englishKeys);
    
    // Update the translations object with new values
    if (Object.keys(remoteTranslations).length > 0) {
      // Create language section if it doesn't exist
      if (!translations[language]) {
        translations[language] = { ...translations.en };
      }
      
      // Update with fetched translations
      Object.keys(remoteTranslations).forEach(key => {
        if (key in translations.en) {
          translations[language][key] = remoteTranslations[key];
        }
      });
    }
  } catch (error) {
    console.error('Failed to update translations:', error);
  }
};
