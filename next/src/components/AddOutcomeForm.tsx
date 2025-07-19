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
  const [probability, setProbability] = useState<string>('1.0'); // as string for form input
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setMessage(null);
    setError(null);

    const parsedProb = parseFloat(probability);

    if (!sourceState || !action || !nextState || isNaN(parsedProb)) {
      setError('⚠️ Must select state, action, and next state and provide a valid probability');
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
          probability: parsedProb,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('❌ [AddOutcomeForm] Server error:', data);
        setError(data?.error || '❌ Failed to add outcome');
        return;
      }

      const msg = data.message || `Outcome "${nextState}" added to (${sourceState}, ${action}) with p=${parsedProb}`;
      setMessage(msg);
      setNextState('');
      setProbability('1.0');
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

      <div className="mb-3">
        <label className="block text-white mb-1">Probability:</label>
        <input
          type="text"
          value={probability}
          onChange={(e) => setProbability(e.target.value)}
          placeholder="e.g. 0.8"
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
