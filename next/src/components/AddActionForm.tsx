'use client';

import { useEffect, useState } from 'react';

interface Props {
  mdpId: string;
  onActionAdded?: () => void;  // Optional callback
}

export default function AddActionForm({ mdpId, onActionAdded }: Props) {
  const [states, setStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [actionName, setActionName] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🔁 Fetch states on mount
  useEffect(() => {
    if (!mdpId) return;
    fetch(`http://localhost:8000/api/mdp/${mdpId}/states`)
      .then((res) => res.json())
      .then((data) => {
        if (data.states) {
          setStates(data.states);
          setSelectedState(data.states[0] || '');
        } else {
          throw new Error(data?.error || 'Unexpected response');
        }
      })
      .catch((err) => {
        console.error('❌ [AddActionForm] Failed to load states:', err);
        setError(err.message);
      });
  }, [mdpId]);

  const handleSubmit = async () => {
    setMessage(null);
    setError(null);

    if (!selectedState || !actionName) {
      setError('⚠️ Please select a state and enter an action name');
      return;
    }

    try {
      const url = `http://localhost:8000/api/mdp/${mdpId}/action`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: selectedState,
          action: actionName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to add action');
      }

      const msg = data.message || `Action "${actionName}" added to "${selectedState}"`;
      setMessage(msg);
      setActionName('');

      onActionAdded?.();
    } catch (err: any) {
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">🎯 Add Action</h2>

      <div className="mb-2">
        <label className="mr-2 text-white">From state:</label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="bg-neutral-800 text-white border border-neutral-600 px-2 py-1 rounded"
        >
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <input
        type="text"
        value={actionName}
        onChange={(e) => setActionName(e.target.value)}
        placeholder="Action name"
        className="px-2 py-1 mr-2 text-white bg-neutral-800 border border-neutral-600 rounded placeholder-gray-400 focus:outline-none"
      />

      <button
        onClick={handleSubmit}
        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
      >
        Add Action
      </button>

      {message && <p className="mt-2 text-green-400">{message}</p>}
      {error && <p className="mt-2 text-red-400">{error}</p>}
    </div>
  );
}
