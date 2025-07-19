import click
import json
from mdp_cli.client import post, get

@click.group()
def cli():
    """MDP CLI"""
    pass

@cli.command()
def create_mdp():
    """Create a new MDP and return its ID"""
    result = post("/mdp/")
    click.echo(json.dumps(result))

@cli.command()
@click.argument("mdp_id")
@click.argument("state_name")
def add_state(mdp_id, state_name):
    """Add a state to an existing MDP"""
    result = post(f"/mdp/{mdp_id}/state", json={"name": state_name})
    click.echo(json.dumps(result))

@cli.command("add-action")
@click.argument("mdp_id")
@click.argument("action_name")
def add_action(mdp_id, action_name):
    """Add an action to an existing MDP"""
    result = post(f"/mdp/{mdp_id}/action", json={"name": action_name})
    click.echo(json.dumps(result))

@cli.command("add-transition")
@click.argument("mdp_id")
@click.argument("state_name")
@click.argument("action_name")
@click.argument("next_state_name")
@click.argument("probability", type=float)
def add_transition(mdp_id, state_name, action_name, next_state_name, probability):
    """Add a transition to an existing MDP"""
    result = post(
        f"/mdp/{mdp_id}/transition",
        json={
            "state": state_name,
            "action": action_name,
            "next_state": next_state_name,
            "probability": probability,
        },
    )
    click.echo(json.dumps(result))

@cli.command("show-mdp")
@click.argument("mdp_id")
def show_mdp(mdp_id):
    """Show the full structure of the MDP"""
    result = get(f"/mdp/{mdp_id}")
    click.echo(json.dumps(result))

@cli.command("reset")
@click.argument("mdp_id")
def reset_mdp(mdp_id):
    """Reset the MDP to an empty state (clears all structure)"""
    result = post(f"/mdp/{mdp_id}/reset")
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
        f"/mdp/{mdp_id}/reward",
        json={
            "state": state,
            "action": action,
            "next_state": next_state,
            "reward": reward
        }
    )
    click.echo(json.dumps(result))
