#!/bin/bash
set -euo pipefail

# beach-example.sh
# Models a decision between beach (risky) and cafe (safe)
# Only reward is if beach leads to sun

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
mdp add-action "$mdp_id" start go_beach
mdp add-action "$mdp_id" start go_cafe
mdp add-action "$mdp_id" beach_sun home_from_sun
mdp add-action "$mdp_id" beach_rain home_from_rain
mdp add-action "$mdp_id" cafe home_from_cafe

# Transitions
echo "🔁 Adding transitions"
mdp add-transition "$mdp_id" start go_beach beach_sun
mdp add-transition "$mdp_id" start go_beach beach_rain
mdp add-transition "$mdp_id" start go_cafe cafe
mdp add-transition "$mdp_id" beach_sun home_from_sun end
mdp add-transition "$mdp_id" beach_rain home_from_rain end
mdp add-transition "$mdp_id" cafe home_from_cafe end

# Transition probabilities
echo "🎚️ Setting transition probabilities"
mdp set-transition-probability "$mdp_id" start go_beach beach_sun 0.9
mdp set-transition-probability "$mdp_id" start go_beach beach_rain 0.1
mdp set-transition-probability "$mdp_id" start go_cafe cafe 1.0
mdp set-transition-probability "$mdp_id" beach_sun home_from_sun end 1.0
mdp set-transition-probability "$mdp_id" beach_rain home_from_rain end 1.0
mdp set-transition-probability "$mdp_id" cafe home_from_cafe end 1.0

# Rewards (updated)
echo "💰 Adding rewards"
mdp add-reward "$mdp_id" start go_beach beach_sun 0.0
mdp add-reward "$mdp_id" start go_beach beach_rain 0.0
mdp add-reward "$mdp_id" start go_cafe cafe 0.0
mdp add-reward "$mdp_id" beach_sun home_from_sun end 10.0
mdp add-reward "$mdp_id" beach_rain home_from_rain end 0.0
mdp add-reward "$mdp_id" cafe home_from_cafe end 5.0

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
