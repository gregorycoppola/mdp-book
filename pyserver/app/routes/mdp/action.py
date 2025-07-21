# pyserver/app/routes/mdp/action.py

from fastapi import APIRouter
from pydantic import BaseModel
from app.core.mdp_store import load_mdp_from_redis, save_mdp_to_redis  # ✅ Redis-backed I/O

router = APIRouter()

class ActionInput(BaseModel):
    state: str
    action: str

@router.post("/{mdp_id}/action")
def add_action(mdp_id: str, payload: ActionInput):
    print(f"📥 [add_action] Called with mdp_id={mdp_id}, state={payload.state}, action={payload.action}")

    mdp = load_mdp_from_redis(mdp_id)
    if not mdp:
        print(f"❌ [add_action] MDP not found for id={mdp_id}")
        return {"error": "MDP not found"}

    if payload.state not in mdp.actions.root:
        print(f"➕ [add_action] No actions for state '{payload.state}', initializing list")
        mdp.actions.root[payload.state] = []

    if payload.action not in mdp.actions.root[payload.state]:
        mdp.actions.root[payload.state].append(payload.action)
        print(f"✅ [add_action] Action '{payload.action}' added to state '{payload.state}'")
    else:
        print(f"⚠️ [add_action] Action '{payload.action}' already exists for state '{payload.state}'")

    save_mdp_to_redis(mdp_id, mdp)
    return {"message": f"Action '{payload.action}' added to state '{payload.state}'"}
