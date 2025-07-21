'use client';

import StructureGraph from '@/components/StructureGraph';
import { useParams } from 'next/navigation';


export default function SolutionGraphPage() {
  const { mdp_id } = useParams<{ mdp_id: string }>();

  if (!mdp_id) {
    return <p className="text-red-400">❌ MDP ID not found in URL</p>;
  }

  return (
    <main className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📈 MDP Solution Graph</h1>
      <p className="text-green-400 mb-6">MDP ID: {mdp_id}</p>
      <StructureGraph mdpId={mdp_id} />   
    </main>
  );
}
