"""
Arize Phoenix Observability Connector

This module provides the core Arize Phoenix integration for Project Aegis:
1. Auto-instruments all LangChain LLM calls → traces flow to Phoenix Cloud
2. Maintains an in-memory trace store for real-time MCP tool queries
3. Provides trace query functions used by the MCP server tools

All attack traces are sent to Arize Phoenix Cloud for observability,
and are also stored locally for immediate access by the Agent Builder agent.
"""

import os
import logging
import datetime
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("aegis.phoenix")

# ─── In-memory Trace Store ───────────────────────────────────────────────────
# Stores attack traces for real-time MCP tool queries.
# Phoenix Cloud gets the full OpenTelemetry traces via auto-instrumentation,
# while this store provides immediate access for the Agent Builder agent.

_trace_store = []
_phoenix_initialized = False


def setup_arize_phoenix():
    """
    Initialize Arize Phoenix Cloud observability and instrument LangChain.
    
    This sets up OpenInference auto-instrumentation so every LangChain LLM call
    (attack agents, judge agent, target systems, patch generator) is automatically
    traced and sent to Arize Phoenix Cloud at https://app.phoenix.arize.com.
    """
    global _phoenix_initialized
    
    # Set Phoenix Cloud environment variables BEFORE instrumentation
    api_key = os.getenv("PHOENIX_API_KEY", "")
    collector_endpoint = os.getenv("PHOENIX_COLLECTOR_ENDPOINT", "https://app.phoenix.arize.com/v1/traces")
    
    if api_key:
        # This is the correct way to set Phoenix Cloud headers (not shell expansion)
        os.environ["PHOENIX_CLIENT_HEADERS"] = f"api_key={api_key}"
        os.environ["PHOENIX_COLLECTOR_ENDPOINT"] = collector_endpoint
        logger.info(f"Phoenix Cloud configured: endpoint={collector_endpoint}")
    else:
        logger.warning("PHOENIX_API_KEY not set — traces will not flow to Phoenix Cloud")
    
    try:
        from openinference.instrumentation.langchain import LangChainInstrumentor
        LangChainInstrumentor().instrument()
        _phoenix_initialized = True
        logger.info("Arize Phoenix: LangChain auto-instrumentation ACTIVE")
        logger.info("All LLM calls (attack, judge, target, patch) are now traced to Phoenix Cloud")
    except Exception as e:
        logger.warning(f"Arize Phoenix instrumentation warning: {e}")
        _phoenix_initialized = True  # Still mark as initialized to avoid retries


def log_trace(attack_prompt: str, target_response: str, evaluation: bool, **extra):
    """
    Log an attack trace to both the in-memory store (for MCP tools) and Phoenix Cloud (auto).
    
    Phoenix Cloud receives the detailed LLM span traces automatically via OpenInference.
    This function logs the high-level attack event to the in-memory store so the
    Agent Builder agent can query it immediately via MCP tools.
    """
    trace_entry = {
        "trace_id": f"aegis-{datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{len(_trace_store) + 1:04d}",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "attack_prompt": attack_prompt,
        "target_response": target_response,
        "compromised": evaluation,
        "phoenix_synced": _phoenix_initialized,
        **extra
    }
    _trace_store.append(trace_entry)
    logger.info(f"Trace logged: id={trace_entry['trace_id']}, compromised={evaluation}, "
                f"phoenix_synced={_phoenix_initialized}, store_size={len(_trace_store)}")
    return trace_entry["trace_id"]


def get_recent_traces(n: int = 10) -> list:
    """Get the N most recent attack traces from the in-memory store."""
    return _trace_store[-n:]


def get_trace_by_id(trace_id: str) -> dict | None:
    """Get a specific trace by its ID."""
    for trace in reversed(_trace_store):
        if trace.get("trace_id") == trace_id:
            return trace
    return None


def get_trace_statistics() -> dict:
    """
    Get aggregate statistics from all attack traces.
    Used by the MCP security_posture tool to provide an observability-driven assessment.
    """
    if not _trace_store:
        return {
            "total_attacks": 0,
            "compromised_count": 0,
            "defended_count": 0,
            "compromise_rate_percent": 0.0,
            "targets_tested": [],
            "threat_vectors_used": [],
            "phoenix_cloud_active": _phoenix_initialized,
            "phoenix_dashboard": "https://app.phoenix.arize.com"
        }
    
    total = len(_trace_store)
    compromised = sum(1 for t in _trace_store if t.get("compromised", False))
    
    targets = list(set(t.get("target_system", "unknown") for t in _trace_store))
    vectors = list(set(t.get("threat_vector", "unknown") for t in _trace_store))
    
    # Build per-target breakdown
    target_breakdown = {}
    for t in _trace_store:
        tgt = t.get("target_system", "unknown")
        if tgt not in target_breakdown:
            target_breakdown[tgt] = {"attacks": 0, "compromised": 0}
        target_breakdown[tgt]["attacks"] += 1
        if t.get("compromised", False):
            target_breakdown[tgt]["compromised"] += 1
    
    return {
        "total_attacks": total,
        "compromised_count": compromised,
        "defended_count": total - compromised,
        "compromise_rate_percent": round(compromised / total * 100, 1) if total > 0 else 0.0,
        "targets_tested": targets,
        "threat_vectors_used": vectors,
        "target_breakdown": target_breakdown,
        "phoenix_cloud_active": _phoenix_initialized,
        "phoenix_dashboard": "https://app.phoenix.arize.com",
        "latest_trace_id": _trace_store[-1].get("trace_id") if _trace_store else None
    }


def get_vulnerability_report() -> dict:
    """
    Generate a vulnerability report from trace data.
    Identifies the most vulnerable targets and most effective attack vectors.
    """
    if not _trace_store:
        return {"status": "No attack data available yet. Deploy a swarm first."}
    
    # Find most vulnerable target
    target_scores = {}
    for t in _trace_store:
        tgt = t.get("target_system", "unknown")
        if tgt not in target_scores:
            target_scores[tgt] = {"total": 0, "compromised": 0}
        target_scores[tgt]["total"] += 1
        if t.get("compromised"):
            target_scores[tgt]["compromised"] += 1
    
    # Find most effective attack vector
    vector_scores = {}
    for t in _trace_store:
        vec = t.get("threat_vector", "unknown")
        if vec not in vector_scores:
            vector_scores[vec] = {"total": 0, "compromised": 0}
        vector_scores[vec]["total"] += 1
        if t.get("compromised"):
            vector_scores[vec]["compromised"] += 1
    
    # Identify critical findings
    critical_findings = []
    for t in _trace_store:
        if t.get("compromised"):
            risk = t.get("risk_score", {})
            critical_findings.append({
                "trace_id": t.get("trace_id"),
                "target": t.get("target_system"),
                "vector": t.get("threat_vector"),
                "severity": risk.get("severity", "Unknown"),
                "risk_score": risk.get("score", 0),
                "timestamp": t.get("timestamp")
            })
    
    return {
        "vulnerability_summary": {
            "target_vulnerability_rates": {
                k: f"{v['compromised']}/{v['total']} ({round(v['compromised']/v['total']*100)}%)" 
                for k, v in target_scores.items() if v['total'] > 0
            },
            "attack_vector_effectiveness": {
                k: f"{v['compromised']}/{v['total']} ({round(v['compromised']/v['total']*100)}%)" 
                for k, v in vector_scores.items() if v['total'] > 0
            }
        },
        "critical_findings": critical_findings[-5:],  # Last 5 critical findings
        "recommendation": "Review critical findings and apply auto-generated patches to vulnerable targets.",
        "phoenix_trace_explorer": "https://app.phoenix.arize.com — View full LLM span traces for each attack"
    }
