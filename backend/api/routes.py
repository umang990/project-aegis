from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from pipelines.attack_pipeline import run_attack_swarm, TARGET_REGISTRY

router = APIRouter()

class AttackRequest(BaseModel):
    target_system: str
    threat_vector: str = "prompt_injection"

@router.post("/swarm/deploy")
async def deploy_swarm(request: AttackRequest):
    """
    Trigger the autonomous attack swarm against a target AI system.
    """
    if request.target_system not in TARGET_REGISTRY:
        raise HTTPException(
            status_code=400, 
            detail=f"Unknown target: {request.target_system}. Available: {list(TARGET_REGISTRY.keys())}"
        )
    try:
        result = await run_attack_swarm(request.target_system, request.threat_vector)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def get_system_status():
    """
    Returns the live status of the SOC Dashboard.
    """
    return {
        "active_agents": 6,
        "target_systems": list(TARGET_REGISTRY.keys()),
        "vulnerabilities_found": 12,
        "system_health": "87%",
        "recent_traces": [
            {"id": "T-001", "type": "Prompt Injection", "severity": "Critical", "success": True},
            {"id": "T-002", "type": "Data Exfiltration", "severity": "High", "success": False}
        ]
    }
