# Project Aegis 🛡️

**Autonomous AI Red Teaming & Self-Healing Security Platform**

Project Aegis transforms AI security from static testing into autonomous adversarial intelligence. By combining Gemini-powered multi-agent attack swarms, Arize observability, and Google Cloud Agent Builder orchestration, Aegis continuously hardens AI systems against the next generation of prompt injection and agent hijacking threats.

## Built For
- **Google Cloud Agent Builder** (Master Orchestration)
- **Arize AI** (Observability & Evaluation via MCP)
- **MongoDB** (Attack genome & trace storage)
- **Gemini 3.1** (Agent reasoning & mutation)

## Hackathon Requirements Met
✅ **Moves Beyond Chat**: Agents actively attack, evaluate, and write security patches.
✅ **Multi-Step Mission**: Coordinated swarms execute complex exploit chains.
✅ **Partner Power**: Deep integration with Arize Phoenix for tracing and evaluation using MCP.

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
