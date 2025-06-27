import React, { useState } from 'react';
import { PersonActivity } from '../types';
import { formatDuration } from '../utils/calculations';

interface PersonTrackerProps {
  activities: PersonActivity[];
}

export const PersonTracker: React.FC<PersonTrackerProps> = ({ activities }) => {
  const [selectedPerson, setSelectedPerson] = useState('');
  
  const filteredActivities = selectedPerson 
    ? activities.filter(a => a.person.toLowerCase().includes(selectedPerson.toLowerCase()))
    : activities;

  return (
    <div className="person-tracker">
      <h3>Person Activity Tracker</h3>
      
      <div className="person-filter">
        <input
          type="text"
          placeholder="Filter by person name..."
          value={selectedPerson}
          onChange={(e) => setSelectedPerson(e.target.value)}
        />
      </div>
      
      <div className="person-list">
        {filteredActivities.map((person) => (
          <div key={person.person} className="person-card">
            <h4>{person.person}</h4>
            <div className="person-stats">
              <div className="person-stat">
                <span className="stat-label">Total Activities:</span>
                <span className="stat-value">{person.activitiesCount}</span>
              </div>
              <div className="person-stat">
                <span className="stat-label">State Changes:</span>
                <span className="stat-value">{person.stateChanges}</span>
              </div>
              <div className="person-stat">
                <span className="stat-label">Comments:</span>
                <span className="stat-value">{person.comments}</span>
              </div>
              <div className="person-stat">
                <span className="stat-label">Work Items:</span>
                <span className="stat-value">{person.workItems}</span>
              </div>
              {person.totalTimeWorked > 0 && (
                <div className="person-stat">
                  <span className="stat-label">Time Worked:</span>
                  <span className="stat-value">{formatDuration(person.totalTimeWorked)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};