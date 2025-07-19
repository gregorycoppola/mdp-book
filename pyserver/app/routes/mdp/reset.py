# pyserver/app/routes/mdp/reset.py

from fastapi import APIRouter
from app.core.mdp_store import delete_mdp_from_redis  # ✅ new Redis-based function

router = APIRouter()

@router.delete("/{mdp_id}")
def reset_mdp(mdp_id: str):
    deleted = delete_mdp_from_redis(mdp_id)
    if not deleted:
        return {"error": "MDP not found or already deleted"}
    return {"message": f"MDP {mdp_id} has been reset"}
