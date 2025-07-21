from fastapi import APIRouter
from . import base, state, action, transition, reward, gamma, solve, policy, value_function, inspect, reset, probability

router = APIRouter()
router.include_router(base.router)
router.include_router(state.router)
router.include_router(action.router)
router.include_router(transition.router)
router.include_router(reward.router)
router.include_router(gamma.router)
router.include_router(solve.router)
router.include_router(policy.router)
router.include_router(value_function.router)
router.include_router(inspect.router)
router.include_router(reset.router)
router.include_router(probability.router)
