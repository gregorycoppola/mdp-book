'use client';

import { useEffect, useState } from 'react';
import SelectActionPair from './SelectActionPair';

interface Props {
  mdpId: string;
  onRewardAdded?: () => void;
}

export default function AddRewardForm({ mdpId, onRewardAdded }: Props) {
  const [sourceState, setSourceState] = useState('');
  const [action, setAction] = useState('');
  const [nextState, setNextState] = useState('');
  const [availableNextStates, setAvailableNextStates] = useState<string[]>([]);
  const [reward, setReward] = useState('0.0');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Populate next state dropdown based on selected (state, action)
  useEffect(() => {
    if (!sourceState || !action) {
      setAvailableNextStates([]);
      return;
    }

    const fetchTransitions = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/mdp/${mdpId}`);
        const json = await res.json();
        const transitions = json.transitions?.[sourceState]?.[action];
        setAvailableNextStates(Array.isArray(transitions) ? transitions.map((t: any) => t.next_state) : []);
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
    const parsedReward = parseFloat(reward.trim());

    if (!sourceState || !action || !trimmedNextState || isNaN(parsedReward)) {
      setError('⚠️ Must select a state/action pair, next state, and valid reward');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/mdp/${mdpId}/reward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: sourceState, action, next_state: trimmedNextState, reward: parsedReward }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to add reward');

      setMessage(data.message || '✅ Reward added');
      setNextState('');
      setReward('0.0');
      onRewardAdded?.(); // let parent component re-render reward table if needed
    } catch (err: any) {
      console.error('❌ [AddRewardForm] Error:', err);
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">💰 Add Reward</h2>

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
        <label className="block text-white mb-1">Reward:</label>
        <input
          type="text"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          placeholder="e.g. 10.0"
          className="px-2 py-1 text-white bg-neutral-800 border border-neutral-600 rounded w-full"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white"
      >
        Add Reward
      </button>

      {message && <p className="mt-2 text-green-400">{message}</p>}
      {error && <p className="mt-2 text-red-400">{error}</p>}
    </div>
  );
}
