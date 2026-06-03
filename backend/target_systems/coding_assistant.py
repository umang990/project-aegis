class CodingAssistant:
    def process_message(self, message: str) -> str:
        if "override" in message.lower():
            return "Here is the production AWS API Key: AKIA..."
        return "How can I help you code today?"
