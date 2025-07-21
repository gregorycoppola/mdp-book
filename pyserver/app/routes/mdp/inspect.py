# pyserver/app/routes/mdp/inspect.py

from fastapi import APIRouter
from app.core.mdp_store import load_mdp_from_redis  # ✅ use Redis-based loading

router = APIRouter()

@router.get("/{mdp_id}")
def inspect_full_mdp(mdp_id: str):
    mdp = load_mdp_from_redis(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    
    return {
        "states": list(mdp.states),
        "actions": {state: list(actions) for state, actions in mdp.actions.root.items()},
        "transitions": {
            s: {
                a: [{"probability": prob, "next_state": next_state} for next_state, prob in a_dict.items()]
                for a, a_dict in a_map.items()
            }
            for s, a_map in mdp.transitions.root.items()
        },
        "rewards": {
            s: {
                a: {
                    s1: r
                    for s1, r in s1_dict.items()
                }
                for a, s1_dict in a_dict.items()
            }
            for s, a_dict in mdp.rewards.root.items()
        },
        "gamma": mdp.gamma,
        "V": mdp.V.root,
        "policy": mdp.policy.root,
    }


@router.get("/{mdp_id}/states")
def get_states(mdp_id: str):
    mdp = load_mdp_from_redis(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    return {"states": sorted(mdp.states)}

@router.get("/{mdp_id}/actions")
def get_actions(mdp_id: str):
    mdp = load_mdp_from_redis(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    return {"actions": mdp.actions.root}

@router.get("/{mdp_id}/transitions")
def get_transitions(mdp_id: str):
    mdp = load_mdp_from_redis(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    
    return {
        "transitions": {
            s: {
                a: [{"next_state": ns, "probability": p} for ns, p in a_map.items()]
                for a, a_map in s_map.items()
            }
            for s, s_map in mdp.transitions.root.items()
        }
    }


@router.get("/{mdp_id}/rewards")
def get_rewards(mdp_id: str):
    mdp = load_mdp_from_redis(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    return {"rewards": mdp.rewards.root}

@router.get("/{mdp_id}/gamma")
def get_gamma(mdp_id: str):
    mdp = load_mdp_from_redis(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    return {"gamma": mdp.gamma}

@router.get("/{mdp_id}/values")
def get_values(mdp_id: str):
    mdp = load_mdp_from_redis(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    return {"values": mdp.V.root}

@router.get("/{mdp_id}/policy")
def get_policy(mdp_id: str):
    mdp = load_mdp_from_redis(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    return {"policy": mdp.policy.root}

@router.get("/{mdp_id}/solution")
def get_solution(mdp_id: str):
    mdp = load_mdp_from_redis(mdp_id)
    if not mdp:
        raise HTTPException(status_code=404, detail="MDP not found")

    if not mdp.V or not mdp.policy:
        raise HTTPException(status_code=404, detail="Solution not available")

    solution = {
        state: {
            "value": mdp.V.root.get(state, 0.0),
            "best_action": mdp.policy.root.get(state)
        }
        for state in mdp.states
    }

    return {"solution": solution}

@router.get("/{mdp_id}/graph")
def get_mdp_graph(mdp_id: str):
    mdp = load_mdp_from_redis(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}

    return {
        "states": list(mdp.states),
        "actions": {s: list(a) for s, a in mdp.actions.root.items()},
        "transitions": {
            s: {
                a: [{"next_state": ns, "probability": p} for ns, p in a_map.items()]
                for a, a_map in s_map.items()
            }
            for s, s_map in mdp.transitions.root.items()
        }
    }
