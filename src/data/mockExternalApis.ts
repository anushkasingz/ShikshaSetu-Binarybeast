export interface MockApiResponse<T> {
  status: 'SUCCESS' | 'MISMATCH_DETECTED' | 'NOT_FOUND' | 'ERROR';
  statusCode: number;
  source: string;
  latencyMs: number;
  timestamp: string;
  data: T;
  auditSignature: string;
}

export const MOCK_DIGILOCKER_DB = {
  '9845-2104-6729': {
    aadhaarNumberMasked: 'XXXX-XXXX-7391',
    holderName: 'Priya Kumari Sharma',
    dob: '2006-08-14',
    gender: 'Female',
    certificates: [
      { docType: 'Class XII Marksheet', org: 'CBSE', docRef: 'CBSE-DIGI-2024-9182', nameOnDoc: 'Priya K Sharma', grade: '84.6%', year: 2024 },
      { docType: 'Income Certificate', org: 'Govt of UP - Revenue', docRef: 'EDISTRICT-UP-884129', annualIncome: 185000, validUntil: '2026-10-25' },
      { docType: 'Caste Certificate', org: 'Govt of UP - Social Welfare', docRef: 'EDISTRICT-UP-CAST-3382', category: 'OBC (Non-Creamy Layer)', issueDate: '2024-04-18' }
    ]
  }
};

export const MOCK_UDISE_DB = {
  '09630504102': {
    udiseCode: '09630504102',
    institutionName: 'Govt Engineering College, Varanasi',
    affiliatedUniversity: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU)',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    institutionType: 'State Government Technical University Affiliated',
    aicteApproved: true,
    activeStudentsCount: 2480,
    nodalOfficer: {
      name: 'Dr. Rajeshwar Rao',
      designation: 'Scholarship Nodal Officer',
      email: 'nodal.scholarship@gecvaranasi.ac.in',
      phone: '+91 542 229103'
    }
  }
};

export const MOCK_APAAR_REGISTRY = {
  '9845-2104-6729': {
    apaarId: '9845-2104-6729',
    linkedAadhaarRef: 'UIDAI-SHA256-e4a819b2',
    legalName: 'Priya Kumari Sharma',
    currentEnrolledDegree: 'Bachelor of Technology (Computer Science & Engineering)',
    currentSemester: 2,
    cumulativeCredits: 22,
    attendancePercent: 88.4,
    institutionCode: '09630504102'
  }
};

export const MOCK_NPCI_DBT_MAPPING = {
  'XXXX-XXXX-7391': {
    aadhaarNumberMasked: 'XXXX-XXXX-7391',
    dbtStatus: 'ACTIVE_SEEDED',
    linkedBank: 'State Bank of India',
    bankBranch: 'BHU Main Campus, Varanasi',
    ifsc: 'SBIN0001248',
    lastMandateAuthDate: '2025-08-11',
    accountStatus: 'OPERATIVE_KYC_COMPLIANT'
  }
};

export async function queryMockDigiLocker(apaarId: string): Promise<MockApiResponse<any>> {
  await new Promise(r => setTimeout(r, 600));
  const record = (MOCK_DIGILOCKER_DB as any)[apaarId];
  if (!record) {
    return {
      status: 'NOT_FOUND',
      statusCode: 404,
      source: 'DigiLocker Govt Gateway (Mock/Sandbox)',
      latencyMs: 620,
      timestamp: new Date().toISOString(),
      data: null,
      auditSignature: 'HMAC-SHA256-SANDBOX-NIL'
    };
  }
  return {
    status: 'SUCCESS',
    statusCode: 200,
    source: 'DigiLocker Sandbox Connector (MeitY)',
    latencyMs: 580,
    timestamp: new Date().toISOString(),
    data: record,
    auditSignature: 'DL-SHA256-7fa19bb012'
  };
}

export async function queryMockUdise(udiseCode: string): Promise<MockApiResponse<any>> {
  await new Promise(r => setTimeout(r, 450));
  const record = (MOCK_UDISE_DB as any)[udiseCode];
  return {
    status: record ? 'SUCCESS' : 'NOT_FOUND',
    statusCode: record ? 200 : 404,
    source: 'UDISE+ Ministry of Education Connector (Mock/Sandbox)',
    latencyMs: 440,
    timestamp: new Date().toISOString(),
    data: record,
    auditSignature: 'UDISE-SIGN-889104'
  };
}

export async function queryMockApaar(apaarId: string): Promise<MockApiResponse<any>> {
  await new Promise(r => setTimeout(r, 500));
  const record = (MOCK_APAAR_REGISTRY as any)[apaarId];
  return {
    status: record ? 'SUCCESS' : 'NOT_FOUND',
    statusCode: record ? 200 : 404,
    source: 'APAAR / Academic Bank of Credits Gateway (Mock/Sandbox)',
    latencyMs: 510,
    timestamp: new Date().toISOString(),
    data: record,
    auditSignature: 'APAAR-TOKEN-44819'
  };
}

export async function queryMockNpciDbt(maskedAadhaar: string): Promise<MockApiResponse<any>> {
  await new Promise(r => setTimeout(r, 650));
  const record = (MOCK_NPCI_DBT_MAPPING as any)[maskedAadhaar];
  return {
    status: record ? 'SUCCESS' : 'NOT_FOUND',
    statusCode: record ? 200 : 404,
    source: 'NPCI National Payments Aadhaar Seeding Bridge (Mock/Sandbox)',
    latencyMs: 630,
    timestamp: new Date().toISOString(),
    data: record,
    auditSignature: 'NPCI-DBT-MAPPING-OK'
  };
}
