import { useParams } from 'next/navigation';
import AddStateForm from '@/components/AddStateForm';

export default function MdpPage() {
  const { id } = useParams();

  if (typeof id !== 'string') return <div>Invalid MDP ID</div>;

  return (
    <main className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-2xl mb-4">Editing MDP: {id}</h1>
      <AddStateForm mdpId={id} />
    </main>
  );
}
