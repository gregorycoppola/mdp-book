'use client';

import { useState } from 'react';

interface Props {
  mdpId: string;
}

export default function AddStateForm({ mdpId }: Props) {
  const [stateName, setStateName] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setMessage(null);
    setError(null);
    if (!stateName) return;

    try {
      const res = await fetch(`http://localhost:8000/api/mdp/${mdpId}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: stateName }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to add state');
      }

      setMessage(data.message || `State "${stateName}" added`);
      setStateName('');
    } catch (err: any) {
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <div className="mt-6">
      <input
        type="text"
        value={stateName}
        onChange={(e) => setStateName(e.target.value)}
        placeholder="State name"
        className="px-2 py-1 mr-2 text-black rounded"
      />
      <button
        onClick={handleSubmit}
        className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white"
      >
        Add State
      </button>
      {message && <p className="mt-2 text-green-400">{message}</p>}
      {error && <p className="mt-2 text-red-400">{error}</p>}
    </div>
  );
}
