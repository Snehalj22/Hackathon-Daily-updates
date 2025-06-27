import React, { useState } from 'react';
import { DailyUpdateDashboard } from './components/DailyUpdateDashboard';
import './App.css';

function App() {
  const [ticketId, setTicketId] = useState('RV2-45285');
  const [inputValue, setInputValue] = useState(ticketId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setTicketId(inputValue.trim());
    }
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>📊 Daily Ticket Updates</h1>
        <p>Comprehensive daily progress reports for your tickets</p>
      </div>
      
      <form onSubmit={handleSubmit} className="ticket-selector">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter ticket ID (e.g., RV2-45285)"
          className="ticket-input"
        />
        <button type="submit" className="update-button">
          Get Daily Update
        </button>
      </form>

      <DailyUpdateDashboard ticketId={ticketId} />
    </div>
  );
}

export default App;