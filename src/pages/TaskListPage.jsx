import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskCard from '../components/features/TaskCard';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { Link } from 'react-router-dom';

/**
 * TaskListPage - Task List Page
 * 
 * Features:
 * - Display all tasks
 * - Filter and sort
 * - Search functionality
 * - Batch operations
 */
function TaskListPage() {
  const {
    tasks,
    loading,
    error,
    toggleTaskStatus,
    deleteTask,
    searchTasks
  } = useTaskContext();

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  /**
   * Handle search
   */
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  /**
   * Get filtered tasks
   */
  const getFilteredTasks = () => {
    let filtered = searchQuery ? searchTasks(searchQuery) : tasks;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    // Filter by priority
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  if (loading && tasks.length === 0) {
    return <Loading fullScreen text="Loading task list..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-xl mb-4">❌ {error}</div>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task List</h1>
          <p className="text-gray-600 mt-1">
            {filteredTasks.length} tasks total
            {searchQuery && ` (Search: "${searchQuery}")`}
          </p>
        </div>
        <Link to="/tasks/create">
          <Button variant="primary" size="lg">
            + Create New Task
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Box */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Tasks
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search title, description or tags..."
                value={searchQuery}
                onChange={handleSearch}
                className="input pl-10"
              />
              <svg
                className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="input"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Sort Options */}
        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Sort:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('createdAt')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'createdAt'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Created Date
            </button>
            <button
              onClick={() => setSortBy('dueDate')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'dueDate'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Due Date
            </button>
            <button
              onClick={() => setSortBy('priority')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'priority'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Priority
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStatus={toggleTaskStatus}
              onDelete={deleteTask}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Tasks Found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'No tasks created yet'}
          </p>
          {!searchQuery && (
            <Link to="/tasks/create">
              <Button variant="primary">Create First Task</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskListPage;
