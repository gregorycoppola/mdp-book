'use client';

import { useParams } from 'next/navigation';
import AddRewardForm from '@/components/AddRewardForm';
import SelectActionPair from '@/components/SelectActionPair';

export default function RewardsPage() {
  const params = useParams();
  const mdpId = params?.mdp_id as string;

  if (!mdpId) {
    return <p className="text-red-400">❌ MDP ID not found in URL</p>;
  }

  return (
    <main className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">💰 Add Rewards</h1>
      <p className="text-green-400 mb-4">MDP ID: {mdpId}</p>

      <AddRewardForm
        mdpId={mdpId}
        onRewardAdded={() => console.log('✅ Reward added')}
      />

      <div className="mt-6">
        <SelectActionPair
          mdpId={mdpId}
          onPairSelected={(s, a) =>
            console.log(`🎯 Selected pair: (${s}, ${a})`)
          }
        />
      </div>
    </main>
  );
}
