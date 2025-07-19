def print_graph_structure(mdp):
    print("\n🔎 MDP Graph Structure:")
    
    print("States:")
    for state in sorted(mdp.states):
        print(f"  • {state}")

    print("\nActions per State:")
    for state in sorted(mdp.actions.root.keys()):
        actions = sorted(mdp.actions.root[state])
        print(f"  • {state}: {actions}")

    print("\nTransitions:")
    for state, actions in mdp.transitions.root.items():
        for action, outcomes in actions.items():
            for prob, next_state in outcomes:  # ✅ Unpack tuple
                print(f"  • {state} --[{action}, p={prob}]--> {next_state}")

    print("\nRewards:")
    for state, actions in mdp.rewards.root.items():
        for action, next_rewards in actions.items():
            for next_state, reward in next_rewards.items():
                print(f"  • R({state}, {action}, {next_state}) = {reward}")

    print(f"\nDiscount factor (gamma): {mdp.gamma}")
    print("🔚 End of Graph\n")
