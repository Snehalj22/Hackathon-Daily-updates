import React from 'react';
import { TestingRecommendation } from '../types';

interface TestingRecommendationsProps {
  recommendations: TestingRecommendation[];
}

export const TestingRecommendations: React.FC<TestingRecommendationsProps> = ({ recommendations }) => {
  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'Critical': '#DC2626',
      'High': '#F59E0B',
      'Medium': '#3B82F6',
      'Low': '#10B981'
    };
    return colors[priority] || '#6B7280';
  };

  const getTestTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'Unit': '🧪',
      'Integration': '🔗',
      'E2E': '🎯',
      'Performance': '⚡',
      'Security': '🔒',
      'UAT': '👥'
    };
    return icons[type] || '📋';
  };

  return (
    <div className="testing-recommendations">
      <h2>Testing Recommendations</h2>
      <div className="recommendations-grid">
        {recommendations.map((rec, index) => (
          <div key={index} className="recommendation-card">
            <div className="rec-header">
              <span className="test-type-icon">{getTestTypeIcon(rec.testType)}</span>
              <span className="rec-area">{rec.area}</span>
              <span 
                className="priority-badge" 
                style={{ backgroundColor: getPriorityColor(rec.priority) }}
              >
                {rec.priority}
              </span>
            </div>
            <p className="rec-description">{rec.description}</p>
            <div className="rec-meta">
              <span className="rec-effort">⏱️ {rec.estimatedEffort}</span>
              <span className="rec-automation">
                {rec.automatable ? '🤖 Automatable' : '👤 Manual'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};