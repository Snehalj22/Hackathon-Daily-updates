import React, { useState, useEffect } from 'react';
import { TicketUpdate } from '../types';
import { generateMockTicketUpdate, allAssociates } from '../data/mockData';
import { StatusCard } from './StatusCard';
import { ProgressTimeline } from './ProgressTimeline';
import { ReopenHistory } from './ReopenHistory';
import { DelayAnalysis } from './DelayAnalysis';
import { TestingRecommendations } from './TestingRecommendations';
import { RiskAssessment } from './RiskAssessment';
import { BlockersList } from './BlockersList';
import { DonutChart } from './DonutChart';
import { StatusDonutChart } from './StatusDonutChart';
import { AssociateSelector } from './AssociateSelector';
import { TicketHistoryDropdown } from './TicketHistoryDropdown';
import { DateRangePicker } from './DateRangePicker';
import { VoiceNarrator } from './VoiceNarrator';
import { format } from 'date-fns';

interface DailyUpdateDashboardProps {
  ticketId: string;
}

export const DailyUpdateDashboard: React.FC<DailyUpdateDashboardProps> = ({ ticketId: initialTicketId }) => {
  const [update, setUpdate] = useState<TicketUpdate | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAssociate, setSelectedAssociate] = useState('');
  const [ticketId, setTicketId] = useState(initialTicketId);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    setTimeout(() => {
      setUpdate(generateMockTicketUpdate(ticketId, selectedAssociate));
      setLoading(false);
    }, 1000);
  }, [ticketId, selectedAssociate]);

  const handleTicketSelect = (newTicketId: string) => {
    setTicketId(newTicketId);
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end });
  };

  if (loading) {
    return <div className="loading">Loading daily update...</div>;
  }

  if (!update) {
    return <div className="error">No update available</div>;
  }

  return (
    <div className="daily-update-dashboard">
      <div className="dashboard-controls">
        <TicketHistoryDropdown 
          currentTicketId={ticketId}
          onTicketSelect={handleTicketSelect}
          filterByAssignee={selectedAssociate}
        />
        <AssociateSelector
          associates={allAssociates}
          selectedAssociate={selectedAssociate}
          onAssociateChange={setSelectedAssociate}
        />
        <DateRangePicker 
          onDateRangeChange={handleDateRangeChange}
        />
      </div>

      <header className="dashboard-header">
        <h1>Daily Ticket Update: {update.ticketId}</h1>
        <p className="update-date">Update for {format(update.date, 'MMMM dd, yyyy')}</p>
        <p className="ticket-summary">{update.summary}</p>
      </header>

      <div className="dashboard-grid">
        <div className="grid-item">
          <StatusCard status={update.currentStatus} estimatedCompletion={update.estimatedCompletion} />
        </div>
        
        <div className="grid-item">
          <StatusDonutChart 
            currentStatus={update.currentStatus.state}
            daysInCurrentState={update.currentStatus.daysInCurrentState}
          />
        </div>

        <div className="grid-item full-width">
          <VoiceNarrator
            ticketId={update.ticketId}
            currentStatus={update.currentStatus.state}
            assignee={update.currentStatus.assignee}
            summary={update.summary}
            progress={{
              development: update.developmentProgress.completionPercentage,
              qa: Math.round((update.qaProgress.testCasesPassed / update.qaProgress.testCasesTotal) * 100)
            }}
            reopenCount={update.reopenHistory.length}
            activeBlockers={update.blockers.filter(b => b.status === 'Active').length}
          />
        </div>

        <div className="grid-item full-width">
          <ProgressTimeline 
            development={update.developmentProgress} 
            qa={update.qaProgress}
            currentStatus={update.currentStatus.state}
          />
        </div>

        {update.blockers.filter(b => b.status === 'Active').length > 0 && (
          <div className="grid-item full-width alert-section">
            <BlockersList blockers={update.blockers} />
          </div>
        )}

        <div className="grid-item">
          <DonutChart 
            title="QA Test Results"
            data={[
              { name: 'Passed', value: update.qaProgress.testCasesPassed },
              { name: 'Failed', value: update.qaProgress.testCasesFailed },
              { name: 'Pending', value: update.qaProgress.testCasesTotal - update.qaProgress.testCasesPassed - update.qaProgress.testCasesFailed }
            ]}
            colors={['#10B981', '#EF4444', '#F59E0B']}
          />
        </div>

        <div className="grid-item">
          <DonutChart 
            title="Bug Severity Distribution"
            data={[
              { name: 'Critical', value: update.qaProgress.bugs.filter(b => b.severity === 'Critical').length },
              { name: 'High', value: update.qaProgress.bugs.filter(b => b.severity === 'High').length },
              { name: 'Medium', value: update.qaProgress.bugs.filter(b => b.severity === 'Medium').length },
              { name: 'Low', value: update.qaProgress.bugs.filter(b => b.severity === 'Low').length }
            ]}
            colors={['#DC2626', '#EF4444', '#F59E0B', '#10B981']}
          />
        </div>

        <div className="grid-item">
          <DonutChart 
            title="Reopen Reasons"
            data={[
              { name: 'Bug', value: update.reopenHistory.filter(r => r.issueType === 'Bug').length },
              { name: 'Missing Requirement', value: update.reopenHistory.filter(r => r.issueType === 'Missing Requirement').length },
              { name: 'Performance', value: update.reopenHistory.filter(r => r.issueType === 'Performance').length },
              { name: 'UX Issue', value: update.reopenHistory.filter(r => r.issueType === 'UX Issue').length },
              { name: 'Other', value: update.reopenHistory.filter(r => r.issueType === 'Other').length }
            ].filter(item => item.value > 0)}
          />
        </div>

        <div className="grid-item">
          <DonutChart 
            title="Blocker Types"
            data={[
              { name: 'Technical', value: update.blockers.filter(b => b.type === 'Technical').length },
              { name: 'Resource', value: update.blockers.filter(b => b.type === 'Resource').length },
              { name: 'Dependency', value: update.blockers.filter(b => b.type === 'Dependency').length },
              { name: 'Business', value: update.blockers.filter(b => b.type === 'Business').length }
            ].filter(item => item.value > 0)}
            colors={['#8B5CF6', '#F59E0B', '#EF4444', '#3B82F6']}
          />
        </div>

        <div className="grid-item">
          <ReopenHistory reopenEvents={update.reopenHistory} />
        </div>

        <div className="grid-item">
          <DelayAnalysis delays={update.delays} />
        </div>

        <div className="grid-item full-width">
          <TestingRecommendations recommendations={update.testingRecommendations} />
        </div>

        <div className="grid-item full-width">
          <RiskAssessment assessment={update.riskAssessment} />
        </div>
      </div>

      <div className="summary-section">
        <h2>Key Metrics</h2>
        <div className="metrics-grid">
          <div className="metric">
            <span className="metric-label">Development Progress</span>
            <span className="metric-value">{update.developmentProgress.completionPercentage}%</span>
          </div>
          <div className="metric">
            <span className="metric-label">QA Progress</span>
            <span className="metric-value">
              {update.qaProgress.testCasesPassed}/{update.qaProgress.testCasesTotal} tests passed
            </span>
          </div>
          <div className="metric">
            <span className="metric-label">Reopened</span>
            <span className="metric-value">{update.reopenHistory.length} times</span>
          </div>
          <div className="metric">
            <span className="metric-label">Active Blockers</span>
            <span className="metric-value">{update.blockers.filter(b => b.status === 'Active').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};