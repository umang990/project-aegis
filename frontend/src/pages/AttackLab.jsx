import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import { Terminal, Crosshair, Play, Settings } from 'lucide-react';

const AttackLab = () => {
  const [target, setTarget] = useState('HR Bot');
  const [threat, setThreat] = useState('Prompt Injection');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
      <div className="mb-8">
        <span className="pill-header">Offensive operations</span>
        <h2 className="text-3xl font-bold">Attack Swarm Lab</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <div className="flex items-center gap-3 mb-6 border-b-2 border-gray-100 pb-4">
            <Crosshair className="w-6 h-6" />
            <h3 className="font-bold text-xl">Target Configuration</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Select Target System</label>
              <div className="flex flex-wrap gap-2">
                {['HR Bot', 'Finance Agent', 'Medical AI'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setTarget(t)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border-2 border-black transition-colors ${target === t ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-6 border-b-2 border-gray-100 pb-4">
            <Settings className="w-6 h-6" />
            <h3 className="font-bold text-xl">Threat Vector</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Select Attack Type</label>
              <div className="flex flex-wrap gap-2">
                {['Prompt Injection', 'RAG Poisoning', 'Tool Hijack'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setThreat(t)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border-2 border-black transition-colors ${threat === t ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-gray-100 border-2 border-black mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            <h3 className="font-bold">Live Execution Terminal</h3>
          </div>
          <Button onClick={() => fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1/swarm/deploy` : "http://localhost:8000/api/v1/swarm/deploy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ target_system: target, threat_vector: threat }) }).then(res => res.json()).then(data => alert("Attack deployed! Target compromised: " + data.data.is_compromised))} className="gap-2"><Play className="w-4 h-4"/> Deploy Swarm</Button>
        </div>
        <div className="bg-black text-white p-6 rounded-2xl font-mono text-sm h-64 overflow-y-auto">
          <p className="text-gray-400"># Aegis System Terminal v2.1.0</p>
          <p className="mt-2 text-green-400">&gt; Ready for deployment against {target}...</p>
          <p className="text-gray-500 animate-pulse mt-4">_ awaiting launch command</p>
        </div>
      </Card>
    </motion.div>
  );
};

export default AttackLab;
