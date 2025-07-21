'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import AddOutcomeForm from '@/components/AddOutcomeForm';
import AllTransitionsList from '@/components/AllTransitionsList';

export default function TransitionsPage() {
  const { mdp_id } = useParams<{ mdp_id: string }>();
  const [refreshKey, setRefreshKey] = useState(0);

  if (!mdp_id) {
    return <p className="text-red-400">❌ MDP ID not found in URL</p>;
  }

  return (
    <main className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🔀 Transitions</h1>
      <p className="text-green-400 mb-4">MDP ID: {mdp_id}</p>

      <AddOutcomeForm
        mdpId={mdp_id}
        onOutcomeAdded={() => {
          console.log('✅ Outcome added');
          setRefreshKey((prev) => prev + 1); // 🔁 trigger refresh of AllTransitionsList
        }}
      />

      <AllTransitionsList mdpId={mdp_id} refreshTrigger={refreshKey} />
    </main>
  );
}
