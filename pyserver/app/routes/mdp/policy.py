from fastapi import APIRouter
from core.mdp_store import mdp_store

router = APIRouter()

@router.get("/{mdp_id}/policy")
def get_policy(mdp_id: str):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    if not mdp.get("policy"):
        return {"error": "Policy has not been computed yet"}
    return {"policy": mdp["policy"]}
