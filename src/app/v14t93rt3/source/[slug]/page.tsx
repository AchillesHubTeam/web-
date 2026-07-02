'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function SourcePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [code, setCode] = useState('');
  const [encryptedUrl, setEncryptedUrl] = useState('');
  const [showResult, setShowResult] = useState(false);

  // Encrypt function that converts code to _bsdata format
  const encryptToBsData = (input: string): string => {
    // Add the comment and prefix
    const data = `--dont use this\n${input}`;
    
    // Convert to base64
    const base64 = btoa(unescape(encodeURIComponent(data)));
    
    // Create the _bsdata parameter with 'v' prefix
    const bsData = `v${base64}`;
    
    // Generate random ID for /raw/ endpoint (9 chars)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
    for (let i = 0; i < 9; i++) {
      randomId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Build the URL with _bsdata parameter
    const url = `/raw/${randomId}?_bsdata=${encodeURIComponent(bsData)}`;
    
    return url;
  };

  const handleEncrypt = () => {
    if (!code.trim()) return;
    
    const url = encryptToBsData(code);
    setEncryptedUrl(url);
    setShowResult(true);
  };

  const copyToClipboard = () => {
    const fullUrl = window.location.origin + encryptedUrl;
    navigator.clipboard.writeText(fullUrl);
    alert('Da copy URL: ' + fullUrl);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Ma hoa Code</h1>
        <p className="text-gray-400 mb-8">Slug: {slug}</p>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Nhap Code can ma hoa</h2>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste code vao day..."
            className="w-full h-40 bg-gray-700 text-white p-4 rounded border border-gray-600 focus:border-blue-500 focus:outline-none mb-4 font-mono text-sm"
          />
          <button
            onClick={handleEncrypt}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
          >
            Ma hoa and Tao URL
          </button>
        </div>

        {showResult && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Ket qua</h2>
            <div className="bg-gray-900 p-4 rounded mb-4">
              <p className="text-sm text-gray-400 mb-2">URL da ma hoa:</p>
              <code className="text-green-400 break-all">{encryptedUrl}</code>
            </div>
            <button
              onClick={copyToClipboard}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition"
            >
              Copy URL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
