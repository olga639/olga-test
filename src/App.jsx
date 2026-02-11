/**
 * @fault-type: typescript-error
 * @category: build-errors
 * @description: Type definition error causes TypeScript compilation failure
 * @expected-error: Type error
 * @target-file: src/App.jsx
 * @severity: high
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/Layout/Layout';
import { TaskProvider } from './context/TaskContext';

// FAULT INJECTION: TypeScript type error
// Error Type: Type mismatch
// Expected Result: If TypeScript checking is enabled, compilation fails

// Pages
import Home from './pages/Home';
import TaskListPage from './pages/TaskListPage';
import TaskDetailPage from './pages/TaskDetailPage';
import CreateTaskPage from './pages/CreateTaskPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * App - Root Application Component
 * 
 * FAULT INJECTION: TypeScript type error
 * Error Type: Type definition mismatch
 * Expected Result: TypeScript compilation fails
 */
function App() {
  // ERROR: Assigning string to number type
  const count: number = "123"; // Type 'string' is not assignable to type 'number'
  
  // ERROR: Using undefined type
  const user: UserType = { name: "test" }; // Cannot find name 'UserType'

  return (
    <Router>
      <TaskProvider>
        <ErrorBoundary>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tasks" element={<TaskListPage />} />
              <Route path="/tasks/:id" element={<TaskDetailPage />} />
              <Route path="/create" element={<CreateTaskPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </ErrorBoundary>
      </TaskProvider>
    </Router>
  );
}

export default App;
