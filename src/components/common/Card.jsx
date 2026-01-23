import React from 'react';

/**
 * Card - Card Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.extra - Extra content on the right side of title
 * @param {boolean} props.hoverable - Whether to enable hover effect
 * @param {Function} props.onClick - Click event
 * @param {string} props.className - Additional CSS class names
 */
function Card({
  children,
  title,
  extra,
  hoverable = false,
  onClick,
  className = '',
  ...rest
}) {
  const baseStyles = 'bg-white rounded-lg shadow-md transition-shadow duration-200';
  const hoverStyles = hoverable ? 'hover:shadow-lg cursor-pointer' : '';
  const cardStyles = `${baseStyles} ${hoverStyles} ${className}`;

  return (
    <div className={cardStyles} onClick={onClick} {...rest}>
      {/* Card Header */}
      {(title || extra) && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {extra && <div className="flex items-center">{extra}</div>}
        </div>
      )}

      {/* Card Content */}
      <div className="p-6">{children}</div>
    </div>
  );
}

export default Card;
