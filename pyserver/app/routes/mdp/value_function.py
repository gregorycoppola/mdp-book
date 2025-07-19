# pyserver/app/routes/mdp/value_function.py

from fastapi import APIRouter
from app.core.mdp_store import load_mdp_from_redis  # ✅ Redis storage

router = APIRouter()

@router.get("/{mdp_id}/value-function")
def get_value_function(mdp_id: str):
    print(f"📥 [get_value_function] Called with mdp_id={mdp_id}")
    
    mdp = load_mdp_from_redis(mdp_id)
    if not mdp:
        print(f"❌ [get_value_function] MDP not found for id={mdp_id}")
        return {"error": "MDP not found"}

    if not mdp.V:
        print(f"⚠️ [get_value_function] Value function has not been computed yet for MDP {mdp_id}")
        return {"error": "Value function has not been computed yet"}

    print(f"✅ [get_value_function] Returning value function for MDP {mdp_id}")
    return {"value_function": mdp.V}
