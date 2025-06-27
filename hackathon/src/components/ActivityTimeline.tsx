import React from 'react';
import { TicketActivity } from '../types';
import { format } from 'date-fns';
import { isBackwardMovement, getStateIcon } from '../utils/workflow';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ActivityTimelineProps {
  activities: TicketActivity[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'state_change':
        return '🔄';
      case 'comment':
        return '💬';
      case 'work_item':
        return '⏱️';
      case 'assignee_change':
        return '👤';
      default:
        return '📝';
    }
  };

  const getActivityDescription = (activity: TicketActivity) => {
    switch (activity.type) {
      case 'state_change':
        const isBackward = activity.from && activity.to ? isBackwardMovement(activity.from, activity.to) : false;
        return (
          <span className={isBackward ? 'backward-movement' : ''}>
            State changed from {getStateIcon(activity.from || '')} {activity.from || 'N/A'} to {getStateIcon(activity.to || '')} {activity.to || 'N/A'}
            {isBackward && (
              <>
                {' '}
                <ArrowLeft size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
                <span className="backward-label">Moved Backward!</span>
              </>
            )}
          </span>
        );
      case 'comment':
        return activity.description || 'Added a comment';
      case 'work_item':
        return `Logged ${activity.duration} minutes of work`;
      case 'assignee_change':
        return `Assignee changed from ${activity.from || 'N/A'} to ${activity.to || 'N/A'}`;
      default:
        return activity.description || 'Activity';
    }
  };

  return (
    <div className="activity-timeline">
      <h3>Activity Timeline</h3>
      <div className="timeline">
        {sortedActivities.map((activity) => (
          <div key={activity.id} className="timeline-item">
            <div className="timeline-icon">{getActivityIcon(activity.type)}</div>
            <div className="timeline-content">
              <div className="timeline-header">
                <span className="timeline-actor">{activity.actor}</span>
                <span className="timeline-date">
                  {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
              <div className="timeline-description">
                {getActivityDescription(activity)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};