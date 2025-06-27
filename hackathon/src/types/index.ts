export interface TicketActivity {
  id: string;
  timestamp: string;
  type: 'state_change' | 'assignee_change' | 'comment' | 'work_item';
  actor: string;
  from?: string;
  to?: string;
  duration?: number;
  description?: string;
}

export interface TicketStats {
  ticketId: string;
  summary: string;
  currentState: string;
  createdDate: string;
  resolvedDate?: string;
  reopenCount: number;
  timeInStates: Record<string, number>;
  activities: TicketActivity[];
  assignees: string[];
}

export interface PersonActivity {
  person: string;
  activitiesCount: number;
  stateChanges: number;
  comments: number;
  workItems: number;
  totalTimeWorked: number;
}

export interface YouTrackConfig {
  baseUrl: string;
  token: string;
}