# pyserver/app/models/mdp_model.py
from pydantic import BaseModel, Field, RootModel
from typing import Dict, Set, Tuple, List, NewType

State = NewType("State", str)
Action = NewType("Action", str)
Transition = Tuple[float, State]
TransitionList = List[Transition]
RewardMap = Dict[State, float]

class Transitions(RootModel[Dict[State, Dict[Action, TransitionList]]]):
    pass

class Rewards(RootModel[Dict[State, Dict[Action, RewardMap]]]):
    pass

class MDPModel(BaseModel):
    states: Set[State] = Field(default_factory=set)
    actions: Dict[State, Set[Action]] = Field(default_factory=dict)
    transitions: Transitions = Field(default_factory=Transitions)
    rewards: Rewards = Field(default_factory=Rewards)
    gamma: float = 0.9
    V: Dict[State, float] = Field(default_factory=dict)
    policy: Dict[State, Action] = Field(default_factory=dict)

