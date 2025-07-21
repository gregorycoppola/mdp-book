import Link from "next/link";

export default async function MdpLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ mdp_id: string }>;
}) {
  const { mdp_id } = await params; // ⬅️ REQUIRED in Next 15+

  return (
    <>
      <nav className="bg-neutral-900 border-b border-neutral-700 px-6 py-4 flex space-x-4 text-white">
        <Link href="/" className="hover:underline">🏠 Home</Link>
        <Link href={`/mdp/${mdp_id}/states`} className="hover:underline">🧩 States</Link>
        <Link href={`/mdp/${mdp_id}/actions`} className="hover:underline">🎯 Actions</Link>
        <Link href={`/mdp/${mdp_id}/transitions`} className="hover:underline">🔀 Transitions</Link>
        <Link href={`/mdp/${mdp_id}/rewards`} className="hover:underline">💰 Rewards</Link>
        <Link href={`/mdp/${mdp_id}/probabilities`} className="hover:underline">📊 Probabilities</Link>
        <Link href={`/mdp/${mdp_id}/solve`} className="hover:underline">📈 Solve</Link>
        <Link href={`/mdp/${mdp_id}/mdp`} className="hover:underline">🗂 View MDP</Link>
      </nav>
      {children}
    </>
  );
}
