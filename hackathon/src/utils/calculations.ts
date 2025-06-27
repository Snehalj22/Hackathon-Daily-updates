import { TicketStats, PersonActivity, TicketActivity } from '../types';

export function calculatePersonActivities(stats: TicketStats): PersonActivity[] {
  const personMap = new Map<string, PersonActivity>();

  stats.activities.forEach(activity => {
    const person = activity.actor;
    
    if (!personMap.has(person)) {
      personMap.set(person, {
        person,
        activitiesCount: 0,
        stateChanges: 0,
        comments: 0,
        workItems: 0,
        totalTimeWorked: 0
      });
    }

    const personActivity = personMap.get(person)!;
    personActivity.activitiesCount++;

    switch (activity.type) {
      case 'state_change':
        personActivity.stateChanges++;
        break;
      case 'comment':
        personActivity.comments++;
        break;
      case 'work_item':
        personActivity.workItems++;
        personActivity.totalTimeWorked += activity.duration || 0;
        break;
    }
  });

  return Array.from(personMap.values());
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export function extractTicketId(url: string): string | null {
  const patterns = [
    /issue\/([A-Z0-9]+-\d+)/i,
    /issues\/([A-Z0-9]+-\d+)/i,
    /([A-Z0-9]+-\d+)$/i
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1].toUpperCase();
    }
  }

  return null;
}