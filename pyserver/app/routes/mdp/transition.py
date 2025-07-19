from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger(__name__)

@router.post("/{mdp_id}/transition")
def add_transition(mdp_id: str, transition: TransitionInput):
    print(f"📥 [add_transition] Request for mdp_id={mdp_id}: {transition.model_dump()}")

    mdp = load_mdp_from_redis(mdp_id)
    if not mdp:
        return JSONResponse(status_code=404, content={"error": "MDP not found"})

    if transition.state not in mdp.states:
        logger.warning(f"[add_transition] Invalid source state: {transition.state}")
        return JSONResponse(status_code=400, content={"error": f"State '{transition.state}' does not exist"})

    if transition.next_state not in mdp.states:
        logger.warning(f"[add_transition] Invalid next_state: {transition.next_state}")
        return JSONResponse(status_code=400, content={"error": f"Next state '{transition.next_state}' does not exist"})

    actions_for_state = mdp.actions.root.get(transition.state, set())
    if transition.action not in actions_for_state:
        logger.warning(f"[add_transition] Invalid action '{transition.action}' for state '{transition.state}'")
        return JSONResponse(
            status_code=400,
            content={"error": f"Action '{transition.action}' not defined for state '{transition.state}'"}
        )

    # ✅ Add transition
    mdp.transitions.root.setdefault(transition.state, {}).setdefault(transition.action, {})[
        transition.next_state
    ] = transition.probability

    save_mdp_to_redis(mdp_id, mdp)
    print(f"✅ [add_transition] {transition.state} --{transition.action}/{transition.probability}--> {transition.next_state}")
    return {
        "message": f"Transition added: ({transition.state}, {transition.action}) -> {transition.next_state} [{transition.probability}]"
    }
