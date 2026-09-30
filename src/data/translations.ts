export type Language = 'en' | 'hi' | 'hinglish';

export interface TranslationDictionary {
  // Brand & Header
  brandTitle: string;
  brandTag: string;
  brandSubtitle: string;
  
  // Top Feature Nav
  navStudent: string;
  navOfficer: string;
  navCharter: string;
  navPreFlight: string;
  navJago: string;
  navLogout: string;
  
  // Auth Screen
  authTitle: string;
  authSubtitle: string;
  authSignInTab: string;
  authSignUpTab: string;
  authStudentRole: string;
  authOfficerRole: string;
  authIdentifierLabel: string;
  authPasswordLabel: string;
  authSignInButton: string;
  authSignUpButton: string;
  authTrialHeader: string;
  authTrialSubheader: string;
  authTrialStudent: string;
  authTrialDistrictOfficer: string;
  authTrialStateOfficer: string;
  authOneUserNotice: string;
  authSignUpFullName: string;
  authSignUpMobile: string;
  authSignUpEmail: string;
  authSignUpCategory: string;
  authSignUpIncome: string;
  authSignUpAcademic: string;
  authSignUpDistrict: string;
  authSignUpPasswordConfirm: string;
  
  // Student Portal
  studentHeaderTitle: string;
  studentHeaderSubtitle: string;
  readinessTitle: string;
  readinessSubtitle: string;
  riskRadarTitle: string;
  riskRadarSubtitle: string;
  nextActionTitle: string;
  
  // Tabs in Student Navigation Bar
  tabOverview: string;
  tabSchemes: string;
  tabSearch: string;
  tabVerifier: string;
  tabWallet: string;
  tabTracker: string;
  tabPreFlight: string;
  tabCharter: string;
  tabParent: string;
  tabHistory: string;
  
  // 5-Scheme Radar
  schemesTitle: string;
  schemesSubtitle: string;
  filterAll: string;
  filterEligible: string;
  filterGirls: string;
  filterMerit: string;
  annualBenefit: string;
  deadline: string;
  applyNow: string;
  checkEligibility: string;
  alreadyApplied: string;
  
  // Search & Eligibility Engine
  searchEngineTitle: string;
  searchEngineSubtitle: string;
  searchPlaceholder: string;
  filterCategory: string;
  filterMaxIncome: string;
  filterMinMarks: string;
  matchScoreLabel: string;
  
  // Document Verifier
  verifierTitle: string;
  verifierSubtitle: string;
  verifyScanButton: string;
  authenticityScore: string;
  
  // Parent Mode
  parentModeTitle: string;
  parentModeSubtitle: string;
  parentSwitchChild: string;
  parentConsentTitle: string;
  parentConsentSubtitle: string;
  parentAttendanceStatus: string;
  
  // History & Tracking
  historyTitle: string;
  historySubtitle: string;
  historyEventFilter: string;
  historyDownloadSlip: string;
  
  // Document Wallet
  walletTitle: string;
  walletSubtitle: string;
  digilockerSynced: string;
  uploadNewDoc: string;
  verifiedBadge: string;
  preCheckBadge: string;
  
  // Application Tracker
  trackerTitle: string;
  trackerSubtitle: string;
  submittedApps: string;
  verificationPipeline: string;
  dbtStatusTitle: string;
  askJagoPrompt: string;
  deficiencyNotice: string;
  submitClarification: string;
  
  // 30-Day Charter
  charterTitle: string;
  charterSubtitle: string;
  charterClockTag: string;
  charterDayCount: string;
  charterSlaHealthy: string;
  charterSlaBreached: string;
  charterWhyPending: string;
  charterOfflineContact: string;
  charterOfficerName: string;
  charterOfficeAddress: string;
  charterVisitingHours: string;
  charterGenerateSlip: string;
  
  // Pre-Flight Check
  preFlightTitle: string;
  preFlightSubtitle: string;
  preFlightAuditStatus: string;
  preFlightReady: string;
  preFlightBlocked: string;
  preFlightFit: string;
  preFlightMisfit: string;
  preFlightMatched: string;
  preFlightMismatch: string;
  preFlightValid: string;
  preFlightExpired: string;
  preFlightAutoFix: string;
  preFlightProceed: string;
  
  // Officer Portal
  officerPortalTitle: string;
  officerNodalDesk: string;
  officerRoleLabel: string;
  kpiTotalApps: string;
  kpiPendingVerif: string;
  kpiFlaggedMismatches: string;
  kpiDisbursed: string;
  tabChartsHeatmaps: string;
  tabVerifQueue: string;
  tabMismatchDesk: string;
  tabDbtMonitoring: string;
  tabUnreachedOutreach: string;
  tabAnalytics: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    brandTitle: "ShikshaSetu",
    brandTag: "National Portal",
    brandSubtitle: "शिक्षासेतु • National Unified Scholarship & Verification Gateway",
    
    navStudent: "Student Portal",
    navOfficer: "Officer Desk",
    navCharter: "30-Day Charter Clock",
    navPreFlight: "Pre-Flight Checker",
    navJago: "JAGO AI Assistant",
    navLogout: "Sign Out",
    
    authTitle: "शिक्षासेतु • ShikshaSetu",
    authSubtitle: "Unified National Scholarship & Automated Verification Gateway",
    authSignInTab: "Sign In",
    authSignUpTab: "New Registration (Sign Up)",
    authStudentRole: "Student Portal",
    authOfficerRole: "Officer Desk",
    authIdentifierLabel: "APAAR ID / Aadhaar / Mobile",
    authPasswordLabel: "Password / MPIN",
    authSignInButton: "Authenticate & Start Session",
    authSignUpButton: "Create Account & Instant Login",
    authTrialHeader: "1-Click Instant Trial",
    authTrialSubheader: "Explore complete workflows without entering credentials",
    authTrialStudent: "Trial as Student (Priya Sharma)",
    authTrialDistrictOfficer: "Trial as District Officer (Varanasi)",
    authTrialStateOfficer: "Trial as State Nodal Officer (UP)",
    authOneUserNotice: "One-User-One-Login enforced. Each account is bound to a single active session token.",
    authSignUpFullName: "Full Name (as on Aadhaar)",
    authSignUpMobile: "Mobile Number (Aadhaar linked)",
    authSignUpEmail: "Email Address",
    authSignUpCategory: "Social Category",
    authSignUpIncome: "Annual Family Income (₹)",
    authSignUpAcademic: "Current Academic Level",
    authSignUpDistrict: "District / Domicile",
    authSignUpPasswordConfirm: "Confirm Password",
    
    studentHeaderTitle: "Student Scholarship Gateway",
    studentHeaderSubtitle: "Direct Benefit Transfer • DigiLocker Verified Profile",
    readinessTitle: "Application Readiness Score",
    readinessSubtitle: "AI evaluation of profile completeness, certificates & DBT link",
    riskRadarTitle: "Proactive Risk Radar",
    riskRadarSubtitle: "Real-time automated warnings to prevent application rejection",
    nextActionTitle: "Recommended Next Best Action",
    
    tabOverview: "5-Scheme Radar",
    tabSchemes: "Flagship Schemes",
    tabSearch: "Search & Match Engine",
    tabVerifier: "Document Verifier",
    tabWallet: "Document Wallet",
    tabTracker: "Application Tracker",
    tabPreFlight: "Pre-Flight Check",
    tabCharter: "30-Day Charter",
    tabParent: "Parent Mode",
    tabHistory: "Activity History",
    
    schemesTitle: "Unified 5 Flagship Scholarship Schemes",
    schemesSubtitle: "Real government schemes with verified rules, financial outlays & direct benefit disbursement",
    filterAll: "All Schemes",
    filterEligible: "Eligible Only",
    filterGirls: "Girls Only (Pragati)",
    filterMerit: "Merit-Based",
    annualBenefit: "Annual Benefit",
    deadline: "Deadline",
    applyNow: "Apply 1-Click",
    checkEligibility: "Check Eligibility",
    alreadyApplied: "Applied (Track)",
    
    searchEngineTitle: "Scholarship Search & Eligibility Matching Engine",
    searchEngineSubtitle: "Find matching central, state and UGC/AICTE scholarships with dynamic criteria simulation",
    searchPlaceholder: "Search by scheme name, ministry, keyword, or degree...",
    filterCategory: "Filter by Category",
    filterMaxIncome: "Maximum Family Income",
    filterMinMarks: "Minimum Marks Required",
    matchScoreLabel: "Eligibility Match Score",
    
    verifierTitle: "Official AI Document Verifier",
    verifierSubtitle: "Instant cryptographic verification of DigiLocker credentials, marksheet QR & revenue stamps",
    verifyScanButton: "Run Live Authenticity Scan",
    authenticityScore: "Integrity & Authenticity Score",
    
    parentModeTitle: "Parent Mode (अभिभावक मोड)",
    parentModeSubtitle: "Operate and monitor scholarships for your children with simplified guidance & DBT tracking",
    parentSwitchChild: "Switch Registered Ward / Child",
    parentConsentTitle: "Parental / Guardian Consent Portal",
    parentConsentSubtitle: "Grant legal consent for minor student applications & Aadhaar-DBT transfers",
    parentAttendanceStatus: "School Attendance & Verification Standing",
    
    historyTitle: "User History & Activity Trail",
    historySubtitle: "Cryptographically verified, transparent timeline of all student actions, officer decisions & DBT credits",
    historyEventFilter: "Filter Activity Events",
    historyDownloadSlip: "Download Activity Statement",
    
    walletTitle: "National Document Locker",
    walletSubtitle: "DigiLocker verified certificates, marksheet repository & authenticity tokens",
    digilockerSynced: "DigiLocker Synced",
    uploadNewDoc: "Upload / Replace Document",
    verifiedBadge: "Verified Authentic",
    preCheckBadge: "AI Pre-Check Passed",
    
    trackerTitle: "Scholarship Application & DBT Lifecycle",
    trackerSubtitle: "Transparent real-time milestone tracking from College Nodal desk to Aadhaar DBT bank account",
    submittedApps: "Submitted Applications",
    verificationPipeline: "Verification Pipeline",
    dbtStatusTitle: "Aadhaar Payment Bridge (PFMS DBT) Status",
    askJagoPrompt: "Ask JAGO about this application status",
    deficiencyNotice: "DEFICIENCY NOTICE ISSUED BY NODAL OFFICER",
    submitClarification: "Submit Clarification",
    
    charterTitle: "30-Day Citizen's Charter Countdown Clock",
    charterSubtitle: "Statutory SLA Guarantee: Public services delivery act mandates 30-day processing guarantee",
    charterClockTag: "Statutory SLA Clock",
    charterDayCount: "Day {day} of 30",
    charterSlaHealthy: "Within 30-Day SLA Window",
    charterSlaBreached: "SLA Breached • Priority Escalation",
    charterWhyPending: "Why is your application currently pending?",
    charterOfflineContact: "Assigned Offline Nodal Officer & Walk-in Desk",
    charterOfficerName: "Designated Public Grievance Officer",
    charterOfficeAddress: "Physical Office Address",
    charterVisitingHours: "Public Visiting Hours",
    charterGenerateSlip: "Generate Physical Walk-in Grievance Token",
    
    preFlightTitle: "Pre-Flight Document & Submission Check",
    preFlightSubtitle: "Automated pre-submission audit: detects Misfit, Mismatched, or Expired documents before government officers see them",
    preFlightAuditStatus: "Pre-Flight Readiness Status",
    preFlightReady: "All Documents Verified & Fit for Submission",
    preFlightBlocked: "Submission Blocked: Critical Discrepancies Found",
    preFlightFit: "Fit for Scheme",
    preFlightMisfit: "Misfit Document",
    preFlightMatched: "Demographics Matched",
    preFlightMismatch: "Name/DOB Mismatch",
    preFlightValid: "Certificate Valid",
    preFlightExpired: "Certificate Expired",
    preFlightAutoFix: "Auto-Fix via DigiLocker",
    preFlightProceed: "Proceed to Application",
    
    officerPortalTitle: "ShikshaSetu Officer Portal",
    officerNodalDesk: "Official Nodal Desk",
    officerRoleLabel: "Active Officer Desk:",
    kpiTotalApps: "Total Applications",
    kpiPendingVerif: "Pending Verification",
    kpiFlaggedMismatches: "Flagged Mismatches",
    kpiDisbursed: "Sanctioned Disbursals",
    tabChartsHeatmaps: "Status Charts & Coverage Heatmaps",
    tabVerifQueue: "Verification Queue",
    tabMismatchDesk: "Mismatch Desk",
    tabDbtMonitoring: "DBT & PFMS Disbursals",
    tabUnreachedOutreach: "Unreached & Outreach Desk",
    tabAnalytics: "Analytics & Funnel",
  },
  
  hi: {
    brandTitle: "शिक्षासेतु",
    brandTag: "राष्ट्रीय पोर्टल",
    brandSubtitle: "शिक्षासेतु • एकीकृत राष्ट्रीय छात्रवृत्ति एवं स्वचालित सत्यापन पोर्टल",
    
    navStudent: "छात्र पोर्टल",
    navOfficer: "अधिकारी डेस्क",
    navCharter: "30-दिवसीय चार्टर घड़ी",
    navPreFlight: "दस्तावेज़ पूर्व-जांच",
    navJago: "जागो AI सहायक",
    navLogout: "लॉगआउट",
    
    authTitle: "शिक्षासेतु • ShikshaSetu",
    authSubtitle: "एकीकृत राष्ट्रीय छात्रवृत्ति एवं स्वचालित सत्यापन गेटवे",
    authSignInTab: "साइन इन (लॉगिन)",
    authSignUpTab: "नया पंजीकरण (साइन अप)",
    authStudentRole: "छात्र पोर्टल",
    authOfficerRole: "अधिकारी डेस्क",
    authIdentifierLabel: "अपार (APAAR) आईडी / आधार / मोबाइल",
    authPasswordLabel: "पासवर्ड / एमपिन",
    authSignInButton: "प्रमाणीकरण करें एवं सत्र शुरू करें",
    authSignUpButton: "खाता बनाएं एवं तुरंत लॉगिन करें",
    authTrialHeader: "1-क्लिक त्वरित ट्रायल",
    authTrialSubheader: "बिना पासवर्ड डाले पूरी प्रणाली का अनुभव करें",
    authTrialStudent: "छात्र ट्रायल (प्रिया शर्मा)",
    authTrialDistrictOfficer: "जिला अधिकारी ट्रायल (वाराणसी)",
    authTrialStateOfficer: "राज्य नोडल अधिकारी ट्रायल (उ.प्र.)",
    authOneUserNotice: "एक-उपयोगकर्ता-एक-लॉगिन अनिवार्य है। प्रत्येक खाता एक सक्रिय टोकन से सुरक्षित है।",
    authSignUpFullName: "पूरा नाम (आधार के अनुसार)",
    authSignUpMobile: "मोबाइल नंबर (आधार से लिंक)",
    authSignUpEmail: "ईमेल पता",
    authSignUpCategory: "सामाजिक वर्ग (श्रेणी)",
    authSignUpIncome: "वार्षिक पारिवारिक आय (₹)",
    authSignUpAcademic: "वर्तमान शैक्षणिक स्तर",
    authSignUpDistrict: "जिला / निवास स्थान",
    authSignUpPasswordConfirm: "पासवर्ड की पुष्टि करें",
    
    studentHeaderTitle: "छात्र छात्रवृत्ति गेटवे",
    studentHeaderSubtitle: "प्रत्यक्ष लाभ अंतरण (DBT) • डिजिलॉकर सत्यापित प्रोफाइल",
    readinessTitle: "आवेदन तैयारी स्कोर",
    readinessSubtitle: "प्रोफाइल पूर्णता, प्रमाण पत्र एवं DBT लिंक का AI मूल्यांकन",
    riskRadarTitle: "सक्रिय जोखिम रडार (रिस्क रडार)",
    riskRadarSubtitle: "आवेदन खारिज होने से बचाने के लिए वास्तविक समय की स्वचालित चेतावनी",
    nextActionTitle: "अनुशंसित अगला सर्वश्रेष्ठ कदम",
    
    tabOverview: "5-योजना रडार",
    tabSchemes: "प्रमुख योजनाएं",
    tabSearch: "खोज एवं पात्रता इंजन",
    tabVerifier: "दस्तावेज़ सत्यापनकर्ता",
    tabWallet: "दस्तावेज़ वॉलेट",
    tabTracker: "आवेदन ट्रैकर",
    tabPreFlight: "दस्तावेज़ पूर्व-जांच",
    tabCharter: "30-दिवसीय चार्टर",
    tabParent: "अभिभावक मोड (Parent)",
    tabHistory: "गतिविधि इतिहास",
    
    schemesTitle: "एकीकृत 5 प्रमुख राष्ट्रीय छात्रवृत्ति योजनाएं",
    schemesSubtitle: "वास्तविक सरकारी छात्रवृत्ति नियम, वित्तीय आवंटन एवं प्रत्यक्ष लाभ अंतरण",
    filterAll: "सभी योजनाएं",
    filterEligible: "केवल पात्र",
    filterGirls: "केवल छात्राएं (प्रगति)",
    filterMerit: "योग्यता आधारित",
    annualBenefit: "वार्षिक लाभ",
    deadline: "अंतिम तिथि",
    applyNow: "1-क्लिक आवेदन करें",
    checkEligibility: "पात्रता जांचें",
    alreadyApplied: "लागू (ट्रैक करें)",
    
    searchEngineTitle: "छात्रवृत्ति खोज एवं पात्रता मिलान इंजन",
    searchEngineSubtitle: "गतिशील मापदंडों के आधार पर उपयुक्त केंद्र, राज्य एवं UGC/AICTE छात्रवृत्तियां खोजें",
    searchPlaceholder: "योजना का नाम, मंत्रालय, विषय या डिग्री से खोजें...",
    filterCategory: "वर्ग अनुसार फ़िल्टर",
    filterMaxIncome: "अधिकतम पारिवारिक आय",
    filterMinMarks: "न्यूनतम आवश्यक अंक",
    matchScoreLabel: "पात्रता मिलान स्कोर",
    
    verifierTitle: "आधिकारिक AI दस्तावेज़ सत्यापनकर्ता",
    verifierSubtitle: "डिजिलॉकर क्रेडेंशियल्स, मार्कशीट QR और राजस्व मुहरों का तत्काल सत्यापन",
    verifyScanButton: "लाइव प्रामाणिकता जांच चलाएं",
    authenticityScore: "सत्यनिष्ठा एवं प्रामाणिकता स्कोर",
    
    parentModeTitle: "अभिभावक मोड (Parent Mode)",
    parentModeSubtitle: "अपने बच्चों के लिए छात्रवृत्ति संचालित करें, प्रगति देखें और DBT की निगरानी करें",
    parentSwitchChild: "पंजीकृत बच्चा / वार्ड चुनें",
    parentConsentTitle: "अभिभावक सहमति पोर्टल",
    parentConsentSubtitle: "नाबालिग छात्र आवेदनों और आधार-DBT हस्तांतरण के लिए कानूनी सहमति दें",
    parentAttendanceStatus: "विद्यालय उपस्थिति एवं सत्यापन स्थिति",
    
    historyTitle: "उपयोगकर्ता इतिहास एवं गतिविधि लॉग",
    historySubtitle: "छात्र की सभी गतिविधियों, अधिकारी निर्णयों और DBT क्रेडिट का पारदर्शी विवरण",
    historyEventFilter: "गतिविधि घटनाएं फ़िल्टर करें",
    historyDownloadSlip: "गतिविधि विवरण पर्ची डाउनलोड करें",
    
    walletTitle: "राष्ट्रीय दस्तावेज़ लॉकर",
    walletSubtitle: "डिजिलॉकर सत्यापित प्रमाण पत्र, अंकपत्र एवं प्रामाणिकता टोकन",
    digilockerSynced: "डिजिलॉकर से सिंक",
    uploadNewDoc: "दस्तावेज़ अपलोड / बदलें",
    verifiedBadge: "सत्यापित प्रामाणिक",
    preCheckBadge: "AI पूर्व-जांच उत्तीर्ण",
    
    trackerTitle: "छात्रवृत्ति आवेदन एवं DBT जीवनचक्र",
    trackerSubtitle: "कॉलेज नोडल डेस्क से लेकर आधार DBT बैंक खाते तक पारदर्शी ट्रैकिंग",
    submittedApps: "जमा किए गए आवेदन",
    verificationPipeline: "सत्यापन पाइपलाइन",
    dbtStatusTitle: "आधार भुगतान ब्रिज (PFMS DBT) स्थिति",
    askJagoPrompt: "जागो AI से इस आवेदन की स्थिति पूछें",
    deficiencyNotice: "नोडल अधिकारी द्वारा कमी की सूचना जारी",
    submitClarification: "स्पष्टीकरण दस्तावेज़ जमा करें",
    
    charterTitle: "30-दिवसीय नागरिक चार्टर उल्टी गिनती घड़ी",
    charterSubtitle: "नागरिक सेवा गारंटी अधिनियम: 30 कार्य दिवसों के भीतर आवेदन निस्तारण की वैधानिक गारंटी",
    charterClockTag: "वैधानिक SLA घड़ी",
    charterDayCount: "30 में से दिन {day}",
    charterSlaHealthy: "30-दिवसीय SLA समय सीमा के भीतर",
    charterSlaBreached: "SLA उल्लंघन • प्राथमिकता स्तर पर अग्रसारित",
    charterWhyPending: "आपका आवेदन वर्तमान में क्यों लंबित है?",
    charterOfflineContact: "नामित ऑफलाइन नोडल अधिकारी एवं संपर्क केंद्र",
    charterOfficerName: "नामित लोक शिकायत निवारण अधिकारी",
    charterOfficeAddress: "कार्यालय का भौतिक पता",
    charterVisitingHours: "जनता से मिलने का समय",
    charterGenerateSlip: "भौतिक शिकायत पर्ची (टोकन) डाउनलोड करें",
    
    preFlightTitle: "आवेदन पूर्व-जांच एवं दस्तावेज़ ऑडिट",
    preFlightSubtitle: "जमा करने से पहले मिसफिट (अनुपयुक्त), मिसमैच (असंगत) या एक्सपायर्ड (समाप्त) दस्तावेज़ों की स्वचालित पहचान",
    preFlightAuditStatus: "पूर्व-जांच स्थिति",
    preFlightReady: "सभी दस्तावेज़ सत्यापित एवं जमा करने हेतु उपयुक्त हैं",
    preFlightBlocked: "आवेदन रुका हुआ है: गंभीर विसंगतियां पाई गईं",
    preFlightFit: "योजना हेतु उपयुक्त",
    preFlightMisfit: "अनुपयुक्त दस्तावेज़ (Misfit)",
    preFlightMatched: "विवरण पूरी तरह मेल खाता है",
    preFlightMismatch: "नाम / जन्मतिथि असंगत (Mismatch)",
    preFlightValid: "प्रमाण पत्र वैध है",
    preFlightExpired: "प्रमाण पत्र की अवधि समाप्त (Expired)",
    preFlightAutoFix: "डिजिलॉकर से स्वतः ठीक करें",
    preFlightProceed: "आवेदन की ओर आगे बढ़ें",
    
    officerPortalTitle: "शिक्षासेतु अधिकारी पोर्टल",
    officerNodalDesk: "आधिकारिक नोडल डेस्क",
    officerRoleLabel: "सक्रिय अधिकारी डेस्क:",
    kpiTotalApps: "कुल आवेदन",
    kpiPendingVerif: "लंबित सत्यापन",
    kpiFlaggedMismatches: "असंगतियां (Mismatches)",
    kpiDisbursed: "स्वीकृत छात्रवृत्ति राशि",
    tabChartsHeatmaps: "स्थिति चार्ट एवं जिला कवरेज हीटमैप",
    tabVerifQueue: "सत्यापन कतार",
    tabMismatchDesk: "विसंगति निवारण डेस्क",
    tabDbtMonitoring: "DBT एवं PFMS संवितरण",
    tabUnreachedOutreach: "वंचित छात्र एवं आउटरीच डेस्क",
    tabAnalytics: "विश्लेषण एवं फ़नल",
  },
  
  hinglish: {
    brandTitle: "ShikshaSetu",
    brandTag: "National Portal",
    brandSubtitle: "शिक्षासेतु • National Unified Scholarship & Verification Gateway",
    
    navStudent: "Student Portal",
    navOfficer: "Officer Desk",
    navCharter: "30-Day Charter Clock",
    navPreFlight: "Pre-Flight Checker",
    navJago: "JAGO AI Assistant",
    navLogout: "Sign Out",
    
    authTitle: "शिक्षासेतु • ShikshaSetu",
    authSubtitle: "Unified National Scholarship & Automated Verification Gateway",
    authSignInTab: "Sign In (लॉगिन)",
    authSignUpTab: "New Registration (साइन अप)",
    authStudentRole: "Student Portal",
    authOfficerRole: "Officer Desk",
    authIdentifierLabel: "APAAR ID / Aadhaar / Mobile No.",
    authPasswordLabel: "Password / MPIN",
    authSignInButton: "Authenticate karein & Session shuru karein",
    authSignUpButton: "Account banayein & Instant Login karein",
    authTrialHeader: "1-Click Instant Trial",
    authTrialSubheader: "Bina password daale complete workflow test karein",
    authTrialStudent: "Trial as Student (Priya Sharma)",
    authTrialDistrictOfficer: "Trial as District Officer (Varanasi)",
    authTrialStateOfficer: "Trial as State Nodal Officer (UP)",
    authOneUserNotice: "One-User-One-Login enforced. Har account single session token se protected hai.",
    authSignUpFullName: "Full Name (Aadhaar ke anusaar)",
    authSignUpMobile: "Mobile Number (Aadhaar linked)",
    authSignUpEmail: "Email Address",
    authSignUpCategory: "Social Category",
    authSignUpIncome: "Annual Family Income (₹)",
    authSignUpAcademic: "Current Class / Course",
    authSignUpDistrict: "District / Domicile",
    authSignUpPasswordConfirm: "Confirm Password",
    
    studentHeaderTitle: "Student Scholarship Gateway",
    studentHeaderSubtitle: "Direct Benefit Transfer • DigiLocker Verified Profile",
    readinessTitle: "Application Readiness Score",
    readinessSubtitle: "Profile completeness, certificates & DBT link ka AI evaluation",
    riskRadarTitle: "Proactive Risk Radar",
    riskRadarSubtitle: "Application reject hone se bachane ke liye real-time alert",
    nextActionTitle: "Recommended Next Best Action",
    
    tabOverview: "5-Scheme Radar",
    tabSchemes: "Flagship Schemes",
    tabSearch: "Search & Match Engine",
    tabVerifier: "Document Verifier",
    tabWallet: "Document Wallet",
    tabTracker: "Application Tracker",
    tabPreFlight: "Pre-Flight Check",
    tabCharter: "30-Day Charter",
    tabParent: "Parent Mode",
    tabHistory: "Activity History",
    
    schemesTitle: "Unified 5 Flagship Scholarship Schemes",
    schemesSubtitle: "Real government schemes with verified rules, financial outlays & direct benefit disbursement",
    filterAll: "All Schemes",
    filterEligible: "Eligible Only",
    filterGirls: "Girls Only (Pragati)",
    filterMerit: "Merit-Based",
    annualBenefit: "Annual Benefit",
    deadline: "Deadline",
    applyNow: "1-Click Apply",
    checkEligibility: "Check Eligibility",
    alreadyApplied: "Applied (Track)",
    
    searchEngineTitle: "Scholarship Search & Eligibility Matching Engine",
    searchEngineSubtitle: "Central, state aur UGC scholarships ko dynamic criteria se match karein",
    searchPlaceholder: "Scheme name, ministry, keyword ya degree se search karein...",
    filterCategory: "Category Filter",
    filterMaxIncome: "Maximum Family Income",
    filterMinMarks: "Minimum Marks Required",
    matchScoreLabel: "Eligibility Match Score",
    
    verifierTitle: "Official AI Document Verifier",
    verifierSubtitle: "DigiLocker certificates, marksheet QR aur revenue stamps ka instant verification",
    verifyScanButton: "Run Authenticity Scan",
    authenticityScore: "Authenticity & Integrity Score",
    
    parentModeTitle: "Parent Mode (अभिभावक मोड)",
    parentModeSubtitle: "Apne bachhon ki scholarship operate karein, attendance dekhein aur DBT track karein",
    parentSwitchChild: "Registered Child / Ward Switch Karein",
    parentConsentTitle: "Parental Consent Portal",
    parentConsentSubtitle: "Minor student applications aur Aadhaar DBT ke liye legal consent dein",
    parentAttendanceStatus: "School Attendance aur Verification Status",
    
    historyTitle: "User History & Activity Trail",
    historySubtitle: "Student ke sabhi actions, officer decisions aur DBT credit ka transparent audit log",
    historyEventFilter: "Activity Events Filter Karein",
    historyDownloadSlip: "Activity Statement Download Karein",
    
    walletTitle: "National Document Locker",
    walletSubtitle: "DigiLocker verified certificates, marksheets & authenticity tokens",
    digilockerSynced: "DigiLocker Synced",
    uploadNewDoc: "Upload / Replace Document",
    verifiedBadge: "Verified Authentic",
    preCheckBadge: "AI Pre-Check Passed",
    
    trackerTitle: "Scholarship Application & DBT Lifecycle",
    trackerSubtitle: "College Nodal desk se bank account tak transparent real-time tracking",
    submittedApps: "Submitted Applications",
    verificationPipeline: "Verification Pipeline",
    dbtStatusTitle: "Aadhaar Payment Bridge (PFMS DBT) Status",
    askJagoPrompt: "JAGO AI se is application ka status poochhein",
    deficiencyNotice: "DEFICIENCY NOTICE ISSUED BY NODAL OFFICER",
    submitClarification: "Clarification Documents Submit Karein",
    
    charterTitle: "30-Day Citizen's Charter Clock",
    charterSubtitle: "Public Services Act: 30 days ke andar application process hone ki legal guarantee",
    charterClockTag: "Statutory SLA Clock",
    charterDayCount: "Day {day} of 30",
    charterSlaHealthy: "30-Day SLA Window ke andar",
    charterSlaBreached: "SLA Breached • Priority Escalation",
    charterWhyPending: "Aapka application abhi pending kyun hai?",
    charterOfflineContact: "Assigned Offline Nodal Officer & Walk-in Desk",
    charterOfficerName: "Designated Public Grievance Officer",
    charterOfficeAddress: "Physical Office Address",
    charterVisitingHours: "Public Visiting Hours",
    charterGenerateSlip: "Physical Walk-in Token Download Karein",
    
    preFlightTitle: "Pre-Flight Document & Submission Check",
    preFlightSubtitle: "Submit karne se pehle Misfit, Mismatched ya Expired documents ko check karein",
    preFlightAuditStatus: "Pre-Flight Readiness Status",
    preFlightReady: "Sabhi documents verified aur submit karne ke liye fit hain",
    preFlightBlocked: "Submission Blocked: Critical discrepancies mili hain",
    preFlightFit: "Scheme ke liye Fit",
    preFlightMisfit: "Misfit Document",
    preFlightMatched: "Demographics Matched",
    preFlightMismatch: "Name/DOB Mismatch",
    preFlightValid: "Certificate Valid",
    preFlightExpired: "Certificate Expired",
    preFlightAutoFix: "DigiLocker se Auto-Fix karein",
    preFlightProceed: "Application Submit Karein",
    
    officerPortalTitle: "ShikshaSetu Officer Portal",
    officerNodalDesk: "Official Nodal Desk",
    officerRoleLabel: "Active Officer Desk:",
    kpiTotalApps: "Total Applications",
    kpiPendingVerif: "Pending Verification",
    kpiFlaggedMismatches: "Flagged Mismatches",
    kpiDisbursed: "Sanctioned Disbursals",
    tabChartsHeatmaps: "Status Charts & District Heatmaps",
    tabVerifQueue: "Verification Queue",
    tabMismatchDesk: "Mismatch Desk",
    tabDbtMonitoring: "DBT & PFMS Disbursals",
    tabUnreachedOutreach: "Unreached & Outreach Desk",
    tabAnalytics: "Analytics & Funnel",
  }
};
