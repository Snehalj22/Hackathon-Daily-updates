export interface TicketUpdate {
  id: string;
  ticketId: string;
  date: Date;
  summary: string;
  currentStatus: TicketStatus;
  developmentProgress: DevelopmentProgress;
  qaProgress: QAProgress;
  reopenHistory: ReopenEvent[];
  delays: DelayAnalysis[];
  testingRecommendations: TestingRecommendation[];
  riskAssessment: RiskAssessment;
  estimatedCompletion: Date;
  blockers: Blocker[];
}

export interface TicketStatus {
  state: 'Planning' | 'In Development' | 'Code Review' | 'QA Testing' | 'UAT' | 'Resolved' | 'Reopened';
  assignee: string;
  lastUpdated: Date;
  daysInCurrentState: number;
}

export interface DevelopmentProgress {
  startDate: Date | null;
  endDate: Date | null;
  completionPercentage: number;
  commits: number;
  linesOfCodeChanged: number;
  developers: Developer[];
  pullRequests: PullRequest[];
}

export interface Developer {
  name: string;
  contributions: number;
  lastActive: Date;
}

export interface PullRequest {
  id: string;
  title: string;
  status: 'Open' | 'Merged' | 'Closed';
  createdDate: Date;
  reviewers: string[];
  comments: number;
}

export interface QAProgress {
  startDate: Date | null;
  endDate: Date | null;
  testCasesTotal: number;
  testCasesPassed: number;
  testCasesFailed: number;
  automationCoverage: number;
  testers: string[];
  bugs: Bug[];
}

export interface Bug {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Fixed' | 'Verified';
  description: string;
  foundDate: Date;
}

export interface ReopenEvent {
  date: Date;
  reason: string;
  reportedBy: string;
  previousState: string;
  issueType: 'Bug' | 'Missing Requirement' | 'Performance' | 'UX Issue' | 'Other';
}

export interface DelayAnalysis {
  phase: string;
  expectedDuration: number;
  actualDuration: number;
  delayDays: number;
  reason: string;
  impact: 'High' | 'Medium' | 'Low';
  mitigation: string;
}

export interface TestingRecommendation {
  area: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  testType: 'Unit' | 'Integration' | 'E2E' | 'Performance' | 'Security' | 'UAT';
  description: string;
  estimatedEffort: string;
  automatable: boolean;
}

export interface RiskAssessment {
  overallRisk: 'High' | 'Medium' | 'Low';
  factors: RiskFactor[];
  mitigationStrategies: string[];
}

export interface RiskFactor {
  type: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface Blocker {
  id: string;
  description: string;
  type: 'Technical' | 'Resource' | 'Dependency' | 'Business';
  reportedDate: Date;
  reporter: string;
  status: 'Active' | 'Resolved';
  resolution?: string;
}