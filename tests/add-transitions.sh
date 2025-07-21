#!/bin/bash
set -euo pipefail

echo "📦 Creating MDP..."
create_out=$(mdp create-mdp)
echo "$create_out"

mdp_id=$(echo "$create_out" | jq -r '.mdp_id')
echo "✅ MDP ID: $mdp_id"

# Add states
for state in start end; do
  echo "➕ Adding state: $state"
  mdp add-state "$mdp_id" "$state"
done

# Add actions for each state
echo "🎯 Adding action: go for state 'start'"
mdp add-action "$mdp_id" start go

echo "🎯 Adding action: finish for state 'end'"
mdp add-action "$mdp_id" end finish

# Add transition: start --go--> end
echo "🔁 Adding transition: start + go → end [p=1.0]"
mdp add-transition "$mdp_id" start go end 1.0

# Show full MDP
echo "🔍 Final MDP structure:"
mdp show-mdp "$mdp_id"
