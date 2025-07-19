'use client';

import { useEffect, useState } from 'react';

interface Props {
  mdpId: string;
  onPairSelected?: (sourceState: string, action: string) => void;
}

type ActionsByState = Record<string, string[]>;

export default function SelectActionPair({ mdpId, onPairSelected }: Props) {
  const [actionsByState, setActionsByState] = useState<ActionsByState>({});
  const [sourceStates, setSourceStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Fetch actions for all states
  useEffect(() => {
    if (!mdpId) return;

    console.log(`📡 [SelectActionPair] Fetching actions for MDP: ${mdpId}`);
    fetch(`http://localhost:8000/api/mdp/${mdpId}/actions`)
      .then((res) => res.json())
      .then((data) => {
        if (data.actions) {
          console.log('✅ [SelectActionPair] Loaded actions:\n', data.actions);
          setActionsByState(data.actions);

          const states = Object.keys(data.actions);
          setSourceStates(states);
          setSelectedState((prev) => states.includes(prev) ? prev : states[0] || '');
        } else {
          throw new Error(data?.error || 'Unexpected response');
        }
      })
      .catch((err) => {
        console.error('❌ [SelectActionPair] Failed to load actions:', err);
        setError(err.message);
      });
  }, [mdpId]);

  // Reset action when state changes
  useEffect(() => {
    const actions = actionsByState[selectedState] || [];
    setSelectedAction(actions[0] || '');
  }, [selectedState, actionsByState]);

  const handleSubmit = () => {
    if (selectedState && selectedAction) {
      console.log(`✅ [SelectActionPair] Selected: (${selectedState}, ${selectedAction})`);
      onPairSelected?.(selectedState, selectedAction);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">🎛 Select Action Pair</h2>
      {error && <p className="text-red-400">Error: {error}</p>}

      <div className="flex items-center gap-4 mb-4">
        <div>
          <label className="block text-white mb-1">Source State:</label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-neutral-800 text-white border border-neutral-600 px-2 py-1 rounded"
          >
            {sourceStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white mb-1">Action:</label>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="bg-neutral-800 text-white border border-neutral-600 px-2 py-1 rounded"
          >
            {(actionsByState[selectedState] || []).map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white mt-6"
        >
          Confirm Pair
        </button>
      </div>

      {selectedState && selectedAction && (
        <p className="text-green-400 text-sm">
          Selected: <strong>{selectedState}</strong> → <strong>{selectedAction}</strong>
        </p>
      )}
    </div>
  );
}
