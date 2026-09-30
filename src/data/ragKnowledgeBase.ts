export interface RagChunk {
  id: string;
  topic: string;
  keywords: string[];
  content: string;
}

export const RAG_KNOWLEDGE_BASE: RagChunk[] = [
  {
    id: 'rag_001',
    topic: 'Central Sector Scheme of Scholarships (NSP CSSS)',
    keywords: ['central sector', 'csss', 'nsp', 'merit', '80 percentile', 'income limit 4.5 lakh', 'college'],
    content: `Central Sector Scheme (CSSS) is administered by the Ministry of Education.
- Eligibility: Minimum 80th percentile in relevant stream in Class XII Board examination.
- Family Annual Income limit: Gross annual income of parents must not exceed ₹4,50,000 per annum from all sources.
- Rate of scholarship: ₹12,000 per annum for the first 3 years of graduate level, and ₹20,000 per annum at post-graduate level.
- Must not be receiving any other Centrally Sponsored or State scholarship for the same study.`
  },
  {
    id: 'rag_002',
    topic: 'Post-Matric SC/ST Scholarship Scheme',
    keywords: ['post-matric', 'sc', 'st', 'scheduled caste', 'scheduled tribe', 'maintenance allowance', 'tuition fee'],
    content: `Post-Matric Scholarship for SC/ST is a centrally sponsored scheme implemented by State Governments.
- Eligibility: Students belonging to SC or ST categories pursuing recognized post-matric or post-secondary courses.
- Income Ceiling: Family income from all sources must not exceed ₹2,50,000 per annum.
- Benefits: Complete reimbursement of compulsory non-refundable fees (tuition fees) + monthly maintenance allowance (up to ₹13,500/year for hostellers).
- Aadhaar-based DBT payment directly into Aadhaar-seeded bank account through PFMS.`
  },
  {
    id: 'rag_003',
    topic: 'AICTE Pragati Scholarship Scheme for Girl Students',
    keywords: ['pragati', 'aicte', 'girls', 'female', 'technical', 'engineering', 'diploma', 'degree'],
    content: `AICTE Pragati Scheme is aimed at empowering young women in Technical Education.
- Eligibility: Female students admitted to 1st year of Degree/Diploma program in an AICTE approved institution (or 2nd year via lateral entry).
- Quota: Maximum 2 girl children per family.
- Income Limit: Family income from all sources must not exceed ₹8,00,000 per annum.
- Amount: ₹50,000 per annum awarded towards tuition fee, books, stationery, laptop/computer purchase.`
  },
  {
    id: 'rag_004',
    topic: 'Handling Name Mismatch in Documents',
    keywords: ['name mismatch', 'spelling mistake', 'aadhaar name', 'marksheet name', 'deficiency', 'correction'],
    content: `If your name differs between Aadhaar and Board Marksheet (e.g. "Priya Kumari" vs "Priya K"):
1. In ShikshaSetu, minor spelling or abbreviation mismatches (Levenshtein distance < 3) can be auto-reconciled using your APAAR ID and DigiLocker linked records.
2. For major discrepancies, request an Institute Nodal Officer Endorsement Certificate or submit an affidavit on stamp paper.
3. To permanently fix, update your Aadhaar card at your nearest Aadhaar Seva Kendra or update your Board certificate via your state Board portal.`
  },
  {
    id: 'rag_005',
    topic: 'Aadhaar NPCI DBT Seeding Process',
    keywords: ['npci', 'aadhaar seeding', 'dbt', 'bank unlinked', 'pfms failure', 'dbt status'],
    content: `Direct Benefit Transfer (DBT) requires your bank account to be linked with NPCI (National Payments Corporation of India) Aadhaar Mapper.
- Merely having your Aadhaar card linked with your bank for KYC is NOT enough; the account must be enabled for 'Aadhaar DBT Credit'.
- How to check: Use UIDAI portal "Check Aadhaar & Bank Account Seeding Status" or visit your bank branch and submit the 'NPCI Aadhaar Mandate Form'.
- In ShikshaSetu, you can verify this instantly via our Sandbox NPCI Connector.`
  },
  {
    id: 'rag_006',
    topic: 'Income Certificate Validity and Renewal Guidelines',
    keywords: ['income certificate', 'validity', 'expiry', 'tehsildar', 'financial year', 'edistrict'],
    content: `Income certificates issued by State Revenue Authorities (Tehsildar / SDO / Revenue Officer) are generally valid for:
- 1 financial year or 3 years depending on State Government rules.
- If your certificate expires during the application verification cycle, upload a renewed certificate or the acknowledgment receipt with application number from e-District to prevent application rejection or deficiency flagging.`
  },
  {
    id: 'rag_007',
    topic: 'Deficiency Notice Redressal & Resolution Window',
    keywords: ['deficiency', 'defect', 'application returned', 're-submit', 'correction window'],
    content: `When an application is marked as 'Deficient' by the Institute, District, or State Nodal Officer:
- The student is granted a mandatory 15-day rectification window to upload requested clarification documents.
- The application is NOT rejected; once the student re-uploads the correct document or resolves the mismatch, the application is prioritized in the Officer Verification Queue.`
  }
];

export function retrieveRagContext(query: string): string {
  const qLower = query.toLowerCase();
  const scored = RAG_KNOWLEDGE_BASE.map(chunk => {
    let score = 0;
    for (const kw of chunk.keywords) {
      if (qLower.includes(kw.toLowerCase())) score += 3;
    }
    const words = qLower.split(/\s+/);
    for (const w of words) {
      if (w.length > 3 && chunk.content.toLowerCase().includes(w)) score += 1;
    }
    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const relevant = scored.filter(s => s.score > 0).slice(0, 3);
  if (relevant.length === 0) {
    return RAG_KNOWLEDGE_BASE.slice(0, 2).map(r => r.content).join('\n---\n');
  }
  return relevant.map(r => `[Knowledge Topic: ${r.chunk.topic}]\n${r.chunk.content}`).join('\n\n---\n\n');
}
