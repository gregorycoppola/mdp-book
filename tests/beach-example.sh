#!/bin/bash
set -euo pipefail

# beach-weather.sh
# Models a decision between beach (risky) and cafe (safe)
# Beach can lead to beach_sun (10 reward) or beach_rain (0 reward)

echo "📦 Creating MDP..."
create_out=$(mdp create-mdp --gamma 1.0)
echo "$create_out"

mdp_id=$(echo "$create_out" | jq -r '.mdp_id')
echo "✅ MDP ID: $mdp_id"

# States
for state in start beach_sun beach_rain cafe end; do
  echo "➕ State: $state"
  mdp add-state "$mdp_id" "$state"
done

# Actions
echo "🎯 Adding actions"
mdp add-action "$mdp_id" start beach
mdp add-action "$mdp_id" start cafe
mdp add-action "$mdp_id" beach_sun go
mdp add-action "$mdp_id" beach_rain go
mdp add-action "$mdp_id" cafe go

# Transitions (no probabilities set here)
echo "🔁 Adding transitions"
mdp add-transition "$mdp_id" start beach beach_sun
mdp add-transition "$mdp_id" start beach beach_rain
mdp add-transition "$mdp_id" start cafe cafe
mdp add-transition "$mdp_id" beach_sun go end
mdp add-transition "$mdp_id" beach_rain go end
mdp add-transition "$mdp_id" cafe go end

# Set transition probabilities
echo "🎚️ Setting transition probabilities"
mdp set-transition-probability "$mdp_id" start beach beach_sun 0.9
mdp set-transition-probability "$mdp_id" start beach beach_rain 0.1
mdp set-transition-probability "$mdp_id" start cafe cafe 1.0
mdp set-transition-probability "$mdp_id" beach_sun go end 1.0
mdp set-transition-probability "$mdp_id" beach_rain go end 1.0
mdp set-transition-probability "$mdp_id" cafe go end 1.0

# Rewards
echo "💰 Adding rewards"
mdp add-reward "$mdp_id" beach_sun go end 10.0
mdp add-reward "$mdp_id" beach_rain go end 0.0
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

# Inspect solution
echo "🔍 Solution overview:"
mdp inspect "$mdp_id"

