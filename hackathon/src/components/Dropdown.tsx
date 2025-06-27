import React from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select an option',
}) => {
  return (
    <div className="dropdown">
      <label className="dropdown-label">{label}</label>
      <div className="dropdown-wrapper">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="dropdown-select"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="dropdown-icon" size={16} />
      </div>
    </div>
  );
};