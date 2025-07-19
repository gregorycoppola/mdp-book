from collections import defaultdict
from uuid import uuid4

mdp_store = {}

def create_mdp():
    mdp_id = str(uuid4())
    mdp_store[mdp_id] = {
        "states": set(),                            # set of all states
        "actions": defaultdict(set),               # state → set of available actions
        "transitions": defaultdict(lambda: defaultdict(list)),  # s → a → [(p, s')]
        "rewards": defaultdict(lambda: defaultdict(dict)),      # s → a → s' → r
        "gamma": 0.9,
        "V": {},
        "policy": {}
    }
    return mdp_id
