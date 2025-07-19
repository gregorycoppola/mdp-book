from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.mdp import router as mdp_router  # adjust path if needed

app = FastAPI()

# ✅ CORS setup for frontend at localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Mount your MDP router under /api/mdp
app.include_router(mdp_router, prefix="/api/mdp", tags=["MDP"])

# ✅ Print routes on startup
@app.on_event("startup")
def print_routes():
    routes = sorted(app.routes, key=lambda r: r.path)
    print("\n📋 Registered Routes:")
    for route in routes:
        if hasattr(route, "methods"):
            methods = ",".join(sorted(route.methods))
            print(f"  {methods:10s} {route.path}")
