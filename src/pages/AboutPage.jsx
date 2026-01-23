import React from 'react';
import Card from '../components/common/Card';

/**
 * AboutPage - About Page
 * 
 * Features:
 * - Project introduction
 * - Tech stack description
 * - Chaos engineering description
 */
function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Project Introduction */}
      <Card>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-4">
            <span className="text-4xl text-white">T</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TaskFlow</h1>
          <p className="text-xl text-gray-600">Modern Task Management System</p>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Overview</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            TaskFlow is a fully-featured task management system designed for chaos engineering exercises.
            It provides an intuitive user interface and comprehensive task management features to help users efficiently organize and track their daily tasks.
          </p>
          <p className="text-gray-700 leading-relaxed">
            This project is not only a practical task management tool but also a demo application for demonstrating and testing chaos engineering practices.
            Through the built-in fault injection system, various real-world error scenarios can be simulated for testing and practicing fault analysis platforms.
          </p>
        </div>
      </Card>

      {/* Core Features */}
      <Card title="Core Features">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">📝</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Task Management</h3>
              <p className="text-sm text-gray-600">
                Create, edit, and delete tasks with status tracking and priority settings
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🔍</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Search & Filter</h3>
              <p className="text-sm text-gray-600">
                Powerful search and filter features to quickly find the tasks you need
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Statistics</h3>
              <p className="text-sm text-gray-600">
                Real-time task statistics to understand work progress and completion status
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🏷️</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Tag Classification</h3>
              <p className="text-sm text-gray-600">
                Use tags to categorize tasks for better content organization
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tech Stack */}
      <Card title="Tech Stack">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Frontend Framework</h3>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-info">React 18</span>
              <span className="badge badge-info">React Router v6</span>
              <span className="badge badge-info">Context API</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Build Tools</h3>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-success">Vite 5</span>
              <span className="badge badge-success">ES Modules</span>
              <span className="badge badge-success">HMR</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Styling</h3>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-warning">TailwindCSS 3</span>
              <span className="badge badge-warning">PostCSS</span>
              <span className="badge badge-warning">Autoprefixer</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Deployment Platform</h3>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-danger">Vercel</span>
              <span className="badge badge-danger">GitHub</span>
              <span className="badge badge-danger">Webhook</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Chaos Engineering */}
      <Card title="Chaos Engineering Exercises">
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            This project includes a complete chaos engineering fault injection system that supports quick injection of various error types through CLI tools:
          </p>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Supported Fault Types</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span><strong>Build Errors:</strong> Syntax errors, import path errors, missing dependencies, etc.</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span><strong>Runtime Errors:</strong> Component crashes, infinite loops, state management errors, etc.</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                <span><strong>Resource Loading Errors:</strong> Static resource 404, code splitting failures, etc.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span><strong>Performance Issues:</strong> Memory leaks, render lag, etc.</span>
              </li>
            </ul>
          </div>

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
                <h3 className="text-sm font-medium text-blue-800">Usage Instructions</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Use the CLI tool <code className="bg-blue-100 px-2 py-1 rounded">npm run chaos inject --type [fault-type]</code> 
                    to inject the specified error type for testing fault analysis platform functionality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Version Info */}
      <Card>
        <div className="text-center text-sm text-gray-600">
          <p className="mb-2">Version: 2.0.0</p>
          <p className="mb-2">Last Updated: January 14, 2026</p>
          <p>© 2026 TaskFlow. All rights reserved.</p>
        </div>
      </Card>
    </div>
  );
}

export default AboutPage;
