'use client';

import { useParams } from 'next/navigation';
import AddStateForm from '@/components/AddStateForm';
import AllStatesList from '@/components/AllStatesList';

export default function StatesPage() {
  const params = useParams();
  const mdpId = params?.mdp_id as string;
  const refreshKey = Date.now(); // Can be improved for actual refresh logic

  return (
    <main className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🌐 States</h1>
      <p className="mb-2 text-green-400">MDP ID: {mdpId}</p>
      <AddStateForm mdpId={mdpId} onStateAdded={() => {}} />
      <AllStatesList mdpId={mdpId} refreshTrigger={refreshKey} />
    </main>
  );
}
