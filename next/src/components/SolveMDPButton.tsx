'use client';

import { useState } from 'react';

interface Props {
  mdpId: string;
  onSolved?: () => void;
}

export default function SolveMDPButton({ mdpId, onSolved }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSolve = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`http://localhost:8000/api/mdp/${mdpId}/solve`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || 'Failed to solve');

      setMessage('✅ MDP solved successfully');
      onSolved?.();
    } catch (err: any) {
      console.error('❌ Error solving MDP:', err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSolve}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
      >
        {loading ? 'Solving...' : 'Solve Now'}
      </button>
      {message && <p className="mt-2 text-yellow-400">{message}</p>}
    </div>
  );
}
