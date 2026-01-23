import React from 'react';

/**
 * Badge - Badge Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Badge content
 * @param {'success'|'warning'|'danger'|'info'|'default'} props.variant - Badge style
 * @param {'sm'|'md'|'lg'} props.size - Badge size
 * @param {string} props.className - Additional CSS class names
 */
function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) {
  // Base styles
  const baseStyles = 'inline-flex items-center rounded-full font-medium';

  // Variant styles
  const variantStyles = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800'
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const badgeStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return <span className={badgeStyles}>{children}</span>;
}

export default Badge;
