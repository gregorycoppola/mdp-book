'use client';

import { useRouter } from 'next/navigation';
import NewMdpButton from '@/components/NewMdpButton';

export default function HomePage() {
  const router = useRouter();

  const handleNewMdp = (id: string) => {
    console.log('✅ [HomePage] New MDP created:', id);
    router.push(`/mdp/${id}/states`);
  };

  return (
    <main className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">MDP Creator</h1>
      <p className="mb-4 text-gray-400">Click below to start a new Markov Decision Process</p>
      <NewMdpButton onCreated={handleNewMdp} />
    </main>
  );
}
