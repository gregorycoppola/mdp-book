'use client';

import { useState } from 'react';

interface Props {
  mdpId: string;
}

export default function AddStateForm({ mdpId }: Props) {
  const [stateName, setStateName] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  console.log("📦 [AddStateForm] Rendered — mdpId:", mdpId, "| stateName:", stateName);

  const handleSubmit = async () => {
    console.log("🟢 [AddStateForm] Submit clicked — stateName:", stateName);
    setMessage(null);
    setError(null);

    if (!stateName) {
      console.warn("⚠️ [AddStateForm] No state name entered, skipping submit");
      return;
    }

    try {
      const url = `http://localhost:8000/api/mdp/${mdpId}/state`;
      console.log("📡 [AddStateForm] Sending POST to:", url);
      console.log("📤 [AddStateForm] Payload:", { name: stateName });

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: stateName }),
      });

      console.log("📬 [AddStateForm] Response status:", res.status);
      const data = await res.json();
      console.log("📥 [AddStateForm] Response JSON:", data);

      if (!res.ok) {
        console.error("❌ [AddStateForm] Failed response:", data);
        throw new Error(data?.error || 'Failed to add state');
      }

      const msg = data.message || `State "${stateName}" added`;
      setMessage(msg);
      console.log("✅ [AddStateForm] Success:", msg);
      setStateName('');
    } catch (err: any) {
      console.error("🔥 [AddStateForm] Exception caught:", err);
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <div className="mt-6">
      <input
        type="text"
        value={stateName}
        onChange={(e) => {
          setStateName(e.target.value);
          console.log("✏️ [AddStateForm] stateName changed:", e.target.value);
        }}
        placeholder="State name"
        className="px-2 py-1 mr-2 text-black rounded"
      />
      <button
        onClick={handleSubmit}
        className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white"
      >
        Add State
      </button>
      {message && <p className="mt-2 text-green-400">{message}</p>}
      {error && <p className="mt-2 text-red-400">{error}</p>}
    </div>
  );
}
