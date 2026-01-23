/**
 * @fault-type: state-error
 * @category: runtime-errors
 * @description: Updating state during render causes error
 * @expected-error: Cannot update during render
 * @target-file: src/context/TaskContext.jsx
 * @severity: medium
 * 
 * Simplified template: calling setState directly in getTaskStats
 */

// This template is intentionally simplified, actual use will inject error in TaskContext
// Error example: calling setState in computed property or render function

export const stateErrorExample = `
// ERROR Example: Updating state in computed function
const getTaskStats = useCallback(() => {
  // ERROR: Directly updating state in non-event handler
  setError('Error during stats calculation');  // This causes "Cannot update during render"
  
  return {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length
  };
}, [tasks]);
`;
