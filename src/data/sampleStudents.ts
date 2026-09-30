import { StudentProfile, ApplicationRecord, MismatchRecord } from '../types/scholarship';

export const INITIAL_STUDENT: StudentProfile = {
  id: 'stu_109284',
  fullName: 'Priya Kumari Sharma',
  gender: 'Female',
  dob: '2006-08-14',
  mobile: '+91 98765 43210',
  email: 'priya.sharma2026@gmail.com',
  aadhaarNumberMasked: 'XXXX-XXXX-7391',
  apaarId: '9845-2104-6729',
  category: 'OBC',
  annualFamilyIncome: 185000,
  currentEducationLevel: 'B.Tech Computer Science (1st Year)',
  classGradeNumber: 13,
  marksPercentage: 84.6,
  institutionName: 'Govt Engineering College, Varanasi (AKTU)',
  institutionUdiseCode: '09630504102',
  domicileState: 'Uttar Pradesh',
  district: 'Varanasi',
  hasDisability: false,
  bankAccount: {
    accountNumberMasked: 'XXXX-XXXX-6512',
    bankName: 'State Bank of India',
    ifsc: 'SBIN0001248',
    npciAadhaarSeeded: true,
  },
  digiLockerLinked: true,
  apaarLinked: true,
  documents: [
    {
      id: 'doc_aadhaar',
      type: 'Aadhaar',
      name: 'Aadhaar Card (UIDAI)',
      fileName: 'uidai_aadhaar_7391.pdf',
      source: 'DigiLocker',
      verifiedStatus: 'Verified',
      issuedDate: '2023-01-10',
      verificationBadgeId: 'DL-UIDAI-99412',
      storageUrl: 'https://cloudinary.mock.gov.in/docs/aadhaar_7391.pdf',
      ocrConfidence: 0.99,
      ocrExtractedData: {
        fullName: 'Priya Kumari Sharma',
        dob: '2006-08-14',
        serialNumber: '7391',
        issuingAuthority: 'UIDAI Govt of India'
      }
    },
    {
      id: 'doc_income',
      type: 'Income_Certificate',
      name: 'Annual Income Certificate (Tehsildar)',
      fileName: 'income_up_rev_2025.pdf',
      source: 'DigiLocker',
      verifiedStatus: 'Verified',
      issuedDate: '2025-05-12',
      expiryDate: '2026-10-25', // Expiring in 27 days! Triggers Risk Radar
      verificationBadgeId: 'EDISTRICT-UP-884129',
      storageUrl: 'https://cloudinary.mock.gov.in/docs/income_cert.pdf',
      ocrConfidence: 0.96,
      ocrExtractedData: {
        fullName: 'Priya Kumari Sharma',
        incomeValue: 185000,
        issuingAuthority: 'Tehsildar Sadar, Varanasi'
      }
    },
    {
      id: 'doc_caste',
      type: 'Caste_Certificate',
      name: 'OBC Non-Creamy Layer Certificate',
      fileName: 'obc_ncl_cert_up.pdf',
      source: 'DigiLocker',
      verifiedStatus: 'Verified',
      issuedDate: '2024-04-18',
      verificationBadgeId: 'EDISTRICT-UP-CAST-3382',
      storageUrl: 'https://cloudinary.mock.gov.in/docs/caste_obc.pdf',
      ocrConfidence: 0.98,
      ocrExtractedData: {
        fullName: 'Priya Kumari Sharma',
        category: 'OBC (Other Backward Classes)',
        issuingAuthority: 'Sub-Divisional Magistrate, Varanasi'
      }
    },
    {
      id: 'doc_marksheet_12',
      type: 'Marksheet_12',
      name: 'CBSE Class XII Board Marksheet',
      fileName: 'cbse_class12_marksheet.pdf',
      source: 'DigiLocker',
      verifiedStatus: 'Verified',
      issuedDate: '2024-05-20',
      verificationBadgeId: 'CBSE-DIGI-2024-9182',
      storageUrl: 'https://cloudinary.mock.gov.in/docs/cbse_12.pdf',
      ocrConfidence: 0.97,
      ocrExtractedData: {
        fullName: 'Priya K Sharma', // slight name discrepancy triggers mismatch alert!
        serialNumber: 'ROLL-1284918',
        issuingAuthority: 'CBSE New Delhi'
      }
    },
    {
      id: 'doc_passbook',
      type: 'Bank_Passbook',
      name: 'SBI Bank Passbook & Mandate Proof',
      fileName: 'sbi_passbook_scan.pdf',
      source: 'Manual_Upload',
      verifiedStatus: 'Verified',
      issuedDate: '2024-07-02',
      storageUrl: 'https://cloudinary.mock.gov.in/docs/sbi_passbook.pdf',
      ocrConfidence: 0.94,
      ocrExtractedData: {
        fullName: 'Priya Kumari Sharma',
        serialNumber: 'SBIN0001248'
      }
    }
  ]
};

export const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app_2026_001',
    applicationNumber: 'SS-2026-UP-849102',
    schemeId: 'scheme_aicte_pragati',
    schemeName: 'AICTE Pragati Scholarship Scheme for Girl Students',
    studentId: 'stu_109284',
    studentName: 'Priya Kumari Sharma',
    apaarId: '9845-2104-6729',
    appliedDate: '2026-09-12',
    status: 'District_Verified',
    stageProgress: 60,
    amountSanctioned: 50000,
    dbtStatus: 'PFMS_Batch_Queued',
    pfmsTransactionId: 'PFMS-UP-2026-99214-DBT',
    officerRemarks: 'Institute verified admission letter. District nodal approval completed. Disbursal file batched for PFMS Aadhaar push.',
    riskLevel: 'Low',
    matchScore: 98
  },
  {
    id: 'app_2026_002',
    applicationNumber: 'SS-2026-UP-849103',
    schemeId: 'scheme_nsp_central',
    schemeName: 'Central Sector Scheme of Scholarships (NSP)',
    studentId: 'stu_109284',
    studentName: 'Priya Kumari Sharma',
    apaarId: '9845-2104-6729',
    appliedDate: '2026-09-18',
    status: 'Submitted',
    stageProgress: 35,
    amountSanctioned: 20000,
    dbtStatus: 'Not_Initiated',
    officerRemarks: 'Pending Principal verification at Govt Engineering College Varanasi.',
    riskLevel: 'Low',
    matchScore: 92
  },
  {
    id: 'app_2026_003',
    applicationNumber: 'SS-2026-UP-849104',
    schemeId: 'scheme_post_matric_sc_st',
    schemeName: 'Post-Matric Scholarship Scheme for SC / ST Students',
    studentId: 'stu_109284',
    studentName: 'Priya Kumari Sharma',
    apaarId: '9845-2104-6729',
    appliedDate: '2026-09-02',
    status: 'Deficient',
    stageProgress: 25,
    amountSanctioned: 45000,
    dbtStatus: 'Not_Initiated',
    deficiencyReason: 'Category mismatch: Applicant is OBC but applied under SC/ST scheme.',
    deficiencyActionRequired: 'Please review scheme criteria or apply for PM-YASASVI or Pragati scheme.',
    officerRemarks: 'Caste certificate on record states OBC, whereas scheme is reserved for Scheduled Castes.',
    riskLevel: 'High',
    matchScore: 40
  }
];

export const INITIAL_MISMATCHES: MismatchRecord[] = [
  {
    id: 'mism_01',
    studentId: 'stu_109284',
    studentName: 'Priya Kumari Sharma',
    apaarId: '9845-2104-6729',
    applicationId: 'app_2026_001',
    fieldName: 'Full Name',
    studentClaimedValue: 'Priya Kumari Sharma',
    officialSource: 'DigiLocker',
    sourceVerifiedValue: 'Priya K Sharma (CBSE Class XII Record)',
    severity: 'Warning',
    detectedAt: '2026-09-15 14:22 IST',
    status: 'Clarification_Requested',
    suggestion: 'Minor middle name abbreviation detected between Aadhaar ("Kumari") and CBSE ("K"). Auto-reconciliation eligible via APAAR identity graph.'
  },
  {
    id: 'mism_02',
    studentId: 'stu_109284',
    studentName: 'Priya Kumari Sharma',
    apaarId: '9845-2104-6729',
    applicationId: 'app_2026_002',
    fieldName: 'Family Annual Income',
    studentClaimedValue: '₹1,85,000 / year',
    officialSource: 'Income Tax/Ration',
    sourceVerifiedValue: '₹1,82,400 (e-District UP Revenue Record)',
    severity: 'Minor',
    detectedAt: '2026-09-18 10:11 IST',
    status: 'Pending_Review',
    suggestion: 'Delta is within acceptable 5% variance margin. Officer can approve automatic reconciliation.'
  }
];
