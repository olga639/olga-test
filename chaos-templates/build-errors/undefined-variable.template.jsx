/**
 * @fault-type: undefined-variable
 * @category: build-errors
 * @description: Using undefined module import causes build failure
 * @expected-error: is not defined
 * @target-file: src/pages/TaskListPage.jsx
 * @severity: high
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import TaskCard from '../components/features/TaskCard';
import Loading from '../components/common/Loading';
import Badge from '../components/common/Badge';

// ERROR: Import non-existent module (this will fail at build time)
import { nonExistentFunction } from './utils/nonExistentModule';
// Error: Cannot find module './utils/nonExistentModule'

// ERROR: Import non-existent export from existing module
import { undefinedExport } from '../context/TaskContext';
// Error: export 'undefinedExport' was not found in '../context/TaskContext'

/**
 * TaskListPage - Task List Page
 * 
 * FAULT INJECTION: Undefined variable/module
 * Error Type: Import non-existent module or export
 * Expected Result: Build failure
 */
function TaskListPage() {
  const { tasks, loading, fetchTasks } = useTaskContext();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ERROR: Using undefined imports
  const result = nonExistentFunction(tasks);
  const config = undefinedExport;

  // Filter and sort tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  }).filter((task) => {
    if (!searchTerm) return true;
    return task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           task.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Task List</h1>
        <Link
          to="/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Task
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Task List */}
      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No tasks
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
}

export default TaskListPage;
