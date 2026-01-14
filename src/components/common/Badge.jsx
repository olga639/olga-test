import React from 'react';

/**
 * Badge - 徽章组件
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - 徽章内容
 * @param {'success'|'warning'|'danger'|'info'|'default'} props.variant - 徽章样式
 * @param {'sm'|'md'|'lg'} props.size - 徽章大小
 * @param {string} props.className - 额外的CSS类名
 */
function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) {
  // 基础样式
  const baseStyles = 'inline-flex items-center rounded-full font-medium';

  // 变体样式
  const variantStyles = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800'
  };

  // 尺寸样式
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const badgeStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return <span className={badgeStyles}>{children}</span>;
}

export default Badge;

