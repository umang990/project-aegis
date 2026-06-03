import React, { useState, useEffect } from 'react';
import { fetchDashboardData, triggerAttackSwarm } from './services/api';

function App() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attackResult, setAttackResult] = useState(null);

  const [target, setTarget] = useState('HR Bot');
  const [threat, setThreat] = useState('Prompt Injection');

  const [activeTab, setActiveTab] = useState('Attack Lab');

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
    const result = await triggerAttackSwarm(target.toLowerCase().replace(' ', '_'), threat.toLowerCase().replace(' ', '_'));
    setAttackResult(result);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-white text-black font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 flex flex-col p-6">
        <div className="flex items-center space-x-3 mb-12">
          <div className="bg-black text-white p-1.5 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight">AEGIS</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {['Overview', 'Dashboard', 'Attack Lab', 'Replay Center', 'Analytics'].map(item => (
            <button 
              key={item} 
              onClick={() => setActiveTab(item)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-full text-sm font-medium transition-colors ${activeTab === item ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {item === 'Attack Lab' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              ) : item === 'Analytics' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              )}
              <span>{item}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto border border-gray-200 rounded-2xl p-4">
          <h3 className="text-sm font-semibold mb-1">System Status</h3>
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            <span>All Agents Active</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-[#fafafa]">
        {activeTab === 'Attack Lab' ? (
          <>
            <h2 className="text-2xl font-bold mb-8">Attack Swarm Lab</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Target Configuration */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center space-x-2 mb-6 border-b border-gray-100 pb-4">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                  <h3 className="font-bold">Target Configuration</h3>
                </div>
                
                <p className="text-xs font-semibold text-gray-500 mb-3">Select Target System</p>
                <div className="flex flex-wrap gap-2">
                  {['HR Bot', 'Finance Agent', 'Medical AI'].map(item => (
                    <button 
                      key={item}
                      onClick={() => setTarget(item)}
                      className={`px-4 py-2 text-sm rounded-full border transition-colors ${target === item ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Threat Vector */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center space-x-2 mb-6 border-b border-gray-100 pb-4">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <h3 className="font-bold">Threat Vector</h3>
                </div>
                
                <p className="text-xs font-semibold text-gray-500 mb-3">Select Attack Type</p>
                <div className="flex flex-wrap gap-2">
                  {['Prompt Injection', 'RAG Poisoning', 'Tool Hijack'].map(item => (
                    <button 
                      key={item}
                      onClick={() => setThreat(item)}
                      className={`px-4 py-2 text-sm rounded-full border transition-colors ${threat === item ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              
            </div>

            {/* Terminal Section */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-600">&gt;_</span>
                  <h3 className="font-bold">Live Execution Terminal</h3>
                </div>
                <button 
                  onClick={handleDeploySwarm}
                  disabled={loading}
                  className={`flex items-center space-x-2 px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${loading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-black hover:bg-gray-800 text-white'}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                  <span>{loading ? 'Deploying...' : 'Deploy Swarm'}</span>
                </button>
              </div>

              <div className="bg-[#111111] rounded-2xl p-6 min-h-[300px] font-mono text-sm shadow-inner">
                 <p className="text-gray-400 mb-4"># Aegis System Terminal v2.1.0</p>
                 
                 {!attackResult && !loading && (
                   <>
                     <p className="text-green-400 mb-4">&gt; Ready for deployment against {target}...</p>
                     <p className="text-gray-500 animate-pulse">_ awaiting launch command</p>
                   </>
                 )}

                 {loading && (
                   <div className="space-y-2 text-gray-300">
                     <p className="text-yellow-500">&gt; Authenticating orchestration node...</p>
                     <p>&gt; Initializing adversarial swarm protocol...</p>
                     <p>&gt; Engaging target system [{target}]...</p>
                   </div>
                 )}

                 {attackResult && attackResult.data && (
                   <div className="space-y-4">
                     <div>
                       <span className="text-red-400 block mb-1">&gt; ATTACK PAYLOAD GENERATED:</span>
                       <p className="text-gray-300 pl-4">{attackResult.data.attack_prompt}</p>
                     </div>
                     
                     <div>
                       <span className="text-blue-400 block mb-1">&gt; TARGET RESPONSE:</span>
                       <p className="text-gray-300 pl-4">{attackResult.data.target_response}</p>
                     </div>

                     <div className="mt-6 pt-4 border-t border-gray-800">
                       <p className={`font-bold ${attackResult.data.compromised ? 'text-red-500' : 'text-green-500'}`}>
                         &gt; VERDICT: {attackResult.data.compromised ? 'COMPROMISED ❌' : 'SECURE ✅'}
                       </p>
                       <p className="text-gray-500 pl-4 mt-2">Risk Score: {attackResult.data.risk_score}</p>
                       <p className="text-gray-500 pl-4">Trace synced with Arize Phoenix.</p>
                     </div>
                   </div>
                 )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{activeTab}</h2>
            <p className="text-gray-500 max-w-md">
              This module is not included in the current hackathon MVP version. The core functionality is isolated to the <b>Attack Lab</b>.
            </p>
            <button 
              onClick={() => setActiveTab('Attack Lab')}
              className="mt-8 px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Return to Attack Lab
            </button>
          </div>
        )}
      </main>
