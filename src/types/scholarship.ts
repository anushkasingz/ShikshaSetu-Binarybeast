export type SchemeCategory = 'Central' | 'UGC/AICTE' | 'State' | 'Merit-cum-Means' | 'Special';

export interface EligibilityCriteria {
  minMarksPercent: number;
  maxFamilyIncomeAnnual: number; // in INR
  allowedCategories: string[]; // ['SC', 'ST', 'OBC', 'General', 'EWS', 'All']
  genderRestriction?: 'Female' | 'All';
  minClassLevel?: number; // 9, 10, 11, 12, or higher (e.g. 13 for undergrad)
  maxClassLevel?: number;
  domicileRequired?: string; // State or 'All India'
  disabilityAllowed?: boolean;
}

export interface ScholarshipScheme {
  id: string;
  code: string;
  name: string;
  shortName: string;
  ministry: string;
  description: string;
  annualBenefit: number; // in INR
  benefitType: string;
  deadlineDate: string;
  applicationOpen: boolean;
  totalSeats: number;
  quotaFilledPercent: number;
  category: SchemeCategory;
  criteria: EligibilityCriteria;
  requiredDocuments: string[];
  disbursementMode: 'Direct Benefit Transfer (DBT via PFMS/Aadhaar)' | 'Direct to Institute';
}

export interface StudentDocument {
  id: string;
  type: 'Aadhaar' | 'Income_Certificate' | 'Caste_Certificate' | 'Marksheet_10' | 'Marksheet_12' | 'Domicile_Certificate' | 'Bank_Passbook' | 'Bonafide_Student';
  name: string;
  fileName: string;
  source: 'DigiLocker' | 'Manual_Upload';
  verifiedStatus: 'Verified' | 'Pending' | 'Mismatch_Flagged' | 'Expired';
  issuedDate: string;
  expiryDate?: string;
  verificationBadgeId?: string;
  storageUrl: string;
  ocrConfidence: number;
  ocrExtractedData: {
    fullName?: string;
    dob?: string;
    incomeValue?: number;
    category?: string;
    serialNumber?: string;
    issuingAuthority?: string;
  };
}

export interface ApplicationRecord {
  id: string;
  applicationNumber: string;
  schemeId: string;
  schemeName: string;
  studentId: string;
  studentName: string;
  apaarId: string;
  appliedDate: string;
  status: 'Draft' | 'Submitted' | 'Institute_Verified' | 'District_Verified' | 'State_Sanctioned' | 'Deficient' | 'Disbursed' | 'Rejected';
  stageProgress: number; // 0 to 100
  amountSanctioned: number;
  dbtStatus: 'Not_Initiated' | 'Aadhaar_Bridge_Ready' | 'PFMS_Batch_Queued' | 'Credited' | 'Failed_NPCI_Unlinked';
  pfmsTransactionId?: string;
  deficiencyReason?: string;
  deficiencyActionRequired?: string;
  officerRemarks?: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  matchScore: number;
}

export interface MismatchRecord {
  id: string;
  studentId: string;
  studentName: string;
  apaarId: string;
  applicationId: string;
  fieldName: 'Full Name' | 'Date of Birth' | 'Family Annual Income' | 'Social Category' | 'Marks Percentage' | 'Bank Account IFSC';
  studentClaimedValue: string;
  officialSource: 'DigiLocker' | 'UDISE+' | 'APAAR' | 'Income Tax/Ration' | 'NPCI DBT';
  sourceVerifiedValue: string;
  severity: 'Critical' | 'Warning' | 'Minor';
  detectedAt: string;
  status: 'Pending_Review' | 'Clarification_Requested' | 'Override_Approved' | 'Rejected';
  suggestion: string;
}

export interface RiskAlert {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  category: 'Document' | 'Bank' | 'Deadline' | 'Mismatch';
  description: string;
  actionLabel: string;
  actionType: 'upload' | 'digilocker' | 'bank_seed' | 'apply' | 'resolve_mismatch';
}

export interface NextBestAction {
  id: string;
  priority: 1 | 2 | 3;
  title: string;
  subtitle: string;
  badge: string;
  actionType: 'apply' | 'upload_doc' | 'link_bank' | 'verify_digilocker' | 'fix_mismatch';
  targetSchemeId?: string;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  gender: 'Female' | 'Male' | 'Other';
  dob: string;
  mobile: string;
  email: string;
  aadhaarNumberMasked: string; // "XXXX-XXXX-4819"
  apaarId: string; // 12-digit APAAR
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  annualFamilyIncome: number; // in INR
  currentEducationLevel: string; // e.g., "12th Standard (Science)" or "B.Tech 2nd Year"
  classGradeNumber: number; // 12
  marksPercentage: number;
  institutionName: string;
  institutionUdiseCode: string;
  domicileState: string;
  district: string;
  hasDisability: boolean;
  bankAccount: {
    accountNumberMasked: string;
    bankName: string;
    ifsc: string;
    npciAadhaarSeeded: boolean;
  };
  digiLockerLinked: boolean;
  apaarLinked: boolean;
  documents: StudentDocument[];
}

export interface OutreachStudent {
  id: string;
  name: string;
  district: string;
  state: string;
  schoolName: string;
  category: string;
  annualIncome: number;
  marksPercent: number;
  eligibleSchemes: string[];
  riskFactor: 'High Drop-Out Risk' | 'No Internet Access' | 'Low Awareness' | 'First-Gen Learner';
  contactMobileMasked: string;
  outreachStatus: 'Not_Contacted' | 'SMS_Dispatched' | 'WhatsApp_Delivered' | 'IVR_Called' | 'Enrolled';
  lastCampaignDate?: string;
}

export interface DistrictMetric {
  district: string;
  state: string;
  totalEligible: number;
  appliedCount: number;
  unreachedCount: number;
  saturationRate: number; // percentage
  topUrgentScheme: string;
}

