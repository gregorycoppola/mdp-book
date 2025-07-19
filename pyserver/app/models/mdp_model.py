# pyserver/app/models/mdp_model.py

from typing import Dict, List, Set, Tuple, NewType
from pydantic import BaseModel, Field

# Type aliases for clarity
State = NewType("State", str)
Action = NewType("Action", str)
Probability = float
RewardValue = float

# Transition: P(s' | s, a) → list of (probability, next_state)
TransitionList = List[Tuple[Probability, State]]

class Transitions(BaseModel):
    __root__: Dict[State, Dict[Action, TransitionList]]

class Rewards(BaseModel):
    __root__: Dict[State, Dict[Action, Dict[State, RewardValue]]]

class ActionsByState(BaseModel):
    __root__: Dict[State, Set[Action]]

class MDPModel(BaseModel):
    states: Set[State] = Field(default_factory=set)
    actions: Dict[State, Set[Action]] = Field(default_factory=dict)
    transitions: Dict[State, Dict[Action, TransitionList]] = Field(default_factory=dict)
    rewards: Dict[State, Dict[Action, Dict[State, RewardValue]]] = Field(default_factory=dict)
    gamma: float = 0.9
    V: Dict[State, float] = Field(default_factory=dict)
    policy: Dict[State, Action] = Field(default_factory=dict)
