import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

const Home = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Welcome to Show The Work
        </h1>
        <p className="text-xl text-gray-600">
          A secure platform for sharing and viewing work with controlled access
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Link href="/viewer">
            <a className="block p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">View Work</h2>
              <p className="text-gray-600 mb-4">
                Have an access code? Enter it here to view the work.
              </p>
              <span className="inline-flex items-center text-blue-600 hover:text-blue-700">
                Enter Access Code →
              </span>
            </a>
          </Link>

          <Link href="/dashboard">
            <a className="block p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
              <p className="text-gray-600 mb-4">
                Admin access to manage works and access codes.
              </p>
              <span className="inline-flex items-center text-blue-600 hover:text-blue-700">
                Go to Dashboard →
              </span>
            </a>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Home; 
