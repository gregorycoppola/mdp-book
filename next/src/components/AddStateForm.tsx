'use client';

import { useState } from 'react';

interface Props {
  mdpId: string;
  onStateAdded?: () => void;
}

export default function AddStateForm({ mdpId, onStateAdded }: Props) {
  const [stateName, setStateName] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();  // prevent form reload
    setMessage(null);
    setError(null);

    if (!stateName.trim()) return;

    try {
      const res = await fetch(`http://localhost:8000/api/mdp/${mdpId}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: stateName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to add state');

      setMessage(data.message || `State "${stateName}" added`);
      setStateName('');
      onStateAdded?.();
    } catch (err: any) {
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <input
        type="text"
        value={stateName}
        onChange={(e) => setStateName(e.target.value)}
        placeholder="State name"
        className="px-2 py-1 mr-2 text-white bg-neutral-800 border border-neutral-600 rounded placeholder-gray-400 focus:outline-none"
      />
      <button
        type="submit"
        className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white"
      >
        Add State
      </button>
      {message && <p className="mt-2 text-green-400">{message}</p>}
      {error && <p className="mt-2 text-red-400">{error}</p>}
    </form>
  );
}
