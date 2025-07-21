'use client';

import { useEffect, useState } from 'react';

import AllStatesList from './AllStatesList';

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

      {error && <p className="text-red-400">Error: {error}</p>}
      {!data && !error && <p className="text-white">Loading...</p>}

      {data && (
        <div className="space-y-6 text-white">
          <AllStatesList
            mdpId={mdpId}
          />
        </div>
      )}
    </div>
  );
}
