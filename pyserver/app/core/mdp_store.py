# pyserver/app/core/mdp_store.py

from uuid import uuid4
from models.mdp_model import MDPModel

mdp_store: Dict[str, MDPModel] = {}

def create_mdp() -> str:
    mdp_id = str(uuid4())
    mdp_store[mdp_id] = MDPModel()
    return mdp_id
