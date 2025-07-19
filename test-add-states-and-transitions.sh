#!/bin/bash
set -euo pipefail

mkdir -p logs

# Create a new MDP
echo "📦 Creating MDP..."
create_out=$(mdp create-mdp)
echo "$create_out" | tee logs/create.txt

mdp_id=$(echo "$create_out" | jq -r '.mdp_id')
echo "✅ MDP ID: $mdp_id"

# Add states
for state in start end; do
  echo "➕ Adding state: $state"
  mdp add-state "$mdp_id" "$state" | tee "logs/add-state-$state.txt"
done

# Add action
echo "➕ Adding action: go"
mdp add-action "$mdp_id" go | tee logs/add-action-go.txt

# Add transition: start --go--> end
echo "🔁 Adding transition: start + go → end [p=1.0]"
mdp add-transition "$mdp_id" start go end 1.0 | tee logs/add-transition.txt

# Read back full MDP
echo "🔍 Final MDP structure:"
mdp show-mdp "$mdp_id" | tee logs/final-mdp.txt

