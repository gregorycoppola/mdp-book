from fastapi import APIRouter
from core.mdp_store import create_mdp

router = APIRouter()

@router.post("/")
def create_new_mdp():
    mdp_id = create_mdp()
    return {"mdp_id": mdp_id}
