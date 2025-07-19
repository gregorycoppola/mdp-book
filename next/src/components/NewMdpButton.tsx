'use client';

import { useState } from 'react';

interface Props {
  onCreated: (id: string) => void;
}

export default function NewMdpButton({ onCreated }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    console.log("🟢 [NewMdpButton] Clicked");

    setLoading(true);
    console.log("🔄 [NewMdpButton] Setting loading = true");

    try {
      console.log("📡 [NewMdpButton] Sending POST request to /api/mdp/");
      const res = await fetch('http://localhost:8000/api/mdp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      console.log("📬 [NewMdpButton] Response status:", res.status);
      const data = await res.json();
      console.log("📥 [NewMdpButton] Response JSON:", data);

      if (!res.ok || !data?.mdp_id) {
        console.error("❌ [NewMdpButton] Invalid response:", data);
        throw new Error(data?.error || 'Failed to create MDP');
      }

      console.log("✅ [NewMdpButton] Successfully created MDP:", data.mdp_id);
      onCreated(data.mdp_id);
    } catch (err) {
      console.error("🔥 [NewMdpButton] Error creating MDP:", err);
    } finally {
      setLoading(false);
      console.log("🔽 [NewMdpButton] Setting loading = false");
    }
  };

  console.log("📦 [NewMdpButton] Rendered, loading =", loading);

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
    >
      {loading ? 'Creating...' : 'New MDP'}
    </button>
  );
}
