import { OutreachStudent, DistrictMetric } from '../types/scholarship';

export const OUTREACH_STUDENTS: OutreachStudent[] = [
  {
    id: 'out_001',
    name: 'Santosh Rawat',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    schoolName: 'Pt. Deen Dayal Upadhyay Govt Inter College',
    category: 'SC',
    annualIncome: 95000,
    marksPercent: 78.5,
    eligibleSchemes: ['Post-Matric SC/ST Scholarship', 'NMMS Merit Scholarship'],
    riskFactor: 'High Drop-Out Risk',
    contactMobileMasked: '+91 9415X XXX19',
    outreachStatus: 'Not_Contacted'
  },
  {
    id: 'out_002',
    name: 'Kavita Bind',
    district: 'Mirzapur',
    state: 'Uttar Pradesh',
    schoolName: 'Kasturba Gandhi Balika Vidyalaya, Chunar',
    category: 'OBC',
    annualIncome: 110000,
    marksPercent: 82.0,
    eligibleSchemes: ['Pragati Scholarship for Girls', 'Begum Hazrat Mahal Scholarship'],
    riskFactor: 'No Internet Access',
    contactMobileMasked: '+91 9838X XXX42',
    outreachStatus: 'SMS_Dispatched',
    lastCampaignDate: '2026-09-24'
  },
  {
    id: 'out_003',
    name: 'Manish Kumar Gond',
    district: 'Sonbhadra',
    state: 'Uttar Pradesh',
    schoolName: 'Govt Tribal Ashram Inter College, Dudhi',
    category: 'ST',
    annualIncome: 60000,
    marksPercent: 71.4,
    eligibleSchemes: ['Post-Matric SC/ST Scholarship'],
    riskFactor: 'First-Gen Learner',
    contactMobileMasked: '+91 8765X XXX89',
    outreachStatus: 'Not_Contacted'
  },
  {
    id: 'out_004',
    name: 'Fatima Zohra',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    schoolName: 'Anjuman Islamia High School',
    category: 'General (Minority)',
    annualIncome: 140000,
    marksPercent: 89.2,
    eligibleSchemes: ['Begum Hazrat Mahal Scholarship', 'Central Sector Scheme (NSP)'],
    riskFactor: 'Low Awareness',
    contactMobileMasked: '+91 9120X XXX73',
    outreachStatus: 'WhatsApp_Delivered',
    lastCampaignDate: '2026-09-26'
  },
  {
    id: 'out_005',
    name: 'Deepak Paswan',
    district: 'Patna',
    state: 'Bihar',
    schoolName: 'Govt Boys Senior Secondary, Danapur',
    category: 'SC',
    annualIncome: 120000,
    marksPercent: 79.8,
    eligibleSchemes: ['Post-Matric SC/ST Scholarship', 'PM-YASASVI Scholarship'],
    riskFactor: 'High Drop-Out Risk',
    contactMobileMasked: '+91 9470X XXX55',
    outreachStatus: 'Not_Contacted'
  },
  {
    id: 'out_006',
    name: 'Gita Devi Murmu',
    district: 'Ranchi',
    state: 'Jharkhand',
    schoolName: 'Birsa Munda Memorial Girls School',
    category: 'ST',
    annualIncome: 75000,
    marksPercent: 84.1,
    eligibleSchemes: ['Post-Matric SC/ST Scholarship', 'Pragati Scholarship for Girls'],
    riskFactor: 'No Internet Access',
    contactMobileMasked: '+91 9934X XXX21',
    outreachStatus: 'Not_Contacted'
  }
];

export const DISTRICT_SATURATION_DATA: DistrictMetric[] = [
  { district: 'Varanasi', state: 'Uttar Pradesh', totalEligible: 12400, appliedCount: 9850, unreachedCount: 2550, saturationRate: 79.4, topUrgentScheme: 'Central Sector Scheme (NSP)' },
  { district: 'Mirzapur', state: 'Uttar Pradesh', totalEligible: 8600, appliedCount: 5200, unreachedCount: 3400, saturationRate: 60.5, topUrgentScheme: 'Post-Matric SC/ST' },
  { district: 'Sonbhadra', state: 'Uttar Pradesh', totalEligible: 7200, appliedCount: 3800, unreachedCount: 3400, saturationRate: 52.8, topUrgentScheme: 'Post-Matric SC/ST (Tribal)' },
  { district: 'Patna', state: 'Bihar', totalEligible: 18900, appliedCount: 15300, unreachedCount: 3600, saturationRate: 81.0, topUrgentScheme: 'Pragati AICTE' },
  { district: 'Gaya', state: 'Bihar', totalEligible: 11200, appliedCount: 6800, unreachedCount: 4400, saturationRate: 60.7, topUrgentScheme: 'NMMS Merit Scholarship' },
  { district: 'Ranchi', state: 'Jharkhand', totalEligible: 9400, appliedCount: 6100, unreachedCount: 3300, saturationRate: 64.9, topUrgentScheme: 'Post-Matric SC/ST' },
  { district: 'Barabanki', state: 'Uttar Pradesh', totalEligible: 6800, appliedCount: 4100, unreachedCount: 2700, saturationRate: 60.3, topUrgentScheme: 'Begum Hazrat Mahal' }
];
