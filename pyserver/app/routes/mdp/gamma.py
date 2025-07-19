# pyserver/app/routes/mdp/gamma.py

from fastapi import APIRouter
from pydantic import BaseModel
from app.core.mdp_store import load_mdp_from_redis, save_mdp_to_redis  # ✅ Redis-backed access

router = APIRouter()

class GammaInput(BaseModel):
    gamma: float

@router.post("/{mdp_id}/gamma")
def set_gamma(mdp_id: str, gamma_input: GammaInput):
    print(f"📥 [set_gamma] Called with mdp_id={mdp_id}, gamma={gamma_input.gamma}")

    mdp = load_mdp_from_redis(mdp_id)
    if not mdp:
        print(f"❌ [set_gamma] MDP not found for mdp_id={mdp_id}")
        return {"error": "MDP not found"}

    if not (0 <= gamma_input.gamma <= 1):
        print(f"⚠️ [set_gamma] Invalid gamma value: {gamma_input.gamma}")
        return {"error": "Gamma must be between 0 and 1"}

    mdp.gamma = gamma_input.gamma
    save_mdp_to_redis(mdp_id, mdp)  # ✅ Persist change
    print(f"✅ [set_gamma] Gamma updated to {gamma_input.gamma} for MDP {mdp_id}")

    return {"message": f"Gamma set to {gamma_input.gamma}"}
