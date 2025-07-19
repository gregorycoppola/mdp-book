from fastapi import APIRouter, Path
from pydantic import BaseModel
from core.mdp_store import mdp_store

router = APIRouter()

class GammaInput(BaseModel):
    gamma: float

@router.post("/{mdp_id}/gamma")
def set_gamma(mdp_id: str, gamma_input: GammaInput):
    mdp = mdp_store.get(mdp_id)
    if not mdp:
        return {"error": "MDP not found"}
    if not (0 <= gamma_input.gamma <= 1):
        return {"error": "Gamma must be between 0 and 1"}
    mdp["gamma"] = gamma_input.gamma
    return {"message": f"Gamma set to {gamma_input.gamma}"}
