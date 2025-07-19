#!/bin/bash
set -euo pipefail

echo "📦 Creating MDP..."
create_out=$(mdp create-mdp)
echo "$create_out"

mdp_id=$(echo "$create_out" | jq -r '.mdp_id')
echo "✅ MDP ID: $mdp_id"

echo "➕ Adding state: start"
mdp add-state "$mdp_id" start

echo "➕ Adding state: end"
mdp add-state "$mdp_id" end

echo "🎯 Adding action: go for state 'start'"
mdp add-action "$mdp_id" start go

echo "🎯 Adding action: finish for state 'end'"
mdp add-action "$mdp_id" end finish

echo "🔍 Reading MDP back..."
mdp show-mdp "$mdp_id"
