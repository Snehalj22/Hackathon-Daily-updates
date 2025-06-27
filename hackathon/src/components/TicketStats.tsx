import React from 'react';
import { TicketStats as TicketStatsType } from '../types';
import { format } from 'date-fns';

interface TicketStatsProps {
  stats: TicketStatsType;
}

export const TicketStats: React.FC<TicketStatsProps> = ({ stats }) => {
  return (
    <div className="ticket-stats">
      <h2>{stats.ticketId}: {stats.summary}</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Current State</h3>
          <p className="stat-value">{stats.currentState}</p>
        </div>
        
        <div className="stat-card">
          <h3>Reopen Count</h3>
          <p className="stat-value">{stats.reopenCount}</p>
        </div>
        
        <div className="stat-card">
          <h3>Created Date</h3>
          <p className="stat-value">
            {format(new Date(stats.createdDate), 'MMM dd, yyyy')}
          </p>
        </div>
        
        {stats.resolvedDate && (
          <div className="stat-card">
            <h3>Resolved Date</h3>
            <p className="stat-value">
              {format(new Date(stats.resolvedDate), 'MMM dd, yyyy')}
            </p>
          </div>
        )}
        
        <div className="stat-card">
          <h3>Total Activities</h3>
          <p className="stat-value">{stats.activities.length}</p>
        </div>
        
        <div className="stat-card">
          <h3>Unique Contributors</h3>
          <p className="stat-value">{stats.assignees.length}</p>
        </div>
      </div>
    </div>
  );
};