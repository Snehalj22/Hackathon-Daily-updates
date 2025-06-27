import React from 'react';
import { RiskAssessment as RiskAssessmentType } from '../types';

interface RiskAssessmentProps {
  assessment: RiskAssessmentType;
}

export const RiskAssessment: React.FC<RiskAssessmentProps> = ({ assessment }) => {
  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      'High': '#EF4444',
      'Medium': '#F59E0B',
      'Low': '#10B981'
    };
    return colors[risk] || '#6B7280';
  };

  return (
    <div className="risk-assessment">
      <h2>Risk Assessment</h2>
      <div className="overall-risk">
        <span>Overall Risk Level: </span>
        <span 
          className="risk-level-badge" 
          style={{ backgroundColor: getRiskColor(assessment.overallRisk) }}
        >
          {assessment.overallRisk}
        </span>
      </div>

      <div className="risk-content">
        <div className="risk-factors">
          <h3>Risk Factors</h3>
          {assessment.factors.map((factor, index) => (
            <div key={index} className="risk-factor">
              <div className="factor-header">
                <span className="factor-type">{factor.type}</span>
                <span 
                  className="factor-severity" 
                  style={{ color: getRiskColor(factor.severity) }}
                >
                  {factor.severity}
                </span>
              </div>
              <p className="factor-description">{factor.description}</p>
            </div>
          ))}
        </div>

        <div className="mitigation-strategies">
          <h3>Mitigation Strategies</h3>
          <ul>
            {assessment.mitigationStrategies.map((strategy, index) => (
              <li key={index}>{strategy}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};