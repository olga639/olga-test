import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Loading from '../components/common/Loading';
import Card from '../components/common/Card';

/**
 * TaskDetailPage - Task Detail Page
 * 
 * Features:
 * - Display complete task information
 * - Edit task
 * - Delete task
 * - Toggle status
 */
function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTaskById, updateTask, deleteTask, toggleTaskStatus } = useTaskContext();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Load task details
  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTaskById(id);
      setTask(data);
      setFormData(data);
    } catch (err) {
      setError(err.message || 'Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form input
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Save edits
   */
  const handleSave = async () => {
    try {
      const updated = await updateTask(id, formData);
      setTask(updated);
      setEditing(false);
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  /**
   * Cancel editing
   */
  const handleCancel = () => {
    setFormData(task);
    setEditing(false);
  };

  /**
   * Delete task
   */
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      try {
        await deleteTask(id);
        navigate('/tasks');
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  /**
   * Toggle status
   */
  const handleToggleStatus = async () => {
    try {
      const updated = await toggleTaskStatus(id);
      setTask(updated);
    } catch (err) {
      alert('Status update failed: ' + err.message);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading task details..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Task Not Found</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link to="/tasks">
          <Button variant="primary">Back to Task List</Button>
        </Link>
      </div>
    );
  }

  if (!task) return null;

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

  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back Button */}
      <div>
        <Link to="/tasks">
          <Button variant="secondary" size="sm">
            ← Back to List
          </Button>
        </Link>
      </div>

      {/* Task Detail Card */}
      <Card>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            {editing ? (
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input text-2xl font-bold mb-2"
                placeholder="Task Title"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {task.title}
              </h1>
            )}
            <div className="flex flex-wrap gap-2">
              <Badge variant={priority.variant}>
                {priority.icon} {priority.label}
              </Badge>
              <Badge variant={status.variant}>
                {status.icon} {status.label}
              </Badge>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
          {editing ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input min-h-[120px]"
              placeholder="Task Description"
            />
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">
              {task.description || 'No description'}
            </p>
          )}
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Status */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
            {editing ? (
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            ) : (
              <p className="text-gray-900">{status.label}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Priority</h4>
            {editing ? (
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="input"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            ) : (
              <p className="text-gray-900">{priority.label}</p>
            )}
          </div>

          {/* Due Date */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Due Date</h4>
            {editing ? (
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate || ''}
                onChange={handleInputChange}
                className="input"
              />
            ) : (
              <p className="text-gray-900">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString('en-US')
                  : 'No due date'}
              </p>
            )}
          </div>

          {/* Created Date */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Created Date</h4>
            <p className="text-gray-900">
              {new Date(task.createdAt).toLocaleString('en-US')}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {task.tags && task.tags.length > 0 ? (
              task.tags.map((tag, index) => (
                <Badge key={index} variant="default">
                  {tag}
                </Badge>
              ))
            ) : (
              <p className="text-gray-400">No tags</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
          {editing ? (
            <>
              <Button variant="primary" onClick={handleSave}>
                Save
              </Button>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" onClick={() => setEditing(true)}>
                Edit
              </Button>
              <Button
                variant={task.status === 'completed' ? 'secondary' : 'success'}
                onClick={handleToggleStatus}
              >
                {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

export default TaskDetailPage;
