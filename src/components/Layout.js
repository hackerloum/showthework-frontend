import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <nav className="w-64 bg-white dark:bg-gray-800 shadow-lg fixed h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Show The Work</h1>
        </div>
        
        <ul className="mt-4 space-y-2">
          <li>
            <Link href="/dashboard">
              <a className={`flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                isActive('/dashboard') ? 'bg-blue-50 dark:bg-gray-700' : ''
              }`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </a>
            </Link>
          </li>
          <li>
            <Link href="/gallery">
              <a className={`flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                isActive('/gallery') ? 'bg-blue-50 dark:bg-gray-700' : ''
              }`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Gallery
              </a>
            </Link>
          </li>
          <li>
            <Link href="/access-codes">
              <a className={`flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                isActive('/access-codes') ? 'bg-blue-50 dark:bg-gray-700' : ''
              }`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Access Codes
              </a>
            </Link>
          </li>
          <li>
            <Link href="/clients">
              <a className={`flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                isActive('/clients') ? 'bg-blue-50 dark:bg-gray-700' : ''
              }`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Clients
              </a>
            </Link>
          </li>
          <li>
            <Link href="/analytics">
              <a className={`flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                isActive('/analytics') ? 'bg-blue-50 dark:bg-gray-700' : ''
              }`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </a>
            </Link>
          </li>
        </ul>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Navigation */}
        <header className="bg-white dark:bg-gray-800 shadow-sm h-16 fixed w-full z-10">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative">
                <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <img src="/profile-placeholder.jpg" alt="Profile" className="w-8 h-8 rounded-full" />
                <span className="text-gray-700 dark:text-gray-300">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="pt-16 p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 
