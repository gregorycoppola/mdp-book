# pyserver/app/routes/mdp/solve.py

from fastapi import APIRouter
from app.core.mdp_store import load_mdp_from_redis, save_mdp_to_redis
from app.models.mdp_model import MDPModel

router = APIRouter()

@router.post("/{mdp_id}/solve")
def solve_mdp(mdp_id: str):
    mdp: MDPModel = load_mdp_from_redis(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}

    states = mdp.states
    actions = mdp.actions.root
    P = mdp.transitions.root
    R = mdp.rewards.root
    gamma = mdp.gamma

    V = {s: 0.0 for s in states}
    threshold = 1e-6

    while True:
        delta = 0
        for s in states:
            v = V[s]
            V[s] = max(
                sum(p * (R[s][a].get(s1, 0.0) + gamma * V[s1]) for s1, p in P[s][a].items())
                if a in P[s] else float('-inf')
                for a in actions.get(s, [])
            )
            delta = max(delta, abs(v - V[s]))
        if delta < threshold:
            break

    policy = {}
    for s in states:
        best_a = max(
            actions.get(s, []),
            key=lambda a: sum(p * (R[s][a].get(s1, 0.0) + gamma * V[s1]) for s1, p in P[s][a].items())
            if a in P[s] else float('-inf'),
            default=None
        )
        policy[s] = best_a

    mdp.V.root = V
    mdp.policy.root = policy

    save_mdp_to_redis(mdp_id, mdp)

    return {"message": "Value iteration completed"}
