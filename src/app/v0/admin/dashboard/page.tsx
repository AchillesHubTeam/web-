'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CodeEntry {
  id: string;
  code: string;
  rawUrl: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [code, setCode] = useState('');
  const [entries, setEntries] = useState<CodeEntry[]>([]);
  const router = useRouter();

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (!auth) {
      router.push('/v0/admin');
      return;
    }
    const saved = localStorage.getItem('code_entries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, [router]);

  const generateRandomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 9; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreate = () => {
    if (!code.trim()) return;

    const id = generateRandomId();
    const rawUrl = `/raw/${id}`;
    
    const newEntry: CodeEntry = {
      id,
      code: code.trim(),
      rawUrl,
      createdAt: new Date().toISOString(),
    };

    const updated = [...entries, newEntry];
    setEntries(updated);
    localStorage.setItem('code_entries', JSON.stringify(updated));
    setCode('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Da copy: ' + text);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Tao Code moi</h2>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste code vao day..."
            className="w-full h-40 bg-gray-700 text-white p-4 rounded border border-gray-600 focus:border-blue-500 focus:outline-none mb-4 font-mono text-sm"
          />
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
          >
            Create
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Danh sach Code</h2>
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-gray-700 p-4 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-blue-400">{entry.rawUrl}</span>
                  <button
                    onClick={() => copyToClipboard(window.location.origin + entry.rawUrl)}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-3 rounded transition"
                  >
                    Copy URL
                  </button>
                </div>
                <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
                  {entry.code}
                </pre>
              </div>
            ))}
            {entries.length === 0 && (
              <p className="text-gray-400">Chua co code nao duoc tao.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
