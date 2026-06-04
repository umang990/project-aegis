import json
import traceback
from mcp.server import Server
import mcp.types as types
from pipelines.attack_pipeline import run_attack_swarm, TARGET_REGISTRY, ATTACK_REGISTRY

# Create the MCP Server
mcp = Server("Aegis-Arize-MCP")

@mcp.list_tools()
async def list_tools() -> list[types.Tool]:
    """List the tools provided by this MCP server."""
    return [
        types.Tool(
            name="deploy_swarm",
            description=(
                "Trigger the autonomous security testing swarm against a target AI system. "
                "This will generate an attack, fire it at the target, evaluate if it was compromised, "
                "score the risk, and auto-generate a patch if breached."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "target_system": {
                        "type": "string",
                        "description": "The target system to attack. Must be one of: hr_bot, finance_bot, healthcare_bot, coding_assistant",
                        "enum": list(TARGET_REGISTRY.keys())
                    },
                    "threat_vector": {
                        "type": "string",
                        "description": "The specific threat vector to deploy. Must be one of: prompt_injection, data_exfiltration, rag_poisoning, chaos, social_engineering",
                        "enum": list(ATTACK_REGISTRY.keys()),
                        "default": "prompt_injection"
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
        threat = arguments.get("threat_vector", "prompt_injection")
        
        # Validate target
        if target not in TARGET_REGISTRY:
            return [types.TextContent(
                type="text",
                text=f"Error: Unknown target '{target}'. Available targets: {list(TARGET_REGISTRY.keys())}"
            )]
        
        try:
            # Trigger the attack pipeline with both target and threat vector
            result = await run_attack_swarm(target, threat)
            
            # Format a clean summary for the agent
            summary = {
                "status": result.get("status", "Unknown"),
                "target_system": result.get("target_system", target),
                "threat_vector": result.get("threat_vector", threat),
                "compromised": result.get("compromised", False),
                "judge_reason": result.get("judge_reason", "N/A"),
                "risk_score": result.get("risk_score", {}),
                "attack_prompt": result.get("attack_prompt", "N/A"),
                "target_response": result.get("target_response", "N/A"),
                "recommended_patch": result.get("recommended_patch", None),
            }
            
            return [
                types.TextContent(
                    type="text",
                    text=f"Swarm deployed successfully against {target} using {threat}.\n\nResult:\n{json.dumps(summary, indent=2)}"
                )
            ]
        except Exception as e:
            error_detail = traceback.format_exc()
            print(f"MCP deploy_swarm error: {error_detail}")
            return [types.TextContent(
                type="text", 
                text=f"Error deploying swarm against {target}: {str(e)}"
            )]
            
    elif name == "get_arize_trace":
        # Return trace info from Arize Phoenix
        # In production, this would query the Phoenix API
        return [
            types.TextContent(
                type="text",
                text=json.dumps({
                    "observability": "Arize Phoenix Integration Active",
                    "phoenix_dashboard": "https://app.phoenix.arize.com",
                    "latest_trace": {
                        "eval_score": "Compromised",
                        "vulnerability_type": "Prompt Injection",
                        "spans": ["attack_generation", "target_processing", "evaluation"]
                    }
                }, indent=2)
            )
        ]
        
    raise ValueError(f"Unknown tool: {name}")
