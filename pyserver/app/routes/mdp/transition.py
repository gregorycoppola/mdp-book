from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import logging

from app.core.mdp_store import load_mdp_from_redis, save_mdp_to_redis

router = APIRouter()
logger = logging.getLogger(__name__)

# 🚫 No longer includes probability
class TransitionInput(BaseModel):
    state: str
    action: str
    next_state: str

@router.post("/{mdp_id}/transition")
def add_transition(mdp_id: str, transition: TransitionInput):
    print(f"📥 [add_transition] Request for mdp_id={mdp_id}: {transition.model_dump()}")

    mdp = load_mdp_from_redis(mdp_id)
    if not mdp:
        return JSONResponse(status_code=404, content={"error": "MDP not found"})

    if transition.state not in mdp.states:
        return JSONResponse(status_code=400, content={"error": f"State '{transition.state}' does not exist"})

    if transition.next_state not in mdp.states:
        return JSONResponse(status_code=400, content={"error": f"Next state '{transition.next_state}' does not exist"})

    if transition.action not in mdp.actions.root.get(transition.state, set()):
        return JSONResponse(status_code=400, content={
            "error": f"Action '{transition.action}' not defined for state '{transition.state}'"
        })

    # ✅ Initialize transition slot without setting probability
    mdp.transitions.root \
        .setdefault(transition.state, {}) \
        .setdefault(transition.action, {}) \
        .setdefault(transition.next_state, None)

    save_mdp_to_redis(mdp_id, mdp)
    print(f"✅ [add_transition] Added ({transition.state}, {transition.action}) -> {transition.next_state}")
    return {
        "message": f"Transition added: ({transition.state}, {transition.action}) -> {transition.next_state}"
    }
