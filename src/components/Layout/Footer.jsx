import React from 'react';

/**
 * Footer - Footer Component
 * 
 * Features:
 * - Display copyright information
 * - Display project information
 * - Provide quick links
 * - Display tech stack information
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project Information */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">TaskFlow</h3>
            <p className="text-sm text-gray-400 mb-3">
              A modern task management system to help you efficiently manage your daily tasks and projects.
            </p>
            <p className="text-xs text-gray-500">
              Chaos Engineering Exercise Project
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/tasks" className="hover:text-white transition-colors">
                  Task List
                </a>
              </li>
              <li>
                <a href="/tasks/create" className="hover:text-white transition-colors">
                  Create Task
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              <span className="badge bg-blue-900 text-blue-200 text-xs">
                React 18
              </span>
              <span className="badge bg-purple-900 text-purple-200 text-xs">
                Vite 5
              </span>
              <span className="badge bg-cyan-900 text-cyan-200 text-xs">
                TailwindCSS
              </span>
              <span className="badge bg-green-900 text-green-200 text-xs">
                React Router
              </span>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>Build Tool: Vite</p>
              <p>Deployment: Vercel</p>
              <p>Version Control: GitHub</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>
              © {currentYear} TaskFlow. All rights reserved.
            </p>
            <p className="mt-2 md:mt-0">
              Made with ❤️ for Chaos Engineering
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
