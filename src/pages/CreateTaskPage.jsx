import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

/**
 * CreateTaskPage - 创建任务页面
 * 
 * 功能：
 * - 创建新任务
 * - 表单验证
 * - 标签管理
 */
function CreateTaskPage() {
  const navigate = useNavigate();
  const { createTask } = useTaskContext();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * 处理表单输入
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * 添加标签
   */
  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  /**
   * 删除标签
   */
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  /**
   * 表单验证
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '请输入任务标题';
    } else if (formData.title.length < 3) {
      newErrors.title = '标题至少需要3个字符';
    }

    if (!formData.description.trim()) {
      newErrors.description = '请输入任务描述';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 提交表单
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const newTask = await createTask(formData);
      navigate(`/tasks/${newTask.id}`);
    } catch (err) {
      alert('创建任务失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* 返回按钮 */}
      <div>
        <Link to="/tasks">
          <Button variant="secondary" size="sm">
            ← 返回列表
          </Button>
        </Link>
      </div>

      {/* 表单卡片 */}
      <Card title="创建新任务">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 任务标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              任务标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`input ${errors.title ? 'border-red-500' : ''}`}
              placeholder="输入任务标题..."
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* 任务描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              任务描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`input min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
              placeholder="详细描述任务内容..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* 状态和优先级 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 状态 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input"
              >
                <option value="pending">⏳ 待处理</option>
                <option value="in-progress">🚀 进行中</option>
                <option value="completed">✅ 已完成</option>
              </select>
            </div>

            {/* 优先级 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                优先级
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="input"
              >
                <option value="high">🔥 高优先级</option>
                <option value="medium">⚡ 中优先级</option>
                <option value="low">📌 低优先级</option>
              </select>
            </div>
          </div>

          {/* 截止日期 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              截止日期
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="input"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* 标签 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标签
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                className="input flex-1"
                placeholder="输入标签后按回车..."
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddTag}
              >
                添加
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
              className="flex-1"
            >
              {loading ? '创建中...' : '✅ 创建任务'}
            </Button>
            <Link to="/tasks" className="flex-1">
              <Button
                type="button"
                variant="secondary"
                fullWidth
                disabled={loading}
              >
                取消
              </Button>
            </Link>
          </div>
        </form>
      </Card>

      {/* 提示信息 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">提示</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>标题和描述是必填项</li>
                <li>可以添加多个标签来分类任务</li>
                <li>设置截止日期有助于更好地管理时间</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTaskPage;

