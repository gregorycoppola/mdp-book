# pyserver/app/core/mdp_store.py

import redis
from uuid import uuid4
from app.models.mdp_model import MDPModel, Actions, Transitions, Rewards, ValueFunction, Policy
from collections import OrderedDict

# 🔌 Connect to Redis (localhost:6379 assumed)
r = redis.Redis(host="localhost", port=6379, decode_responses=True)

def save_mdp_to_redis(mdp_id: str, mdp: MDPModel):
    json_str = mdp.model_dump_json()
    r.set(f"mdp:{mdp_id}", json_str)

def load_mdp_from_redis(mdp_id: str) -> MDPModel | None:
    json_str = r.get(f"mdp:{mdp_id}")
    if json_str is None:
        return None
    return MDPModel.model_validate_json(json_str)

def delete_mdp_from_redis(mdp_id: str) -> bool:
    """Deletes the MDP entry from Redis. Returns True if deleted, False otherwise."""
    return r.delete(f"mdp:{mdp_id}") > 0


def create_mdp() -> str:
    mdp_id = str(uuid4())
    mdp = MDPModel(
        states=[],  # ✅ preserve order
        actions=Actions(OrderedDict()),  # ✅ ordered
        transitions=Transitions(OrderedDict()),
        rewards=Rewards(OrderedDict()),
        gamma=1.0,
        V=ValueFunction(OrderedDict()),
        policy=Policy(OrderedDict())
    )
    save_mdp_to_redis(mdp_id, mdp)
    return mdp_id

