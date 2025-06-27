import React from 'react';
import { ReopenEvent } from '../types';
import { format } from 'date-fns';

interface ReopenHistoryProps {
  reopenEvents: ReopenEvent[];
}

export const ReopenHistory: React.FC<ReopenHistoryProps> = ({ reopenEvents }) => {
  const getIssueTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Bug': '#EF4444',
      'Missing Requirement': '#F59E0B',
      'Performance': '#8B5CF6',
      'UX Issue': '#3B82F6',
      'Other': '#6B7280'
    };
    return colors[type] || '#6B7280';
  };

  return (
    <div className="reopen-history">
      <h2>Reopen History ({reopenEvents.length})</h2>
      {reopenEvents.length === 0 ? (
        <p className="no-data">No reopens - Great job! 🎉</p>
      ) : (
        <div className="reopen-list">
          {reopenEvents.map((event, index) => (
            <div key={index} className="reopen-event">
              <div className="reopen-header">
                <span 
                  className="issue-type-badge" 
                  style={{ backgroundColor: getIssueTypeColor(event.issueType) }}
                >
                  {event.issueType}
                </span>
                <span className="reopen-date">{format(event.date, 'MMM dd')}</span>
              </div>
              <p className="reopen-reason">{event.reason}</p>
              <div className="reopen-meta">
                <span>Reported by: {event.reportedBy}</span>
                <span>Previous state: {event.previousState}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};