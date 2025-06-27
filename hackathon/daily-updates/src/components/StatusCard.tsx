import React from 'react';
import { TicketStatus } from '../types';
import { format, formatDistanceToNow } from 'date-fns';

interface StatusCardProps {
  status: TicketStatus;
  estimatedCompletion: Date;
}

export const StatusCard: React.FC<StatusCardProps> = ({ status, estimatedCompletion }) => {
  const getStatusColor = (state: string) => {
    const colors: Record<string, string> = {
      'Planning': '#6B7280',
      'In Development': '#3B82F6',
      'Code Review': '#8B5CF6',
      'QA Testing': '#F59E0B',
      'UAT': '#10B981',
      'Resolved': '#059669',
      'Reopened': '#EF4444'
    };
    return colors[state] || '#6B7280';
  };

  return (
    <div className="status-card">
      <h2>Current Status</h2>
      <div className="status-content">
        <div className="status-badge" style={{ backgroundColor: getStatusColor(status.state) }}>
          {status.state}
        </div>
        <div className="status-details">
          <p><strong>Assignee:</strong> {status.assignee}</p>
          <p><strong>Days in current state:</strong> {status.daysInCurrentState}</p>
          <p><strong>Last updated:</strong> {formatDistanceToNow(status.lastUpdated, { addSuffix: true })}</p>
          <p><strong>Estimated completion:</strong> {format(estimatedCompletion, 'MMM dd, yyyy')}</p>
        </div>
      </div>
    </div>
  );
};