# pyserver/app/routes/mdp/solve.py

from fastapi import APIRouter
from app.core.mdp_store import load_mdp_from_redis, save_mdp_to_redis
from app.models.mdp_model import MDPModel
from app.utils.pretty_print import print_graph_structure
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/{mdp_id}/solve")
def solve_mdp(mdp_id: str):
    mdp: MDPModel = load_mdp_from_redis(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}

    print_graph_structure(mdp)  # for debugging

    V = run_value_iteration(mdp)
    policy = extract_policy(mdp, V)

    mdp.V.root = V
    mdp.policy.root = policy
    save_mdp_to_redis(mdp_id, mdp)

    return {
        "message": "Value iteration completed",
        "V": V,
        "policy": policy
    }


def run_value_iteration(mdp: MDPModel, threshold: float = 1e-6) -> dict:
    states = mdp.states
    actions = mdp.actions.root
    P = mdp.transitions.root
    R = mdp.rewards.root
    gamma = mdp.gamma

    V = {s: 0.0 for s in states}

    while True:
        delta = 0
        for s in states:
            v = V[s]
            values = []
            for a in actions.get(s, []):
                transitions = P.get(s, {}).get(a, {}).items()
                reward_map = R.get(s, {}).get(a, {})
                value = sum(
                    prob * (reward_map.get(s1, 0.0) + gamma * V.get(s1, 0.0))
                    for s1, prob in transitions
                )
                values.append(value)
            V[s] = max(values, default=0.0)
            delta = max(delta, abs(v - V[s]))
        if delta < threshold:
            break

    return V


def extract_policy(mdp: MDPModel, V: dict) -> dict:
    states = mdp.states
    actions = mdp.actions.root
    P = mdp.transitions.root
    R = mdp.rewards.root
    gamma = mdp.gamma

    policy = {}

    for s in states:
        best_action = None
        best_value = float('-inf')

        for a in actions.get(s, []):
            transitions = P.get(s, {}).get(a, {}).items()
            reward_map = R.get(s, {}).get(a, {})
            value = sum(
                prob * (reward_map.get(s1, 0.0) + gamma * V.get(s1, 0.0))
                for s1, prob in transitions
            )
            if value > best_value:
                best_value = value
                best_action = a

        policy[s] = best_action

    return policy
