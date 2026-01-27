/**
 * @fault-type: syntax-error
 * @category: build-errors
 * @description: JSX syntax error, missing closing tag causes compilation failure
 * @expected-error: Unexpected token
 * @target-file: src/pages/Home.jsx
 * @severity: high
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

/**
 * Home - Home Page Component
 * 
 * FAULT INJECTION: JSX Syntax Error
 * Error Type: Missing closing tag
 * Expected Result: Vite compilation fails, unable to build
 */
function Home() {
  const { tasks, loading, getTaskStats } = useTaskContext();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (tasks.length > 0) {
      setStats(getTaskStats());
    }
  }, [tasks, getTaskStats]);

  if (loading && !stats) {
    return <Loading fullScreen text="Loading..." />;
  }

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section - ERROR: Missing closing </div> tag */}
      <div className="text-center py-12 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to TaskFlow</h1>
        <p className="text-xl text-primary-100 mb-6">
          Efficiently manage your tasks and boost productivity
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/tasks/create">
            <Button variant="secondary" size="lg">
              + Create New Task
            </Button>
          </Link>
          <Link to="/tasks">
            <Button variant="primary" size="lg" className="bg-white text-primary-700 hover:bg-gray-100">
              View All Tasks
            </Button>
          </Link>
        </div>
      {/* ERROR: Missing </div> closing tag here, will cause compilation error */}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Tasks</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Home;

