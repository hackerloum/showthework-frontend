import React from 'react';
import Layout from '../components/Layout';

const Dashboard = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => {/* TODO: Add new work */}}
          >
            Add New Work
          </button>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Uploads</h3>
          <div className="space-y-4">
            {/* TODO: Add list of recent works */}
            <p className="text-gray-500">No works uploaded yet.</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Total Views</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Active Access Codes</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Total Works</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 
