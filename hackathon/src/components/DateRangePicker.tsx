import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateChange,
}) => {
  return (
    <div className="date-range-picker">
      <div className="date-picker-wrapper">
        <Calendar size={16} />
        <DatePicker
          selected={startDate}
          onChange={(date) => onDateChange(date, endDate)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          dateFormat="MMM dd, yyyy"
        />
      </div>
      <span className="date-separator">to</span>
      <div className="date-picker-wrapper">
        <Calendar size={16} />
        <DatePicker
          selected={endDate}
          onChange={(date) => onDateChange(startDate, date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="End Date"
          dateFormat="MMM dd, yyyy"
        />
      </div>
    </div>
  );
};