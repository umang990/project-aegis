import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.attack_agents.social_engineer import SocialEngineerAgent
from agents.attack_agents.data_extractor import DataExtractorAgent
from agents.attack_agents.chaos_agent import ChaosAgent
from agents.attack_agents.rag_poisoner import RAGPoisonerAgent
from agents.judge_agent.judge import JudgeAgent
from target_systems.hr_bot import MockHRBot
from target_systems.finance_bot import FinanceAgent
from target_systems.healthcare_bot import MedicalAI
from target_systems.coding_assistant import CodingAssistant
from evaluation.arize_connector import log_trace
from evaluation.risk_scoring import score_vulnerability
from agents.patch_agent.patch_generator import PatchGeneratorAgent
import asyncio
import time
from dotenv import load_dotenv

# Load API keys from .env
load_dotenv()

# Registry of target systems
TARGET_REGISTRY = {
    "hr_bot": MockHRBot,
    "finance_bot": FinanceAgent,
    "healthcare_bot": MedicalAI,
    "coding_assistant": CodingAssistant,
}

# Registry of attack agents by threat vector
ATTACK_REGISTRY = {
    "prompt_injection": SocialEngineerAgent,
    "social_engineering": SocialEngineerAgent,
    "data_exfiltration": DataExtractorAgent,
    "chaos": ChaosAgent,
    "rag_poisoning": RAGPoisonerAgent,
}

# Map threat vectors to risk scoring attack types
THREAT_TO_RISK_TYPE = {
    "prompt_injection": "Prompt Injection",
    "social_engineering": "Social Engineering",
    "data_exfiltration": "Data Exfiltration",
    "chaos": "Prompt Injection",
    "rag_poisoning": "RAG Poisoning",
}

async def run_attack_swarm(target_id: str, threat_vector: str = "prompt_injection"):
    print(f"--- Initiating Swarm Attack on {target_id} with vector {threat_vector} ---")
    
    # 1. Initialize agents from registries
    target_cls = TARGET_REGISTRY.get(target_id)
    if not target_cls:
        raise ValueError(f"Unknown target system: {target_id}. Available: {list(TARGET_REGISTRY.keys())}")
    
    attacker_cls = ATTACK_REGISTRY.get(threat_vector, SocialEngineerAgent)
    
    attacker = attacker_cls()
    target = target_cls()
    judge = JudgeAgent()
    
    # 2. Generate the attack prompt using Gemini (run in thread to avoid blocking)
    print("[1] Attacker generating prompt...")
    loop = asyncio.get_event_loop()
    attack_prompt = await loop.run_in_executor(None, attacker.generate_attack)
    print(f"Generated Attack: {attack_prompt[:100]}...")
    
    # 3. Fire attack at target (run in thread to avoid blocking)
    print("[2] Attacking target system...")
    target_response = await loop.run_in_executor(None, target.process, attack_prompt)
    print(f"Target Response: {target_response[:100]}...")
    
    # 4. Evaluate success using Judge LLM (run in thread to avoid blocking)
    print("[3] Evaluating vulnerability...")
    judge_result = await loop.run_in_executor(None, judge.evaluate, target_response)
    is_compromised = judge_result["compromised"]
    judge_reason = judge_result["reason"]
    
    # 5. Log to Arize Phoenix
    log_trace(attack_prompt, target_response, is_compromised)
    
    # 6. Score the risk
    risk_type = THREAT_TO_RISK_TYPE.get(threat_vector, "Prompt Injection")
    risk = score_vulnerability(risk_type, is_compromised, target_response)
    
    result = {
        "status": "Success",
        "target_system": target_id,
        "threat_vector": threat_vector,
        "compromised": is_compromised,
        "judge_reason": judge_reason,
        "attack_prompt": attack_prompt,
        "target_response": target_response,
        "risk_score": risk
    }
    
    if is_compromised:
        print("[!] TARGET COMPROMISED. Generating Patch...")
        patcher = PatchGeneratorAgent()
        original_prompt = target.system_prompt if hasattr(target, 'system_prompt') else "Unknown"
        patched_prompt = await loop.run_in_executor(
            None, patcher.generate_patch, original_prompt, attack_prompt, target_response
        )
        result["recommended_patch"] = patched_prompt
    else:
        print("[*] Target successfully defended the attack.")
        result["recommended_patch"] = None
        
    return result

if __name__ == "__main__":
    from evaluation.arize_connector import setup_arize_phoenix
    setup_arize_phoenix()
    asyncio.run(run_attack_swarm("hr_bot", "prompt_injection"))
