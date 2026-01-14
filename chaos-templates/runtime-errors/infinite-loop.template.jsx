/**
 * @fault-type: infinite-loop
 * @category: runtime-errors
 * @description: useEffect依赖配置错误导致无限渲染
 * @expected-error: Maximum update depth exceeded
 * @target-file: src/pages/TaskListPage.jsx
 * @severity: high
 */

import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskCard from '../components/features/TaskCard';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { Link } from 'react-router-dom';

/**
 * TaskListPage - 任务列表页面
 * 
 * 🚨 故障注入：无限循环
 * 错误类型：useEffect依赖配置错误
 * 预期结果：页面卡死，控制台报错 "Maximum update depth exceeded"
 */
function TaskListPage() {
  const {
    tasks,
    loading,
    error,
    toggleTaskStatus,
    deleteTask,
    searchTasks
  } = useTaskContext();

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [filteredTasks, setFilteredTasks] = useState([]);

  // 🚨 故障注入：无限循环
  // 错误：在useEffect中更新state，但state又在依赖数组中
  // 这会导致无限循环：state更新 → useEffect触发 → state更新 → ...
  useEffect(() => {
    let filtered = searchQuery ? searchTasks(searchQuery) : tasks;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

    // 🚨 错误：更新state，但filteredTasks在依赖数组中
    setFilteredTasks(filtered);
  }, [tasks, searchQuery, filterStatus, filterPriority, sortBy, searchTasks, filteredTasks]);
  // ⬆️ 问题：filteredTasks在依赖数组中，导致无限循环

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading && tasks.length === 0) {
    return <Loading fullScreen text="加载任务列表..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-xl mb-4">❌ {error}</div>
        <Button onClick={() => window.location.reload()}>重新加载</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">任务列表</h1>
          <p className="text-gray-600 mt-1">
            共 {filteredTasks.length} 个任务
            {searchQuery && ` (搜索: "${searchQuery}")`}
          </p>
        </div>
        <Link to="/tasks/create">
          <Button variant="primary" size="lg">
            ➕ 创建新任务
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              搜索任务
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="搜索标题、描述或标签..."
                value={searchQuery}
                onChange={handleSearch}
                className="input pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              状态
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="all">全部状态</option>
              <option value="pending">待处理</option>
              <option value="in-progress">进行中</option>
              <option value="completed">已完成</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              优先级
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="input"
            >
              <option value="all">全部优先级</option>
              <option value="high">高优先级</option>
              <option value="medium">中优先级</option>
              <option value="low">低优先级</option>
            </select>
          </div>
        </div>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStatus={toggleTaskStatus}
              onDelete={deleteTask}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            没有找到任务
          </h3>
        </div>
      )}
    </div>
  );
}

export default TaskListPage;

