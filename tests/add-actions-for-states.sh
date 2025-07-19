#!/bin/bash
set -euo pipefail

mkdir -p logs

echo "📦 Creating MDP..."
create_out=$(mdp create-mdp)
echo "$create_out" | tee logs/create.txt

mdp_id=$(echo "$create_out" | jq -r '.mdp_id')
echo "✅ MDP ID: $mdp_id"

echo "➕ Adding state: start"
mdp add-state "$mdp_id" start | tee logs/add-state-start.txt

echo "➕ Adding state: end"
mdp add-state "$mdp_id" end | tee logs/add-state-end.txt

echo "🎯 Adding action: go for state 'start'"
mdp add-action "$mdp_id" start go | tee logs/add-action-start-go.txt

echo "🎯 Adding action: finish for state 'end'"
mdp add-action "$mdp_id" end finish | tee logs/add-action-end-finish.txt

echo "🔍 Reading MDP back..."
mdp show-mdp "$mdp_id" | tee logs/show-mdp.txt

