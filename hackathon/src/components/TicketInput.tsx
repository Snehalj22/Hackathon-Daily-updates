import React, { useState } from 'react';

interface TicketInputProps {
  onSubmit: (url: string, token: string) => void;
}

export const TicketInput: React.FC<TicketInputProps> = ({ onSubmit }) => {
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && token) {
      onSubmit(url, token);
    }
  };

  return (
    <div className="ticket-input">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="ticket-url">YouTrack Ticket URL:</label>
          <input
            id="ticket-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtrack.company.com/issue/PROJECT-123"
            required
          />
        </div>
        
        {!showTokenInput && (
          <button 
            type="button" 
            className="token-button"
            onClick={() => setShowTokenInput(true)}
          >
            Configure API Token
          </button>
        )}
        
        {showTokenInput && (
          <div className="form-group">
            <label htmlFor="api-token">API Token:</label>
            <input
              id="api-token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Your YouTrack API token"
              required
            />
          </div>
        )}
        
        <button type="submit" disabled={!url || !token}>
          Analyze Ticket
        </button>
      </form>
    </div>
  );
};