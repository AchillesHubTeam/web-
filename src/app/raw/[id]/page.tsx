'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

export default function RawPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const [displayContent, setDisplayContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Get _bsdata from URL query params
    const bsData = searchParams.get('_bsdata');

    if (bsData && bsData.startsWith('v')) {
      try {
        // Remove 'v' prefix and decode base64
        const base64 = bsData.substring(1);
        const decoded = decodeURIComponent(escape(atob(base64)));
        setDisplayContent(decoded);
      } catch (err) {
        setError('Invalid _bsdata parameter');
      }
    } else {
      // Khong co _bsdata: hien thi loadstring de fetch code tu URL nay
      const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
      const loadstringCode = `loadstring(game:HttpGet("${currentUrl}"))()`;
      setDisplayContent(loadstringCode);
    }
  }, [searchParams, id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(displayContent);
    alert('Da copy code!');
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {error ? (
          <div className="bg-red-900 p-4 rounded text-red-200">{error}</div>
        ) : (
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold">Raw Code</h1>
              <button
                onClick={copyToClipboard}
                className="bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-3 rounded transition"
              >
                Copy Code
              </button>
            </div>
            <pre className="bg-black p-4 rounded overflow-x-auto font-mono text-sm text-green-400">
              {displayContent}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
