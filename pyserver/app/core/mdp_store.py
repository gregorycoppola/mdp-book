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
        actions=Actions(set()),
        transitions=Transitions({}),
        rewards=Rewards({}),
        gamma=0.9,
        V=ValueFunction({}),
        policy=Policy({})
    )
    return mdp_id
