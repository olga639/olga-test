import React from 'react';
import Header from './Header';
import Footer from './Footer';

/**
 * Layout - Layout Component
 * 
 * Features:
 * - Provide unified page layout structure
 * - Include Header and Footer
 * - Main content area with adaptive height
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content
 */
function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Layout;
