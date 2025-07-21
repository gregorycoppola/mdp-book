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

  const tableStyle = "border border-gray-600 px-3 py-1";

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
              {data.states.map((s: string) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold">🎯 Actions</h3>
            {Object.entries(data.actions).map(([state, actions]: [string, string[]]) => (
              <div key={state}>
                <p className="font-bold">{state}</p>
                <ul className="list-disc list-inside ml-4">
                  {actions.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                  {actions.length === 0 && <li>(none)</li>}
                </ul>
              </div>
            ))}
          </section>

          <section>
            <h3 className="text-xl font-semibold">🔁 Transitions</h3>
            {Object.entries(data.transitions).map(([s0, actionMap]) => (
              <div key={s0} className="mb-4">
                <p className="font-bold mb-2">From: {s0}</p>
                <table className="w-full border-collapse border border-gray-700 text-sm">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className={tableStyle}>Action</th>
                      <th className={tableStyle}>Next State</th>
                      <th className={tableStyle}>Probability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(actionMap).flatMap(
                      ([a, nextMap]: [string, Record<string, number>]) =>
                        Object.entries(nextMap).map(([s1, prob]) => (
                          <tr key={`${s0}-${a}-${s1}`}>
                            <td className={tableStyle}>{a}</td>
                            <td className={tableStyle}>{s1}</td>
                            <td className={tableStyle}>{prob}</td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            ))}
          </section>

          <section>
            <h3 className="text-xl font-semibold">💰 Rewards</h3>
            {Object.entries(data.rewards).map(([s0, aMap]) => (
              <div key={s0} className="mb-4">
                <p className="font-bold mb-2">From: {s0}</p>
                <table className="w-full border-collapse border border-gray-700 text-sm">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className={tableStyle}>Action</th>
                      <th className={tableStyle}>Next State</th>
                      <th className={tableStyle}>Reward</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(aMap).flatMap(
                      ([a, s1Map]: [string, Record<string, number>]) =>
                        Object.entries(s1Map).map(([s1, r]) => (
                          <tr key={`${s0}-${a}-${s1}`}>
                            <td className={tableStyle}>{a}</td>
                            <td className={tableStyle}>{s1}</td>
                            <td className={tableStyle}>{r}</td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            ))}
          </section>

          <section>
            <h3 className="text-xl font-semibold">⚖️ Gamma</h3>
            <p>{data.gamma}</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold">📈 Value Function</h3>
            <table className="w-1/2 border-collapse border border-gray-700 text-sm">
              <thead>
                <tr className="bg-gray-800">
                  <th className={tableStyle}>State</th>
                  <th className={tableStyle}>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.V).map(([s, v]: [string, number]) => (
                  <tr key={s}>
                    <td className={tableStyle}>{s}</td>
                    <td className={tableStyle}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <h3 className="text-xl font-semibold">🧭 Policy</h3>
            <table className="w-1/2 border-collapse border border-gray-700 text-sm">
              <thead>
                <tr className="bg-gray-800">
                  <th className={tableStyle}>State</th>
                  <th className={tableStyle}>Best Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.policy).map(([s, a]: [string, string | null]) => (
                  <tr key={s}>
                    <td className={tableStyle}>{s}</td>
                    <td className={tableStyle}>{a || '(none)'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      )}
    </div>
  );
}
