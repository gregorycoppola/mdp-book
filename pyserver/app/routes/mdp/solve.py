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

            candidates = []
            for a in actions.get(s, []):
                transitions = P.get(s, {}).get(a, [])
                reward_map = R.get(s, {}).get(a, {})
                val = sum(
                    p * (reward_map.get(s1, 0.0) + gamma * V[s1])
                    for p, s1 in transitions
                )
                candidates.append(val)

            if not candidates:
                print(f"⚠️ [solve_mdp] No valid actions for state '{s}' — assigning V[{s}] = 0.0")

            V[s] = max(candidates, default=0.0)
            delta = max(delta, abs(v - V[s]))

        if delta < threshold:
            break

    policy = {}
    for s in states:
        best_action = None
        best_value = float("-inf")

        for a in actions.get(s, []):
            transitions = P.get(s, {}).get(a, [])
            reward_map = R.get(s, {}).get(a, {})
            val = sum(
                p * (reward_map.get(s1, 0.0) + gamma * V[s1])
                for p, s1 in transitions
            )
            if val > best_value:
                best_value = val
                best_action = a

        if best_action is None:
            print(f"⚠️ [solve_mdp] No best action for state '{s}' — setting policy[s] = None")

        policy[s] = best_action

    mdp.V.root = V
    mdp.policy.root = policy

    save_mdp_to_redis(mdp_id, mdp)

    return {"message": "Value iteration completed"}

