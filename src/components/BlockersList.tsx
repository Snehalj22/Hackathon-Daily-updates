import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { Blocker } from '../types';

interface BlockersListProps {
  blockers: Blocker[];
}

export const BlockersList: React.FC<BlockersListProps> = ({ blockers }) => {
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Technical': '#8B5CF6',
      'Resource': '#F59E0B',
      'Dependency': '#EF4444',
      'Business': '#3B82F6'
    };
    return colors[type] || '#6B7280';
  };

  const activeBlockers = blockers.filter(b => b.status === 'Active');
  const resolvedBlockers = blockers.filter(b => b.status === 'Resolved');

  return (
    <div className="blockers-list">
      <h2>⚠️ Blockers</h2>
      
      {activeBlockers.length > 0 && (
        <div className="active-blockers">
          <h3>Active Blockers ({activeBlockers.length})</h3>
          <div className="blockers-grid">
            {activeBlockers.map(blocker => (
              <div key={blocker.id} className="blocker-card active">
                <div className="blocker-header">
                  <span className="blocker-id">{blocker.id}</span>
                  <span 
                    className="blocker-type" 
                    style={{ backgroundColor: getTypeColor(blocker.type) }}
                  >
                    {blocker.type}
                  </span>
                </div>
                <p className="blocker-description">{blocker.description}</p>
                <div className="blocker-meta">
                  <span>Reporter: {blocker.reporter}</span>
                  <span>Blocked for: {formatDistanceToNow(blocker.reportedDate)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {resolvedBlockers.length > 0 && (
        <div className="resolved-blockers">
          <h3>Recently Resolved ({resolvedBlockers.length})</h3>
          <div className="resolved-list">
            {resolvedBlockers.map(blocker => (
              <div key={blocker.id} className="blocker-resolved">
                <span className="blocker-id">{blocker.id}</span>
                <span className="resolution">✓ {blocker.resolution}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};