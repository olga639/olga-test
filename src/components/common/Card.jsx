import React from 'react';

/**
 * Card - 卡片组件
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - 卡片内容
 * @param {string} props.title - 卡片标题
 * @param {React.ReactNode} props.extra - 标题右侧额外内容
 * @param {boolean} props.hoverable - 是否启用悬停效果
 * @param {Function} props.onClick - 点击事件
 * @param {string} props.className - 额外的CSS类名
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
      {/* 卡片头部 */}
      {(title || extra) && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {extra && <div className="flex items-center">{extra}</div>}
        </div>
      )}

      {/* 卡片内容 */}
      <div className="p-6">{children}</div>
    </div>
  );
}

export default Card;

