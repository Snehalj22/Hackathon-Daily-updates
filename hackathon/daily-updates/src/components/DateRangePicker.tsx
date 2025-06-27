import React, { useState } from 'react';
import { format } from 'date-fns';

interface DateRangePickerProps {
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleApply = () => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    onDateRangeChange(start, end);
    setIsOpen(false);
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    onDateRangeChange(null, null);
  };

  const getDateRangeText = () => {
    if (startDate && endDate) {
      return `${format(new Date(startDate), 'MMM dd')} - ${format(new Date(endDate), 'MMM dd, yyyy')}`;
    }
    return 'All Time';
  };

  return (
    <div className="date-range-picker">
      <button 
        className="date-range-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="calendar-icon-wrapper">
          <span className="calendar-icon">📅</span>
          <span className="calendar-badge">
            {startDate && endDate ? '!' : ''}
          </span>
        </div>
        <span className="date-range-text">{getDateRangeText()}</span>
        <span className="arrow-icon">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="date-range-dropdown">
          <div className="date-inputs">
            <div className="date-input-group">
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
              />
            </div>
            <div className="date-input-group">
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="date-input"
              />
            </div>
          </div>
          
          <div className="quick-select">
            <h4>Quick Select:</h4>
            <div className="quick-options">
              <button onClick={() => {
                const today = new Date();
                const last7Days = new Date(today);
                last7Days.setDate(today.getDate() - 7);
                setStartDate(last7Days.toISOString().split('T')[0]);
                setEndDate(today.toISOString().split('T')[0]);
              }}>Last 7 Days</button>
              <button onClick={() => {
                const today = new Date();
                const last30Days = new Date(today);
                last30Days.setDate(today.getDate() - 30);
                setStartDate(last30Days.toISOString().split('T')[0]);
                setEndDate(today.toISOString().split('T')[0]);
              }}>Last 30 Days</button>
              <button onClick={() => {
                const today = new Date();
                const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                setStartDate(thisMonth.toISOString().split('T')[0]);
                setEndDate(today.toISOString().split('T')[0]);
              }}>This Month</button>
            </div>
          </div>

          <div className="date-range-actions">
            <button onClick={handleClear} className="clear-btn">Clear</button>
            <button onClick={handleApply} className="apply-btn">Apply</button>
          </div>
        </div>
      )}
    </div>
  );
};