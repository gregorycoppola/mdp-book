'use client';

import { useParams } from 'next/navigation';
import SelectActionPair from '@/components/SelectActionPair';
import AddOutcomeForm from '@/components/AddOutcomeForm';

export default function TransitionsPage() {
  const { mdp_id } = useParams<{ mdp_id: string }>();

  return (
    <main className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🔀 Transitions</h1>
      <p className="text-green-400 mb-4">MDP ID: {mdp_id}</p>

      <SelectActionPair
        mdpId={mdp_id}
        onPairSelected={(s, a) =>
          console.log(`🎯 Selected pair: (${s}, ${a})`)
        }
      />

      <div className="mt-6">
        <AddOutcomeForm
          mdpId={mdp_id}
          onOutcomeAdded={() => console.log('✅ Outcome added')}
        />
      </div>
    </main>
  );
}
