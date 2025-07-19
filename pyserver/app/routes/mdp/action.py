from fastapi import APIRouter
from pydantic import BaseModel
from core.mdp_store import mdp_store

router = APIRouter()

class ActionInput(BaseModel):
    state: str
    action: str

@router.post("/{mdp_id}/action")
def add_action(mdp_id: str, payload: ActionInput):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}

    mdp["actions"][payload.state].add(payload.action)
    return {"message": f"Action '{payload.action}' added to state '{payload.state}'"}
