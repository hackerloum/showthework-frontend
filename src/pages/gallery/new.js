import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const NewWork = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    // Filter files by type and size
    const validFiles = newFiles.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('title', e.target.title.value);
      formData.append('description', e.target.description.value);
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/.netlify/functions/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload work');
      }

      setSuccess({
        message: data.message,
        accessCode: data.work.accessCode,
      });

      // Clear form
      e.target.reset();
      setFiles([]);

      // Redirect to gallery after 5 seconds
      setTimeout(() => {
        router.push('/gallery');
      }, 5000);
    } catch (error) {
      console.error('Error uploading work:', error);
      setError(error.message || 'Failed to upload work. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          <div className="mb-8">
            <button
              onClick={() => router.push('/gallery')}
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Gallery
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="p-6">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Add New Work</h1>
              
              {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                  <p className="text-sm text-green-600 dark:text-green-400">{success.message}</p>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Access Code:</p>
                    <p className="mt-1 text-lg font-mono font-bold text-gray-900 dark:text-white">{success.accessCode}</p>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Save this code! You'll need it to share your work. Redirecting to gallery in 5 seconds...
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    placeholder="Enter work title"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    placeholder="Describe your work"
                  />
                </div>

                <div>
                  <label htmlFor="files" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Upload Files
                  </label>
                  <div
                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                      dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'
                    } border-dashed rounded-md relative`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.pdf"
                    />
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload files</span>
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, PDF up to 10MB each
                      </p>
                    </div>
                  </div>

                  {/* File List */}
                  {files.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {files.map((file, index) => (
                        <li key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Creating...
                      </>
                    ) : (
                      'Create Work'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewWork; 
