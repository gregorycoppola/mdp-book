'use client';

import { useEffect, useState } from 'react';

interface Props {
  mdpId: string;
}

export default function MDPRenderComponent({ mdpId }: Props) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const loadMDP = async () => {
    try {
      setError(null);
      const res = await fetch(`http://localhost:8000/api/mdp/${mdpId}`);
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to load MDP');
      }
      setData(json);
    } catch (err: any) {
      console.error('❌ [MDPRenderComponent] Error loading MDP:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    loadMDP();
  }, [mdpId]);

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold text-white mb-4">📊 Full MDP View</h2>
      <button
        onClick={loadMDP}
        className="mb-4 px-3 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded"
      >
        🔄 Refresh
      </button>
      {error && <p className="text-red-400">Error: {error}</p>}
      {!data && !error && <p className="text-white">Loading...</p>}
      {data && (
        <div className="space-y-6 text-white">
          <section>
            <h3 className="text-xl font-semibold">📌 States</h3>
            <ul className="list-disc list-inside">
              {data.states.map((s: string) => <li key={s}>{s}</li>)}
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold">🎯 Actions</h3>
            {Object.entries(data.actions).map(([state, acts]: [string, string[]]) => (
              <p key={state}><strong>{state}</strong>: {acts.join(', ') || '(none)'}</p>
            ))}
          </section>

          <section>
            <h3 className="text-xl font-semibold">🔁 Transitions</h3>
            {Object.entries(data.transitions).map(([state, actionMap]) => (
              <div key={state}>
                <p className="font-bold">From: {state}</p>
                {Object.entries(actionMap).map(([action, outcomes]: [string, any[]]) => (
                  <div key={action} className="ml-4">
                    <p><em>Action: {action}</em></p>
                    <ul className="list-disc list-inside ml-4">
                      {outcomes.map((o, i) => (
                        <li key={i}>{o.next_state} ({o.probability})</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </section>

          <section>
            <h3 className="text-xl font-semibold">💰 Rewards</h3>
            {Object.entries(data.rewards).map(([s, aDict]) => (
              <div key={s}>
                <p className="font-bold">State: {s}</p>
                {Object.entries(aDict).map(([a, s1Dict]) => (
                  <div key={a} className="ml-4">
                    <p><em>Action: {a}</em></p>
                    <ul className="list-disc list-inside ml-4">
                      {Object.entries(s1Dict).map(([s1, r]) => (
                        <li key={s1}>{s1}: {r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </section>

          <section>
            <h3 className="text-xl font-semibold">⚖️ Gamma</h3>
            <p>{data.gamma}</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold">📈 Value Function</h3>
            <ul className="list-disc list-inside">
              {Object.entries(data.V).map(([s, v]: [string, number]) => (
                <li key={s}>{s}: {v}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold">🧭 Policy</h3>
            <ul className="list-disc list-inside">
              {Object.entries(data.policy).map(([s, a]: [string, string | null]) => (
                <li key={s}>{s}: {a || '(none)'}</li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
