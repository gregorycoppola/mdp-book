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

            candidates = [
                sum(
                    p * (R.get(s, {}).get(a, {}).get(s1, 0.0) + gamma * V[s1])
                    for p, s1 in P.get(s, {}).get(a, [])
                )
                for a in actions.get(s, [])
                if a in P.get(s, {})
            ]

            if not candidates:
                print(f"⚠️ [solve_mdp] No valid actions for state '{s}' — assigning V[{s}] = 0.0")

            V[s] = max(candidates, default=0.0)
            delta = max(delta, abs(v - V[s]))
        if delta < threshold:
            break

    policy = {}
    for s in states:
        action_values = {
            a: sum(
                p * (R.get(s, {}).get(a, {}).get(s1, 0.0) + gamma * V[s1])
                for p, s1 in P.get(s, {}).get(a, [])
            )
            for a in actions.get(s, [])
            if a in P.get(s, {})
        }

        if not action_values:
            print(f"⚠️ [solve_mdp] No policy options for state '{s}' — assigning policy[s] = None")
            policy[s] = None
        else:
            policy[s] = max(action_values, key=action_values.get)

    mdp.V.root = V
    mdp.policy.root = policy

    save_mdp_to_redis(mdp_id, mdp)

    return {"message": "Value iteration completed"}

