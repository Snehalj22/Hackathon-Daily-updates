export interface WorkflowState {
  id: string;
  name: string;
  icon: string;
  order: number;
  type: 'active' | 'waiting' | 'done';
}

export const WORKFLOW_STATES: WorkflowState[] = [
  { id: 'planning', name: 'Planning', icon: '🪑', order: 1, type: 'waiting' },
  { id: 'development', name: 'Development', icon: '🏃‍♂️➡️', order: 2, type: 'active' },
  { id: 'code_review', name: 'Code Review', icon: '🪑', order: 3, type: 'waiting' },
  { id: 'qa_testing', name: 'QA Testing', icon: '🏃‍♀️➡️', order: 4, type: 'active' },
  { id: 'uat', name: 'UAT', icon: '🪑', order: 5, type: 'waiting' },
  { id: 'resolved', name: 'Resolved', icon: '✅', order: 6, type: 'done' },
];

export function getStateOrder(stateName: string): number {
  const state = WORKFLOW_STATES.find(s => 
    s.name.toLowerCase() === stateName.toLowerCase() ||
    s.id === stateName.toLowerCase().replace(/\s+/g, '_')
  );
  return state?.order || 0;
}

export function isBackwardMovement(fromState: string, toState: string): boolean {
  const fromOrder = getStateOrder(fromState);
  const toOrder = getStateOrder(toState);
  return fromOrder > toOrder && fromOrder > 0 && toOrder > 0;
}

export function getStateIcon(stateName: string): string {
  const state = WORKFLOW_STATES.find(s => 
    s.name.toLowerCase() === stateName.toLowerCase() ||
    s.id === stateName.toLowerCase().replace(/\s+/g, '_')
  );
  return state?.icon || '📋';
}

export function getMovementDirection(fromState: string, toState: string): 'forward' | 'backward' | 'none' {
  const fromOrder = getStateOrder(fromState);
  const toOrder = getStateOrder(toState);
  
  if (fromOrder === 0 || toOrder === 0) return 'none';
  if (fromOrder < toOrder) return 'forward';
  if (fromOrder > toOrder) return 'backward';
  return 'none';
}