import React from 'react';
import { format } from 'date-fns';

interface StageDetailModalProps {
  stage: string;
  details: {
    status: string;
    assignee: string;
    startDate?: Date;
    endDate?: Date;
    duration: number;
    activities: string[];
    blockers?: string[];
    progress?: number;
  };
  onClose: () => void;
}

export const StageDetailModal: React.FC<StageDetailModalProps> = ({ stage, details, onClose }) => {
  const getStatusColor = (status: string) => {
    if (status === 'Completed') return '#10b981';
    if (status === 'In Progress') return '#f59e0b';
    return '#6b7280';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2 className="modal-title">{stage} Details</h2>
        
        <div className="status-header" style={{ backgroundColor: getStatusColor(details.status) }}>
          <span className="status-text">{details.status}</span>
        </div>

        <div className="detail-section">
          <h3>👤 Assignee</h3>
          <p>{details.assignee}</p>
        </div>

        <div className="detail-section">
          <h3>📅 Timeline</h3>
          {details.startDate && (
            <p>Started: {format(details.startDate, 'MMM dd, yyyy')}</p>
          )}
          {details.endDate && (
            <p>Completed: {format(details.endDate, 'MMM dd, yyyy')}</p>
          )}
          <p>Duration: {details.duration} days</p>
        </div>

        {details.progress !== undefined && (
          <div className="detail-section">
            <h3>📊 Progress</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${details.progress}%` }}
              />
            </div>
            <p className="progress-text">{details.progress}% Complete</p>
          </div>
        )}

        <div className="detail-section">
          <h3>📝 Recent Activities</h3>
          <ul className="activity-list">
            {details.activities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </div>

        {details.blockers && details.blockers.length > 0 && (
          <div className="detail-section">
            <h3>🚧 Blockers</h3>
            <ul className="blocker-list">
              {details.blockers.map((blocker, index) => (
                <li key={index} className="blocker-item">{blocker}</li>
              ))}
            </ul>
          </div>
        )}

        <button className="speak-button" onClick={() => {
          const text = `${stage} is currently ${details.status}. Assigned to ${details.assignee}. 
            ${details.progress ? `Progress is at ${details.progress} percent.` : ''} 
            Duration: ${details.duration} days. 
            Recent activities include: ${details.activities.join('. ')}.
            ${details.blockers && details.blockers.length > 0 ? `Current blockers: ${details.blockers.join('. ')}` : ''}`;
          
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.9;
          utterance.pitch = 1;
          window.speechSynthesis.speak(utterance);
        }}>
          🔊 Read Status Aloud
        </button>
      </div>
    </div>
  );
};