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
    mdp["transitions"][transition.state][transition.action].append(
        (transition.probability, transition.next_state)
    )
    return {"message": f"Transition added: ({transition.state}, {transition.action}) -> {transition.next_state} [{transition.probability}]"}
