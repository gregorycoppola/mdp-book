# pyserver/app/routes/mdp/transition.py

from fastapi import APIRouter
from pydantic import BaseModel
from app.core.mdp_store import load_mdp_from_redis, save_mdp_to_redis  # ✅ Redis I/O

router = APIRouter()

class TransitionInput(BaseModel):
    state: str
    action: str
    next_state: str
    probability: float

@router.post("/{mdp_id}/transition")
def add_transition(mdp_id: str, transition: TransitionInput):
    print(f"📥 [add_transition] Request for mdp_id={mdp_id}: {transition.model_dump()}")

    mdp = load_mdp_from_redis(mdp_id)
    if not mdp:
        print(f"❌ [add_transition] MDP not found for id={mdp_id}")
        return {"error": "MDP not found"}

    # ✅ Validate state exists
    if transition.state not in mdp.states:
        return {"error": f"State '{transition.state}' does not exist"}
    if transition.next_state not in mdp.states:
        return {"error": f"Next state '{transition.next_state}' does not exist"}

    # ✅ Validate action is defined
    actions_for_state = mdp.actions.root.get(transition.state, set())
    if transition.action not in actions_for_state:
        return {"error": f"Action '{transition.action}' not defined for state '{transition.state}'"}

    # ✅ Add transition
    mdp.transitions.root.setdefault(transition.state, {}).setdefault(transition.action, []).append(
        (transition.probability, transition.next_state)
    )

    save_mdp_to_redis(mdp_id, mdp)  # ✅ Persist
    print(f"✅ [add_transition] Transition recorded for {transition.state} --{transition.action}/{transition.probability}--> {transition.next_state}")

    return {
        "message": f"Transition added: ({transition.state}, {transition.action}) -> {transition.next_state} [{transition.probability}]"
    }
