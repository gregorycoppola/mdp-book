#!/bin/bash
set -euo pipefail

# beach-weather.sh
# Models a decision between beach (risky) and cafe (safe)
# Beach can lead to beach_sun (10 reward) or beach_rain (0 reward)

echo "\U0001F4E6 Creating MDP..."
create_out=$(mdp create-mdp)
echo "$create_out"

mdp_id=$(echo "$create_out" | jq -r '.mdp_id')
echo "✅ MDP ID: $mdp_id"

# States
for state in start beach_sun beach_rain cafe end; do
  echo "➕ State: $state"
  mdp add-state "$mdp_id" "$state"
done

# Actions
echo "\U0001F3AF Adding action: beach for state 'start'"
mdp add-action "$mdp_id" start beach

echo "\U0001F3AF Adding action: cafe for state 'start'"
mdp add-action "$mdp_id" start cafe

echo "\U0001F3AF Adding action: go for state 'beach_sun'"
mdp add-action "$mdp_id" beach_sun go

echo "\U0001F3AF Adding action: go for state 'beach_rain'"
mdp add-action "$mdp_id" beach_rain go

echo "\U0001F3AF Adding action: go for state 'cafe'"
mdp add-action "$mdp_id" cafe go

# Transitions
echo "\U0001F501 Adding transitions"
mdp add-transition "$mdp_id" start beach beach_sun 0.9
mdp add-transition "$mdp_id" start beach beach_rain 0.1
mdp add-transition "$mdp_id" start cafe cafe 1.0

mdp add-transition "$mdp_id" beach_sun go end 1.0
mdp add-transition "$mdp_id" beach_rain go end 1.0
mdp add-transition "$mdp_id" cafe go end 1.0

# Rewards
echo "\U0001F4B0 Adding rewards"
mdp add-reward "$mdp_id" beach_sun go end 10.0
mdp add-reward "$mdp_id" beach_rain go end 0.0
mdp add-reward "$mdp_id" cafe go end 5.0

# Solve
echo "\U0001F9E0 Solving MDP..."
mdp solve "$mdp_id"

# Final MDP structure
echo "\U0001F4CA Final MDP structure:"
mdp show-mdp "$mdp_id"

# Get values
echo "\U0001F4C8 Value function:"
mdp get-values "$mdp_id"
