import React from 'react';
import { DevelopmentProgress, QAProgress } from '../types';
import { KhoKhoGame } from './KhoKhoGame';
import { format } from 'date-fns';

interface ProgressTimelineProps {
  development: DevelopmentProgress;
  qa: QAProgress;
  currentStatus: string;
}

export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ development, qa, currentStatus }) => {
  const stages = [
    { name: 'Planning', completed: true },
    { name: 'Development', completed: development.completionPercentage === 100 },
    { name: 'Code Review', completed: currentStatus === 'QA Testing' || currentStatus === 'UAT' || currentStatus === 'Resolved' },
    { name: 'QA Testing', completed: currentStatus === 'UAT' || currentStatus === 'Resolved' },
    { name: 'UAT', completed: currentStatus === 'Resolved' },
    { name: 'Resolved', completed: currentStatus === 'Resolved' }
  ];

  // Reverse stages for Kho-Kho game display
  const reversedStages = [...stages].reverse();

  return (
    <div className="progress-timeline">
      <h2>Development Timeline</h2>
      
      {/* Kho-Kho Game Visualization */}
      <KhoKhoGame currentStage={currentStatus} stages={stages} />
      
      <div className="progress-details">
        <div className="progress-section">
          <h3>Development Details</h3>
          {development.startDate && (
            <p>Started: {format(development.startDate, 'MMM dd, yyyy')}</p>
          )}
          {development.endDate && (
            <p>Completed: {format(development.endDate, 'MMM dd, yyyy')}</p>
          )}
          <p>Progress: {development.completionPercentage}%</p>
          <p>Commits: {development.commits}</p>
          <p>Lines changed: {development.linesOfCodeChanged.toLocaleString()}</p>
          <div className="developers">
            <h4>Developers:</h4>
            {development.developers.map(dev => (
              <div key={dev.name} className="developer">
                {dev.name} - {dev.contributions} contributions
              </div>
            ))}
          </div>
        </div>
        
        <div className="progress-section">
          <h3>QA Testing Details</h3>
          {qa.startDate && (
            <p>Started: {format(qa.startDate, 'MMM dd, yyyy')}</p>
          )}
          <p>Test cases: {qa.testCasesPassed}/{qa.testCasesTotal}</p>
          <p>Automation coverage: {qa.automationCoverage}%</p>
          <p>Active bugs: {qa.bugs.filter(b => b.status === 'Open').length}</p>
          <div className="testers">
            <h4>Testers:</h4>
            {qa.testers.map(tester => (
              <div key={tester}>{tester}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};