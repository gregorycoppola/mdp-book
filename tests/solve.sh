#!/bin/bash
set -euo pipefail

echo "📦 Creating MDP..."
create_out=$(mdp create-mdp)
echo "$create_out"

mdp_id=$(echo "$create_out" | jq -r '.mdp_id')
echo "✅ MDP ID: $mdp_id"

# States
for state in start middle end; do
  echo "➕ State: $state"
  mdp add-state "$mdp_id" "$state"
done

# Actions
echo "🎯 Adding action: go for state 'start'"
mdp add-action "$mdp_id" start go

echo "🎯 Adding action: exit for state 'start'"
mdp add-action "$mdp_id" start exit

echo "🎯 Adding action: go for state 'middle'"
mdp add-action "$mdp_id" middle go

# Transitions
echo "🔁 Adding transitions"
mdp add-transition "$mdp_id" start go middle 1.0
mdp add-transition "$mdp_id" middle go end 1.0
mdp add-transition "$mdp_id" start exit end 1.0

# Rewards
echo "💰 Adding rewards"
mdp add-reward "$mdp_id" start go middle 0
mdp add-reward "$mdp_id" middle go end 10
mdp add-reward "$mdp_id" start exit end 5

# Solve
echo "🧠 Solving MDP..."
mdp solve "$mdp_id"

# Final MDP structure
echo "📊 Final MDP structure:"
mdp show-mdp "$mdp_id"

# Get values
echo "📈 Value function:"
mdp get-values "$mdp_id"
