'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import SolveMDPButton from '@/components/SolveMDPButton';
import SolutionTable from '@/components/SolutionTable';

export default function SolvePage() {
  const { mdp_id } = useParams<{ mdp_id: string }>();
  const [solved, setSolved] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (!mdp_id) {
    return <p className="text-red-400">❌ MDP ID not found in URL</p>;
  }

  const handleSolved = () => {
    setSolved(true);
    setRefreshTrigger(Date.now());
  };

  return (
    <main className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📈 Solve MDP</h1>
      <p className="text-green-400 mb-6">MDP ID: {mdp_id}</p>

      <SolveMDPButton mdpId={mdp_id} onSolved={handleSolved} />

      {solved && (
        <div className="mt-10">
          <SolutionTable mdpId={mdp_id} refreshTrigger={refreshTrigger} />
        </div>
      )}
    </main>
  );
}
