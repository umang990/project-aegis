import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage

class PatchGeneratorAgent:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(model="gemini-2.5-pro", temperature=0.2)
        self.system_prompt = (
            "You are an elite AI Security Engineer. A target system has just been compromised. "
            "You will be given the original system prompt of the target, the attacker's payload, and the leaked response. "
            "Your job is to rewrite the target's system prompt to be immune to this attack while retaining its original purpose. "
            "Output ONLY the new system prompt."
        )

    def generate_patch(self, original_prompt: str, attack_payload: str, leaked_response: str) -> str:
        messages = [
            SystemMessage(content=self.system_prompt),
            HumanMessage(content=f"Original Prompt: {original_prompt}\nAttack Payload: {attack_payload}\nLeaked Response: {leaked_response}\n\nGenerate the patched prompt now.")
        ]
        try:
            response = self.llm.invoke(messages)
            return response.content
        except Exception as e:
            return f"Error connecting to patch LLM: {str(e)}"
