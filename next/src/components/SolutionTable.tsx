'use client';

import { useEffect, useState } from 'react';

interface Props {
  mdpId: string;
  refreshTrigger?: any;
}

interface SolutionEntry {
  value: number;
  best_action: string;
}

type SolutionMap = Record<string, SolutionEntry>;

export default function SolutionTable({ mdpId, refreshTrigger }: Props) {
  const [solution, setSolution] = useState<SolutionMap>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mdpId) return;

    const fetchSolution = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/mdp/${mdpId}/solution`);
        const json = await res.json();

        if (json.solution) {
          setSolution(json.solution);
        } else {
          throw new Error(json?.error || 'Unexpected response from server');
        }
      } catch (err: any) {
        console.error('❌ Failed to fetch solution:', err);
        setError(err.message);
      }
    };

    fetchSolution();
  }, [mdpId, refreshTrigger]);

  const tableStyle = "border border-gray-600 px-3 py-1";

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-2">📊 Solution Table</h2>
      {error && <p className="text-red-400">Error: {error}</p>}

      <table className="w-full border-collapse border border-gray-700 text-sm">
        <thead>
          <tr className="bg-gray-800">
            <th className={tableStyle}>State</th>
            <th className={tableStyle}>Value</th>
            <th className={tableStyle}>Best Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(solution).map(([state, entry]) => (
            <tr key={state}>
              <td className={tableStyle}>{state}</td>
              <td className={tableStyle}>{entry.value.toFixed(3)}</td>
              <td className={tableStyle}>{entry.best_action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
