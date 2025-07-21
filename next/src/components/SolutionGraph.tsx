'use client';

import { useEffect, useState } from 'react';
import Graph from 'react-graph-vis';

interface Props {
  mdpId: string;
  refreshTrigger?: any;
}

interface SolutionEntry {
  value: number;
  best_action: string | null;
}

type SolutionMap = Record<string, SolutionEntry>;

export default function SolutionGraph({ mdpId, refreshTrigger }: Props) {
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

  if (error) {
    return <p className="text-red-400 mt-4">Error: {error}</p>;
  }

  const nodes = Object.entries(solution).map(([state, entry]) => ({
    id: state,
    label: `${state}\nV=${entry.value.toFixed(2)}${entry.best_action ? `\n→ ${entry.best_action}` : ''}`,
    shape: 'box',
    font: { align: 'left' },
  }));

  const edges = Object.entries(solution)
    .filter(([, entry]) => entry.best_action)
    .map(([state, entry]) => ({
      from: state,
      to: findNextState(state, entry.best_action!, solution),
      label: entry.best_action!,
      arrows: 'to',
    }))
    .filter(e => e.to); // filter nulls if not found

  const graph = { nodes, edges };

  const options = {
    layout: {
      hierarchical: {
        direction: 'UD',
        sortMethod: 'directed',
      },
    },
    edges: {
      arrows: { to: { enabled: true } },
      smooth: true,
    },
    height: '600px',
    physics: false,
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-white mb-2">📈 MDP Solution Graph</h2>
      <Graph graph={graph} options={options} />
    </div>
  );
}

function findNextState(state: string, action: string, solution: SolutionMap): string | null {
  // For now, we assume best_action transitions to a unique next state.
  // If you have transition data available, this should be informed by it.
  for (const candidate in solution) {
    if (candidate !== state && solution[candidate].best_action === null) {
      return candidate; // naive fallback
    }
  }
  return null;
}
