/**
 * Helpers - 通用格式化工具
 */

/**
 * 格式化任务数据
 * 
 * @param {Object} task - 任务对象
 * @returns {Object} 格式化后的任务对象
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
 * 格式化日期
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('zh-CN');
}

/**
 * 获取状态显示文本
 */
export function getStatusDisplay(status) {
  const statusMap = {
    pending: '待处理',
    'in-progress': '进行中',
    completed: '已完成',
  };
  return statusMap[status] || status;
}

/**
 * 获取优先级显示文本
 */
export function getPriorityDisplay(priority) {
  const priorityMap = {
    low: '低',
    medium: '中',
    high: '高',
  };
  return priorityMap[priority] || priority;
}

