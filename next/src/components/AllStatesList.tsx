'use client';

import { useEffect, useState } from 'react';

interface Props {
  mdpId: string;
  refreshTrigger?: any; // optional: pass something to trigger refetch
}

export default function AllStatesList({ mdpId, refreshTrigger }: Props) {
  const [states, setStates] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mdpId) return;
    console.log(`📡 [AllStatesList] Fetching states for MDP: ${mdpId}`);
    fetch(`http://localhost:8000/api/mdp/${mdpId}/states`)
      .then((res) => res.json())
      .then((data) => {
        if (data.states) {
          console.log('✅ [AllStatesList] Loaded states:\n', data.states);
          setStates(data.states);
        } else {
          throw new Error(data?.error || 'Unexpected response');
        }
      })
      .catch((err) => {
        console.error('❌ [AllStatesList] Failed to load states:', err);
        setError(err.message);
      });
  }, [mdpId, refreshTrigger]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">📋 All States</h2>
      {error && <p className="text-red-400">Error: {error}</p>}
      <ul className="list-disc list-inside text-white">
        {states.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
