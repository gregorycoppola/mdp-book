from fastapi import APIRouter
from pydantic import BaseModel
from core.mdp_store import mdp_store

router = APIRouter()

class RewardInput(BaseModel):
    state: str
    action: str
    next_state: str
    reward: float

@router.post("/{mdp_id}/reward")
def add_reward(mdp_id: str, reward_input: RewardInput):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    mdp["rewards"][reward_input.state][reward_input.action][reward_input.next_state] = reward_input.reward
    return {"message": f"Reward set for ({reward_input.state}, {reward_input.action}, {reward_input.next_state})"}
