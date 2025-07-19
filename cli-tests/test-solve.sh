#!/bin/bash
set -euo pipefail
mkdir -p logs

# Create MDP
create_out=$(mdp create-mdp)
echo "$create_out" | tee logs/create.txt
mdp_id=$(echo "$create_out" | jq -r '.mdp_id')
echo "✅ MDP ID: $mdp_id"

# States
for state in start middle end; do
  echo "➕ State: $state"
  mdp add-state "$mdp_id" "$state" | tee "logs/add-state-$state.txt"
done

# Actions
for action in go exit; do
  echo "🎯 Action: $action"
  mdp add-action "$mdp_id" "$action" | tee "logs/add-action-$action.txt"
done

# Transitions
echo "🔁 Transitions"
mdp add-transition "$mdp_id" start go middle 1.0 | tee logs/transition-start-go-middle.txt
mdp add-transition "$mdp_id" middle go end 1.0 | tee logs/transition-middle-go-end.txt
mdp add-transition "$mdp_id" start exit end 1.0 | tee logs/transition-start-exit-end.txt

# Rewards
echo "💰 Rewards"
mdp add-reward "$mdp_id" start go middle 0 | tee logs/reward-start-go-middle.txt
mdp add-reward "$mdp_id" middle go end 10 | tee logs/reward-middle-go-end.txt
mdp add-reward "$mdp_id" start exit end 5 | tee logs/reward-start-exit-end.txt

# Solve
echo "🧠 Solving MDP..."
mdp solve "$mdp_id" | tee logs/solve.txt

# Get value function
echo "📈 Value function:"
mdp get-values "$mdp_id" | tee logs/values.txt

# Get policy
echo "📌 Optimal policy:"
mdp get-policy "$mdp_id" | tee logs/policy.txt

