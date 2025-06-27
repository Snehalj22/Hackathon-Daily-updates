import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface StatusDonutChartProps {
  currentStatus: string;
  daysInCurrentState: number;
}

export const StatusDonutChart: React.FC<StatusDonutChartProps> = ({ 
  currentStatus, 
  daysInCurrentState 
}) => {
  // Define all stages and their progress
  const stages = [
    { name: 'Planning', value: 100, color: '#6B7280' },
    { name: 'In Development', value: 100, color: '#3B82F6' },
    { name: 'Code Review', value: 100, color: '#8B5CF6' },
    { name: 'QA Testing', value: 80, color: '#F59E0B' },
    { name: 'UAT', value: 0, color: '#10B981' },
    { name: 'Resolved', value: 0, color: '#059669' }
  ];

  // Update values based on current status
  const currentIndex = stages.findIndex(s => s.name === currentStatus);
  const data = stages.map((stage, index) => ({
    ...stage,
    value: index < currentIndex ? 100 : (index === currentIndex ? 80 : 0)
  }));

  const totalProgress = data.reduce((sum, stage) => sum + stage.value, 0);
  const maxProgress = stages.length * 100;
  const overallProgress = Math.round((totalProgress / maxProgress) * 100);

  return (
    <div className="status-donut-chart">
      <h3>Overall Progress</h3>
      <div className="donut-container">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        <div className="donut-center">
          <div className="progress-percentage">{overallProgress}%</div>
          <div className="current-status-label">Complete</div>
        </div>
      </div>
      
      <div className="status-info">
        <div className="current-stage">
          <span className="stage-label">Current Stage:</span>
          <span className="stage-value" style={{ color: stages.find(s => s.name === currentStatus)?.color }}>
            {currentStatus}
          </span>
        </div>
        <div className="days-in-state">
          <span className="days-label">Days in current state:</span>
          <span className="days-value">{daysInCurrentState}</span>
        </div>
      </div>
      
      <div className="stage-legend">
        {stages.map((stage) => (
          <div key={stage.name} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: stage.color }} />
            <span className="legend-text">{stage.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};