import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

/**
 * CreateTaskPage - Create Task Page
 * 
 * Features:
 * - Create new task
 * - Form validation
 * - Tag management
 */
function CreateTaskPage() {
  const navigate = useNavigate();
  const { createTask } = useTaskContext();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * Handle form input
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear corresponding field error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Add tag
   */
  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  /**
   * Remove tag
   */
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  /**
   * Form validation
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a task title';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a task description';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Submit form
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const newTask = await createTask(formData);
      navigate(`/tasks/${newTask.id}`);
    } catch (err) {
      alert('Failed to create task: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Back Button */}
      <div>
        <Link to="/tasks">
          <Button variant="secondary" size="sm">
            ← Back to List
          </Button>
        </Link>
      </div>

      {/* Form Card */}
      <Card title="Create New Task">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`input ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter task title..."
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`input min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Describe the task in detail..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input"
              >
                <option value="pending">⏳ Pending</option>
                <option value="in-progress">🚀 In Progress</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="input"
              >
                <option value="high">🔥 High Priority</option>
                <option value="medium">⚡ Medium Priority</option>
                <option value="low">📌 Low Priority</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="input"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                className="input flex-1"
                placeholder="Enter tag and press Enter..."
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddTag}
              >
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
            <Link to="/tasks" className="flex-1">
              <Button
                type="button"
                variant="secondary"
                fullWidth
                disabled={loading}
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Tips</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Title and description are required fields</li>
                <li>You can add multiple tags to categorize tasks</li>
                <li>Setting a due date helps with time management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTaskPage;
