import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockApi } from '../utils/mockApi';

/**
 * TaskContext - 任务状态管理上下文
 * 
 * 提供全局的任务状态管理，包括：
 * - 任务列表
 * - CRUD操作
 * - 加载状态
 * - 错误处理
 */
const TaskContext = createContext(null);

/**
 * useTaskContext - 使用任务上下文的Hook
 * 
 * @returns {Object} 任务上下文对象
 * @throws {Error} 如果在TaskProvider外部使用会抛出错误
 */
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
}

/**
 * TaskProvider - 任务状态提供者组件
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - 子组件
 */
export function TaskProvider({ children }) {
  // 状态管理
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  /**
   * 获取所有任务
   */
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mockApi.getTasks();
      setTasks(data);
      setInitialized(true);
    } catch (err) {
      setError(err.message || '获取任务失败');
      console.error('获取任务失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 根据ID获取单个任务
   * 
   * @param {string} id - 任务ID
   * @returns {Promise<Object>} 任务对象
   */
  const getTaskById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const task = await mockApi.getTaskById(id);
      return task;
    } catch (err) {
      setError(err.message || '获取任务详情失败');
      console.error('获取任务详情失败:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 创建新任务
   * 
   * @param {Object} taskData - 任务数据
   * @returns {Promise<Object>} 创建的任务对象
   */
  const createTask = useCallback(async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      const newTask = await mockApi.createTask(taskData);
      setTasks(prevTasks => [newTask, ...prevTasks]);
      return newTask;
    } catch (err) {
      setError(err.message || '创建任务失败');
      console.error('创建任务失败:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 更新任务
   * 
   * @param {string} id - 任务ID
   * @param {Object} updates - 更新的数据
   * @returns {Promise<Object>} 更新后的任务对象
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
      setError(err.message || '更新任务失败');
      console.error('更新任务失败:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 删除任务
   * 
   * @param {string} id - 任务ID
   * @returns {Promise<void>}
   */
  const deleteTask = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await mockApi.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (err) {
      setError(err.message || '删除任务失败');
      console.error('删除任务失败:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 切换任务完成状态
   * 
   * @param {string} id - 任务ID
   * @returns {Promise<Object>} 更新后的任务对象
   */
  const toggleTaskStatus = useCallback(async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('任务不存在');
    }
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    return updateTask(id, { status: newStatus });
  }, [tasks, updateTask]);

  /**
   * 按状态筛选任务
   * 
   * @param {string} status - 任务状态
   * @returns {Array} 筛选后的任务列表
   */
  const getTasksByStatus = useCallback((status) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  /**
   * 按优先级筛选任务
   * 
   * @param {string} priority - 任务优先级
   * @returns {Array} 筛选后的任务列表
   */
  const getTasksByPriority = useCallback((priority) => {
    return tasks.filter(task => task.priority === priority);
  }, [tasks]);

  /**
   * 搜索任务
   * 
   * @param {string} query - 搜索关键词
   * @returns {Array} 搜索结果
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
   * 获取任务统计信息
   * 
   * @returns {Object} 统计信息
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

  // 初始化时加载任务
  useEffect(() => {
    if (!initialized) {
      fetchTasks();
    }
  }, [initialized, fetchTasks]);

  // 上下文值
  const contextValue = {
    // 状态
    tasks,
    loading,
    error,
    initialized,

    // 操作方法
    fetchTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,

    // 查询方法
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

