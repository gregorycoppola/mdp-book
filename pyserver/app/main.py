from fastapi import FastAPI
from .routes.mdp import router as mdp_router

app = FastAPI()
app.include_router(mdp_router, prefix="/mdp")

@app.on_event("startup")
def print_routes():
    routes = sorted(app.routes, key=lambda r: r.path)
    print("\n📋 Registered Routes:")
    for route in routes:
        if hasattr(route, "methods"):
            methods = ",".join(sorted(route.methods))
            print(f"  {methods:10s} {route.path}")
