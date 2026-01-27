import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

/**
 * Home - Home Page Component
 * 
 * Features:
 * - Display task statistics
 * - Show recent tasks
 * - Provide quick action shortcuts
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

  // Get recent tasks
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
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
      </div>

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

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pending</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">In Progress</p>
                <p className="text-3xl font-bold text-purple-900">{stats.inProgress}</p>
              </div>
              <div className="text-4xl">🚀</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Completed</p>
                <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </Card>
        </div>
      )}

      {/* Recent Tasks */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Tasks</h2>
          <Link to="/tasks">
            <Button variant="secondary" size="sm">
              View All →
            </Button>
          </Link>
        </div>

        {recentTasks.length > 0 ? (
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <Link key={task.id} to={`/tasks/${task.id}`}>
                <Card hoverable className="transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1">{task.description}</p>
                    </div>
                    <div className="ml-4">
                      <span className={`badge ${
                        task.status === 'completed' ? 'badge-success' :
                        task.status === 'in-progress' ? 'badge-info' :
                        'badge-warning'
                      }`}>
                        {task.status === 'completed' ? 'Completed' :
                         task.status === 'in-progress' ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-lg">No tasks yet, create your first task!</p>
            </div>
          </Card>
        )}
      </div>

      {/* Feature Introduction */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold text-lg mb-2">Task Management</h3>
            <p className="text-sm text-gray-600">
              Create, edit, and delete tasks to easily manage your workflow
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold text-lg mb-2">Priority Settings</h3>
            <p className="text-sm text-gray-600">
              Set task priorities to organize your work efficiently
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-bold text-lg mb-2">Statistics</h3>
            <p className="text-sm text-gray-600">
              View real-time task statistics to track your progress
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Home;

