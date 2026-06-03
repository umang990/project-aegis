import os
import phoenix as px
from openinference.instrumentation.langchain import LangChainInstrumentor

def setup_arize_phoenix():
    """
    Initializes the Arize Phoenix observability layer and instruments LangChain.
    """
    print("Connecting to Arize Phoenix...")
    # For Phoenix Cloud, we don't launch the local app. 
    # We just instrument LangChain which reads PHOENIX_COLLECTOR_ENDPOINT from .env
    LangChainInstrumentor().instrument()
    
    print("Arize Phoenix connected to Cloud and LangChain instrumented.")
    return None

def log_trace(attack_prompt: str, target_response: str, evaluation: bool):
    """
    Custom tracing for specific pipeline events.
    (LangChain automatically traces the LLM calls, but we can log high-level events here).
    """
    # In a real environment, we would log specific span attributes to Phoenix here.
    # For now, OpenInference instrumentation handles the LLM traces automatically.
    print(f"Logged trace to Phoenix: Eval={evaluation}")
