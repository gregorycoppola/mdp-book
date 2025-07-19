from fastapi import APIRouter
from pydantic import BaseModel
from core.mdp_store import mdp_store

router = APIRouter()

class ActionInput(BaseModel):
    state: str
    action: str

@router.post("/{mdp_id}/action")
def add_action(mdp_id: str, payload: ActionInput):
    print(f"🔍 [add_action] Current keys in mdp_store: {list(mdp_store.keys())}")
    print(f"📥 [add_action] Called with mdp_id={mdp_id}, state={payload.state}, action={payload.action}")
    
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        print(f"❌ [add_action] MDP not found for id={mdp_id}")
        return {"error": "MDP not found"}

    mdp.actions.root.setdefault(payload.state, set()).add(payload.action)
    print(f"✅ [add_action] Action '{payload.action}' added to state '{payload.state}'")
    return {"message": f"Action '{payload.action}' added to state '{payload.state}'"}
