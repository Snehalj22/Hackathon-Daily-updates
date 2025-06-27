import React from 'react';
import { DelayAnalysis as DelayType } from '../types';

interface DelayAnalysisProps {
  delays: DelayType[];
}

export const DelayAnalysis: React.FC<DelayAnalysisProps> = ({ delays }) => {
  const getImpactColor = (impact: string) => {
    const colors: Record<string, string> = {
      'High': '#EF4444',
      'Medium': '#F59E0B',
      'Low': '#10B981'
    };
    return colors[impact] || '#6B7280';
  };

  const totalDelayDays = delays.reduce((sum, delay) => sum + delay.delayDays, 0);

  return (
    <div className="delay-analysis">
      <h2>Delay Analysis</h2>
      <div className="total-delay">
        <span>Total Delay: </span>
        <strong>{totalDelayDays} days</strong>
      </div>
      
      {delays.length === 0 ? (
        <p className="no-data">On track - No delays! 🚀</p>
      ) : (
        <div className="delay-list">
          {delays.map((delay, index) => (
            <div key={index} className="delay-item">
              <div className="delay-header">
                <span className="delay-phase">{delay.phase}</span>
                <span 
                  className="impact-badge" 
                  style={{ backgroundColor: getImpactColor(delay.impact) }}
                >
                  {delay.impact} Impact
                </span>
              </div>
              <div className="delay-details">
                <p className="delay-duration">
                  Expected: {delay.expectedDuration} days | 
                  Actual: {delay.actualDuration} days | 
                  <strong> Delay: {delay.delayDays} days</strong>
                </p>
                <p className="delay-reason"><strong>Reason:</strong> {delay.reason}</p>
                <p className="delay-mitigation"><strong>Mitigation:</strong> {delay.mitigation}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};