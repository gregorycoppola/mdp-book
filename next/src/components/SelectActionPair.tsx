import { useEffect, useState } from 'react';

interface Props {
  mdpId: string;
  onPairSelected?: (state: string, action: string) => void;
}

export default function SelectActionPair({ mdpId, onPairSelected }: Props) {
    const [states, setStates] = useState<string[]>([]);
    const [actions, setActions] = useState<Record<string, string[]>>({});
    const [selectedState, setSelectedState] = useState('');
    const [selectedAction, setSelectedAction] = useState('');
  
    const fetchStatesAndActions = async () => {
      try {
        const stateRes = await fetch(`http://localhost:8000/api/mdp/${mdpId}/states`);
        const stateData = await stateRes.json();
        setStates(stateData.states || []);
  
        const actionRes = await fetch(`http://localhost:8000/api/mdp/${mdpId}/actions`);
        const actionData = await actionRes.json();
        setActions(actionData.actions || {});
      } catch (err) {
        console.error('Failed to fetch states/actions:', err);
      }
    };
  
    useEffect(() => {
      fetchStatesAndActions();
    }, [mdpId]);
  
    useEffect(() => {
      onPairSelected?.(selectedState, selectedAction);
    }, [selectedState, selectedAction]);
  
    return (
      <div className="mb-4">
        <label className="block text-white mb-1">Source State:</label>
        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedAction('');
          }}
          className="px-2 py-1 text-white bg-neutral-800 border border-neutral-600 rounded"
          >
          <option value="">Select state</option>
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
  
        <label className="block text-white mt-3 mb-1">Action:</label>
        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          disabled={!selectedState}
          className="px-2 py-1 text-white bg-neutral-800 border border-neutral-600 rounded"
          >
          <option value="">Select action</option>
          {(actions[selectedState] || []).map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
  
        {selectedState && selectedAction && (
          <p className="text-sm text-gray-400 mt-2">
            Selected: <code>{selectedState}</code> → <code>{selectedAction}</code>
          </p>
        )}

      </div>
    );
  }
  