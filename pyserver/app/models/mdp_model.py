from typing import List, Optional
from collections import OrderedDict
from pydantic import BaseModel, RootModel, field_validator

class Actions(RootModel[OrderedDict[str, List[str]]]): pass
# Preserves order of state keys and actions

class Transitions(RootModel[OrderedDict[str, OrderedDict[str, OrderedDict[str, float]]]]): pass

class Rewards(RootModel[OrderedDict[str, OrderedDict[str, OrderedDict[str, float]]]]): pass

class ValueFunction(RootModel[OrderedDict[str, float]]): pass

class Policy(RootModel[OrderedDict[str, Optional[str]]]): pass

class MDPModel(BaseModel):
    states: List[str]
    actions: Actions
    transitions: Transitions
    rewards: Rewards
    gamma: float
    V: ValueFunction
    policy: Policy
