from fastapi import APIRouter
from core.mdp_store import mdp_store

router = APIRouter()

@router.get("/{mdp_id}")
def inspect_full_mdp(mdp_id: str):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    return {
        "states": list(mdp["states"]),
        "actions": list(mdp["actions"]),
        "transitions": mdp["transitions"],
        "rewards": mdp["rewards"],
        "gamma": mdp["gamma"]
    }

@router.get("/{mdp_id}/states")
def get_states(mdp_id: str):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    return {"states": list(mdp["states"])}

@router.get("/{mdp_id}/actions")
def get_actions(mdp_id: str):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    return {"actions": list(mdp["actions"])}

@router.get("/{mdp_id}/transitions")
def get_transitions(mdp_id: str):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    return {"transitions": mdp["transitions"]}

@router.get("/{mdp_id}/rewards")
def get_rewards(mdp_id: str):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    return {"rewards": mdp["rewards"]}

@router.get("/{mdp_id}/gamma")
def get_gamma(mdp_id: str):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    return {"gamma": mdp["gamma"]}
