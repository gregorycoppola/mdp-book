'use client';

import { useEffect, useState } from 'react';
import SelectActionPair from './SelectActionPair';

interface Props {
  mdpId: string;
  onOutcomeAdded?: () => void;
}

export default function AddOutcomeForm({ mdpId, onOutcomeAdded }: Props) {
  const [sourceState, setSourceState] = useState('');
  const [action, setAction] = useState('');
  const [nextState, setNextState] = useState('');
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load available states for dropdown
  useEffect(() => {
    if (!mdpId) return;
    fetch(`http://localhost:8000/api/mdp/${mdpId}/states`)
      .then((res) => res.json())
      .then((data) => {
        if (data.states) setAvailableStates(data.states);
        else throw new Error(data?.error || 'Unexpected response');
      })
      .catch((err) => {
        console.error('❌ [AddOutcomeForm] Failed to fetch states:', err);
        setError('Failed to load available states');
      });
  }, [mdpId]);

  const handleSubmit = async () => {
    setMessage(null);
    setError(null);

    if (!sourceState || !action || !nextState) {
      setError('⚠️ Must select a source state, action, and next state');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/mdp/${mdpId}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: sourceState, action, next_state: nextState }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('❌ [AddOutcomeForm] Server error:', data);
        setError(data?.error || '❌ Failed to add outcome');
        return;
      }

      const msg = data.message || `Outcome "${nextState}" added to (${sourceState}, ${action})`;
      setMessage(msg);
      setNextState('');
      onOutcomeAdded?.();
    } catch (err: any) {
      console.error('❌ [AddOutcomeForm] Error:', err);
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">🔀 Add Outcome (Transition)</h2>

      <SelectActionPair
        mdpId={mdpId}
        onPairSelected={(s, a) => {
          console.log(`🎯 Selected pair: (${s}, ${a})`);
          setSourceState(s);
          setAction(a);
        }}
      />

      <div className="mb-3">
        <label className="block text-white mt-4 mb-1">Next State:</label>
        <select
          value={nextState}
          onChange={(e) => setNextState(e.target.value)}
          className="px-2 py-1 text-white bg-neutral-800 border border-neutral-600 rounded w-full"
        >
          <option value="">Select next state</option>
          {availableStates.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-white"
      >
        Add Outcome
      </button>

      {message && <p className="mt-2 text-green-400">{message}</p>}
      {error && <p className="mt-2 text-red-400">{error}</p>}
    </div>
  );
}
