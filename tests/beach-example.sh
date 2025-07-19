#!/bin/bash
set -euo pipefail

echo "📦 Creating MDP..."
create_out=$(mdp create-mdp)
echo "$create_out"

mdp_id=$(echo "$create_out" | jq -r '.mdp_id')
echo "✅ MDP ID: $mdp_id"

# States
for state in start beach cafe end; do
  echo "➕ State: $state"
  mdp add-state "$mdp_id" "$state"
done

# Actions
echo "🎯 Adding action: beach for state 'start'"
mdp add-action "$mdp_id" start beach

echo "🎯 Adding action: cafe for state 'start'"
mdp add-action "$mdp_id" start cafe

echo "🎯 Adding action: go for state 'beach'"
mdp add-action "$mdp_id" beach go

echo "🎯 Adding action: go for state 'cafe'"
mdp add-action "$mdp_id" cafe go

# Transitions
echo "🔁 Adding transitions"
mdp add-transition "$mdp_id" start beach beach 1.0
mdp add-transition "$mdp_id" start cafe cafe 1.0
mdp add-transition "$mdp_id" beach go end 1.0
mdp add-transition "$mdp_id" cafe go end 1.0

# Rewards
echo "💰 Adding rewards"
mdp add-reward "$mdp_id" beach go end 9.0   # 0.9 × 10
mdp add-reward "$mdp_id" cafe go end 5.0

# Solve
echo "🧠 Solving MDP..."
mdp solve "$mdp_id"

# Final MDP structure
echo "📊 Final MDP structure:"
mdp show-mdp "$mdp_id"

# Get values
echo "📈 Value function:"
mdp get-values "$mdp_id"
