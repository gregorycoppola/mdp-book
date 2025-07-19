from fastapi import APIRouter
from core.mdp_store import mdp_store

router = APIRouter()

@router.post("/{mdp_id}/solve")
def solve_mdp(mdp_id: str):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}

    states = mdp["states"]
    actions = mdp["actions"]
    P = mdp["transitions"]
    R = mdp["rewards"]
    gamma = mdp["gamma"]

    V = {s: 0.0 for s in states}
    threshold = 1e-6

    while True:
        delta = 0
        for s in states:
            v = V[s]
            V[s] = max(
                sum(p * (R[s][a].get(s1, 0.0) + gamma * V[s1]) for p, s1 in P[s][a])
                if a in P[s] else float('-inf')
                for a in actions
            )
            delta = max(delta, abs(v - V[s]))
        if delta < threshold:
            break

    policy = {}
    for s in states:
        best_a = max(actions, key=lambda a:
            sum(p * (R[s][a].get(s1, 0.0) + gamma * V[s1]) for p, s1 in P[s][a])
            if a in P[s] else float('-inf')
        )
        policy[s] = best_a

    mdp["V"] = V
    mdp["policy"] = policy

    return {"message": "Value iteration completed"}
