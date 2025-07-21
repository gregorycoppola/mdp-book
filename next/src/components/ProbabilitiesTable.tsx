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

export default function ProbabilitiesTable({ mdpId, refreshTrigger }: Props) {
  const [transitions, setTransitions] = useState<TransitionsByState>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mdpId) return;

    const fetchTransitions = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/mdp/${mdpId}/transitions`);
        const json = await res.json();

        if (json.transitions) {
          setTransitions(json.transitions);
        } else {
          throw new Error(json?.error || 'Unexpected response from server');
        }
      } catch (err: any) {
        console.error('❌ [ProbabilitiesTable] Failed to load transitions:', err);
        setError(err.message);
      }
    };

    fetchTransitions();
  }, [mdpId, refreshTrigger]);

  const tableStyle = "border border-gray-600 px-3 py-1";

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-2">📊 Transition Probabilities</h2>
      {error && <p className="text-red-400">Error: {error}</p>}

      {Object.entries(transitions).map(([s0, aMap]) => (
        <div key={s0} className="mb-6">
          <p className="font-bold mb-2">From State: <span className="text-sky-400">{s0}</span></p>
          <table className="w-full border-collapse border border-gray-700 text-sm">
            <thead>
              <tr className="bg-gray-800">
                <th className={tableStyle}>Action</th>
                <th className={tableStyle}>Next State</th>
                <th className={tableStyle}>Probability</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(aMap).flatMap(([a, outcomes]) =>
                outcomes.map((t, i) => (
                  <tr key={`${s0}-${a}-${t.next_state}-${i}`}>
                    <td className={tableStyle}>{a}</td>
                    <td className={tableStyle}>{t.next_state}</td>
                    <td className={tableStyle}>
                      {typeof t.probability === 'number' ? t.probability.toFixed(3) : '0.0'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}
