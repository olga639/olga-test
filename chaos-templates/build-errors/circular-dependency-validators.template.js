/**
 * @fault-type: circular-dependency
 * @category: build-errors
 * @description: validators reverse dependency on helpers, forming circular dependency
 * @expected-error: Circular dependency detected
 * @target-file: src/utils/validators.js
 * @severity: medium
 */

/**
 * validators.js - Helper file for circular-dependency fault
 * This file will be created at src/utils/validators.js
 * It imports helpers.js, forming circular dependency
 */

// ERROR: Circular dependency: validators.js imports helpers.js
import { formatTaskData } from './helpers';

/**
 * Validate task data
 */
export function validateTaskData(task) {
  if (!task || typeof task !== 'object') {
    return false;
  }
  
  // Using function from helpers here, intensifying circular dependency
  const formatted = formatTaskData(task);
  
  return !!(task.title && task.status);
}

/**
 * Validate task title
 */
export function validateTitle(title) {
  return typeof title === 'string' && title.trim().length > 0;
}
