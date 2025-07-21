'use client';

import { useEffect, useState } from 'react';
import Graph from './DynamicGraph';

interface Props {
  mdpId: string;
  refreshTrigger?: any;
}

interface SolutionEntry {
  value: number;
  best_action: string | null;
}

type SolutionMap = Record<string, SolutionEntry>;

interface Transition {
  next_state: string;
  probability: number;
}

interface GraphData {
  transitions: Record<string, Record<string, Transition[]>>;
}

export default function SolutionGraph({ mdpId, refreshTrigger }: Props) {
  const [solution, setSolution] = useState<SolutionMap>({});
  const [transitions, setTransitions] = useState<GraphData['transitions']>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!mdpId) return;

      try {
        const [solRes, graphRes] = await Promise.all([
          fetch(`http://localhost:8000/api/mdp/${mdpId}/solution`),
          fetch(`http://localhost:8000/api/mdp/${mdpId}/graph`),
        ]);

        const solJson = await solRes.json();
        const graphJson = await graphRes.json();

        if (!solJson.solution) throw new Error(solJson?.error || 'Missing solution');
        if (!graphJson.transitions) throw new Error(graphJson?.error || 'Missing graph transitions');

        setSolution(solJson.solution);
        setTransitions(graphJson.transitions);
      } catch (err: any) {
        console.error('[SolutionGraph] ❌ Error:', err);
        setError(err.message);
      }
    };

    fetchData();
  }, [mdpId, refreshTrigger]);

  if (error) {
    return <p className="text-red-400 mt-4">Error: {error}</p>;
  }

  const nodeMap = new Map<string, any>();
  const edges: any[] = [];

  for (const [state, { value, best_action }] of Object.entries(solution)) {
    const label = `${state}\nV=${value.toFixed(2)}${best_action ? `\n→ ${best_action}` : ''}`;
    nodeMap.set(state, {
      id: state,
      label,
      shape: 'box',
      color: { background: '#ADD8E6' },
      font: { align: 'left', color: '#ffffff' },
    });

    if (best_action) {
      const actionNodeId = `${state}_${best_action}`;

      if (!nodeMap.has(actionNodeId)) {
        nodeMap.set(actionNodeId, {
          id: actionNodeId,
          label: best_action,
          shape: 'ellipse',
          color: { background: '#90EE90' },
          font: { color: '#000000' },
        });
      }

      // state → action
      edges.push({
        id: `${state}->${actionNodeId}`,
        from: state,
        to: actionNodeId,
        arrows: 'to',
        label: '',
      });

      // action → each next state (from transitions)
      const t = transitions[state]?.[best_action];
      if (t) {
        for (const { next_state, probability } of t) {
          if (!nodeMap.has(next_state)) {
            nodeMap.set(next_state, {
              id: next_state,
              label: next_state,
              shape: 'box',
              color: { background: '#D3D3D3' },
              font: { color: '#ffffff' },
            });
          }
          edges.push({
            id: `${actionNodeId}->${next_state}`,
            from: actionNodeId,
            to: next_state,
            arrows: 'to',
            label: `${probability}`,
          });
        }
      }
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
        nodeSpacing: 150,
        levelSeparation: 120,
      },
    },
    edges: {
      arrows: {
        to: { enabled: true, scaleFactor: 2 },
      },
      smooth: {
        type: 'curvedCW',
        roundness: 0.3,
      },
      color: {
        color: '#FF0000',
        highlight: '#FF0000',
        hover: '#FF6666',
      },
    },
    nodes: {
      borderWidth: 2,
      color: { border: '#ffffff' },
      font: { color: '#ffffff' },
    },
    height: '600px',
    physics: false,
  };

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
