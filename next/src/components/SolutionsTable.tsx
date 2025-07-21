'use client';

import { useEffect, useState } from 'react';

interface Props {
  mdpId: string;
  refreshTrigger?: any;
}

export default function SolutionTable({ mdpId, refreshTrigger }: Props) {
  const [states, setStates] = useState<string[]>([]);
  const [values, setValues] = useState<Record<string, number>>({});
  const [policy, setPolicy] = useState<Record<string, string | null>>({});
  const [error, setError] = useState<string | null>(null);

  // Fetch states first
  useEffect(() => {
    if (!mdpId) return;

    fetch(`http://localhost:8000/api/mdp/${mdpId}/states`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.states)) {
          setStates(data.states);
        } else {
          throw new Error(data?.error || 'Failed to load states');
        }
      })
      .catch(err => {
        console.error('❌ Failed to fetch states:', err);
        setError(err.message);
      });
  }, [mdpId]);

  // Fetch solution values and policy
  useEffect(() => {
    if (!mdpId) return;

    fetch(`http://localhost:8000/api/mdp/${mdpId}/solve`)
      .then(res => res.json())
      .then(data => {
        if (data.values && data.policy) {
          setValues(data.values);
          setPolicy(data.policy);
        } else {
          throw new Error(data?.error || 'Invalid solve response');
        }
      })
      .catch(err => {
        console.error('❌ Failed to fetch solution:', err);
        setError(err.message);
      });
  }, [mdpId, refreshTrigger]);

  const tableStyle = "border border-gray-600 px-3 py-1";

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-2">📈 MDP Solution</h2>
      {error && <p className="text-red-400">Error: {error}</p>}

      <table className="w-full border-collapse border border-gray-700 text-sm">
        <thead className="bg-gray-800">
          <tr>
            <th className={tableStyle}>State</th>
            <th className={tableStyle}>Value</th>
            <th className={tableStyle}>Best Action</th>
          </tr>
        </thead>
        <tbody>
          {states.map((s) => (
            <tr key={s}>
              <td className={tableStyle}>{s}</td>
              <td className={tableStyle}>
                {typeof values[s] === 'number' ? values[s].toFixed(3) : '—'}
              </td>
              <td className={tableStyle}>
                {policy[s] ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
