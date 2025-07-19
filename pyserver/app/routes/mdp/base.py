from fastapi import APIRouter
from core.mdp_store import create_mdp

router = APIRouter()

@router.post("/")
def create_new_mdp():
    print("📥 [create_new_mdp] Request received to create new MDP")
    
    mdp_id = create_mdp()
    
    print(f"🆕 [create_new_mdp] New MDP created with id: {mdp_id}")
    print(f"📦 [create_new_mdp] Initial state: "
          f"states=set(), actions=set(), transitions={{}}, rewards={{}}, gamma=0.9, V={{}}, policy={{}}")
    
    return {"mdp_id": mdp_id}
