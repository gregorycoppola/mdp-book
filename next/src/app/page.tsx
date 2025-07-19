'use client';

import { useState } from 'react';
import NewMdpButton from '@/components/NewMdpButton';
import AddStateForm from '@/components/AddStateForm';
import AllStatesList from '@/components/AllStatesList';
import AddActionForm from '@/components/AddActionForm';

console.log("🧪 Import check - NewMdpButton:", typeof NewMdpButton);
console.log("🧪 Import check - AddStateForm:", typeof AddStateForm);
console.log("🧪 Import check - AllStatesList:", typeof AllStatesList);

export default function HomePage() {
  const [mdpId, setMdpId] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  const handleNewMdp = (id: string) => {
    console.log("✅ [HomePage] New MDP created:", id);
    setMdpId(id);
    setRefresh(0);
  };

  const handleStateAdded = () => {
    console.log("🔁 [HomePage] State added — refreshing state list");
    setRefresh((r) => r + 1);
  };

  return (
    <main className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">MDP Creator</h1>
      <NewMdpButton onCreated={handleNewMdp} />
      {mdpId && (
        <>
          <p className="mt-4 text-green-400">MDP ID: {mdpId}</p>
          <AddStateForm mdpId={mdpId} onStateAdded={handleStateAdded} />
          <AllStatesList mdpId={mdpId} refreshTrigger={refresh} />
          <AddActionForm mdpId={mdpId} onActionAdded={() => console.log('🔄 Action added')} />
        </>
      )}
    </main>
  );
}
