import React from 'react';
import Header from './Header';
import Footer from './Footer';

/**
 * Layout - 布局组件
 * 
 * 功能：
 * - 提供统一的页面布局结构
 * - 包含Header和Footer
 * - 主内容区域自适应高度
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - 页面内容
 */
function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航 */}
      <Header />

      {/* 主内容区域 */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>

      {/* 底部信息 */}
      <Footer />
    </div>
  );
}

export default Layout;

