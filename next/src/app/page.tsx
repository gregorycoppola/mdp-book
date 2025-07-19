'use client';

import { useState } from 'react';

export default function Home() {
  const [mdpId, setMdpId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stateName, setStateName] = useState('');
  const [stateMessage, setStateMessage] = useState<string | null>(null);

  const handleCreateMdp = async () => {
    console.log("🚀 Creating new MDP...");
  
    setLoading(true);
    setError(null);
    setStateMessage(null);
  
    try {
      const res = await fetch('http://localhost:8000/api/mdp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
  
      console.log("📡 Response status:", res.status);
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Server responded with error:", errorText);
        throw new Error(`Error ${res.status}`);
      }
  
      const data = await res.json();
      console.log("📥 Received response JSON:", data);
  
      if (!data?.mdp_id) {
        throw new Error("No mdp_id in response");
      }
  
      setMdpId(data.mdp_id);
      console.log("✅ MDP created successfully. ID:", data.mdp_id);
    } catch (err: any) {
      console.error("❌ Failed to create MDP:", err);
      setError(`Failed to create MDP: ${err.message}`);
    } finally {
      setLoading(false);
      console.log("🔚 MDP creation complete");
    }
  };
  

  const handleAddState = async () => {
    if (!mdpId || !stateName) {
      console.warn("Missing mdpId or stateName");
      return;
    }
  
    console.log("🔧 Submitting new state:", {
      mdpId,
      stateName,
    });
  
    setError(null);
    setStateMessage(null);
  
    try {
      const response = await fetch(`http://localhost:8000/api/mdp/${mdpId}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: stateName }),
      });
  
      console.log("📡 Response status:", response.status);
  
      const data = await response.json();
      console.log("📥 Response data:", data);
  
      if (!response.ok) {
        throw new Error(data?.error || `Status ${response.status}`);
      }
  
      setStateMessage(data.message || `State "${stateName}" added`);
      setStateName('');
      console.log("✅ State added successfully:", stateName);
    } catch (err: any) {
      console.error("❌ Failed to add state:", err);
      setError(`Failed to add state: ${err.message}`);
    }
  };
  

  return (
    <main className="p-8 min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">MDP Creator</h1>

      <button
        onClick={handleCreateMdp}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white mb-4"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'New MDP'}
      </button>

      {mdpId && (
        <div className="mb-6">
          <p className="text-green-400">✅ MDP ID: <code>{mdpId}</code></p>

          <div className="mt-4">
            <label htmlFor="state" className="block mb-1">Add New State:</label>
            <input
              id="state"
              type="text"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              className="px-2 py-1 rounded text-black mr-2"
            />
            <button
              onClick={handleAddState}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded"
            >
              Add State
            </button>
          </div>
        </div>
      )}

      {stateMessage && (
        <p className="mt-4 text-green-300">{stateMessage}</p>
      )}

      {error && (
        <p className="mt-6 text-red-400">
          ❌ {error}
        </p>
      )}
    </main>
  );
}
