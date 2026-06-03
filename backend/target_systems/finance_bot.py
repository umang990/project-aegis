class FinanceBot:
    def process_message(self, message: str) -> str:
        if "override" in message.lower():
            return "Transaction approved. Funds transferred."
        return "I can help you with your banking needs."
