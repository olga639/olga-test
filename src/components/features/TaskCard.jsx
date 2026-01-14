import React from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../common/Badge';
import Button from '../common/Button';

/**
 * TaskCard - 任务卡片组件
 * 
 * 功能：
 * - 展示任务基本信息
 * - 支持快速操作（完成、删除）
 * - 点击跳转到详情页
 * - 优先级和状态标识
 * 
 * @param {Object} props
 * @param {Object} props.task - 任务对象
 * @param {Function} props.onToggleStatus - 切换状态回调
 * @param {Function} props.onDelete - 删除回调
 */
function TaskCard({ task = {}, onToggleStatus, onDelete }) {
  const navigate = useNavigate();

  // 优先级配置
  const priorityConfig = {
    high: { label: '高优先级', variant: 'danger', icon: '🔥' },
    medium: { label: '中优先级', variant: 'warning', icon: '⚡' },
    low: { label: '低优先级', variant: 'info', icon: '📌' }
  };

  // 状态配置
  const statusConfig = {
    pending: { label: '待处理', variant: 'default', icon: '⏳' },
    'in-progress': { label: '进行中', variant: 'info', icon: '🚀' },
    completed: { label: '已完成', variant: 'success', icon: '✅' }
  };

  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const status = statusConfig[task.status] || statusConfig.pending;

  /**
   * 处理卡片点击
   */
  const handleCardClick = () => {
    navigate(`/tasks/${task.id}`);
  };

  /**
   * 处理切换状态
   */
  const handleToggleStatus = (e) => {
    e.stopPropagation();
    onToggleStatus && onToggleStatus(task.id);
  };

  /**
   * 处理删除
   */
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`确定要删除任务"${task.title}"吗？`)) {
      onDelete && onDelete(task.id);
    }
  };

  /**
   * 格式化日期
   */
  const formatDate = (dateString) => {
    if (!dateString) return '无截止日期';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * 判断是否逾期
   */
  const isOverdue = () => {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <div
      className="card hoverable cursor-pointer transition-all duration-200 hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      {/* 卡片头部 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {task.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {task.description}
          </p>
        </div>
      </div>

      {/* 标签和徽章 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant={priority.variant} size="sm">
          {priority.icon} {priority.label}
        </Badge>
        <Badge variant={status.variant} size="sm">
          {status.icon} {status.label}
        </Badge>
        {task.tags && task.tags.map((tag, index) => (
          <Badge key={index} variant="default" size="sm">
            {tag}
          </Badge>
        ))}
      </div>

      {/* 截止日期 */}
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

      {/* 操作按钮 */}
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

