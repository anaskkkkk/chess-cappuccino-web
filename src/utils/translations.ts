
// Translations for multilingual support

export type TranslationKey = keyof typeof translations['en'];

interface Translations {
  [key: string]: {
    [key: string]: string;
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
  }
};

// Create a helper hook for accessing translations
export const useTranslation = (language: string) => {
  const t = (key: TranslationKey): string => {
    const lang = language in translations ? language : 'en';
    return translations[lang][key] || translations.en[key] || key;
  };

  return { t };
};
