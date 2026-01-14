import React from 'react';
import Card from '../components/common/Card';

/**
 * AboutPage - 关于页面
 * 
 * 功能：
 * - 项目介绍
 * - 技术栈说明
 * - 混沌工程说明
 */
function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* 项目介绍 */}
      <Card>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-4">
            <span className="text-4xl text-white">T</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TaskFlow</h1>
          <p className="text-xl text-gray-600">现代化的任务管理系统</p>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">项目简介</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            TaskFlow 是一个功能完整的任务管理系统，专为混沌工程演练而设计。
            它提供了直观的用户界面和完善的任务管理功能，帮助用户高效地组织和跟踪日常任务。
          </p>
          <p className="text-gray-700 leading-relaxed">
            本项目不仅是一个实用的任务管理工具，更是一个用于演示和测试混沌工程实践的Demo应用。
            通过内置的故障注入系统，可以模拟各种真实的错误场景，用于故障分析平台的测试和演练。
          </p>
        </div>
      </Card>

      {/* 核心功能 */}
      <Card title="核心功能">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">📝</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">任务管理</h3>
              <p className="text-sm text-gray-600">
                创建、编辑、删除任务，支持状态跟踪和优先级设置
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🔍</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">搜索筛选</h3>
              <p className="text-sm text-gray-600">
                强大的搜索和筛选功能，快速找到需要的任务
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">统计分析</h3>
              <p className="text-sm text-gray-600">
                实时任务统计，直观了解工作进度和完成情况
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🏷️</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">标签分类</h3>
              <p className="text-sm text-gray-600">
                使用标签对任务进行分类，更好地组织工作内容
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 技术栈 */}
      <Card title="技术栈">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">前端框架</h3>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-info">React 18</span>
              <span className="badge badge-info">React Router v6</span>
              <span className="badge badge-info">Context API</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">构建工具</h3>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-success">Vite 5</span>
              <span className="badge badge-success">ES Modules</span>
              <span className="badge badge-success">HMR</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">样式方案</h3>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-warning">TailwindCSS 3</span>
              <span className="badge badge-warning">PostCSS</span>
              <span className="badge badge-warning">Autoprefixer</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">部署平台</h3>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-danger">Vercel</span>
              <span className="badge badge-danger">GitHub</span>
              <span className="badge badge-danger">Webhook</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 混沌工程 */}
      <Card title="混沌工程演练">
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            本项目内置了完整的混沌工程故障注入系统，支持通过CLI工具快速注入各种类型的错误代码：
          </p>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">支持的故障类型</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span><strong>构建错误：</strong>语法错误、导入路径错误、依赖缺失等</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span><strong>运行时错误：</strong>组件崩溃、无限循环、状态管理错误等</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                <span><strong>资源加载错误：</strong>静态资源404、代码分割失败等</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span><strong>性能问题：</strong>内存泄漏、渲染卡顿等</span>
              </li>
            </ul>
          </div>

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
                <h3 className="text-sm font-medium text-blue-800">使用说明</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    通过命令行工具 <code className="bg-blue-100 px-2 py-1 rounded">npm run chaos inject --type [故障类型]</code> 
                    即可注入指定类型的错误代码，用于测试故障分析平台的功能。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 版本信息 */}
      <Card>
        <div className="text-center text-sm text-gray-600">
          <p className="mb-2">版本: 2.0.0</p>
          <p className="mb-2">最后更新: 2026年1月14日</p>
          <p>© 2026 TaskFlow. All rights reserved.</p>
        </div>
      </Card>
    </div>
  );
}

export default AboutPage;

