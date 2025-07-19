# pyserver/app/models/mdp_model.py

from typing import Set, Dict, Optional
from pydantic import BaseModel, RootModel

class Actions(RootModel[Dict[str, Set[str]]]): pass

class Transitions(RootModel[Dict[str, Dict[str, Dict[str, float]]]]): pass
# Structure: transitions[state][action][next_state] = probability

class Rewards(RootModel[Dict[str, Dict[str, Dict[str, float]]]]): pass
# Structure: rewards[state][action] = reward

class ValueFunction(RootModel[Dict[str, float]]): pass
# Structure: V[state] = value

# models/mdp_model.py
class Policy(RootModel[Dict[str, Optional[str]]]): pass
# Structure: policy[state] = action

class MDPModel(BaseModel):
    states: Set[str]
    actions: Actions
    transitions: Transitions
    rewards: Rewards
    gamma: float
    V: ValueFunction
    policy: Policy
