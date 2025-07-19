# pyserver/app/routes/mdp/policy.py

from fastapi import APIRouter
from app.core.mdp_store import load_mdp_from_redis  # ✅ Use Redis-based loading

router = APIRouter()

@router.get("/{mdp_id}/policy")
def get_policy(mdp_id: str):
    print(f"📥 [get_policy] Called with mdp_id={mdp_id}")
    
    mdp = load_mdp_from_redis(mdp_id)
    if not mdp:
        print(f"❌ [get_policy] MDP not found for id={mdp_id}")
        return {"error": "MDP not found"}

    if not mdp.policy:
        print(f"⚠️ [get_policy] Policy has not been computed yet for MDP {mdp_id}")
        return {"error": "Policy has not been computed yet"}

    print(f"✅ [get_policy] Returning policy for MDP {mdp_id}")
    return {"policy": mdp.policy}
