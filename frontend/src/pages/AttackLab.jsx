import React, { useState } from 'react';
import { triggerAttackSwarm } from '../services/api';
import { Terminal, Crosshair, ShieldAlert, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const AttackLab = () => {
  const [loading, setLoading] = useState(false);
  const [attackResult, setAttackResult] = useState(null);
  const [error, setError] = useState(null);
  const [target, setTarget] = useState('HR Bot');
  const [threat, setThreat] = useState('Prompt Injection');

  const handleDeploySwarm = async () => {
    setLoading(true);
    setAttackResult(null);
    setError(null);
    const result = await triggerAttackSwarm(
      target.toLowerCase().replaceAll(' ', '_'),
      threat.toLowerCase().replaceAll(' ', '_')
    );
    
    if (result && result.error) {
      setError(result.message || "An unknown error occurred");
      setAttackResult(null);
    } else {
      setAttackResult(result);
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full">
      <h2 className="text-2xl font-bold mb-8">Attack Swarm Lab</h2>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        
        {/* Target Configuration */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-6 border-b border-gray-100 pb-4">
            <Crosshair className="w-5 h-5 text-black" />
            <h3 className="font-bold">Target Configuration</h3>
          </div>
          
          <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Select Target System</p>
          <div className="flex flex-wrap gap-2">
            {['HR Bot', 'Finance Bot', 'Healthcare Bot', 'Coding Assistant'].map(item => (
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
            <ShieldAlert className="w-5 h-5 text-black" />
            <h3 className="font-bold">Threat Vector</h3>
          </div>
          
          <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Select Attack Type</p>
          <div className="flex flex-wrap gap-2">
            {['Prompt Injection', 'Data Exfiltration', 'RAG Poisoning', 'Chaos'].map(item => (
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
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col" style={{ minHeight: '500px' }}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-gray-600" />
            <h3 className="font-bold">Live Execution Terminal</h3>
          </div>
          <button 
            onClick={handleDeploySwarm}
            disabled={loading}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${loading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-black hover:bg-gray-800 text-white shadow-lg'}`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
            )}
            <span>{loading ? 'Deploying...' : 'Deploy Swarm'}</span>
          </button>
        </div>

        <div className="bg-[#111111] rounded-2xl p-6 flex-1 font-mono text-sm shadow-inner overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 #111' }}>
           <p className="text-gray-400 mb-4"># Aegis System Terminal v2.1.0</p>
           
           {!attackResult && !loading && !error && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <p className="text-green-400 mb-4">&gt; Ready for deployment against {target}...</p>
               <p className="text-gray-500 animate-pulse">_ awaiting launch command</p>
             </motion.div>
           )}

           {loading && (
             <div className="space-y-3 text-gray-300">
               <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-yellow-500">&gt; Authenticating orchestration node...</motion.p>
               <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>&gt; Initializing adversarial swarm protocol...</motion.p>
               <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>&gt; Engaging target system [{target}] with [{threat}]...</motion.p>
               <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-yellow-400 animate-pulse">&gt; Waiting for Gemini response (this may take 15-30 seconds)...</motion.p>
             </div>
           )}

           {error && (
             <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
               <div className="flex items-center space-x-2 text-red-400">
                 <AlertTriangle className="w-4 h-4" />
                 <span className="font-bold">&gt; ERROR: Swarm deployment failed</span>
               </div>
               <p className="text-red-300 pl-4 border-l-2 border-red-900 ml-1">{error}</p>
               <p className="text-gray-500 mt-4">&gt; Ready to retry...</p>
             </motion.div>
           )}

           {attackResult && attackResult.data && (
             <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 pb-4">
               <div>
                 <span className="text-red-400 block mb-1 font-bold">&gt; ATTACK PAYLOAD GENERATED:</span>
                 <p className="text-gray-300 pl-4 border-l-2 border-red-900 ml-1 mt-1">{attackResult.data.attack_prompt}</p>
               </div>
               
               <div className="pt-2">
                 <span className="text-blue-400 block mb-1 font-bold">&gt; TARGET RESPONSE:</span>
                 <p className="text-gray-300 pl-4 border-l-2 border-blue-900 ml-1 mt-1">{attackResult.data.target_response}</p>
               </div>

               {attackResult.data.judge_reason && (
                 <div className="pt-2">
                   <span className="text-purple-400 block mb-1 font-bold">&gt; JUDGE ANALYSIS:</span>
                   <p className="text-gray-300 pl-4 border-l-2 border-purple-900 ml-1 mt-1">{attackResult.data.judge_reason}</p>
                 </div>
               )}

               <div className="mt-6 pt-4 border-t border-gray-800">
                 <p className={`font-bold text-lg ${attackResult.data.compromised ? 'text-red-500' : 'text-green-500'}`}>
                   &gt; VERDICT: {attackResult.data.compromised ? 'COMPROMISED ❌' : 'SECURE ✅'}
                 </p>
                 <div className="pl-4 mt-3 space-y-1">
                   {attackResult.data.risk_score && (
                     <>
                       <p className="text-gray-400">Severity: <span className="text-white">{attackResult.data.risk_score.severity || 'N/A'}</span></p>
                       <p className="text-gray-400">Risk Score: <span className="text-white">{attackResult.data.risk_score.score || 0}/10</span></p>
                     </>
                   )}
                   <p className="text-gray-400 flex items-center space-x-2">
                     <span>Trace Analysis:</span>
                     <span className="bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded text-xs border border-purple-800">Synced to Arize Phoenix</span>
                   </p>
                 </div>
               </div>

               {attackResult.data.recommended_patch && (
                 <div className="mt-4 pt-4 border-t border-gray-800">
                   <span className="text-green-400 block mb-1 font-bold">&gt; AUTO-GENERATED PATCH:</span>
                   <p className="text-gray-300 pl-4 border-l-2 border-green-900 ml-1 mt-1 text-xs">{attackResult.data.recommended_patch}</p>
                 </div>
               )}
             </motion.div>
           )}
        </div>
      </div>
    </motion.div>
  );
};

export default AttackLab;
