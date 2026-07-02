'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

export default function RawPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const [decodedCode, setDecodedCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Get _bsdata from URL query params
    const bsData = searchParams.get('_bsdata');
    
    if (bsData && bsData.startsWith('v')) {
      try {
        // Remove 'v Congressional prefix and decode
        const base64 = bsData.substring(1);
        const decoded = decodeURIComponent(escape(atob(base64)));
        setDecodedCode(decoded);
      } catch (err) {
        setError('Invalid _bsdata parameter');
      }
    } else {
      // If no _bsdata, show default message
      setDecodedCode(`--dont use this\n// Raw code endpoint: ${id}\n// No code data provided`);
    }
  }, [searchParams, id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(decodedCode);
    alert('Da copy code!');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Raw Code</h1>
        <p className="text-gray-400 mb-4">ID: {id}</p>
        
        {error ? (
          <div className="bg-red-900 p-4 rounded text-red-200">{error}</div>
        ) : (
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Code Content</h2>
              <button
                onClick={copyToClipboard}
                className="bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-3 rounded transition"
              >
                Copy Code
              </button>
            </div>
            <pre className="bg-gray-900 p-4 rounded overflow-x-auto font-mono text-sm">
              {decodedCode}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
