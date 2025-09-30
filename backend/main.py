from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, nodes, edges  # your routers

app = FastAPI()

# --- Enable CORS for frontend ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include routers ---
app.include_router(auth.router)
app.include_router(nodes.router)
app.include_router(edges.router)

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}
from routers import edges
app.include_router(edges.router)
