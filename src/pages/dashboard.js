import React from 'react';
import Layout from '../components/Layout';

const Dashboard = () => {
  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
          <button
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm md:text-base"
            onClick={() => {/* TODO: Add new work */}}
          >
            Add New Work
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Views</h3>
                <p className="text-lg md:text-2xl font-semibold text-gray-900 dark:text-white">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Codes</h3>
                <p className="text-lg md:text-2xl font-semibold text-gray-900 dark:text-white">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Works</h3>
                <p className="text-lg md:text-2xl font-semibold text-gray-900 dark:text-white">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</h3>
                <p className="text-lg md:text-2xl font-semibold text-gray-900 dark:text-white">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4 md:p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center mb-2 sm:mb-0">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="ml-3 md:ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">New work added</p>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">A new work was uploaded to the gallery</p>
                  </div>
                </div>
                <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Just now</span>
              </div>

              {/* Example of another activity item */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center mb-2 sm:mb-0">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="ml-3 md:ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">New view recorded</p>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Someone viewed your latest work</p>
                  </div>
                </div>
                <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">5 minutes ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 
