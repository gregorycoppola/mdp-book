from typing import Dict, List, Set, Tuple
from pydantic import BaseModel, Field, RootModel

# Aliases for clarity
State = str
Action = str
NextState = str
Probability = float
RewardValue = float

# Nested model types using RootModel
class Actions(RootModel[Dict[State, Set[Action]]]): pass
class Transitions(RootModel[Dict[State, Dict[Action, List[Tuple[Probability, NextState]]]]]): pass
class Rewards(RootModel[Dict[State, Dict[Action, Dict[NextState, RewardValue]]]]): pass
class ValueFunction(RootModel[Dict[State, float]]): pass
class Policy(RootModel[Dict[State, Action]]): pass

# Main MDP model
class MDPModel(BaseModel):
    states: Set[State] = Field(default_factory=set)
    actions: Actions = Field(default_factory=lambda: Actions(__root__={}))
    transitions: Transitions = Field(default_factory=lambda: Transitions(__root__={}))
    rewards: Rewards = Field(default_factory=lambda: Rewards(__root__={}))
    gamma: float = 0.9
    V: ValueFunction = Field(default_factory=lambda: ValueFunction(__root__={}))
    policy: Policy = Field(default_factory=lambda: Policy(__root__={}))
