from fastapi import APIRouter, Path
from pydantic import BaseModel
from core.mdp_store import mdp_store

router = APIRouter()

class StateInput(BaseModel):
    name: str

@router.post("/{mdp_id}/state")
def add_state(mdp_id: str, state: StateInput):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}

    if state.name not in mdp["states"]:
        mdp["states"].append(state.name)

    print("✅ Current states for MDP:", mdp["states"])
    return {"message": f"State {state.name} added"}
