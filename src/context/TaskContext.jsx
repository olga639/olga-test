import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockApi } from '../utils/mockApi';

/**
 * TaskContext - Task State Management Context
 * 
 * Provides global task state management, including:
 * - Task list
 * - CRUD operations
 * - Loading state
 * - Error handling
 */
const TaskContext = createContext(null);

/**
 * useTaskContext - Hook to use task context
 * 
 * @returns {Object} Task context object
 * @throws {Error} Throws error if used outside TaskProvider
 */
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
}

/**
 * TaskProvider - Task State Provider Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export function TaskProvider({ children }) {
  // State management
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  /**
   * Fetch all tasks
   */
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mockApi.getTasks();
      setTasks(data);
      setInitialized(true);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get single task by ID
   * 
   * @param {string} id - Task ID
   * @returns {Promise<Object>} Task object
   */
  const getTaskById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const task = await mockApi.getTaskById(id);
      return task;
    } catch (err) {
      setError(err.message || 'Failed to get task details');
      console.error('Failed to get task details:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create new task
   * 
   * @param {Object} taskData - Task data
   * @returns {Promise<Object>} Created task object
   */
  const createTask = useCallback(async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      const newTask = await mockApi.createTask(taskData);
      setTasks(prevTasks => [newTask, ...prevTasks]);
      return newTask;
    } catch (err) {
      setError(err.message || 'Failed to create task');
      console.error('Failed to create task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update task
   * 
   * @param {string} id - Task ID
   * @param {Object} updates - Update data
   * @returns {Promise<Object>} Updated task object
   */
  const updateTask = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTask = await mockApi.updateTask(id, updates);
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === id ? updatedTask : task))
      );
      return updatedTask;
    } catch (err) {
      setError(err.message || 'Failed to update task');
      console.error('Failed to update task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete task
   * 
   * @param {string} id - Task ID
   * @returns {Promise<void>}
   */
  const deleteTask = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await mockApi.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete task');
      console.error('Failed to delete task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Toggle task completion status
   * 
   * @param {string} id - Task ID
   * @returns {Promise<Object>} Updated task object
   */
  const toggleTaskStatus = useCallback(async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    return updateTask(id, { status: newStatus });
  }, [tasks, updateTask]);

  /**
   * Filter tasks by status
   * 
   * @param {string} status - Task status
   * @returns {Array} Filtered task list
   */
  const getTasksByStatus = useCallback((status) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  /**
   * Filter tasks by priority
   * 
   * @param {string} priority - Task priority
   * @returns {Array} Filtered task list
   */
  const getTasksByPriority = useCallback((priority) => {
    return tasks.filter(task => task.priority === priority);
  }, [tasks]);

  /**
   * Search tasks
   * 
   * @param {string} query - Search keyword
   * @returns {Array} Search results
   */
  const searchTasks = useCallback((query) => {
    if (!query.trim()) {
      return tasks;
    }
    const lowerQuery = query.toLowerCase();
    return tasks.filter(
      task =>
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery)
    );
  }, [tasks]);

  /**
   * Get task statistics
   * 
   * @returns {Object} Statistics information
   */
  const getTaskStats = useCallback(() => {
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      highPriority: tasks.filter(t => t.priority === 'high').length,
      mediumPriority: tasks.filter(t => t.priority === 'medium').length,
      lowPriority: tasks.filter(t => t.priority === 'low').length
    };
  }, [tasks]);

  // Load tasks on initialization
  useEffect(() => {
    if (!initialized) {
      fetchTasks();
    }
  }, [initialized, fetchTasks]);

  // Context value
  const contextValue = {
    // State
    tasks,
    loading,
    error,
    initialized,

    // Operation methods
    fetchTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,

    // Query methods
    getTasksByStatus,
    getTasksByPriority,
    searchTasks,
    getTaskStats
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}
