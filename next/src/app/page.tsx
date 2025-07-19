'use client';
import { useState } from 'react';
import NewMdpButton from '@/components/NewMdpButton';
import AddStateForm from '@/components/AddStateForm';

export default function HomePage() {
  const [mdpId, setMdpId] = useState<string | null>(null);

  return (
    <main className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">MDP Creator</h1>
      <NewMdpButton onCreated={setMdpId} />
      {mdpId && (
        <>
          <p className="mt-4 text-green-400">MDP ID: {mdpId}</p>
          <AddStateForm mdpId={mdpId} />
        </>
      )}
    </main>
  );
}
