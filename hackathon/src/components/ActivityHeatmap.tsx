import React from 'react';
import { TicketActivity } from '../types';
import { format, eachDayOfInterval, startOfWeek, parseISO, isSameDay } from 'date-fns';

interface ActivityHeatmapProps {
  activities: TicketActivity[];
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ activities }) => {
  const generateHeatmapData = () => {
    if (activities.length === 0) return [];

    const dates = activities.map(a => parseISO(a.timestamp));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    const startDate = startOfWeek(minDate);
    const allDays = eachDayOfInterval({ start: startDate, end: maxDate });
    
    const activityCountByDay = new Map<string, number>();
    
    activities.forEach(activity => {
      const day = format(parseISO(activity.timestamp), 'yyyy-MM-dd');
      activityCountByDay.set(day, (activityCountByDay.get(day) || 0) + 1);
    });

    const maxCount = Math.max(...Array.from(activityCountByDay.values()));
    
    return allDays.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const count = activityCountByDay.get(dayStr) || 0;
      const intensity = maxCount > 0 ? count / maxCount : 0;
      
      return {
        date: day,
        count,
        intensity,
        dayStr: format(day, 'EEE'),
        dateStr: format(day, 'MMM dd'),
      };
    });
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return '#f0f0f0';
    if (intensity < 0.25) return '#c6e48b';
    if (intensity < 0.5) return '#7bc96f';
    if (intensity < 0.75) return '#239a3b';
    return '#196127';
  };

  const heatmapData = generateHeatmapData();
  const weeks: typeof heatmapData[] = [];
  
  for (let i = 0; i < heatmapData.length; i += 7) {
    weeks.push(heatmapData.slice(i, i + 7));
  }

  return (
    <div className="activity-heatmap">
      <h3>Activity Heatmap</h3>
      <div className="heatmap-container">
        <div className="heatmap-days">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="heatmap-day-label">{day}</div>
          ))}
        </div>
        <div className="heatmap-grid">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="heatmap-week">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="heatmap-cell"
                  style={{ backgroundColor: getIntensityColor(day.intensity) }}
                  title={`${day.dateStr}: ${day.count} activities`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="heatmap-legend">
        <span>Less</span>
        <div className="heatmap-legend-cells">
          {[0, 0.25, 0.5, 0.75, 1].map((intensity, index) => (
            <div
              key={index}
              className="heatmap-cell"
              style={{ backgroundColor: getIntensityColor(intensity) }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};