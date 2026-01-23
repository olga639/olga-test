/**
 * Helpers - Common Formatting Utilities
 */

/**
 * Format task data
 * 
 * @param {Object} task - Task object
 * @returns {Object} Formatted task object
 */
export function formatTaskData(task) {
  return {
    ...task,
    formattedDate: formatDate(task.createdAt),
    displayStatus: getStatusDisplay(task.status),
    displayPriority: getPriorityDisplay(task.priority)
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
