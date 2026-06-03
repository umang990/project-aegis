import json
from mcp.server.fastapi import FastAPIServerTransport
from mcp.server import Server
import mcp.types as types
from pipelines.attack_pipeline import run_attack_swarm

# Create the MCP Server
mcp = Server("Aegis-Arize-MCP")

@mcp.list_tools()
async def list_tools() -> list[types.Tool]:
    """List the tools provided by this MCP server."""
    return [
        types.Tool(
            name="deploy_swarm",
            description="Trigger the autonomous security testing swarm against a target AI system.",
            inputSchema={
                "type": "object",
                "properties": {
                    "target_system": {
                        "type": "string",
                        "description": "The target system to attack (e.g., hr_bot, finance_bot, healthcare_bot, coding_assistant)"
                    }
                },
                "required": ["target_system"]
            }
        ),
        types.Tool(
            name="get_arize_trace",
            description="Pull the latest evaluation trace from Arize Phoenix for observability and debugging.",
            inputSchema={
                "type": "object",
                "properties": {
                    "trace_id": {
                        "type": "string",
                        "description": "The ID of the trace to fetch. If omitted, fetches the latest."
                    }
                }
            }
        )
    ]

@mcp.call_tool()
async def call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    """Handle tool execution requests."""
    if name == "deploy_swarm":
        target = arguments.get("target_system", "hr_bot")
        try:
            # Trigger the attack pipeline
            result = await run_attack_swarm(target)
            return [
                types.TextContent(
                    type="text",
                    text=f"Swarm deployed successfully. Result: {json.dumps(result, indent=2)}"
                )
            ]
        except Exception as e:
            return [types.TextContent(type="text", text=f"Error deploying swarm: {str(e)}")]
            
    elif name == "get_arize_trace":
        # Simulate fetching the trace from the Arize Phoenix backend
        # In a real environment, this uses the Phoenix API or SDK
        return [
            types.TextContent(
                type="text",
                text=json.dumps({
                    "observability": "Arize Phoenix Integration Active",
                    "latest_trace": {
                        "eval_score": "Compromised",
                        "vulnerability_type": "Prompt Injection",
                        "spans": ["attack_generation", "target_processing", "evaluation"]
                    }
                }, indent=2)
            )
        ]
        
    raise ValueError(f"Unknown tool: {name}")
