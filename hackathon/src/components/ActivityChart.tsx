import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TicketActivity } from '../types';
import { format, startOfDay, eachDayOfInterval, parseISO } from 'date-fns';

interface ActivityChartProps {
  activities: TicketActivity[];
  chartType: 'line' | 'bar' | 'pie';
}

const COLORS = ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c'];

export const ActivityChart: React.FC<ActivityChartProps> = ({ activities, chartType }) => {
  const prepareActivityData = () => {
    if (activities.length === 0) return [];

    const activityByDay = new Map<string, number>();
    const dates = activities.map(a => parseISO(a.timestamp));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    const allDays = eachDayOfInterval({ start: minDate, end: maxDate });
    
    allDays.forEach(day => {
      const dayStr = format(day, 'MMM dd');
      activityByDay.set(dayStr, 0);
    });

    activities.forEach(activity => {
      const day = format(parseISO(activity.timestamp), 'MMM dd');
      activityByDay.set(day, (activityByDay.get(day) || 0) + 1);
    });

    return Array.from(activityByDay.entries()).map(([date, count]) => ({
      date,
      activities: count,
    }));
  };

  const prepareTypeData = () => {
    const typeCount = new Map<string, number>();
    
    activities.forEach(activity => {
      const type = activity.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      typeCount.set(type, (typeCount.get(type) || 0) + 1);
    });

    return Array.from(typeCount.entries()).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length],
    }));
  };

  if (chartType === 'pie') {
    const data = prepareTypeData();
    return (
      <div className="chart-container">
        <h3>Activity Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  const data = prepareActivityData();

  return (
    <div className="chart-container">
      <h3>Activity Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="activities" stroke="#3498db" strokeWidth={2} />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="activities" fill="#3498db" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};