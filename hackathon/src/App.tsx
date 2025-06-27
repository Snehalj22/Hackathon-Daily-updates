import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { TicketInput } from './components/TicketInput';
import { MetricCard } from './components/MetricCard';
import { ActivityChart } from './components/ActivityChart';
import { PersonTracker } from './components/PersonTracker';
import { ActivityTimeline } from './components/ActivityTimeline';
import { ActivityHeatmap } from './components/ActivityHeatmap';
import { DateRangePicker } from './components/DateRangePicker';
import { Dropdown } from './components/Dropdown';
import { WorkflowTracker } from './components/WorkflowTracker';
import { YouTrackService } from './services/youtrack';
import { TicketStats as TicketStatsType, TicketActivity } from './types';
import { calculatePersonActivities, extractTicketId } from './utils/calculations';
import { BarChart3, Users, Clock, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { parseISO, isWithinInterval } from 'date-fns';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketStats, setTicketStats] = useState<TicketStatsType | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const handleTicketSubmit = async (url: string, token: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const ticketId = extractTicketId(url);
      if (!ticketId) {
        throw new Error('Invalid YouTrack URL format');
      }

      const baseUrl = new URL(url).origin;
      const service = new YouTrackService(baseUrl, token);
      
      const stats = await service.fetchTicketData(ticketId);
      setTicketStats(stats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch ticket data');
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = useMemo(() => {
    if (!ticketStats) return [];
    
    let activities = [...ticketStats.activities];
    
    if (dateRange.start && dateRange.end) {
      activities = activities.filter(activity => {
        const activityDate = parseISO(activity.timestamp);
        return isWithinInterval(activityDate, { start: dateRange.start!, end: dateRange.end! });
      });
    }
    
    if (selectedAssignee) {
      activities = activities.filter(activity => 
        activity.actor.toLowerCase().includes(selectedAssignee.toLowerCase())
      );
    }
    
    if (selectedState) {
      activities = activities.filter(activity => 
        activity.type === 'state_change' && activity.to === selectedState
      );
    }
    
    return activities;
  }, [ticketStats, dateRange, selectedAssignee, selectedState]);

  const personActivities = useMemo(() => {
    if (!ticketStats) return [];
    return calculatePersonActivities({ ...ticketStats, activities: filteredActivities });
  }, [ticketStats, filteredActivities]);

  const assigneeOptions = useMemo(() => {
    if (!ticketStats) return [];
    return ticketStats.assignees.map(assignee => ({
      value: assignee,
      label: assignee,
    }));
  }, [ticketStats]);

  const stateOptions = useMemo(() => {
    if (!ticketStats) return [];
    const states = new Set<string>();
    ticketStats.activities
      .filter(a => a.type === 'state_change' && a.to)
      .forEach(a => states.add(a.to!));
    return Array.from(states).map(state => ({
      value: state,
      label: state,
    }));
  }, [ticketStats]);

  const renderContent = () => {
    if (!ticketStats) {
      return (
        <div className="empty-state">
          <h2>Welcome to YouTrack Ticket Tracker</h2>
          <p>Enter a YouTrack ticket URL above to get started</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <>
            <div className="dashboard-header">
              <h2>{ticketStats.ticketId}: {ticketStats.summary}</h2>
              <div className="filters">
                <DateRangePicker
                  startDate={dateRange.start}
                  endDate={dateRange.end}
                  onDateChange={(start, end) => setDateRange({ start, end })}
                />
                <Dropdown
                  label="Assignee"
                  value={selectedAssignee}
                  options={assigneeOptions}
                  onChange={setSelectedAssignee}
                  placeholder="All assignees"
                />
                <Dropdown
                  label="State"
                  value={selectedState}
                  options={stateOptions}
                  onChange={setSelectedState}
                  placeholder="All states"
                />
              </div>
            </div>
            <div className="metrics-grid">
              <MetricCard
                title="Current State"
                value={ticketStats.currentState}
                icon={CheckCircle}
                color="#2ecc71"
              />
              <MetricCard
                title="Reopen Count"
                value={ticketStats.reopenCount}
                icon={AlertCircle}
                color="#e74c3c"
                trend={{ value: 15, isPositive: false }}
              />
              <MetricCard
                title="Total Activities"
                value={filteredActivities.length}
                icon={BarChart3}
                color="#3498db"
              />
              <MetricCard
                title="Contributors"
                value={personActivities.length}
                icon={Users}
                color="#9b59b6"
              />
            </div>
            <WorkflowTracker activities={filteredActivities} currentState={ticketStats.currentState} />
            <div className="charts-grid">
              <ActivityChart activities={filteredActivities} chartType="line" />
              <ActivityChart activities={filteredActivities} chartType="pie" />
            </div>
            <ActivityHeatmap activities={filteredActivities} />
          </>
        );
      
      case 'statistics':
        return (
          <>
            <div className="dashboard-header">
              <h2>Detailed Statistics</h2>
              <div className="chart-type-selector">
                <button
                  className={chartType === 'line' ? 'active' : ''}
                  onClick={() => setChartType('line')}
                >
                  Line Chart
                </button>
                <button
                  className={chartType === 'bar' ? 'active' : ''}
                  onClick={() => setChartType('bar')}
                >
                  Bar Chart
                </button>
                <button
                  className={chartType === 'pie' ? 'active' : ''}
                  onClick={() => setChartType('pie')}
                >
                  Pie Chart
                </button>
              </div>
            </div>
            <ActivityChart activities={filteredActivities} chartType={chartType} />
            <div className="stats-details">
              <div className="stat-box">
                <h3>Activity Breakdown</h3>
                <ul>
                  <li>State Changes: {filteredActivities.filter(a => a.type === 'state_change').length}</li>
                  <li>Comments: {filteredActivities.filter(a => a.type === 'comment').length}</li>
                  <li>Work Items: {filteredActivities.filter(a => a.type === 'work_item').length}</li>
                  <li>Assignee Changes: {filteredActivities.filter(a => a.type === 'assignee_change').length}</li>
                </ul>
              </div>
            </div>
          </>
        );
      
      case 'timeline':
        return <ActivityTimeline activities={filteredActivities} />;
      
      case 'people':
        return <PersonTracker activities={personActivities} />;
      
      case 'activity':
        return <ActivityHeatmap activities={filteredActivities} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        <div className="content-header">
          <TicketInput onSubmit={handleTicketSubmit} />
          {loading && <div className="loading">Loading ticket data...</div>}
          {error && <div className="error">Error: {error}</div>}
        </div>
        <div className="content-body">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;