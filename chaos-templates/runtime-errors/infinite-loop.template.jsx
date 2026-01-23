/**
 * @fault-type: infinite-loop
 * @category: runtime-errors
 * @description: useEffect dependency configuration error causes infinite render
 * @expected-error: Maximum update depth exceeded
 * @target-file: src/pages/TaskListPage.jsx
 * @severity: high
 */

import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskCard from '../components/features/TaskCard';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { Link } from 'react-router-dom';

/**
 * TaskListPage - Task List Page
 * 
 * FAULT INJECTION: Infinite loop
 * Error Type: useEffect dependency configuration error
 * Expected Result: Page freezes, console shows "Maximum update depth exceeded"
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
  const [filteredTasks, setFilteredTasks] = useState([]);

  // FAULT INJECTION: Infinite loop
  // Error: Updating state in useEffect, but state is in dependency array
  // This causes infinite loop: state update -> useEffect trigger -> state update -> ...
  useEffect(() => {
    let filtered = searchQuery ? searchTasks(searchQuery) : tasks;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

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

    // ERROR: Updating state, but filteredTasks is in dependency array
    setFilteredTasks(filtered);
  }, [tasks, searchQuery, filterStatus, filterPriority, sortBy, searchTasks, filteredTasks]);
  // Problem: filteredTasks in dependency array causes infinite loop

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading && tasks.length === 0) {
    return <Loading fullScreen text="Loading task list..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-xl mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
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

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            </div>
          </div>

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
      </div>

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
        </div>
      )}
    </div>
  );
}

export default TaskListPage;
