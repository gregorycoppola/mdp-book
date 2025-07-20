'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import AddStateForm from '@/components/AddStateForm';
import AllStatesList from '@/components/AllStatesList';

export default function StatesPage() {
  const { mdp_id } = useParams<{ mdp_id: string }>();
  const [refresh, setRefresh] = useState(0);

  return (
    <main className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🌐 States</h1>
      <p className="mb-2 text-green-400">MDP ID: {mdp_id}</p>

      <AddStateForm
        mdpId={mdp_id}
        onStateAdded={() => setRefresh((r) => r + 1)}
      />

      <AllStatesList
        mdpId={mdp_id}
        refreshTrigger={refresh}
      />
    </main>
  );
}
