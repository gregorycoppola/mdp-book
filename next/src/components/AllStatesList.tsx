'use client';

import { useEffect, useState } from 'react';

interface Props {
  mdpId: string;
  refreshTrigger?: number; // Increment this to trigger a refetch externally
}

export default function AllStatesList({ mdpId, refreshTrigger }: Props) {
  const [states, setStates] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      console.log("📡 [AllStatesList] Fetching states for MDP:", mdpId);

      try {
        const res = await fetch(`http://localhost:8000/api/mdp/${mdpId}/actions`);
        const data = await res.json();

        if (!res.ok) {
          console.error("❌ [AllStatesList] Failed to fetch states:", data);
          throw new Error(data?.error || `Status ${res.status}`);
        }

        setStates(data.actions || []);
        console.log("✅ [AllStatesList] Loaded states:", data.actions);
      } catch (err: any) {
        setError(`Failed to load states: ${err.message}`);
      }
    };

    if (mdpId) {
      fetchStates();
    }
  }, [mdpId, refreshTrigger]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">All States</h2>
      {error && <p className="text-red-400">{error}</p>}
      {states.length === 0 && !error && (
        <p className="text-gray-400 italic">No states found.</p>
      )}
      <ul className="list-disc pl-6 text-white">
        {states.map((state, idx) => (
          <li key={idx}>{state}</li>
        ))}
      </ul>
    </div>
  );
}
