'use client';

import { useEffect, useState } from 'react';

interface Props {
  mdpId: string;
  refreshTrigger?: any;
}

interface Transition {
  next_state: string;
  probability: number;
}

type TransitionsByState = Record<string, Record<string, Transition[]>>;
type RewardsByState = Record<string, Record<string, Record<string, number>>>;

export default function RewardsTable({ mdpId, refreshTrigger }: Props) {
  const [transitions, setTransitions] = useState<TransitionsByState>({});
  const [rewards, setRewards] = useState<RewardsByState>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mdpId) return;

    const fetchAll = async () => {
      try {
        const [transRes, rewardRes] = await Promise.all([
          fetch(`http://localhost:8000/api/mdp/${mdpId}/transitions`),
          fetch(`http://localhost:8000/api/mdp/${mdpId}/rewards`),
        ]);

        const transData = await transRes.json();
        const rewardData = await rewardRes.json();

        if (!transRes.ok || !rewardRes.ok) {
          throw new Error(transData.error || rewardData.error || 'Fetch failed');
        }

        setTransitions(transData.transitions || {});
        setRewards(rewardData.rewards || {});
      } catch (err: any) {
        console.error('❌ [RewardsTable] Failed to load:', err);
        setError(err.message);
      }
    };

    fetchAll();
  }, [mdpId, refreshTrigger]);

  const tableStyle = "border border-gray-600 px-3 py-1";

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">📊 Rewards Table</h2>
      {error && <p className="text-red-400">Error: {error}</p>}

      <table className="w-full border-collapse border border-gray-700 text-sm">
        <thead>
          <tr className="bg-gray-800">
            <th className={tableStyle}>Start State</th>
            <th className={tableStyle}>Action</th>
            <th className={tableStyle}>Next State</th>
            <th className={tableStyle}>Reward</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(transitions).flatMap(([s0, aMap]) =>
            Object.entries(aMap).flatMap(([a, transitions]) =>
              transitions.map(({ next_state: s1 }, i) => {
                const reward = rewards?.[s0]?.[a]?.[s1] ?? 0;
                return (
                  <tr key={`${s0}-${a}-${s1}-${i}`}>
                    <td className={tableStyle}>{s0}</td>
                    <td className={tableStyle}>{a}</td>
                    <td className={tableStyle}>{s1}</td>
                    <td className={tableStyle}>{reward}</td>
                  </tr>
                );
              })
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
