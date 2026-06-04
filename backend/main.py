import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.routing import Mount
from mcp.server.sse import SseServerTransport
from api.routes import router as api_router
from database.db import connect_to_mongo, close_mongo_connection
from mcp_server import mcp
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("aegis")

from evaluation.arize_connector import setup_arize_phoenix

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — startup and shutdown events."""
    logger.info("Starting Project Aegis...")
    setup_arize_phoenix()  # Initialize Arize Phoenix tracing BEFORE anything else
    await connect_to_mongo()
    logger.info("Project Aegis is online. Arize Phoenix observability active.")
    yield
    logger.info("Shutting down Project Aegis...")
    await close_mongo_connection()

app = FastAPI(
    title="Project Aegis API & MCP Server",
    description="Autonomous AI Red Teaming & Self-Healing Security Platform",
    version="1.0.0",
    lifespan=lifespan,
)

# Allow React frontend and Google Agent Builder to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Required for MCP SSE + Agent Builder
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
    """SSE endpoint for Model Context Protocol — used by Google Agent Builder."""
    logger.info("MCP SSE connection established")
    async with sse.connect_sse(request.scope, request.receive, request._send) as (
        read_stream,
        write_stream,
    ):
        await mcp.run(
            read_stream,
            write_stream,
            mcp.create_initialization_options(),
        )

@app.get("/")
async def root():
    return {
        "message": "Project Aegis Master Orchestrator and MCP Server is online.",
        "endpoints": {
            "mcp_sse": "/mcp/sse",
            "api": "/api/v1",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "project-aegis"}
