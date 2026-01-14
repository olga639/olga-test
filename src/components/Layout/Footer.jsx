import React from 'react';

/**
 * Footer - 底部信息组件
 * 
 * 功能：
 * - 显示版权信息
 * - 显示项目信息
 * - 提供快速链接
 * - 显示技术栈信息
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 项目信息 */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">TaskFlow</h3>
            <p className="text-sm text-gray-400 mb-3">
              一个现代化的任务管理系统，帮助您高效管理日常任务和项目。
            </p>
            <p className="text-xs text-gray-500">
              🎯 混沌工程演练项目
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  首页
                </a>
              </li>
              <li>
                <a href="/tasks" className="hover:text-white transition-colors">
                  任务列表
                </a>
              </li>
              <li>
                <a href="/tasks/create" className="hover:text-white transition-colors">
                  创建任务
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  关于我们
                </a>
              </li>
            </ul>
          </div>

          {/* 技术栈 */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">技术栈</h3>
            <div className="flex flex-wrap gap-2">
              <span className="badge bg-blue-900 text-blue-200 text-xs">
                React 18
              </span>
              <span className="badge bg-purple-900 text-purple-200 text-xs">
                Vite 5
              </span>
              <span className="badge bg-cyan-900 text-cyan-200 text-xs">
                TailwindCSS
              </span>
              <span className="badge bg-green-900 text-green-200 text-xs">
                React Router
              </span>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>构建工具: Vite</p>
              <p>部署平台: Vercel</p>
              <p>版本控制: GitHub</p>
            </div>
          </div>
        </div>

        {/* 分隔线 */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>
              © {currentYear} TaskFlow. All rights reserved.
            </p>
            <p className="mt-2 md:mt-0">
              Made with ❤️ for Chaos Engineering
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

