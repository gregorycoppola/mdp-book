'use client';

import { useState } from 'react';

export default function Home() {
  const [mdpId, setMdpId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateMdp = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:8000/mdp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const data = await res.json();
      setMdpId(data.mdp_id);
    } catch (err: any) {
      setError(`Failed to create MDP: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">MDP Creator</h1>
      <button
        onClick={handleCreateMdp}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'New MDP'}
      </button>

      {mdpId && (
        <p className="mt-6 text-green-400">
          ✅ MDP ID: <span className="font-mono">{mdpId}</span>
        </p>
      )}

      {error && (
        <p className="mt-6 text-red-400">
          ❌ {error}
        </p>
      )}
    </main>
  );
}
