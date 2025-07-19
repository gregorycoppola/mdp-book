from fastapi import APIRouter
from pydantic import BaseModel
from core.mdp_store import mdp_store

router = APIRouter()

class TransitionInput(BaseModel):
    state: str
    action: str
    next_state: str
    probability: float

@router.post("/{mdp_id}/transition")
def add_transition(mdp_id: str, transition: TransitionInput):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}

    # ✅ Validate state exists
    if transition.state not in mdp["states"]:
        return {"error": f"State '{transition.state}' does not exist"}

    if transition.next_state not in mdp["states"]:
        return {"error": f"Next state '{transition.next_state}' does not exist"}

    # ✅ Validate action is defined for the state
    if transition.action not in mdp["actions"][transition.state]:
        return {"error": f"Action '{transition.action}' not defined for state '{transition.state}'"}

    mdp["transitions"][transition.state][transition.action].append(
        (transition.probability, transition.next_state)
    )

    return {"message": f"Transition added: ({transition.state}, {transition.action}) -> {transition.next_state} [{transition.probability}]"}
