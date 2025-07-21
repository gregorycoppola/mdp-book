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

  // Safely build unique nodes using a Map
  const nodeMap = new Map<string, { id: string; label: string; shape: string; font: { align: string } }>();
  const edges: { from: string; to: string; label: string; arrows: string }[] = [];

  for (const [state, { value, best_action }] of Object.entries(solution)) {
    if (!nodeMap.has(state)) {
      nodeMap.set(state, {
        id: state,
        label: `${state}\nV=${value.toFixed(2)}${best_action ? `\n→ ${best_action}` : ''}`,
        shape: 'box',
        font: { align: 'left' },
      });
    }

    if (best_action) {
      if (!nodeMap.has(best_action)) {
        nodeMap.set(best_action, {
          id: best_action,
          label: best_action,
          shape: 'ellipse',
          font: { align: 'left' },
        });
      }

      edges.push({
        from: state,
        to: best_action,
        label: best_action,
        arrows: 'to',
      });
    }
  }

  const graph = {
    nodes: Array.from(nodeMap.values()),
    edges,
  };

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
