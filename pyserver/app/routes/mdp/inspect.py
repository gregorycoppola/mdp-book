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
        "states": sorted(mdp.states),
        "actions": {state: sorted(actions) for state, actions in mdp.actions.root.items()},
        "transitions": {
            s: {
                a: [{"probability": p, "next_state": s1} for (p, s1) in a_list]
                for a, a_list in a_dict.items()
            }
            for s, a_dict in mdp.transitions.root.items()
        },
        "rewards": mdp.rewards.root,
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
    return {"transitions": mdp.transitions.root}

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
