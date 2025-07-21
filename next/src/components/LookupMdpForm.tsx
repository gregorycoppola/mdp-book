'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LookupMdpForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLookup = async () => {
    if (!name) return;

    setLoading(true);
    setError(null);

    try {
        console.log({name});
      const res = await fetch(`http://localhost:8000/api/mdp/${name}`);
      console.log({res});
      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to load MDP');
      }

      router.push(`/mdp/${name}/states`);
    } catch (err: any) {
      console.error('❌ [LookupMdpForm] Error loading MDP:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <label className="block text-white mb-2">🔎 Look Up MDP by Name</label>
      <div className="flex items-center gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter MDP name"
          className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 flex-1"
        />
        <button
          onClick={handleLookup}
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
        >
          {loading ? 'Looking...' : 'Go'}
        </button>
      </div>
      {error && <p className="text-red-400 mt-2">{error}</p>}
    </div>
  );
}
