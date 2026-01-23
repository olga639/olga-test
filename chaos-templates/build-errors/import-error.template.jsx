/**
 * @fault-type: import-error
 * @category: build-errors
 * @description: Wrong import path causes module not found error
 * @expected-error: Cannot find module
 * @target-file: src/App.jsx
 * @severity: high
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/Layout/Layout';
import { TaskProvider } from './context/TaskContext';

// FAULT INJECTION: Wrong import paths
// Correct path should be './pages/Home', intentionally wrong here
import Home from './pages/HomePage';  // ERROR: File does not exist
import TaskListPage from './pages/TaskListPages';  // ERROR: Filename spelling error
import TaskDetailPage from './pages/TaskDetailPage';
import CreateTaskPage from './pages/CreateTaskPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * App - Root Application Component
 * 
 * FAULT INJECTION: Import path error
 * Error Type: Module path does not exist
 * Expected Result: Vite compilation fails with "Cannot find module"
 */
function App() {
  return (
    <ErrorBoundary>
      <TaskProvider>
        <Router>
          <Layout>
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
