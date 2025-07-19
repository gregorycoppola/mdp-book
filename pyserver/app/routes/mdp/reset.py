from fastapi import APIRouter
from core.mdp_store import mdp_store

router = APIRouter()

@router.post("/{mdp_id}/reset")
def reset_mdp(mdp_id: str):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    mdp["states"].clear()
    mdp["actions"].clear()
    mdp["transitions"].clear()
    mdp["rewards"].clear()
    mdp["V"].clear()
    mdp["policy"].clear()
    return {"message": f"MDP {mdp_id} has been reset"}
