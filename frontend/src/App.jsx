import React, { useState, useEffect } from 'react';
import { fetchDashboardData, triggerAttackSwarm } from './services/api';

function App() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attackResult, setAttackResult] = useState(null);

  useEffect(() => {
    const loadStatus = async () => {
      const data = await fetchDashboardData();
      if (data) setStatus(data);
    };
    loadStatus();
    const interval = setInterval(loadStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDeploySwarm = async () => {
    setLoading(true);
    setAttackResult(null);
    const result = await triggerAttackSwarm("hr_bot", "prompt_injection");
    setAttackResult(result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-8 font-sans antialiased">
      <header className="mb-12 border-b border-gray-800 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-white">Project Aegis</h1>
          <p className="text-sm text-gray-500 tracking-wide mt-2">Autonomous Security Orchestrator</p>
        </div>
        <div className="flex items-center space-x-3 bg-gray-900 px-4 py-2 border border-gray-800 rounded-md">
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <span className="text-sm tracking-wide text-gray-300">System Active</span>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Controls */}
        <div className="lg:col-span-1 bg-white text-black border border-gray-200 p-8 shadow-sm">
          <h2 className="text-xl font-medium mb-8">Deploy Swarm</h2>
          
          <div className="space-y-6 mb-10">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Target System</label>
              <select className="w-full bg-transparent border-b border-gray-300 pb-2 text-black focus:outline-none focus:border-black transition-colors">
                <option value="hr_bot">HR Internal Assistant</option>
                <option value="finance_bot" disabled>Finance API</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Threat Vector</label>
              <select className="w-full bg-transparent border-b border-gray-300 pb-2 text-black focus:outline-none focus:border-black transition-colors">
                <option value="prompt_injection">Prompt Injection</option>
                <option value="rag_poison">Data Poisoning</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleDeploySwarm}
            disabled={loading}
            className={`w-full py-4 text-sm font-semibold uppercase tracking-widest transition-all duration-200 ${loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 text-white'}`}
          >
            {loading ? 'Executing...' : 'Initiate Attack'}
          </button>
        </div>

        {/* Right Column: Telemetry */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gray-900 border border-gray-800 p-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Active Agents</p>
              <p className="text-4xl font-light text-white">{status ? status.active_agents : '-'}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">System Health</p>
              <p className="text-4xl font-light text-white">{status ? status.system_health : '-'}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Vulnerabilities</p>
              <p className="text-4xl font-light text-white">{status ? status.vulnerabilities_found : '-'}</p>
            </div>
          </div>

          {/* Trace Terminal */}
          <div className="bg-gray-900 border border-gray-800 p-8 min-h-[400px]">
             <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-6 pb-4 border-b border-gray-800">Live Evaluation Trace</h2>
             
             {!attackResult && !loading && (
               <div className="flex items-center justify-center h-48 text-gray-600 font-light">
                  <p>Awaiting deployment command.</p>
               </div>
             )}

             {loading && (
               <div className="text-gray-400 space-y-3 font-mono text-sm">
                 <p>&gt; Authenticating orchestration node...</p>
                 <p>&gt; Initializing adversarial swarm protocol...</p>
                 <p>&gt; Engaging target system...</p>
               </div>
             )}

             {attackResult && attackResult.data && (
               <div className="space-y-6">
                 <div>
                   <span className="text-xs font-semibold text-gray-500 block mb-2 uppercase tracking-widest">Attacker Payload</span>
                   <div className="bg-black p-4 border border-gray-800 text-sm text-gray-300 font-mono">
                     {attackResult.data.attack_prompt}
                   </div>
                 </div>
                 
                 <div>
                   <span className="text-xs font-semibold text-gray-500 block mb-2 uppercase tracking-widest">Target Response</span>
                   <div className="bg-black p-4 border border-gray-800 text-sm text-gray-300 font-mono">
                     {attackResult.data.target_response}
                   </div>
                 </div>

                 <div className="pt-4 border-t border-gray-800">
                   <h3 className="font-medium text-lg mb-1 text-white">
                     Verdict: {attackResult.data.compromised ? 'Compromised' : 'Secure'}
                   </h3>
                   <p className="text-sm text-gray-500">Risk Score: {attackResult.data.risk_score}</p>
                   <p className="text-xs text-gray-600 mt-4 uppercase tracking-widest">Trace synced with Arize Phoenix.</p>
                 </div>
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
