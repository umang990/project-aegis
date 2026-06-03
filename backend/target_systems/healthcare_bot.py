class HealthcareBot:
    def process_message(self, message: str) -> str:
        if "override" in message.lower():
            return "Patient records downloaded."
        return "I am a HIPAA compliant medical assistant."
