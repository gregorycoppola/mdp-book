# pyserver/app/models/mdp_model.py

from typing import Dict, List, Set, Tuple
from pydantic import BaseModel, Field


class MDPModel(BaseModel):
    states: Set[str] = Field(default_factory=set)
    actions: Dict[str, Set[str]] = Field(default_factory=dict)
    transitions: Dict[str, Dict[str, List[Tuple[float, str]]]] = Field(default_factory=dict)
    rewards: Dict[str, Dict[str, Dict[str, float]]] = Field(default_factory=dict)
    gamma: float = 0.9
    V: Dict[str, float] = Field(default_factory=dict)
    policy: Dict[str, str] = Field(default_factory=dict)
