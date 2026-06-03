from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from pipelines.attack_pipeline import run_attack_swarm

router = APIRouter()

class AttackRequest(BaseModel):
    target_system: str
    threat_vector: str

@router.post("/swarm/deploy")
async def deploy_swarm(request: AttackRequest):
    """
    Trigger the LangGraph master orchestrator to deploy a swarm against a target.
    """
    try:
        # This will kick off the autonomous loop: attack -> eval -> patch
        result = await run_attack_swarm(request.target_system)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def get_system_status():
    """
    Returns the live status of the SOC Dashboard.
    """
    return {
        "active_agents": 5,
        "vulnerabilities_found": 12,
        "system_health": "87%",
        "recent_traces": [
            {"id": "T-001", "type": "Prompt Injection", "severity": "Critical", "success": True},
            {"id": "T-002", "type": "Data Exfiltration", "severity": "High", "success": False}
        ]
    }
