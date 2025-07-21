'use client';

import { useEffect, useState } from 'react';

interface Props {
  mdpId: string;
  refreshTrigger?: any;
}

interface Transition {
  next_state: string;
  probability: number;
}

type TransitionsByState = Record<string, Record<string, Transition[]>>;

export default function AllTransitionsList({ mdpId, refreshTrigger }: Props) {
  const [transitions, setTransitions] = useState<TransitionsByState>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mdpId) return;

    console.log(`📡 [AllTransitionsList] Fetching transitions for MDP: ${mdpId}`);
    fetch(`http://localhost:8000/api/mdp/${mdpId}/transitions`)
      .then((res) => res.json())
      .then((data) => {
        if (data.transitions) {
          console.log('✅ [AllTransitionsList] Loaded transitions:\n', data.transitions);
          setTransitions(data.transitions);
        } else {
          throw new Error(data?.error || 'Unexpected response');
        }
      })
      .catch((err) => {
        console.error('❌ [AllTransitionsList] Failed to load transitions:', err);
        setError(err.message);
      });
  }, [mdpId, refreshTrigger]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">🔀 All Transitions</h2>
      {error && <p className="text-red-400">Error: {error}</p>}

      <ul className="list-disc list-inside text-white">
        {Object.entries(transitions).map(([state, actions]) => (
          <li key={state} className="mb-2">
            <strong className="text-sky-400">{state}</strong>
            <ul className="ml-4 list-square">
              {Object.entries(actions).map(([action, outcomes]) => (
                <li key={action} className="mb-1">
                  <span className="text-emerald-300 font-medium">{action}</span>
                  <ul className="ml-4 list-none">
                    {outcomes.map((t, idx) => (
                      <li key={idx} className="text-neutral-300">
                        → {t.next_state}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
