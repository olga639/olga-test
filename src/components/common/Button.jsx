import React from 'react';

/**
 * Button - Button Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {'primary'|'secondary'|'danger'|'success'} props.variant - Button style variant
 * @param {'sm'|'md'|'lg'} props.size - Button size
 * @param {boolean} props.disabled - Whether disabled
 * @param {boolean} props.loading - Whether loading
 * @param {boolean} props.fullWidth - Whether full width
 * @param {Function} props.onClick - Click event
 * @param {string} props.className - Additional CSS class names
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
  ...rest
}) {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant styles
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 active:bg-primary-800',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 active:bg-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 active:bg-green-800'
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Full width styles
  const widthStyles = fullWidth ? 'w-full' : '';

  // Combine all styles
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;

  return (
    <button
      className={buttonStyles}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

export default Button;
