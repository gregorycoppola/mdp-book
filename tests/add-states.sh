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

echo "🔍 Reading MDP back..."
mdp show-mdp "$mdp_id"
