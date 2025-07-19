from fastapi import APIRouter
from core.mdp_store import mdp_store

router = APIRouter()

@router.get("/{mdp_id}/value-function")
def get_value_function(mdp_id: str):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    if not mdp.get("V"):
        return {"error": "Value function has not been computed yet"}
    return {"value_function": mdp["V"]}
