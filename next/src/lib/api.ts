export async function createMdp(): Promise<string> {
    const res = await fetch('http://localhost:8000/api/mdp/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  
    const data = await res.json();
    if (!res.ok || !data?.mdp_id) throw new Error(data?.error || 'Failed to create MDP');
    return data.mdp_id;
  }
  
  export async function addState(mdpId: string, name: string): Promise<string> {
    const res = await fetch(`http://localhost:8000/api/mdp/${mdpId}/state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || 'Failed to add state');
    return data.message;
  }
  