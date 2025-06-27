import axios from 'axios';
import { TicketStats, TicketActivity } from '../types';

export class YouTrackService {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }

  async fetchTicketData(ticketId: string): Promise<TicketStats> {
    try {
      const issueResponse = await axios.get(
        `${this.baseUrl}/api/issues/${ticketId}?fields=id,summary,created,resolved,fields(name,value(name,minutes),text)`,
        { headers: this.headers }
      );

      const activitiesResponse = await axios.get(
        `${this.baseUrl}/api/issues/${ticketId}/activities?fields=id,timestamp,author(name),added(name),removed(name),target(name),category(id)`,
        { headers: this.headers }
      );

      const issue = issueResponse.data;
      const activities = activitiesResponse.data;

      const processedActivities = this.processActivities(activities);
      const stats = this.calculateStats(issue, processedActivities);

      return stats;
    } catch (error: any) {
      console.error('Error fetching ticket data:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        throw new Error(`Failed to fetch ticket data: ${error.response.status} - ${error.response.data?.error || error.response.statusText}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('Failed to fetch ticket data: No response from server (possible CORS issue)');
      } else {
        throw new Error(`Failed to fetch ticket data: ${error.message}`);
      }
    }
  }

  private processActivities(activities: any[]): TicketActivity[] {
    return activities.map(activity => {
      const processed: TicketActivity = {
        id: activity.id,
        timestamp: new Date(activity.timestamp).toISOString(),
        type: 'comment',
        actor: activity.author?.name || 'Unknown'
      };

      if (activity.added?.length > 0 || activity.removed?.length > 0) {
        processed.type = 'state_change';
        processed.from = activity.removed?.[0]?.name;
        processed.to = activity.added?.[0]?.name;
      }

      return processed;
    });
  }

  private calculateStats(issue: any, activities: TicketActivity[]): TicketStats {
    const stateChanges = activities.filter(a => a.type === 'state_change');
    const reopenCount = stateChanges.filter(a => 
      a.from?.toLowerCase().includes('resolved') && 
      a.to?.toLowerCase().includes('open')
    ).length;

    const timeInStates: Record<string, number> = {};
    const assignees = new Set<string>();

    activities.forEach(activity => {
      assignees.add(activity.actor);
    });

    return {
      ticketId: issue.id,
      summary: issue.summary,
      currentState: this.getCurrentState(issue),
      createdDate: new Date(issue.created).toISOString(),
      resolvedDate: issue.resolved ? new Date(issue.resolved).toISOString() : undefined,
      reopenCount,
      timeInStates,
      activities,
      assignees: Array.from(assignees)
    };
  }

  private getCurrentState(issue: any): string {
    const stateField = issue.fields?.find((f: any) => f.name === 'State');
    return stateField?.value?.name || 'Unknown';
  }
}