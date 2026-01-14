/**
 * @fault-type: component-crash
 * @category: runtime-errors
 * @description: 访问undefined属性导致组件崩溃
 * @expected-error: Cannot read property 'title' of undefined
 * @target-file: src/components/features/TaskCard.jsx
 * @severity: high
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../common/Badge';
import Button from '../common/Button';

/**
 * TaskCard - 任务卡片组件
 * 
 * 🚨 故障注入：组件崩溃
 * 错误类型：访问undefined对象的属性
 * 预期结果：运行时错误，ErrorBoundary捕获
 */
function TaskCard({ task, onToggleStatus, onDelete }) {
  const navigate = useNavigate();

  // 🚨 故障注入：移除了默认值和安全检查
  // 原本：task = {}
  // 现在：task 可能为 undefined

  const priorityConfig = {
    high: { label: '高优先级', variant: 'danger', icon: '🔥' },
    medium: { label: '中优先级', variant: 'warning', icon: '⚡' },
    low: { label: '低优先级', variant: 'info', icon: '📌' }
  };

  const statusConfig = {
    pending: { label: '待处理', variant: 'default', icon: '⏳' },
    'in-progress': { label: '进行中', variant: 'info', icon: '🚀' },
    completed: { label: '已完成', variant: 'success', icon: '✅' }
  };

  // 🚨 错误：直接访问可能为undefined的task对象
  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const status = statusConfig[task.status] || statusConfig.pending;

  const handleCardClick = () => {
    navigate(`/tasks/${task.id}`);
  };

  const handleToggleStatus = (e) => {
    e.stopPropagation();
    onToggleStatus && onToggleStatus(task.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    // 🚨 错误：task可能为undefined
    if (window.confirm(`确定要删除任务"${task.title}"吗？`)) {
      onDelete && onDelete(task.id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '无截止日期';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isOverdue = () => {
    // 🚨 错误：task可能为undefined
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <div
      className="card hoverable cursor-pointer transition-all duration-200 hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {/* 🚨 错误：task可能为undefined，访问task.title会崩溃 */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {task.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {task.description}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant={priority.variant} size="sm">
          {priority.icon} {priority.label}
        </Badge>
        <Badge variant={status.variant} size="sm">
          {status.icon} {status.label}
        </Badge>
        {/* 🚨 错误：task.tags可能为undefined */}
        {task.tags && task.tags.map((tag, index) => (
          <Badge key={index} variant="default" size="sm">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center text-sm text-gray-500 mb-4">
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className={isOverdue() ? 'text-red-600 font-medium' : ''}>
          {formatDate(task.dueDate)}
          {isOverdue() && ' (已逾期)'}
        </span>
      </div>

      <div className="flex gap-2 pt-3 border-t border-gray-200">
        <Button
          variant={task.status === 'completed' ? 'secondary' : 'success'}
          size="sm"
          onClick={handleToggleStatus}
          className="flex-1"
        >
          {task.status === 'completed' ? '标记未完成' : '标记完成'}
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={handleDelete}
        >
          删除
        </Button>
      </div>
    </div>
  );
}

export default TaskCard;

