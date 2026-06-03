from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.routing import Mount
from mcp.server.sse import SseServerTransport
from api.routes import router as api_router
from database.db import connect_to_mongo, close_mongo_connection
from mcp_server import mcp

app = FastAPI(
    title="Project Aegis API & MCP Server",
    description="Autonomous AI Red Teaming & Self-Healing Security Platform",
    version="1.0.0"
)

# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

# Initialize SSE Transport for MCP
sse = SseServerTransport("/mcp/messages")
app.router.routes.append(Mount("/mcp/messages", app=sse.handle_post_message))

@app.get("/mcp/sse")
async def handle_sse(request: Request):
    async with sse.connect_sse(request.scope, request.receive, request._send) as (
        read_stream,
        write_stream,
    ):
        await mcp.run(
            read_stream,
            write_stream,
            mcp.create_initialization_options(),
        )

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

@app.get("/")
async def root():
    return {"message": "Project Aegis Master Orchestrator and MCP Server is online."}

