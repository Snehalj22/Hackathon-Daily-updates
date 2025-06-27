import React from 'react';

interface AssociateSelectorProps {
  associates: string[];
  selectedAssociate: string;
  onAssociateChange: (associate: string) => void;
}

export const AssociateSelector: React.FC<AssociateSelectorProps> = ({
  associates,
  selectedAssociate,
  onAssociateChange
}) => {
  return (
    <div className="associate-selector">
      <label htmlFor="associate-select">
        <div className="label-with-icon">
          <div className="animated-icon-wrapper">
            <span className="associate-icon">👥</span>
            <span className="pulse-ring"></span>
          </div>
          <span>Select Associate:</span>
        </div>
      </label>
      <select
        id="associate-select"
        value={selectedAssociate}
        onChange={(e) => onAssociateChange(e.target.value)}
        className="associate-dropdown"
      >
        <option value="">All Associates ({associates.length})</option>
        {associates.map(associate => (
          <option key={associate} value={associate}>
            {associate}
          </option>
        ))}
      </select>
    </div>
  );
};