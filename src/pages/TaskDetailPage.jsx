import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Loading from '../components/common/Loading';
import Card from '../components/common/Card';

/**
 * TaskDetailPage - 任务详情页面
 * 
 * 功能：
 * - 显示任务完整信息
 * - 编辑任务
 * - 删除任务
 * - 切换状态
 */
function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTaskById, updateTask, deleteTask, toggleTaskStatus } = useTaskContext();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // 加载任务详情
  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTaskById(id);
      setTask(data);
      setFormData(data);
    } catch (err) {
      setError(err.message || '加载任务失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理表单输入
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * 保存编辑
   */
  const handleSave = async () => {
    try {
      const updated = await updateTask(id, formData);
      setTask(updated);
      setEditing(false);
    } catch (err) {
      alert('保存失败: ' + err.message);
    }
  };

  /**
   * 取消编辑
   */
  const handleCancel = () => {
    setFormData(task);
    setEditing(false);
  };

  /**
   * 删除任务
   */
  const handleDelete = async () => {
    if (window.confirm(`确定要删除任务"${task.title}"吗？`)) {
      try {
        await deleteTask(id);
        navigate('/tasks');
      } catch (err) {
        alert('删除失败: ' + err.message);
      }
    }
  };

  /**
   * 切换状态
   */
  const handleToggleStatus = async () => {
    try {
      const updated = await toggleTaskStatus(id);
      setTask(updated);
    } catch (err) {
      alert('更新状态失败: ' + err.message);
    }
  };

  if (loading) {
    return <Loading fullScreen text="加载任务详情..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">任务不存在</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link to="/tasks">
          <Button variant="primary">返回任务列表</Button>
        </Link>
      </div>
    );
  }

  if (!task) return null;

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

  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* 返回按钮 */}
      <div>
        <Link to="/tasks">
          <Button variant="secondary" size="sm">
            ← 返回列表
          </Button>
        </Link>
      </div>

      {/* 任务详情卡片 */}
      <Card>
        {/* 头部 */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            {editing ? (
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input text-2xl font-bold mb-2"
                placeholder="任务标题"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {task.title}
              </h1>
            )}
            <div className="flex flex-wrap gap-2">
              <Badge variant={priority.variant}>
                {priority.icon} {priority.label}
              </Badge>
              <Badge variant={status.variant}>
                {status.icon} {status.label}
              </Badge>
            </div>
          </div>
        </div>

        {/* 描述 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">描述</h3>
          {editing ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input min-h-[120px]"
              placeholder="任务描述"
            />
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">
              {task.description || '暂无描述'}
            </p>
          )}
        </div>

        {/* 详细信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 状态 */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">状态</h4>
            {editing ? (
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input"
              >
                <option value="pending">待处理</option>
                <option value="in-progress">进行中</option>
                <option value="completed">已完成</option>
              </select>
            ) : (
              <p className="text-gray-900">{status.label}</p>
            )}
          </div>

          {/* 优先级 */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">优先级</h4>
            {editing ? (
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="input"
              >
                <option value="high">高优先级</option>
                <option value="medium">中优先级</option>
                <option value="low">低优先级</option>
              </select>
            ) : (
              <p className="text-gray-900">{priority.label}</p>
            )}
          </div>

          {/* 截止日期 */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">截止日期</h4>
            {editing ? (
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate || ''}
                onChange={handleInputChange}
                className="input"
              />
            ) : (
              <p className="text-gray-900">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString('zh-CN')
                  : '无截止日期'}
              </p>
            )}
          </div>

          {/* 创建时间 */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">创建时间</h4>
            <p className="text-gray-900">
              {new Date(task.createdAt).toLocaleString('zh-CN')}
            </p>
          </div>
        </div>

        {/* 标签 */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">标签</h4>
          <div className="flex flex-wrap gap-2">
            {task.tags && task.tags.length > 0 ? (
              task.tags.map((tag, index) => (
                <Badge key={index} variant="default">
                  {tag}
                </Badge>
              ))
            ) : (
              <p className="text-gray-400">暂无标签</p>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
          {editing ? (
            <>
              <Button variant="primary" onClick={handleSave}>
                💾 保存
              </Button>
              <Button variant="secondary" onClick={handleCancel}>
                取消
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" onClick={() => setEditing(true)}>
                ✏️ 编辑
              </Button>
              <Button
                variant={task.status === 'completed' ? 'secondary' : 'success'}
                onClick={handleToggleStatus}
              >
                {task.status === 'completed' ? '标记未完成' : '标记完成'}
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                🗑️ 删除
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

export default TaskDetailPage;

