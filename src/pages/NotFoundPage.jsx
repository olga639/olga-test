import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

/**
 * NotFoundPage - 404 Page
 * 
 * Features:
 * - Display friendly 404 error message
 * - Provide link to return to home
 */
function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center animate-fade-in">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-200">404</div>
          <div className="text-6xl -mt-8">🔍</div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, the page you are looking for does not exist or has been removed.
          Please check the URL or return to the home page.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary" size="lg">
              Back to Home
            </Button>
          </Link>
          <Link to="/tasks">
            <Button variant="secondary" size="lg">
              View Task List
            </Button>
          </Link>
        </div>

        {/* Help Link */}
        <div className="mt-12 text-sm text-gray-500">
          <p>Need help?</p>
          <Link to="/about" className="text-primary-600 hover:text-primary-700">
            Learn more about TaskFlow
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
