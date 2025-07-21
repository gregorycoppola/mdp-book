'use client';

import { useEffect, useState } from 'react';

interface Props {
  mdpId: string;
  onActionAdded?: () => void;
}

type ActionsByState = Record<string, string[]>;

export default function AddActionForm({ mdpId, onActionAdded }: Props) {
  const [states, setStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [actionName, setActionName] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionsByState, setActionsByState] = useState<ActionsByState>({});

  const loadStates = async () => {
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/api/mdp/${mdpId}/states`);
      const data = await res.json();
      if (res.ok && data.states) {
        setStates(data.states);
        setSelectedState((prev) =>
          data.states.includes(prev) ? prev : data.states[0] || ''
        );
      } else {
        throw new Error(data?.error || 'Failed to load states');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loadActions = async () => {
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/api/mdp/${mdpId}/actions`);
      const data = await res.json();
      if (res.ok && data.actions) {
        setActionsByState(data.actions);
      } else {
        throw new Error(data?.error || 'Failed to load actions');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadStates();
    loadActions();
  }, [mdpId]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault(); // prevent page reload
    setMessage(null);
    setError(null);

    if (!selectedState || !actionName.trim()) {
      setError('⚠️ Please select a state and enter an action name');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/mdp/${mdpId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: selectedState, action: actionName }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || 'Failed to add action');

      setMessage(data.message || `Action "${actionName}" added to "${selectedState}"`);
      setActionName('');
      onActionAdded?.();
      await loadActions();
    } catch (err: any) {
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <h2 className="text-xl font-semibold mb-2">🎯 Add Action</h2>

      <div className="mb-2 flex items-center gap-2">
        <label className="text-white">From state:</label>
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

      <div className="mb-2">
        <input
          type="text"
          value={actionName}
          onChange={(e) => setActionName(e.target.value)}
          placeholder="Action name"
          className="px-2 py-1 text-white bg-neutral-800 border border-neutral-600 rounded placeholder-gray-400 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
      >
        Add Action
      </button>

      {message && <p className="mt-2 text-green-400">{message}</p>}
      {error && <p className="mt-2 text-red-400">{error}</p>}

      <div className="mt-4 text-sm text-white">
        <h3 className="font-semibold">
          Actions for <code>{selectedState}</code>:
        </h3>
        <ul className="list-disc list-inside mt-1">
          {(actionsByState[selectedState] || []).map((a, i) => (
            <li key={i}>{a}</li>
          ))}
          {actionsByState[selectedState]?.length === 0 && <li>(none yet)</li>}
        </ul>
      </div>
    </form>
  );
}
