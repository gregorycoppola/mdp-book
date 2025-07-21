import click
import json
from mdp_cli.client import post, get

@click.group()
def cli():
    """MDP CLI"""
    pass

API_PREFIX = "/api/mdp"

@cli.command()
@click.option("--gamma", default=0.9, type=float, help="Discount factor (gamma) for the MDP")
def create_mdp(gamma):
    """Create a new MDP and return its ID"""
    result = post(f"{API_PREFIX}/", json={"gamma": gamma})
    click.echo(json.dumps(result))


@cli.command()
@click.argument("mdp_id")
@click.argument("state_name")
def add_state(mdp_id, state_name):
    """Add a state to an existing MDP"""
    result = post(f"{API_PREFIX}/{mdp_id}/state", json={"name": state_name})
    click.echo(json.dumps(result))

@cli.command("add-action")
@click.argument("mdp_id")
@click.argument("state")
@click.argument("action_name")
def add_action(mdp_id, state, action_name):
    result = post(f"{API_PREFIX}/{mdp_id}/action", json={"state": state, "action": action_name})
    click.echo(json.dumps(result))


@cli.command("add-transition")
@click.argument("mdp_id")
@click.argument("state_name")
@click.argument("action_name")
@click.argument("next_state_name")
def add_transition(mdp_id, state_name, action_name, next_state_name):
    """Add a transition (probability will be computed automatically later)"""
    result = post(
        f"{API_PREFIX}/{mdp_id}/transition",
        json={
            "state": state_name,
            "action": action_name,
            "next_state": next_state_name,
        },
    )
    click.echo(json.dumps(result))


@cli.command("show-mdp")
@click.argument("mdp_id")
def show_mdp(mdp_id):
    """Show the full structure of the MDP"""
    result = get(f"{API_PREFIX}/{mdp_id}")
    click.echo(json.dumps(result))

@cli.command("reset")
@click.argument("mdp_id")
def reset_mdp(mdp_id):
    """Reset the MDP to an empty state (clears all structure)"""
    result = post(f"{API_PREFIX}/{mdp_id}/reset")
    click.echo(json.dumps(result))

@cli.command("add-reward")
@click.argument("mdp_id")
@click.argument("state")
@click.argument("action")
@click.argument("next_state")
@click.argument("reward", type=float)
def add_reward(mdp_id, state, action, next_state, reward):
    """Add a reward to (state, action, next_state)"""
    result = post(
        f"{API_PREFIX}/{mdp_id}/reward",
        json={
            "state": state,
            "action": action,
            "next_state": next_state,
            "reward": reward
        }
    )
    click.echo(json.dumps(result))

@cli.command("solve")
@click.argument("mdp_id")
def solve_mdp(mdp_id):
    """Solve the MDP using value iteration"""
    result = post(f"{API_PREFIX}/{mdp_id}/solve")
    click.echo(json.dumps(result))

@cli.command("get-values")
@click.argument("mdp_id")
def get_values(mdp_id):
    result = get(f"{API_PREFIX}/{mdp_id}/values")
    click.echo(json.dumps(result))

@cli.command("get-policy")
@click.argument("mdp_id")
def get_policy(mdp_id):
    result = get(f"{API_PREFIX}/{mdp_id}/policy")
    click.echo(json.dumps(result))

@cli.command("inspect")
@click.argument("mdp_id")
def inspect_solution(mdp_id):
    """Inspect the solved MDP (state → value + best action)"""
    result = get(f"{API_PREFIX}/{mdp_id}/solution")
    click.echo(json.dumps(result, indent=2))

@cli.command("set-transition-probability")
@click.argument("mdp_id")
@click.argument("state")
@click.argument("action")
@click.argument("next_state")
@click.argument("probability", type=float)
def set_transition_probability(mdp_id, state, action, next_state, probability):
    """Update probability for a transition (state, action, next_state)"""
    result = post(
        f"{API_PREFIX}/{mdp_id}/transition/probability",
        json={
            "state": state,
            "action": action,
            "next_state": next_state,
            "probability": probability
        }
    )
    click.echo(json.dumps(result))

@cli.command("get-graph")
@click.argument("mdp_id")
def get_graph(mdp_id):
    """Get the full state → action → next_state structure of the MDP"""
    result = get(f"{API_PREFIX}/{mdp_id}/graph")
    click.echo(json.dumps(result, indent=2))
