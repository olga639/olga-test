import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

/**
 * NotFoundPage - 404页面
 * 
 * 功能：
 * - 显示友好的404错误信息
 * - 提供返回首页的链接
 */
function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center animate-fade-in">
        {/* 404图标 */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-200">404</div>
          <div className="text-6xl -mt-8">🔍</div>
        </div>

        {/* 错误信息 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          页面未找到
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          抱歉，您访问的页面不存在或已被移除。
          请检查URL是否正确，或返回首页继续浏览。
        </p>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary" size="lg">
              🏠 返回首页
            </Button>
          </Link>
          <Link to="/tasks">
            <Button variant="secondary" size="lg">
              📋 查看任务列表
            </Button>
          </Link>
        </div>

        {/* 帮助链接 */}
        <div className="mt-12 text-sm text-gray-500">
          <p>需要帮助？</p>
          <Link to="/about" className="text-primary-600 hover:text-primary-700">
            了解更多关于 TaskFlow
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;

