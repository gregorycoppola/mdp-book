from fastapi import APIRouter
from core.mdp_store import mdp_store

router = APIRouter()

def validate_mdp_for_solving(mdp: dict) -> tuple[bool, str]:
    states = mdp["states"]
    actions = mdp["actions"]
    transitions = mdp["transitions"]

    for state in states:
        if state not in actions or not actions[state]:
            return False, f"State '{state}' has no actions defined."

        for action in actions[state]:
            if state not in transitions or action not in transitions[state]:
                return False, f"No transitions defined for (state='{state}', action='{action}')."

            for t in transitions[state][action]:
                next_state = t[1] if isinstance(t, tuple) else t.get("next_state")
                if next_state not in states:
                    return False, f"Transition from (state='{state}', action='{action}') leads to unknown state '{next_state}'."

    return True, "MDP is valid"

@router.post("/{mdp_id}/solve")
def solve_mdp(mdp_id: str):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}

    # ✅ Validate MDP structure before solving
    is_valid, msg = validate_mdp_for_solving(mdp)
    if not is_valid:
        return {"error": f"Invalid MDP: {msg}"}

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
                for a in actions[s]
            )
            delta = max(delta, abs(v - V[s]))
        if delta < threshold:
            break

    policy = {}
    for s in states:
        best_a = max(actions[s], key=lambda a:
            sum(p * (R[s][a].get(s1, 0.0) + gamma * V[s1]) for p, s1 in P[s][a])
            if a in P[s] else float('-inf')
        )
        policy[s] = best_a

    mdp["V"] = V
    mdp["policy"] = policy

    return {"message": "Value iteration completed"}
