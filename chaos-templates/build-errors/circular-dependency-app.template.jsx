/**
 * @fault-type: circular-dependency
 * @category: build-errors
 * @description: Force helpers import into build entry to trigger circular dependency detection
 * @expected-error: Circular dependency detected
 * @target-file: src/App.jsx
 * @severity: medium
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/Layout/Layout';
import { TaskProvider } from './context/TaskContext';
import { formatDate } from './utils/helpers';

// Page components
import Home from './pages/Home';
import TaskListPage from './pages/TaskListPage';
import TaskDetailPage from './pages/TaskDetailPage';
import CreateTaskPage from './pages/CreateTaskPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * App - Root Application Component
 * 
 * Responsibilities:
 * - Configure routing system
 * - Provide global state management (TaskContext)
 * - Error boundary wrapper
 * - Layout component wrapper
 */
function App() {
  const buildDate = formatDate(Date.now());

  return (
    <ErrorBoundary>
      <TaskProvider>
        <Router>
          <Layout>
            <span className="hidden" data-build-date={buildDate} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tasks" element={<TaskListPage />} />
              <Route path="/tasks/:id" element={<TaskDetailPage />} />
              <Route path="/tasks/create" element={<CreateTaskPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </Router>
      </TaskProvider>
    </ErrorBoundary>
  );
}

export default App;
