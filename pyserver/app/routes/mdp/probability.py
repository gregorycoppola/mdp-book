from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.responses import JSONResponse

from app.core.mdp_store import load_mdp_from_redis, save_mdp_to_redis
from app.models.mdp_model import MDPModel

router = APIRouter()

class TransitionProbUpdateInput(BaseModel):
    state: str
    action: str
    next_state: str
    probability: float

@router.post("/{mdp_id}/transition/probability")
def update_transition_probability(mdp_id: str, payload: TransitionProbUpdateInput):
    print(f"🔁 [update_transition_probability] mdp_id={mdp_id}, payload={payload.model_dump()}")

    mdp: MDPModel | None = load_mdp_from_redis(mdp_id)
    if not mdp:
        return JSONResponse(status_code=404, content={"error": "MDP not found"})

    # Validate presence of state, action, and next_state
    if payload.state not in mdp.transitions.root:
        return JSONResponse(status_code=400, content={"error": f"No transitions defined for state '{payload.state}'"})

    if payload.action not in mdp.transitions.root[payload.state]:
        return JSONResponse(status_code=400, content={"error": f"No transitions defined for action '{payload.action}' under state '{payload.state}'"})

    if payload.next_state not in mdp.transitions.root[payload.state][payload.action]:
        return JSONResponse(status_code=400, content={"error": f"Next state '{payload.next_state}' not found in transitions for ({payload.state}, {payload.action})"})

    # Update probability
    mdp.transitions.root[payload.state][payload.action][payload.next_state] = payload.probability

    save_mdp_to_redis(mdp_id, mdp)

    print(f"✅ [update_transition_probability] Updated ({payload.state}, {payload.action}) → {payload.next_state} to p={payload.probability}")
    return {"message": f"Updated probability for transition ({payload.state}, {payload.action}) → {payload.next_state} to {payload.probability}"}
