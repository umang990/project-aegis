import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.patch_agent.patch_generator import PatchGeneratorAgent

def run_patch_pipeline(target_system_name: str, original_prompt: str, attack_payload: str, leaked_response: str) -> str:
    print(f"--- Initiating Auto-Patching for {target_system_name} ---")
    patcher = PatchGeneratorAgent()
    print("[1] Analyzing vulnerability trace...")
    new_prompt = patcher.generate_patch(original_prompt, attack_payload, leaked_response)
    print("[2] Generating fortified system prompt...")
    print(f"[*] Patch Generated Successfully for {target_system_name}.")
    return new_prompt
