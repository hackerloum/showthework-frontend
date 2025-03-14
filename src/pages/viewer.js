import React, { useState } from 'react';
import Layout from '../components/Layout';

const Viewer = () => {
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement access code verification
    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">View Work</h2>
          <p className="mt-2 text-gray-600">Enter your access code to view the work</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700">
              Access Code
            </label>
            <input
              type="text"
              id="accessCode"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your access code"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Verifying...' : 'View Work'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need an access code? Contact the administrator.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Viewer; 
