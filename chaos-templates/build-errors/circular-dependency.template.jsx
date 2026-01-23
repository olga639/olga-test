/**
 * @fault-type: circular-dependency
 * @category: build-errors
 * @description: Circular dependency between modules
 * @expected-error: Circular dependency
 * @target-file: src/utils/helpers.js
 * @severity: medium
 */

// FAULT INJECTION: Circular dependency
// Error Type: helpers.js -> validators.js -> helpers.js
// Expected Result: Build failure or runtime error

// ERROR: Import from validators, which also imports helpers
import { validateTaskData } from './validators';

/**
 * Format task data
 */
export function formatTaskData(task) {
  // Use function from validators, causing circular dependency
  if (!validateTaskData(task)) {
    throw new Error('Invalid task data');
  }
  
  return {
    ...task,
    formattedDate: formatDate(task.createdAt),
    displayStatus: getStatusDisplay(task.status),
  };
}

/**
 * Format date
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US');
}

/**
 * Get status display text
 */
export function getStatusDisplay(status) {
  const statusMap = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    completed: 'Completed',
  };
  return statusMap[status] || status;
}

/**
 * Get priority display text
 */
export function getPriorityDisplay(priority) {
  const priorityMap = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };
  return priorityMap[priority] || priority;
}
