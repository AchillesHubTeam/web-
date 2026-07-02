'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function SourcePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [code, setCode] = useState('');
  const [result, setResult] = useState('');
  const [showResult, setShowResult] = useState(false);

  // Encrypt function: tao loadstring + obfuscate thanh _bsdata
  const encryptToBsData = (input: string): { rawUrl: string; bsDataUrl: string } => {
    // Generate random ID cho /raw/ endpoint (9 chars)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
    for (let i = 0; i < 9; i++) {
      randomId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // URL cua trang raw (chua ma hoa)
    const rawUrl = `/raw/${randomId}`;
    const fullRawUrl = typeof window !== 'undefined' ? window.location.origin + rawUrl : rawUrl;

    // Tao loadstring code de fetch tu raw URL
    // Format: loadstring(game:HttpGet("URL"))()
    const loadstringCode = `loadstring(game:HttpGet("${fullRawUrl}"))()`;

    // Obfuscate: ma hoa loadstring+url thanh _bsdata
    // Them ghi chu --dont use this
    const dataWithComment = `--dont use this\n${loadstringCode}`;

    // Convert to base64
    const base64 = btoa(unescape(encodeURIComponent(dataWithComment)));

    // Tao _bsdata voi prefix 'v'
    const bsData = `v${base64}`;

    // URL voi _bsdata parameter
    const bsDataUrl = `${rawUrl}?_bsdata=${encodeURIComponent(bsData)}`;

    return { rawUrl, bsDataUrl };
  };

  const handleEncrypt = () => {
    if (!code.trim()) return;

    const { rawUrl, bsDataUrl } = encryptToBsData(code);

    // Luu code vao localStorage de trang raw co the lay
    const fullRawUrl = typeof window !== 'undefined' ? window.location.origin + rawUrl : rawUrl;
    localStorage.setItem(`raw_${rawUrl.split('/').pop()}`, code.trim());

    setResult(bsDataUrl);
    setShowResult(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Da copy: ' + text);
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

            {/* Hien thi URL voi _bsdata */}
            <div className="bg-gray-900 p-4 rounded mb-4">
              <p className="text-sm text-gray-400 mb-2">URL voi _bsdata (dan cho user copy):</p>
              <code className="text-green-400 break-all block mb-2">{result}</code>
              <button
                onClick={() => copyToClipboard(typeof window !== 'undefined' ? window.location.origin + result : result)}
                className="bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-3 rounded transition"
              >
                Copy Full URL
              </button>
            </div>

            {/* Hien thi doan _bsdata rieng */}
            <div className="bg-gray-900 p-4 rounded mb-4">
              <p className="text-sm text-gray-400 mb-2">Hoac copy doan _bsdata nay:</p>
              <code className="text-yellow-400 break-all block mb-2">
                _bsdata={result.split('_bsdata=')[1]}
              </code>
              <button
                onClick={() => copyToClipboard('_bsdata=' + result.split('_bsdata=')[1])}
                className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm py-1 px-3 rounded transition"
              >
                Copy _bsdata
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
