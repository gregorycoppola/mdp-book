from fastapi import APIRouter
from pydantic import BaseModel
from app.core.mdp_store import mdp_store  # ✅ absolute import

router = APIRouter()

class StateInput(BaseModel):
    name: str

@router.post("/{mdp_id}/state")
def add_state(mdp_id: str, state: StateInput):
    print(f"📥 [add_state] Called with mdp_id={mdp_id}, state.name={state.name}")

    mdp = mdp_store.get(mdp_id)
    if not mdp:
        print(f"❌ [add_state] MDP not found for mdp_id={mdp_id}")
        return {"error": "MDP not found"}

    if state.name in mdp["states"]:
        print(f"⚠️ [add_state] State '{state.name}' already exists in MDP {mdp_id}")
    else:
        print(f"➕ [add_state] Adding new state '{state.name}' to MDP {mdp_id}")

    mdp["states"].add(state.name)

    print(f"✅ [add_state] State added. Current states in MDP {mdp_id}: {sorted(mdp['states'])}")

    return {"message": f"State {state.name} added"}
