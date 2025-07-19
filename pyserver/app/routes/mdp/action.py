from fastapi import APIRouter, Path
from pydantic import BaseModel
from core.mdp_store import mdp_store

router = APIRouter()

class ActionInput(BaseModel):
    name: str

@router.post("/{mdp_id}/action")
def add_action(mdp_id: str, action: ActionInput):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    mdp["actions"].add(action.name)
    return {"message": f"Action '{action.name}' added"}
