import React from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../common/Badge';
import Button from '../common/Button';

/**
 * TaskCard - Task Card Component
 * 
 * Features:
 * - Display basic task information
 * - Support quick actions (complete, delete)
 * - Click to navigate to detail page
 * - Priority and status indicators
 * 
 * @param {Object} props
 * @param {Object} props.task - Task object
 * @param {Function} props.onToggleStatus - Toggle status callback
 * @param {Function} props.onDelete - Delete callback
 */
function TaskCard({ task = {}, onToggleStatus, onDelete }) {
  const navigate = useNavigate();

  // Priority configuration
  const priorityConfig = {
    high: { label: 'High Priority', variant: 'danger', icon: '🔥' },
    medium: { label: 'Medium Priority', variant: 'warning', icon: '⚡' },
    low: { label: 'Low Priority', variant: 'info', icon: '📌' }
  };

  // Status configuration
  const statusConfig = {
    pending: { label: 'Pending', variant: 'default', icon: '⏳' },
    'in-progress': { label: 'In Progress', variant: 'info', icon: '🚀' },
    completed: { label: 'Completed', variant: 'success', icon: '✅' }
  };

  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const status = statusConfig[task.status] || statusConfig.pending;

  /**
   * Handle card click
   */
  const handleCardClick = () => {
    navigate(`/tasks/${task.id}`);
  };

  /**
   * Handle toggle status
   */
  const handleToggleStatus = (e) => {
    e.stopPropagation();
    onToggleStatus && onToggleStatus(task.id);
  };

  /**
   * Handle delete
   */
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete && onDelete(task.id);
    }
  };

  /**
   * Format date
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * Check if overdue
   */
  const isOverdue = () => {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <div
      className="card hoverable cursor-pointer transition-all duration-200 hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {task.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {task.description}
          </p>
        </div>
      </div>

      {/* Tags and Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant={priority.variant} size="sm">
          {priority.icon} {priority.label}
        </Badge>
        <Badge variant={status.variant} size="sm">
          {status.icon} {status.label}
        </Badge>
        {task.tags && task.tags.map((tag, index) => (
          <Badge key={index} variant="default" size="sm">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Due Date */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className={isOverdue() ? 'text-red-600 font-medium' : ''}>
          {formatDate(task.dueDate)}
          {isOverdue() && ' (Overdue)'}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-gray-200">
        <Button
          variant={task.status === 'completed' ? 'secondary' : 'success'}
          size="sm"
          onClick={handleToggleStatus}
          className="flex-1"
        >
          {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default TaskCard;
