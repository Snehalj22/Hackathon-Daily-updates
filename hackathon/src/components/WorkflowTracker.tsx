import React from 'react';
import { TicketActivity } from '../types';
import { WORKFLOW_STATES, getStateOrder, isBackwardMovement, getStateIcon } from '../utils/workflow';
import { ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';

interface WorkflowTrackerProps {
  activities: TicketActivity[];
  currentState: string;
}

export const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({ activities, currentState }) => {
  const stateTransitions = activities
    .filter(a => a.type === 'state_change' && a.from && a.to)
    .map(a => ({
      ...a,
      isBackward: isBackwardMovement(a.from!, a.to!),
    }));

  const backwardMovements = stateTransitions.filter(t => t.isBackward);
  const currentStateOrder = getStateOrder(currentState);

  return (
    <div className="workflow-tracker">
      <h3>Workflow Progress</h3>
      
      {backwardMovements.length > 0 && (
        <div className="backward-alert">
          <AlertTriangle size={20} />
          <span>Ticket moved backward {backwardMovements.length} time{backwardMovements.length > 1 ? 's' : ''}</span>
        </div>
      )}

      <div className="workflow-states">
        {WORKFLOW_STATES.map((state, index) => {
          const stateOrder = state.order;
          const isActive = stateOrder === currentStateOrder;
          const isPassed = stateOrder < currentStateOrder;
          const hasBackwardMove = backwardMovements.some(m => 
            getStateOrder(m.to!) === stateOrder
          );

          return (
            <React.Fragment key={state.id}>
              <div className={`workflow-state ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''} ${hasBackwardMove ? 'backward' : ''}`}>
                <div className="state-icon">{state.icon}</div>
                <div className="state-name">{state.name}</div>
                {hasBackwardMove && (
                  <div className="backward-indicator">
                    <ArrowLeft size={16} />
                  </div>
                )}
              </div>
              {index < WORKFLOW_STATES.length - 1 && (
                <div className="workflow-arrow">
                  <ArrowRight size={20} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="state-transitions">
        <h4>State History</h4>
        <div className="transition-list">
          {stateTransitions.map((transition, index) => (
            <div key={transition.id} className={`transition-item ${transition.isBackward ? 'backward' : 'forward'}`}>
              <div className="transition-icon">
                {transition.isBackward ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </div>
              <div className="transition-content">
                <span className="transition-from">
                  {getStateIcon(transition.from!)} {transition.from}
                </span>
                <span className="transition-arrow">→</span>
                <span className="transition-to">
                  {getStateIcon(transition.to!)} {transition.to}
                </span>
                {transition.isBackward && (
                  <span className="backward-label">Moved Backward!</span>
                )}
              </div>
              <div className="transition-actor">{transition.actor}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};