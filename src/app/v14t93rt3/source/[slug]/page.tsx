'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function SourcePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [code, setCode] = useState('');
  const [result, setResult] = useState('');
  const [showResult, setShowResult] = useState(false);

  // Ham tao obfuscated _bsdata giong nhu user yeu cau
  const createObfuscatedBsData = (url: string): string => {
    // Chia URL thanh cac phan de obfuscate
    const urlChars = url.split('').map(c => c.charCodeAt(0));
    
    // Tao _bsdata voi string.char() obfuscation
    const charCodes = urlChars.join(',');
    
    // Tao doan code obfuscated
    const obfuscated = `--dont use this
--use loadstring
_bsdata={["_0x1"]=string.char(108,111,97,100,115,116,114,105,110,103),["_0x2"]=string.char(103,97,109,101,58,72,116,116,112,71,101,116),["_0x3"]=string.char(${charCodes})}; _G[_bsdata["_0x1"]](_G[_bsdata["_0x2"]](_bsdata["_0x3"]))()`;
    
    return obfuscated;
  };

  const handleEncrypt = () => {
    if (!code.trim()) return;

    // Generate random ID cho /raw/ endpoint (9 chars)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
    for (let i = 0; i < 9; i++) {
      randomId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // URL cua trang v14t93rt3/source (noi chua code goc)
    const v14Url = typeof window !== 'undefined' 
      ? `${window.location.origin}/v14t93rt3/source/${slug}`
      : `/v14t93rt3/source/${slug}`;

    // Tao obfuscated _bsdata de load v14Url
    const obfuscatedCode = createObfuscatedBsData(v14Url);

    // Luu code goc vao localStorage de trang v14 co the tra ve
    localStorage.setItem(`source_${slug}`, code.trim());

    // Tao URL cho /raw/{id} voi _bsdata parameter
    // _bsdata se chua doan obfuscated code da duoc ma hoa base64
    const base64 = btoa(unescape(encodeURIComponent(obfuscatedCode)));
    const bsData = `v${base64}`;
    const rawUrl = `/raw/${randomId}?_bsdata=${encodeURIComponent(bsData)}`;

    setResult(rawUrl);
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

            <div className="bg-gray-900 p-4 rounded mb-4">
              <p className="text-sm text-gray-400 mb-2">URL /raw/ de dan cho user:</p>
              <code className="text-green-400 break-all block mb-2">{result}</code>
              <button
                onClick={() => copyToClipboard(typeof window !== 'undefined' ? window.location.origin + result : result)}
                className="bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-3 rounded transition"
              >
                Copy Full URL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
