import React, { useState } from 'react';
import { format } from 'date-fns';

interface TicketHistoryItem {
  id: string;
  ticketId: string;
  summary: string;
  lastUpdated: Date;
  status: string;
  assignee: string;
}

interface TicketHistoryDropdownProps {
  currentTicketId: string;
  onTicketSelect: (ticketId: string) => void;
  filterByAssignee?: string;
}

// Mock ticket history data
const mockTicketHistory: TicketHistoryItem[] = [
  {
    id: '1',
    ticketId: 'RV2-45285',
    summary: 'Feature: Implement user authentication with OAuth2',
    lastUpdated: new Date(2025, 5, 27),
    status: 'QA Testing',
    assignee: 'Sarah Chen'
  },
  {
    id: '2',
    ticketId: 'RV2-34978',
    summary: 'Bug: Fix payment gateway timeout issues',
    lastUpdated: new Date(2025, 5, 26),
    status: 'In Development',
    assignee: 'John Smith'
  },
  {
    id: '3',
    ticketId: 'RV2-42156',
    summary: 'Enhancement: Add dark mode support',
    lastUpdated: new Date(2025, 5, 25),
    status: 'Code Review',
    assignee: 'Emily Davis'
  },
  {
    id: '4',
    ticketId: 'RV2-38921',
    summary: 'Task: Database performance optimization',
    lastUpdated: new Date(2025, 5, 24),
    status: 'Resolved',
    assignee: 'Mike Johnson'
  },
  {
    id: '5',
    ticketId: 'RV2-41237',
    summary: 'Feature: Real-time notifications system',
    lastUpdated: new Date(2025, 5, 23),
    status: 'UAT',
    assignee: 'Lisa Wang'
  },
  {
    id: '6',
    ticketId: 'RV2-39845',
    summary: 'Bug: Mobile app crash on iOS 14',
    lastUpdated: new Date(2025, 5, 22),
    status: 'Resolved',
    assignee: 'David Lee'
  },
  {
    id: '7',
    ticketId: 'RV2-43567',
    summary: 'Feature: Export reports to PDF',
    lastUpdated: new Date(2025, 5, 21),
    status: 'Planning',
    assignee: 'Anna Wilson'
  },
  {
    id: '8',
    ticketId: 'RV2-40123',
    summary: 'Enhancement: Improve search functionality',
    lastUpdated: new Date(2025, 5, 20),
    status: 'In Development',
    assignee: 'Robert Brown'
  }
];

export const TicketHistoryDropdown: React.FC<TicketHistoryDropdownProps> = ({
  currentTicketId,
  onTicketSelect,
  filterByAssignee
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Planning': '#6B7280',
      'In Development': '#3B82F6',
      'Code Review': '#8B5CF6',
      'QA Testing': '#F59E0B',
      'UAT': '#10B981',
      'Resolved': '#059669',
      'Reopened': '#EF4444'
    };
    return colors[status] || '#6B7280';
  };

  const filteredHistory = mockTicketHistory.filter(item => {
    const matchesSearch = 
      item.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || item.status === filterStatus;
    
    const matchesAssignee = !filterByAssignee || item.assignee === filterByAssignee;
    
    return matchesSearch && matchesStatus && matchesAssignee;
  });

  const uniqueStatuses = Array.from(new Set(mockTicketHistory.map(item => item.status)));

  return (
    <div className="ticket-history-dropdown">
      <button 
        className="history-dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="animated-icon-wrapper">
          <span className="toggle-icon">📋</span>
          <span className="icon-badge">{filteredHistory.length}</span>
        </div>
        <span>
          Ticket History
          {filterByAssignee && (
            <span className="filter-indicator"> ({filterByAssignee})</span>
          )}
        </span>
        <span className="arrow-icon">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="history-dropdown-content">
          <div className="history-filters">
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="history-search"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="history-status-filter"
            >
              <option value="">All Statuses</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="history-list">
            {filteredHistory.map(item => (
              <div
                key={item.id}
                className={`history-item ${item.ticketId === currentTicketId ? 'current' : ''}`}
                onClick={() => {
                  onTicketSelect(item.ticketId);
                  setIsOpen(false);
                }}
              >
                <div className="history-item-header">
                  <span className="ticket-id">{item.ticketId}</span>
                  <span 
                    className="ticket-status"
                    style={{ backgroundColor: getStatusColor(item.status) }}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="ticket-summary">{item.summary}</p>
                <div className="history-item-footer">
                  <span className="assignee">👤 {item.assignee}</span>
                  <span className="last-updated">
                    📅 {format(item.lastUpdated, 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="history-stats">
            <p>Total: {filteredHistory.length} tickets</p>
            <p>Resolved: {filteredHistory.filter(t => t.status === 'Resolved').length}</p>
            <p>In Progress: {filteredHistory.filter(t => t.status !== 'Resolved' && t.status !== 'Planning').length}</p>
          </div>
        </div>
      )}
    </div>
  );
};