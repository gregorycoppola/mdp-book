#!/bin/bash
set -euo pipefail

mkdir -p logs

echo "📦 Creating MDP..."
resp=$(mdp create-mdp)
echo "$resp" | tee logs/create.txt

mdp_id=$(echo "$resp" | jq -r '.mdp_id')
echo "✅ Created MDP ID: $mdp_id"

