'use client';

import { useEffect, useState } from 'react';
import SelectActionPair from './SelectActionPair';

interface Props {
  mdpId: string;
  onProbabilityUpdated?: () => void;
}

export default function AddProbabilityForm({ mdpId, onProbabilityUpdated }: Props) {
  const [sourceState, setSourceState] = useState('');
  const [action, setAction] = useState('');
  const [nextState, setNextState] = useState('');
  const [availableNextStates, setAvailableNextStates] = useState<string[]>([]);
  const [probability, setProbability] = useState('0.0');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Fetch transitions for dropdown of valid next states
  useEffect(() => {
    if (!sourceState || !action) {
      setAvailableNextStates([]);
      return;
    }

    const fetchTransitions = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/mdp/${mdpId}/transitions`);
        const json = await res.json();
        const transitions = json.transitions?.[sourceState]?.[action];
        if (Array.isArray(transitions)) {
          const nexts = transitions.map((t: any) => t.next_state);
          setAvailableNextStates(nexts);
        } else {
          setAvailableNextStates([]);
        }
      } catch (err) {
        console.error("❌ Error fetching transitions:", err);
        setAvailableNextStates([]);
      }
    };

    fetchTransitions();
  }, [sourceState, action, mdpId]);

  const handleSubmit = async () => {
    setMessage(null);
    setError(null);

    const trimmedNextState = nextState.trim();
    const parsedProb = parseFloat(probability.trim());

    if (!sourceState || !action || !trimmedNextState || isNaN(parsedProb)) {
      setError('⚠️ Must select a state/action pair, next state, and valid probability');
      return;
    }

    try {
      const url = `http://localhost:8000/api/mdp/${mdpId}/transition/probability`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: sourceState,
          action,
          next_state: trimmedNextState,
          probability: parsedProb,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to update probability');

      setMessage(data.message || '✅ Probability updated');
      setNextState('');
      setProbability('0.0');
      onProbabilityUpdated?.();
    } catch (err: any) {
      console.error('❌ [AddProbabilityForm] Error:', err);
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">🎲 Set Transition Probability</h2>

      <SelectActionPair
        mdpId={mdpId}
        onPairSelected={(s, a) => {
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
          <option value="">-- Select Next State --</option>
          {availableNextStates.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-white mb-1">Probability:</label>
        <input
          type="text"
          value={probability}
          onChange={(e) => setProbability(e.target.value)}
          placeholder="e.g. 0.5"
          className="px-2 py-1 text-white bg-neutral-800 border border-neutral-600 rounded w-full"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
      >
        Set Probability
      </button>

      {message && <p className="mt-2 text-green-400">{message}</p>}
      {error && <p className="mt-2 text-red-400">{error}</p>}
    </div>
  );
}
