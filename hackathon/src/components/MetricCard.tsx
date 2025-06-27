import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, color, trend }) => {
  return (
    <div className="metric-card">
      <div className="metric-header">
        <div className="metric-icon" style={{ backgroundColor: color }}>
          <Icon size={24} color="white" />
        </div>
        {trend && (
          <div className={`metric-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div className="metric-content">
        <h3 className="metric-title">{title}</h3>
        <p className="metric-value">{value}</p>
      </div>
    </div>
  );
};