export interface ProjectRecord {
  slug: string;
  year: number;
  dates: string | null;
  role: string | null;
  industry: string | null;
  clientDescriptor: string;
  businessProblem: string | null;
  responsibilities: string | null;
  technicalArchitecture: string | null;
  technologiesUsed: string[];
  leadership: string | null;
  challenges: string | null;
  results: string | null;
  lessonsLearned: string | null;
  resumeBulletPoints: string[];
}

export interface TimelineEntry {
  slug: string;
  year: number;
  dates: string | null;
  role: string | null;
  industry: string | null;
  clientDescriptor: string;
}

export interface SkillRecord {
  slug: string;
  name: string;
  yearsUsed: string | null;
  evidenceProjectSlugs: string[];
  experienceSummary: string | null;
  architectureExperience: string[];
  strengthLevel: number | null;
  strengthLabel: string | null;
  exampleResumeBullets: string[];
}

export interface LeadershipEvidence {
  dates: string | null;
  description: string | null;
  projectSlug: string | null;
}

export interface LeadershipRecord {
  slug: string;
  theme: string;
  summary: string | null;
  evidence: LeadershipEvidence[];
  scope: string | null;
  approach: string | null;
  impact: string | null;
  resumeBulletPoints: string[];
}

export interface AccomplishmentRecord {
  slug: string;
  title: string;
  summary: string | null;
  timeframe: string | null;
  contributingProjectSlugs: string[];
  technologiesInvolved: string[];
  businessValue: string | null;
  resumeBulletPoints: string[];
}
