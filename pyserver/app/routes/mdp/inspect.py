from fastapi import APIRouter
from core.mdp_store import mdp_store

router = APIRouter()

@router.get("/{mdp_id}")
def inspect_full_mdp(mdp_id: str):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    
    return {
        "states": list(mdp.states),
        "actions": {state: list(actions) for state, actions in mdp.actions.root.items()},
        "transitions": {
            s: {
                a: [{"probability": p, "next_state": s1} for (p, s1) in a_list]
                for a, a_list in a_dict.items()
            }
            for s, a_dict in mdp.transitions.root.items()
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
    print(f"📥 [get_states] Called with mdp_id={mdp_id}")
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        print(f"❌ [get_states] MDP not found for id={mdp_id}")
        return {"error": "MDP not found"}
    
    states = sorted(mdp.states)
    print(f"📦 [get_states] Retrieved states for MDP {mdp_id}: {states}")
    return {"states": states}

@router.get("/{mdp_id}/actions")
def get_actions(mdp_id: str):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    return {"actions": mdp.actions.root}

@router.get("/{mdp_id}/transitions")
def get_transitions(mdp_id: str):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    return {"transitions": mdp.transitions.root}

@router.get("/{mdp_id}/rewards")
def get_rewards(mdp_id: str):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    return {"rewards": mdp.rewards.root}

@router.get("/{mdp_id}/gamma")
def get_gamma(mdp_id: str):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    return {"gamma": mdp.gamma}

@router.get("/{mdp_id}/values")
def get_values(mdp_id: str):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    return {"values": mdp.V.root}

@router.get("/{mdp_id}/policy")
def get_policy(mdp_id: str):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    return {"policy": mdp.policy.root}
