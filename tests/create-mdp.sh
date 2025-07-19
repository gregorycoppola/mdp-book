#!/bin/bash
set -euo pipefail

echo "📦 Creating MDP..."
resp=$(mdp create-mdp)
echo "$resp"

mdp_id=$(echo "$resp" | jq -r '.mdp_id')
echo "✅ Created MDP ID: $mdp_id"

