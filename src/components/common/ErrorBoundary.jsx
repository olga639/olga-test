import React from 'react';

/**
 * ErrorBoundary - 错误边界组件
 * 
 * 功能：
 * - 捕获子组件树中的JavaScript错误
 * - 记录错误信息到控制台
 * - 显示友好的错误UI
 * - 提供错误恢复选项
 * 
 * 使用场景：
 * - 防止整个应用崩溃
 * - 在生产环境提供更好的用户体验
 * - 混沌工程中用于捕获注入的错误
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  /**
   * 当子组件抛出错误时调用
   * 更新state以显示错误UI
   */
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  /**
   * 捕获错误详细信息
   * 记录错误日志
   */
  componentDidCatch(error, errorInfo) {
    // 记录错误到控制台
    console.error('🚨 ErrorBoundary 捕获到错误:', error);
    console.error('📍 错误位置:', errorInfo.componentStack);

    // 更新状态
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // 在生产环境可以将错误发送到错误追踪服务
    // 例如: Sentry, LogRocket等
    if (process.env.NODE_ENV === 'production') {
      // sendErrorToService(error, errorInfo);
    }
  }

  /**
   * 重置错误状态
   * 尝试恢复应用
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  /**
   * 刷新页面
   * 完全重置应用状态
   */
  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
            {/* 错误图标 */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* 错误标题 */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
              哎呀！出错了
            </h1>

            {/* 错误描述 */}
            <p className="text-gray-600 text-center mb-6">
              应用遇到了一个意外错误。这可能是由于代码问题或网络问题导致的。
            </p>

            {/* 错误详情（开发环境） */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-red-800 mb-2">
                  错误详情（仅开发环境可见）:
                </h3>
                <pre className="text-xs text-red-700 overflow-x-auto whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <details className="mt-3">
                    <summary className="text-sm text-red-800 cursor-pointer hover:text-red-900">
                      查看组件堆栈
                    </summary>
                    <pre className="mt-2 text-xs text-red-600 overflow-x-auto whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* 错误统计 */}
            {this.state.errorCount > 1 && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  ⚠️ 此错误已发生 <strong>{this.state.errorCount}</strong> 次
                </p>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="btn btn-primary px-6 py-3"
              >
                尝试恢复
              </button>
              <button
                onClick={this.handleReload}
                className="btn btn-secondary px-6 py-3"
              >
                刷新页面
              </button>
              <button
                onClick={() => window.history.back()}
                className="btn btn-secondary px-6 py-3"
              >
                返回上一页
              </button>
            </div>

            {/* 帮助信息 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                如果问题持续存在，请联系技术支持或
                <a href="/" className="text-primary-600 hover:text-primary-700 ml-1">
                  返回首页
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

