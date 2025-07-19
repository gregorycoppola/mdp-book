# pyserver/app/core/mdp_store.py

import redis
from uuid import uuid4
from models.mdp_model import MDPModel, Actions, Transitions, Rewards, ValueFunction, Policy

# 🔌 Connect to Redis (localhost:6379 assumed)
r = redis.Redis(host="localhost", port=6379, decode_responses=True)

def save_mdp_to_redis(mdp_id: str, mdp: MDPModel):
    json_str = mdp.model_dump_json()
    r.set(mdp_id, json_str)

def load_mdp_from_redis(mdp_id: str) -> MDPModel | None:
    json_str = r.get(mdp_id)
    if json_str is None:
        return None
    return MDPModel.model_validate_json(json_str)

def create_mdp() -> str:
    mdp_id = str(uuid4())
    mdp = MDPModel(
        states=set(),
        actions=Actions(set()),
        transitions=Transitions({}),
        rewards=Rewards({}),
        gamma=0.9,
        V=ValueFunction({}),
        policy=Policy({})
    )
    save_mdp_to_redis(mdp_id, mdp)
    return mdp_id
