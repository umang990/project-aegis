import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pipelines.attack_pipeline import run_attack_swarm

async def run_retest_pipeline(target_system_name: str, patched_prompt: str) -> dict:
    print(f"--- Initiating Auto-Retest for {target_system_name} ---")
    print("[1] Deploying attack swarm against patched target...")
    
    # In a real system, we would inject the patched_prompt into the target temporarily.
    # For this architecture demonstration, we run the standard attack pipeline logic to simulate the retest.
    result = await run_attack_swarm(target_system_name)
    
    print("[*] Retest Complete.")
    return result
