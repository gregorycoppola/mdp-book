# pyserver/app/core/mdp_store.py

from uuid import uuid4
from typing import Dict
from models.mdp_model import MDPModel, Actions, Transitions, Rewards, ValueFunction, Policy

# ✅ Declare the store
mdp_store: Dict[str, MDPModel] = {}

def create_mdp():
    mdp_id = str(uuid4())
    mdp_store[mdp_id] = MDPModel(
        states=set(),
        actions=Actions({}),  # ✅ FIXED
        transitions=Transitions(__root__={}),
        rewards=Rewards(__root__={}),
        gamma=0.9,
        V=ValueFunction(__root__={}),
        policy=Policy(__root__={})
    )
    return mdp_id
