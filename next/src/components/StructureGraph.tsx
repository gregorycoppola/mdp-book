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

interface RewardData {
  [state: string]: {
    [action: string]: {
      [next_state: string]: number;
    };
  };
}

export default function SolutionGraph({ mdpId, refreshTrigger }: Props) {
  const [solution, setSolution] = useState<SolutionMap | null>(null);
  const [transitions, setTransitions] = useState<GraphData['transitions']>({});
  const [rewards, setRewards] = useState<RewardData>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!mdpId) return;

      try {
        const [solRes, graphRes, rewardRes] = await Promise.all([
          fetch(`http://localhost:8000/api/mdp/${mdpId}/solution`),
          fetch(`http://localhost:8000/api/mdp/${mdpId}/graph`),
          fetch(`http://localhost:8000/api/mdp/${mdpId}/rewards`),
        ]);

        const solJson = await solRes.json();
        const graphJson = await graphRes.json();
        const rewardJson = await rewardRes.json();

        if (!graphJson.transitions) throw new Error(graphJson?.error || 'Missing graph transitions');
        setTransitions(graphJson.transitions);
        setRewards(rewardJson.rewards || {});

        if (solJson.solution) {
          setSolution(solJson.solution);
        } else {
          console.warn('[StructureGraph] ⚠️ No solution found. Skipping value/policy annotations.');
          setSolution(null);
        }
      } catch (err: any) {
        console.error('[StructureGraph] ❌ Error:', err);
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

  for (const [state, actionMap] of Object.entries(transitions)) {
    let label = state;
    const stateColor = '#ADD8E6';

    if (solution && solution[state]) {
      const { value, best_action } = solution[state];
      label += `\nV=${value.toFixed(2)}`;
      if (best_action) {
        label += `\n→ ${best_action}`;
      }
    }

    if (!nodeMap.has(state)) {
      nodeMap.set(state, {
        id: state,
        label,
        shape: 'box',
        color: { background: stateColor },
        font: { align: 'left', color: '#ffffff' },
      });
    }

    for (const [action, targets] of Object.entries(actionMap)) {
      const actionNodeId = `${state}_${action}`;
      const isBest = solution?.[state]?.best_action === action;

      if (!nodeMap.has(actionNodeId)) {
        nodeMap.set(actionNodeId, {
          id: actionNodeId,
          label: action,
          shape: 'ellipse',
          color: { background: isBest ? '#90EE90' : '#ccccff' },
          font: { color: '#000000' },
        });
      }

      edges.push({
        id: `${state}->${actionNodeId}`,
        from: state,
        to: actionNodeId,
        arrows: 'to',
        label: '',
      });

      for (const { next_state, probability } of targets) {
        if (!nodeMap.has(next_state)) {
          nodeMap.set(next_state, {
            id: next_state,
            label: next_state,
            shape: 'box',
            color: { background: '#D3D3D3' },
            font: { color: '#ffffff' },
          });
        }

        const reward = rewards?.[state]?.[action]?.[next_state];
        const rewardLabel = reward !== undefined ? `r=${reward}` : 'r=?';

        edges.push({
          id: `${actionNodeId}->${next_state}`,
          from: actionNodeId,
          to: next_state,
          arrows: 'to',
          label: `p=${probability}, ${rewardLabel}`,
        });
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
        key={mdpId + '-' + Object.keys(transitions).join(',')}
        graph={graph}
        options={options}
      />
    </div>
  );
}
