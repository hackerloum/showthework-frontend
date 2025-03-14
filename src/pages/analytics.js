import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

const Analytics = () => {
  const router = useRouter();

  return (
    <Layout>
      <div className="bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Analytics</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Track and analyze your work performance
              </p>
            </div>
            <div className="w-full sm:w-auto flex space-x-3">
              <select className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last year</option>
              </select>
            </div>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 gap-6">
            {/* Empty State */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="flex flex-col items-center justify-center p-12">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No analytics data</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
                  Share your work with clients to start tracking views and engagement.
                </p>
                <button
                  onClick={() => router.push('/gallery/new')}
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add First Work
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics; 
