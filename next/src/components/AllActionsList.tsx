'use client';

import { useEffect, useState } from 'react';

interface Props {
  mdpId: string;
  refreshTrigger?: any; // optional: pass something to trigger refetch
}

type ActionsByState = Record<string, string[]>;

export default function AllActionsList({ mdpId, refreshTrigger }: Props) {
  const [actions, setActions] = useState<ActionsByState>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mdpId) return;

    console.log(`📡 [AllActionsList] Fetching actions for MDP: ${mdpId}`);
    fetch(`http://localhost:8000/api/mdp/${mdpId}/actions`)
      .then((res) => res.json())
      .then((data) => {
        if (data.actions) {
          console.log('✅ [AllActionsList] Loaded actions:\n', data.actions);
          setActions(data.actions);
        } else {
          throw new Error(data?.error || 'Unexpected response');
        }
      })
      .catch((err) => {
        console.error('❌ [AllActionsList] Failed to load actions:', err);
        setError(err.message);
      });
  }, [mdpId, refreshTrigger]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">🎯 All Actions</h2>
      {error && <p className="text-red-400">Error: {error}</p>}
      <ul className="list-disc list-inside text-white">
        {Object.entries(actions).map(([state, actionsForState]) => (
          <li key={state}>
            <strong>{state}</strong>: {actionsForState.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}
