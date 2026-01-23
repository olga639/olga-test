/**
 * @fault-type: build-out-of-memory (App.jsx with import)
 * @description: App.jsx imports large data file, triggering memory overflow during build
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';
import { TaskProvider } from './context/TaskContext';

// Pages
import Home from './pages/Home';
import TaskListPage from './pages/TaskListPage';
import TaskDetailPage from './pages/TaskDetailPage';
import CreateTaskPage from './pages/CreateTaskPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

// ERROR: Fault injection - Import large data file
// This will load and execute largeData.js during build, causing memory overflow
import { 
  LARGE_CONSTANT_DATA, 
  HUGE_STRING, 
  MANY_OBJECTS,
  MORE_DATA,
  getTotalDataSize 
} from './utils/largeData';

// ERROR: Use this data at module top level to ensure it's loaded
console.log('Loading large data file...');
console.log('Data size:', getTotalDataSize());
console.log('LARGE_CONSTANT_DATA first 10 items:', LARGE_CONSTANT_DATA.slice(0, 10));
console.log('HUGE_STRING length:', HUGE_STRING.length);
console.log('MANY_OBJECTS count:', MANY_OBJECTS.length);
console.log('MORE_DATA arrays count:', MORE_DATA.arrays.length);

function App() {
  // ERROR: Also reference this data in component
  React.useEffect(() => {
    console.log('App component loaded, data size:', getTotalDataSize());
  }, []);

  return (
    <ErrorBoundary>
      <TaskProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="tasks" element={<TaskListPage />} />
              <Route path="tasks/:id" element={<TaskDetailPage />} />
              <Route path="create" element={<CreateTaskPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </ErrorBoundary>
  );
}

export default App;
