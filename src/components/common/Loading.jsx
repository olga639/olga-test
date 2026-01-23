import React from 'react';

/**
 * Loading - Loading Indicator Component
 * 
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} props.size - Loader size
 * @param {string} props.text - Loading text
 * @param {boolean} props.fullScreen - Whether to display fullscreen
 * @param {string} props.className - Additional CSS class names
 */
function Loading({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
  className = ''
}) {
  // Size mapping
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const spinnerSize = sizeMap[size];

  // Loader component
  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${spinnerSize} border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin`}
      />
      {text && (
        <p className="mt-4 text-gray-600 font-medium animate-pulse">{text}</p>
      )}
    </div>
  );

  // Fullscreen mode
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  // Normal mode
  return <div className={`flex items-center justify-center p-8 ${className}`}>{spinner}</div>;
}

/**
 * LoadingOverlay - Loading Overlay Component
 * Used to display loading state above content
 */
export function LoadingOverlay({ loading, children }) {
  return (
    <div className="relative">
      {children}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <Loading size="md" />
        </div>
      )}
    </div>
  );
}

/**
 * LoadingSkeleton - Skeleton Screen Component
 * Used to display content loading placeholders
 */
export function LoadingSkeleton({ rows = 3, className = '' }) {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default Loading;
