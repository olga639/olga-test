import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Header - Top Navigation Component
 * 
 * Features:
 * - Display app logo and title
 * - Navigation menu (desktop and mobile)
 * - Responsive design
 * - Current route highlighting
 */
function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Navigation menu items
  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/tasks', label: 'Task List', icon: '📋' },
    { path: '/tasks/create', label: 'Create Task', icon: '➕' },
    { path: '/about', label: 'About', icon: 'ℹ️' }
  ];

  /**
   * Check if current route
   */
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  /**
   * Toggle mobile menu
   */
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  /**
   * Close mobile menu
   */
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <Link
            to="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            onClick={closeMobileMenu}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">T</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
              <p className="text-xs text-gray-500">Task Management System</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${
                    isActive(item.path)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 animate-fade-in">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`
                  block px-4 py-3 rounded-lg font-medium transition-all duration-200
                  ${
                    isActive(item.path)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
