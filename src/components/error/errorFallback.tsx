import React from 'react';
import { FallbackProps } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="flex justify-center items-center h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Something went wrong:</strong>
        <span className="block sm:inline">{error.message}</span>
        <button onClick={resetErrorBoundary} className="ml-4 bg-blue-500 text-white px-4 py-2 rounded">
          Try again
        </button>
      </div>
    </div>
  );
}

export default ErrorFallback;