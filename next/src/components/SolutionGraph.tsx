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
    console.log('[SolutionGraph] useEffect triggered. mdpId:', mdpId, 'refreshTrigger:', refreshTrigger);
    if (!mdpId) {
      console.warn('[SolutionGraph] No mdpId provided. Aborting fetch.');
      return;
    }

    const fetchSolution = async () => {
      console.log(`[SolutionGraph] Fetching solution for MDP: ${mdpId}`);
      try {
        const res = await fetch(`http://localhost:8000/api/mdp/${mdpId}/solution`);
        const json = await res.json();
        console.log('[SolutionGraph] Response from backend:', json);

        if (json.solution) {
          setSolution(json.solution);
          console.log('[SolutionGraph] Solution set:', json.solution);
        } else {
          const message = json?.error || 'Unexpected response from server';
          throw new Error(message);
        }
      } catch (err: any) {
        console.error('[SolutionGraph] ❌ Error fetching solution:', err);
        setError(err.message);
      }
    };

    fetchSolution();
  }, [mdpId, refreshTrigger]);

  if (error) {
    console.warn('[SolutionGraph] Rendering error state:', error);
    return <p className="text-red-400 mt-4">Error: {error}</p>;
  }

  const nodeMap = new Map<string, { id: string; label: string; shape: string; font: { align: string } }>();
  const edges: { id: string; from: string; to: string; label: string; arrows: string }[] = [];

  console.log('[SolutionGraph] Building graph nodes and edges from solution...');
  for (const [state, { value, best_action }] of Object.entries(solution)) {
    console.log(`  → State: ${state}, Value: ${value}, Best Action: ${best_action}`);

    if (!nodeMap.has(state)) {
      const node = {
        id: state,
        label: `${state}\nV=${value.toFixed(2)}${best_action ? `\n→ ${best_action}` : ''}`,
        shape: 'box',
        font: { align: 'left' },
        color: { background: '#ADD8E6' }, // Light blue for states
      };
      nodeMap.set(state, node);
      console.log('    ✅ Added state node:', node);
    }

    if (best_action) {
      if (!nodeMap.has(best_action)) {
        const actionNode = {
          id: best_action,
          label: best_action,
          shape: 'ellipse',
          font: { align: 'left' },
          color: { background: '#90EE90' }, // Light green for actions
        };
        nodeMap.set(best_action, actionNode);
        console.log('    ✅ Added action node:', actionNode);
      }

      const edgeId = `${state}->${best_action}`;
      const edge = {
        id: edgeId,
        from: state,
        to: best_action,
        label: best_action,
        arrows: 'to',
      };
      edges.push(edge);
      console.log('    🔗 Added edge:', edge);
    }
  }

  const graph = {
    nodes: Array.from(nodeMap.values()),
    edges,
  };

  console.log('[SolutionGraph] Final graph object:', graph);

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

  console.log('[SolutionGraph] Rendering graph with options:', options);
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-white mb-2">📈 MDP Solution Graph</h2>
      <Graph
        key={mdpId + '-' + Object.keys(solution).join(',')}
        graph={graph}
        options={options}
      />
    </div>
  );
}
