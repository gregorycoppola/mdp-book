# pyserver/app/core/mdp_store.py

from uuid import uuid4
from models.mdp_model import MDPModel, Actions, Transitions, Rewards, ValueFunction, Policy
from typing import Dict

def create_mdp():
    mdp_id = str(uuid4())
    mdp_store[mdp_id] = MDPModel(
        states=set(),
        actions=Actions(__root__={}),
        transitions=Transitions(__root__={}),
        rewards=Rewards(__root__={}),
        gamma=0.9,
        V=ValueFunction(__root__={}),
        policy=Policy(__root__={})
    )
    return mdp_id
