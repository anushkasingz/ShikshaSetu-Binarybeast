import { StudentProfile, ScholarshipScheme, RiskAlert, NextBestAction, MismatchRecord } from '../types/scholarship';

export interface EligibilityMatchResult {
  schemeId: string;
  isEligible: boolean;
  matchScore: number; // 0 to 100
  reasons: string[];
  blockers: string[];
}

export interface ReadinessScoreResult {
  totalScore: number; // 0 to 100
  level: 'High' | 'Moderate' | 'Action_Required';
  breakdown: {
    profileCompleteness: { score: number; max: 20; label: string };
    identityAuth: { score: number; max: 25; label: string };
    documentHealth: { score: number; max: 25; label: string };
    npciBankSeeding: { score: number; max: 20; label: string };
    mismatchCleanliness: { score: number; max: 10; label: string };
  };
  summary: string;
}

export function evaluateSchemeEligibility(student: StudentProfile, scheme: ScholarshipScheme): EligibilityMatchResult {
  const reasons: string[] = [];
  const blockers: string[] = [];
  let score = 100;

  // 1. Marks check
  if (student.marksPercentage >= scheme.criteria.minMarksPercent) {
    reasons.push(`Academic score (${student.marksPercentage}%) exceeds required ${scheme.criteria.minMarksPercent}%.`);
  } else {
    blockers.push(`Requires minimum ${scheme.criteria.minMarksPercent}% marks (You have ${student.marksPercentage}%).`);
    score -= 40;
  }

  // 2. Family Income check
  if (student.annualFamilyIncome <= scheme.criteria.maxFamilyIncomeAnnual) {
    reasons.push(`Annual income (₹${student.annualFamilyIncome.toLocaleString('en-IN')}) is within ₹${scheme.criteria.maxFamilyIncomeAnnual.toLocaleString('en-IN')} ceiling.`);
  } else {
    blockers.push(`Income ₹${student.annualFamilyIncome.toLocaleString('en-IN')} exceeds limit of ₹${scheme.criteria.maxFamilyIncomeAnnual.toLocaleString('en-IN')}.`);
    score -= 50;
  }

  // 3. Social Category check
  const catAllowed = scheme.criteria.allowedCategories.includes('All') || scheme.criteria.allowedCategories.includes(student.category);
  if (catAllowed) {
    reasons.push(`Category '${student.category}' is eligible.`);
  } else {
    blockers.push(`Scheme restricted to ${scheme.criteria.allowedCategories.join(', ')} categories.`);
    score -= 50;
  }

  // 4. Gender restriction
  if (!scheme.criteria.genderRestriction || scheme.criteria.genderRestriction === 'All' || scheme.criteria.genderRestriction === student.gender) {
    if (scheme.criteria.genderRestriction === 'Female') {
      reasons.push('Meets female applicant entitlement criteria.');
    }
  } else {
    blockers.push(`Reserved exclusively for ${scheme.criteria.genderRestriction} applicants.`);
    score -= 60;
  }

  // 5. Class level check
  if (scheme.criteria.minClassLevel && student.classGradeNumber < scheme.criteria.minClassLevel) {
    blockers.push(`Minimum class level ${scheme.criteria.minClassLevel} required.`);
    score -= 30;
  }
  if (scheme.criteria.maxClassLevel && student.classGradeNumber > scheme.criteria.maxClassLevel) {
    blockers.push(`Scheme only applicable up to class level ${scheme.criteria.maxClassLevel}.`);
    score -= 30;
  }

  const finalScore = Math.max(0, Math.min(100, score));
  return {
    schemeId: scheme.id,
    isEligible: blockers.length === 0,
    matchScore: blockers.length === 0 ? finalScore : Math.min(45, finalScore),
    reasons,
    blockers
  };
}

export function calculateReadinessScore(student: StudentProfile, mismatches: MismatchRecord[] = []): ReadinessScoreResult {
  // Profile completeness (max 20)
  let profScore = 0;
  if (student.fullName && student.dob) profScore += 5;
  if (student.institutionName && student.institutionUdiseCode) profScore += 5;
  if (student.annualFamilyIncome > 0) profScore += 5;
  if (student.domicileState && student.district) profScore += 5;

  // Identity Auth (max 25)
  let idScore = 0;
  if (student.aadhaarNumberMasked) idScore += 10;
  if (student.digiLockerLinked) idScore += 8;
  if (student.apaarLinked) idScore += 7;

  // Document health (max 25)
  const reqTypes = ['Aadhaar', 'Income_Certificate', 'Marksheet_12', 'Bank_Passbook'];
  let docScore = 0;
  const now = new Date();
  for (const type of reqTypes) {
    const doc = student.documents.find(d => d.type === type);
    if (doc) {
      if (doc.verifiedStatus === 'Verified') {
        // check expiry
        if (doc.expiryDate) {
          const exp = new Date(doc.expiryDate);
          const daysLeft = (exp.getTime() - now.getTime()) / (1000 * 3600 * 24);
          if (daysLeft < 30) {
            docScore += 3; // slight penalty for expiring
          } else {
            docScore += 6.25;
          }
        } else {
          docScore += 6.25;
        }
      } else {
        docScore += 3;
      }
    }
  }

  // NPCI Bank Seeding (max 20)
  let bankScore = 0;
  if (student.bankAccount.accountNumberMasked && student.bankAccount.ifsc) bankScore += 8;
  if (student.bankAccount.npciAadhaarSeeded) bankScore += 12;

  // Mismatch cleanliness (max 10)
  const criticalMismatches = mismatches.filter(m => m.studentId === student.id && m.severity === 'Critical' && m.status !== 'Override_Approved');
  const warningMismatches = mismatches.filter(m => m.studentId === student.id && m.severity === 'Warning' && m.status !== 'Override_Approved');
  let mismatchScore = 10;
  if (criticalMismatches.length > 0) mismatchScore -= 8;
  if (warningMismatches.length > 0) mismatchScore -= 4;
  mismatchScore = Math.max(0, mismatchScore);

  const total = Math.round(profScore + idScore + docScore + bankScore + mismatchScore);

  let level: 'High' | 'Moderate' | 'Action_Required' = 'Moderate';
  if (total >= 80) level = 'High';
  else if (total < 60) level = 'Action_Required';

  let summary = 'Your profile is in great standing. Ready for instant 1-click verification & DBT sanction.';
  if (level === 'Moderate') {
    summary = 'Profile has minor warning items (e.g. certificate expiring or pending DigiLocker renewal).';
  } else if (level === 'Action_Required') {
    summary = 'Action required on critical items to prevent application rejection by Nodal Officers.';
  }

  return {
    totalScore: total,
    level,
    breakdown: {
      profileCompleteness: { score: profScore, max: 20, label: 'Profile Information' },
      identityAuth: { score: idScore, max: 25, label: 'DigiLocker & APAAR' },
      documentHealth: { score: Math.round(docScore), max: 25, label: 'Document Health & Validity' },
      npciBankSeeding: { score: bankScore, max: 20, label: 'NPCI Aadhaar Bank Seeding' },
      mismatchCleanliness: { score: mismatchScore, max: 10, label: 'Data Discrepancy Status' }
    },
    summary
  };
}

export function detectStudentRisks(student: StudentProfile, mismatches: MismatchRecord[] = []): RiskAlert[] {
  const alerts: RiskAlert[] = [];
  const now = new Date();

  // 1. Expiry checks
  for (const doc of student.documents) {
    if (doc.expiryDate) {
      const expDate = new Date(doc.expiryDate);
      const daysUntil = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
      if (daysUntil > 0 && daysUntil <= 30) {
        alerts.push({
          id: `risk_exp_${doc.id}`,
          title: `${doc.name} Expiring in ${daysUntil} Days`,
          severity: daysUntil <= 15 ? 'high' : 'medium',
          category: 'Document',
          description: `Your ${doc.name} expires on ${doc.expiryDate}. Upload a renewed certificate from e-District portal or DigiLocker before district sanction.`,
          actionLabel: 'Renew via DigiLocker',
          actionType: 'digilocker'
        });
      }
    }
  }

  // 2. NPCI Bank Seeding Check
  if (!student.bankAccount.npciAadhaarSeeded) {
    alerts.push({
      id: 'risk_npci_unlinked',
      title: 'Bank Account NOT Seeded with Aadhaar NPCI',
      severity: 'high',
      category: 'Bank',
      description: 'DBT funds cannot be disbursed via PFMS without NPCI mapper link. Submit Aadhaar mandate form at your branch or link online.',
      actionLabel: 'Verify NPCI Bridge',
      actionType: 'bank_seed'
    });
  }

  // 3. Mismatches
  for (const m of mismatches.filter(m => m.studentId === student.id && m.status === 'Pending_Review')) {
    alerts.push({
      id: `risk_mism_${m.id}`,
      title: `${m.fieldName} Mismatch with ${m.officialSource}`,
      severity: m.severity === 'Critical' ? 'high' : 'medium',
      category: 'Mismatch',
      description: `Student claimed: "${m.studentClaimedValue}" vs Official: "${m.sourceVerifiedValue}". ${m.suggestion}`,
      actionLabel: 'Resolve Mismatch',
      actionType: 'resolve_mismatch'
    });
  }

  // 4. Missing required docs
  const docTypes = student.documents.map(d => d.type);
  if (!docTypes.includes('Income_Certificate')) {
    alerts.push({
      id: 'risk_missing_income',
      title: 'Missing Income Certificate',
      severity: 'high',
      category: 'Document',
      description: 'All central and state merit-cum-means scholarships require a valid Income Certificate.',
      actionLabel: 'Upload Income Proof',
      actionType: 'upload'
    });
  }

  return alerts;
}

export function generateNextBestActions(
  student: StudentProfile,
  schemes: ScholarshipScheme[],
  risks: RiskAlert[]
): NextBestAction[] {
  const actions: NextBestAction[] = [];

  // If high risk exists, that is #1
  const highRisk = risks.find(r => r.severity === 'high');
  if (highRisk) {
    actions.push({
      id: 'act_resolve_high_risk',
      priority: 1,
      title: highRisk.title,
      subtitle: highRisk.description,
      badge: 'URGENT RESOLUTION',
      actionType: highRisk.actionType === 'bank_seed' ? 'link_bank' : 'upload_doc'
    });
  }

  // Next: Top matching scheme not yet applied
  const topMatch = schemes
    .map(s => ({ scheme: s, match: evaluateSchemeEligibility(student, s) }))
    .filter(m => m.match.isEligible)
    .sort((a, b) => b.match.matchScore - a.match.matchScore)[0];

  if (topMatch) {
    actions.push({
      id: `act_apply_${topMatch.scheme.id}`,
      priority: 2,
      title: `Apply for ${topMatch.scheme.shortName}`,
      subtitle: `You have ${topMatch.match.matchScore}% eligibility match. Benefit: ₹${topMatch.scheme.annualBenefit.toLocaleString('en-IN')}/year.`,
      badge: 'HIGH MATCH (98%)',
      actionType: 'apply',
      targetSchemeId: topMatch.scheme.id
    });
  }

  // Next: DigiLocker auto-sync or document check
  if (!student.digiLockerLinked) {
    actions.push({
      id: 'act_digilocker',
      priority: 3,
      title: 'Link DigiLocker Account',
      subtitle: 'Instantly import verified marksheets and caste certificates with official digital seals.',
      badge: 'FAST-TRACK VERIFICATION',
      actionType: 'verify_digilocker'
    });
  } else {
    actions.push({
      id: 'act_doc_audit',
      priority: 3,
      title: 'Run AI Document Pre-Check',
      subtitle: 'Scan your uploaded certificates with Gemini OCR engine to detect flaws before officer review.',
      badge: 'AI PRE-AUDIT',
      actionType: 'upload_doc'
    });
  }

  return actions;
}
