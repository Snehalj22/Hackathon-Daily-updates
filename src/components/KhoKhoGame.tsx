import React, { useState, useEffect } from 'react';
import { StageDetailModal } from './StageDetailModal';
import { subDays } from 'date-fns';

interface KhoKhoGameProps {
  currentStage: string;
  stages: Array<{ name: string; completed: boolean }>;
}

export const KhoKhoGame: React.FC<KhoKhoGameProps> = ({ currentStage, stages }) => {
  // Find the current stage index
  const currentStageIndex = stages.findIndex(s => s.name === currentStage);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  // Mock stage details - in real app, this would come from props or API
  const getStageDetails = (stageName: string) => {
    const details: Record<string, any> = {
      'Planning': {
        status: 'Completed',
        assignee: 'John Smith',
        startDate: subDays(new Date(), 20),
        endDate: subDays(new Date(), 18),
        duration: 2,
        activities: [
          'Requirements gathering completed',
          'User stories created',
          'Technical design approved'
        ],
        progress: 100
      },
      'In Development': {
        status: 'Completed',
        assignee: 'Emily Davis',
        startDate: subDays(new Date(), 18),
        endDate: subDays(new Date(), 10),
        duration: 8,
        activities: [
          'Core functionality implemented',
          'Unit tests written',
          'Code review completed'
        ],
        progress: 100
      },
      'Code Review': {
        status: 'Completed',
        assignee: 'Mike Johnson',
        startDate: subDays(new Date(), 10),
        endDate: subDays(new Date(), 8),
        duration: 2,
        activities: [
          'Code quality checks passed',
          'Security review completed',
          'Performance optimizations applied'
        ],
        progress: 100
      },
      'QA Testing': {
        status: 'In Progress',
        assignee: 'Sarah Chen',
        startDate: subDays(new Date(), 8),
        duration: 5,
        activities: [
          'Test cases executed: 38/45',
          'Bug reported: Token refresh issue',
          'Regression testing in progress'
        ],
        blockers: ['Waiting for bug fix deployment'],
        progress: 84
      },
      'UAT': {
        status: 'Pending',
        assignee: 'Lisa Wang',
        duration: 0,
        activities: ['Not started yet'],
        progress: 0
      },
      'Resolved': {
        status: 'Pending',
        assignee: 'Not assigned',
        duration: 0,
        activities: ['Not started yet'],
        progress: 0
      }
    };
    return details[stageName] || {};
  };

  return (
    <div className="kho-kho-game">
      <div className="game-header">
        <h3>🏃 Kho-Kho Progress Tracker</h3>
        <p className="game-subtitle">Watch the runner's journey through development stages!</p>
      </div>
      
      <div className="kho-kho-field">
        <div className="field-track">
          {stages.map((stage, index) => (
            <div key={stage.name} className="stage-position">
              <div 
                className={`kho-kho-pole ${stage.completed ? 'completed' : ''} clickable`}
                onClick={() => setSelectedStage(stage.name)}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${stage.name} stage`}
              >
                {/* Show runner only at current stage */}
                {stage.name === currentStage ? (
                  <span className="runner-icon reversed">🏃‍♀️</span>
                ) : (
                  <div className="stage-icon">
                    {index === 0 && '📋'}
                    {index === 1 && '💻'}
                    {index === 2 && '🔍'}
                    {index === 3 && '🧪'}
                    {index === 4 && '👥'}
                    {index === 5 && '✅'}
                  </div>
                )}
              </div>
              <div className="stage-label">{stage.name}</div>
              
              {/* Ambulance signal for pending stages */}
              {!stage.completed && stage.name !== currentStage && (
                <div className="ambulance-signal">
                  <div className="signal-light red"></div>
                  <div className="signal-light blue"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Connect lines between stages */}
        <div className="field-lines">
          {stages.map((_, index) => (
            index < stages.length - 1 && (
              <div 
                key={`line-${index}`} 
                className={`connect-line ${stages[index].completed ? 'completed' : ''}`}
              />
            )
          ))}
        </div>
      </div>
      
      <div className="game-info">
        <p className="progress-text">
          The runner is currently at <strong>{currentStage}</strong> stage! 
        </p>
        <p className="progress-subtext">
          Progress: {stages.filter(s => s.completed).length} of {stages.length} stages completed
        </p>
        <p className="click-hint">💡 Click on any stage to see detailed status</p>
      </div>

      {selectedStage && (
        <StageDetailModal
          stage={selectedStage}
          details={getStageDetails(selectedStage)}
          onClose={() => setSelectedStage(null)}
        />
      )}
    </div>
  );
};