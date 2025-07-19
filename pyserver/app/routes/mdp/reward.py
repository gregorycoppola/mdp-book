# pyserver/app/routes/mdp/reward.py

from fastapi import APIRouter
from pydantic import BaseModel
from app.core.mdp_store import load_mdp_from_redis, save_mdp_to_redis
from app.models.mdp_model import MDPModel

router = APIRouter()

class RewardInput(BaseModel):
    state: str
    action: str
    next_state: str
    reward: float

@router.post("/{mdp_id}/reward")
def add_reward(mdp_id: str, reward_input: RewardInput):
    print(f"📥 [add_reward] Request for mdp_id={mdp_id}: {reward_input.model_dump()}")

    mdp: MDPModel | None = load_mdp_from_redis(mdp_id)
    if not mdp:
        print(f"❌ [add_reward] MDP not found for id={mdp_id}")
        return {"error": "MDP not found"}

    # 🧠 Validation (optional but helpful for debug)
    if reward_input.state not in mdp.states:
        return {"error": f"State '{reward_input.state}' not found in MDP"}
    if reward_input.next_state not in mdp.states:
        return {"error": f"Next state '{reward_input.next_state}' not found in MDP"}
    if reward_input.action not in mdp.actions.root.get(reward_input.state, set()):
        return {"error": f"Action '{reward_input.action}' not defined for state '{reward_input.state}'"}

    # ✅ Store reward
    mdp.rewards.root \
        .setdefault(reward_input.state, {}) \
        .setdefault(reward_input.action, {})[reward_input.next_state] = reward_input.reward

    save_mdp_to_redis(mdp_id, mdp)
    print(f"✅ [add_reward] Reward set for ({reward_input.state}, {reward_input.action}, {reward_input.next_state}) = {reward_input.reward}")

    return {
        "message": f"Reward set for ({reward_input.state}, {reward_input.action}, {reward_input.next_state})"
    }
