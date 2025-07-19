'use client';

import { useState } from 'react';

interface Props {
  mdpId: string;
}

export default function SolveMDPButton({ mdpId }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSolve = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`http://localhost:8000/api/mdp/${mdpId}/solve`, {
        method: 'POST',
      });

      const data = await res.json();

      if (!res.ok || data?.error) {
        throw new Error(data?.error || 'Unknown error during solve');
      }

      setMessage(data.message || '✅ Solved successfully');
    } catch (err: any) {
      console.error('❌ [SolveMDPButton] Solve failed:', err);
      setError(`❌ Solve failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleSolve}
        disabled={loading}
        className="px-3 py-1 bg-purple-700 hover:bg-purple-800 rounded text-white"
      >
        🚀 {loading ? 'Solving...' : 'Solve MDP'}
      </button>

      {message && <p className="mt-2 text-green-400">{message}</p>}
      {error && <p className="mt-2 text-red-400">{error}</p>}
    </div>
  );
}
