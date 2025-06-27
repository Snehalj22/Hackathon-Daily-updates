import { TicketUpdate } from '../types';
import { subDays, addDays } from 'date-fns';

// List of all associates
export const allAssociates = [
  'Sarah Chen',
  'John Smith',
  'Emily Davis',
  'Mike Johnson',
  'Lisa Wang',
  'David Lee',
  'Anna Wilson',
  'Robert Brown',
  'James Taylor',
  'Maria Garcia',
  'Kevin Park',
  'Rachel Green'
];

export function generateMockTicketUpdate(ticketId: string, selectedAssociate?: string): TicketUpdate {
  const now = new Date();
  const developmentStartDate = subDays(now, 15);
  const qaStartDate = subDays(now, 5);
  
  // Use selected associate or default
  const assignee = selectedAssociate || 'Sarah Chen';
  
  return {
    id: `update-${Date.now()}`,
    ticketId,
    date: now,
    summary: `Feature: Implement user authentication with OAuth2`,
    currentStatus: {
      state: 'QA Testing',
      assignee: assignee,
      lastUpdated: subDays(now, 1),
      daysInCurrentState: 5
    },
    developmentProgress: {
      startDate: developmentStartDate,
      endDate: subDays(now, 6),
      completionPercentage: 100,
      commits: 23,
      linesOfCodeChanged: 1847,
      developers: [
        { name: 'John Smith', contributions: 15, lastActive: subDays(now, 6) },
        { name: 'Emily Davis', contributions: 8, lastActive: subDays(now, 7) }
      ],
      pullRequests: [
        {
          id: 'PR-456',
          title: 'Add OAuth2 authentication flow',
          status: 'Merged',
          createdDate: subDays(now, 10),
          reviewers: ['Mike Johnson', 'Lisa Wang'],
          comments: 12
        },
        {
          id: 'PR-478',
          title: 'Fix token refresh logic',
          status: 'Merged',
          createdDate: subDays(now, 7),
          reviewers: ['Mike Johnson'],
          comments: 5
        }
      ]
    },
    qaProgress: {
      startDate: qaStartDate,
      endDate: null,
      testCasesTotal: 45,
      testCasesPassed: 38,
      testCasesFailed: 3,
      automationCoverage: 75,
      testers: ['Sarah Chen', 'David Lee'],
      bugs: [
        {
          id: 'BUG-789',
          severity: 'High',
          status: 'Fixed',
          description: 'Token refresh fails when user session expires during API call',
          foundDate: subDays(now, 3)
        },
        {
          id: 'BUG-790',
          severity: 'Medium',
          status: 'Open',
          description: 'Logout button not disabled during logout process',
          foundDate: subDays(now, 2)
        },
        {
          id: 'BUG-791',
          severity: 'Low',
          status: 'Open',
          description: 'Login success message shows incorrect timestamp format',
          foundDate: subDays(now, 1)
        }
      ]
    },
    reopenHistory: [
      {
        date: subDays(now, 8),
        reason: 'OAuth redirect URL configuration was missing for production environment',
        reportedBy: 'QA Team',
        previousState: 'Code Review',
        issueType: 'Missing Requirement'
      },
      {
        date: subDays(now, 3),
        reason: 'Token refresh mechanism causes infinite loop in certain scenarios',
        reportedBy: 'Sarah Chen',
        previousState: 'QA Testing',
        issueType: 'Bug'
      }
    ],
    delays: [
      {
        phase: 'Development',
        expectedDuration: 8,
        actualDuration: 10,
        delayDays: 2,
        reason: 'Additional security requirements added mid-sprint',
        impact: 'Medium',
        mitigation: 'Allocated additional developer resource'
      },
      {
        phase: 'QA Testing',
        expectedDuration: 3,
        actualDuration: 5,
        delayDays: 2,
        reason: 'Critical bug found requiring code changes',
        impact: 'High',
        mitigation: 'Fast-tracked bug fixes with dedicated developer support'
      }
    ],
    testingRecommendations: [
      {
        area: 'Security Testing',
        priority: 'Critical',
        testType: 'Security',
        description: 'Penetration testing for OAuth2 implementation',
        estimatedEffort: '2 days',
        automatable: false
      },
      {
        area: 'Token Management',
        priority: 'High',
        testType: 'Integration',
        description: 'Test token refresh across all API endpoints',
        estimatedEffort: '1 day',
        automatable: true
      },
      {
        area: 'Error Handling',
        priority: 'High',
        testType: 'E2E',
        description: 'Test authentication failure scenarios and recovery',
        estimatedEffort: '1 day',
        automatable: true
      },
      {
        area: 'Performance',
        priority: 'Medium',
        testType: 'Performance',
        description: 'Load test authentication endpoints for 1000 concurrent users',
        estimatedEffort: '0.5 days',
        automatable: true
      }
    ],
    riskAssessment: {
      overallRisk: 'Medium',
      factors: [
        {
          type: 'Technical Debt',
          severity: 'Medium',
          description: 'Legacy authentication code needs refactoring'
        },
        {
          type: 'Security',
          severity: 'High',
          description: 'OAuth2 implementation requires thorough security review'
        },
        {
          type: 'Timeline',
          severity: 'Medium',
          description: 'Release date approaching with open bugs'
        }
      ],
      mitigationStrategies: [
        'Schedule security review with external consultant',
        'Allocate bug fixing sprint before release',
        'Create rollback plan for quick reversion if needed',
        'Implement feature flags for gradual rollout'
      ]
    },
    estimatedCompletion: addDays(now, 4),
    blockers: [
      {
        id: 'BLOCK-101',
        description: 'Waiting for security team approval on OAuth2 configuration',
        type: 'Business',
        reportedDate: subDays(now, 2),
        reporter: 'John Smith',
        status: 'Active',
      },
      {
        id: 'BLOCK-102',
        description: 'Production OAuth2 client credentials not yet provided',
        type: 'Dependency',
        reportedDate: subDays(now, 5),
        reporter: 'Emily Davis',
        status: 'Resolved',
        resolution: 'Credentials received and configured'
      }
    ]
  };
}

export function generateHistoricalUpdates(ticketId: string, days: number): TicketUpdate[] {
  const updates: TicketUpdate[] = [];
  const baseUpdate = generateMockTicketUpdate(ticketId);
  
  for (let i = 0; i < days; i++) {
    const daysAgo = days - i - 1;
    const update = { ...baseUpdate };
    update.date = subDays(new Date(), daysAgo);
    update.id = `update-${i}`;
    
    // Adjust progress based on how far back we are
    const progressRatio = i / days;
    update.developmentProgress.completionPercentage = Math.floor(progressRatio * 100);
    update.qaProgress.testCasesPassed = Math.floor(progressRatio * update.qaProgress.testCasesTotal);
    
    // Adjust status based on timeline
    if (progressRatio < 0.3) {
      update.currentStatus.state = 'Planning';
    } else if (progressRatio < 0.6) {
      update.currentStatus.state = 'In Development';
    } else if (progressRatio < 0.8) {
      update.currentStatus.state = 'Code Review';
    } else {
      update.currentStatus.state = 'QA Testing';
    }
    
    updates.push(update);
  }
  
  return updates;
}