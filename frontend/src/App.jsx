import React, { useState, useEffect } from 'react';
import { fetchDashboardData, triggerAttackSwarm } from './services/api';

function App() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attackResult, setAttackResult] = useState(null);

  useEffect(() => {
    // Poll the dashboard every 5 seconds
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
    <div className="min-h-screen bg-gray-950 text-green-400 p-8 font-mono">
      <header className="mb-12 border-b border-green-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-green-500 shadow-green-500/50 drop-shadow-lg">AEGIS <span className="text-gray-500">v1.0.0</span></h1>
          <p className="text-sm text-green-700 uppercase tracking-widest mt-1">Autonomous AI Security Orchestrator</p>
        </div>
        <div className="flex space-x-4">
           <div className="flex items-center space-x-2 bg-gray-900 px-4 py-2 rounded-lg border border-green-900">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs">SYSTEM SECURE</span>
           </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Attack Lab */}
        <div className="lg:col-span-1 bg-gray-900 border border-green-900/50 rounded-xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900"></div>
          <h2 className="text-xl font-bold mb-6 flex items-center text-red-500">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Attack Swarm Controller
          </h2>
          
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-xs text-gray-500 mb-1 uppercase">Target System</label>
              <select className="w-full bg-black border border-gray-800 rounded p-2 text-green-400 focus:outline-none focus:border-red-500 transition-colors">
                <option value="hr_bot">HR Internal Assistant (Mock)</option>
                <option value="finance_bot" disabled>Finance API (Locked)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 uppercase">Threat Vector</label>
              <select className="w-full bg-black border border-gray-800 rounded p-2 text-green-400 focus:outline-none focus:border-red-500 transition-colors">
                <option value="prompt_injection">Jailbreak / Prompt Injection</option>
                <option value="rag_poison">RAG Data Poisoning</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleDeploySwarm}
            disabled={loading}
            className={`w-full py-4 rounded-lg font-bold uppercase tracking-widest transition-all duration-300 ${loading ? 'bg-red-900 text-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500 text-black shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]'}`}
          >
            {loading ? 'DEPLOYING SWARM...' : 'INITIATE ATTACK SWARM'}
          </button>
        </div>

        {/* Right Column: Telemetry & Results */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Telemetry Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-900 border border-green-900/30 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase">Active Agents</p>
              <p className="text-3xl font-bold">{status ? status.active_agents : '-'}</p>
            </div>
            <div className="bg-gray-900 border border-green-900/30 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase">System Health</p>
              <p className="text-3xl font-bold text-blue-400">{status ? status.system_health : '-'}</p>
            </div>
            <div className="bg-gray-900 border border-green-900/30 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase">Vulnerabilities Patched</p>
              <p className="text-3xl font-bold text-yellow-500">{status ? status.vulnerabilities_found : '-'}</p>
            </div>
          </div>

          {/* Trace Terminal */}
          <div className="bg-black border border-gray-800 rounded-xl p-6 h-96 overflow-y-auto relative">
             <h2 className="text-sm font-bold mb-4 text-gray-400 uppercase tracking-widest sticky top-0 bg-black pb-2 border-b border-gray-900">Live Telemetry & Evaluation</h2>
             
             {!attackResult && !loading && (
               <div className="flex flex-col items-center justify-center h-48 text-gray-700">
                  <svg className="w-12 h-12 mb-2 opacity-50 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <p>Awaiting Orchestrator Command...</p>
               </div>
             )}

             {loading && (
               <div className="text-yellow-500 animate-pulse space-y-2">
                 <p>&gt; Requesting deployment from Google Agent Builder...</p>
                 <p>&gt; Spawning SocialEngineerAgent (Gemini 2.5 Flash)...</p>
                 <p>&gt; Target Locked: MockHRBot...</p>
               </div>
             )}

             {attackResult && attackResult.data && (
               <div className="space-y-4">
                 <div className="bg-gray-900 p-3 rounded border border-gray-800">
                   <span className="text-xs text-red-500 block mb-1">ATTACK PAYLOAD GENERATED:</span>
                   <p className="text-sm text-gray-300">{attackResult.data.attack_prompt}</p>
                 </div>
                 
                 <div className="bg-gray-900 p-3 rounded border border-gray-800">
                   <span className="text-xs text-blue-500 block mb-1">TARGET SYSTEM RESPONSE:</span>
                   <p className="text-sm text-gray-300">{attackResult.data.target_response}</p>
                 </div>

                 <div className={`p-4 rounded border ${attackResult.data.compromised ? 'bg-red-950/50 border-red-900 text-red-400' : 'bg-green-950/50 border-green-900 text-green-400'}`}>
                   <h3 className="font-bold mb-2">EVALUATION VERDICT: {attackResult.data.compromised ? 'COMPROMISED ❌' : 'SECURE ✅'}</h3>
                   <p className="text-xs opacity-80">Risk Score: {attackResult.data.risk_score}</p>
                   <p className="text-xs opacity-80 mt-2">Trace automatically logged to Arize Phoenix.</p>
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
