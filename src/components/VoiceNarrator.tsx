import React, { useState, useEffect } from 'react';

interface VoiceNarratorProps {
  ticketId: string;
  currentStatus: string;
  assignee: string;
  summary: string;
  progress: {
    development: number;
    qa: number;
  };
  reopenCount: number;
  activeBlockers: number;
}

export const VoiceNarrator: React.FC<VoiceNarratorProps> = ({
  ticketId,
  currentStatus,
  assignee,
  summary,
  progress,
  reopenCount,
  activeBlockers
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('default');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const getVoiceByAssignee = (assigneeName: string): SpeechSynthesisVoice | null => {
    // Map associates to voice types
    const voiceMap: Record<string, string> = {
      'Sarah Chen': 'Google US English Female',
      'John Smith': 'Google US English Male',
      'Emily Davis': 'Microsoft Zira - English (United States)',
      'Mike Johnson': 'Google UK English Male',
      'Lisa Wang': 'Google US English Female',
      'David Lee': 'Alex',
      'Anna Wilson': 'Samantha',
      'Robert Brown': 'Daniel'
    };

    const preferredVoice = voiceMap[assigneeName];
    return voices.find(voice => 
      voice.name.includes(preferredVoice) || 
      voice.name === preferredVoice
    ) || voices[0];
  };

  const narrate = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const narrative = `
      Hello! This is ${assignee} reporting on ticket ${ticketId}.
      
      Here's your daily update:
      
      The ticket "${summary}" is currently in ${currentStatus} stage.
      
      Development progress is at ${progress.development} percent complete.
      QA testing progress is at ${progress.qa} percent complete.
      
      ${reopenCount > 0 ? `This ticket has been reopened ${reopenCount} times.` : 'Good news! This ticket has never been reopened.'}
      
      ${activeBlockers > 0 ? `We currently have ${activeBlockers} active blockers that need attention.` : 'There are no active blockers at this time.'}
      
      ${currentStatus === 'QA Testing' ? 'We are currently in the testing phase, ensuring quality standards are met.' : ''}
      ${currentStatus === 'In Development' ? 'The development team is actively working on implementing the features.' : ''}
      ${currentStatus === 'UAT' ? 'We are in User Acceptance Testing, gathering feedback from stakeholders.' : ''}
      
      That concludes today's update. Thank you for your attention!
    `;

    const utterance = new SpeechSynthesisUtterance(narrative);
    
    // Set voice based on assignee
    const voice = getVoiceByAssignee(assignee);
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <div className="voice-narrator">
      <div className="narrator-header">
        <h3>🎙️ Daily Update Narration</h3>
        <p className="narrator-subtitle">Listen to {assignee}'s voice update</p>
      </div>
      
      <div className="voice-controls">
        <button 
          className={`narrate-button ${isPlaying ? 'playing' : ''}`}
          onClick={narrate}
        >
          {isPlaying ? (
            <>⏸️ Pause Narration</>
          ) : (
            <>▶️ Play Voice Update</>
          )}
        </button>
        
        <select 
          className="voice-selector"
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
        >
          <option value="default">Auto (Based on Assignee)</option>
          {voices.map((voice, index) => (
            <option key={index} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="voice-indicator">
        {isPlaying && (
          <div className="voice-waves">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
        )}
      </div>
    </div>
  );
};