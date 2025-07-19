'use client';

import { useState } from 'react';

interface Props {
  onCreated: (id: string) => void;
}

export default function NewMdpButton({ onCreated }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/mdp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (!res.ok || !data?.mdp_id) {
        throw new Error(data?.error || 'Failed to create MDP');
      }

      onCreated(data.mdp_id);
    } catch (err) {
      console.error('Failed to create MDP:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
    >
      {loading ? 'Creating...' : 'New MDP'}
    </button>
  );
}
