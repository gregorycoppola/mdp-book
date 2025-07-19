'use client';

import { useState } from 'react';
import SelectActionPair from './SelectActionPair';

interface Props {
  mdpId: string;
  onOutcomeAdded?: () => void;
}

export default function AddOutcomeForm({ mdpId, onOutcomeAdded }: Props) {
  const [sourceState, setSourceState] = useState<string>('');
  const [action, setAction] = useState<string>('');
  const [nextState, setNextState] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setMessage(null);
    setError(null);

    if (!sourceState || !action || !nextState) {
      setError('⚠️ Must select state, action, and next state');
      return;
    }

    try {
      const url = `http://localhost:8000/api/mdp/${mdpId}/transition`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: sourceState,
          action,
          next_state: nextState,
          probability: 1.0, // dummy value
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to add outcome');
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
        <input
          type="text"
          value={nextState}
          onChange={(e) => setNextState(e.target.value)}
          placeholder="e.g. sunny-beach"
          className="px-2 py-1 text-white bg-neutral-800 border border-neutral-600 rounded w-full"
        />
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
