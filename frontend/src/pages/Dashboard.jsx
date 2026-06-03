import React from 'react';
import { motion } from 'framer-motion';
import Card from '../components/Common/Card';
import { MOCK_ATTACKS, MOCK_TRACES } from '../utils/mockData';
import { AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

const Dashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="pill-header bg-gray-200 !text-black border-2 border-black">Live Feed</span>
          <h2 className="text-3xl font-bold">SOC Dashboard</h2>
        </div>
        <div className="flex gap-2 items-center px-4 py-2 bg-black text-white rounded-full text-sm font-semibold">
          <Activity className="w-4 h-4 animate-pulse" />
          Monitoring Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-xl font-bold mb-6 border-b-2 border-gray-100 pb-4">Live Attack Feed</h3>
            <div className="space-y-4">
              {MOCK_ATTACKS.map((attack) => (
                <div key={attack.id} className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-2xl hover:border-black transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${attack.status === 'Success' ? 'bg-black text-white' : 'bg-gray-100 text-black border-2 border-black'}`}>
                      {attack.status === 'Success' ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{attack.type}</p>
                      <p className="text-sm text-gray-500">Target: {attack.target}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${attack.status === 'Success' ? 'text-black' : 'text-gray-400'}`}>
                      {attack.status === 'Success' ? 'Compromised' : 'Defended'}
                    </p>
                    <p className="text-xs text-gray-500">{attack.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-black text-white">
            <h3 className="text-xl font-bold mb-6">Threat Heatmap</h3>
            <div className="space-y-4">
              {['Prompt Injection', 'Data Exfiltration', 'Tool Hijack'].map((threat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{threat}</span>
                    <span className="font-bold">{90 - idx * 20}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: `${90 - idx * 20}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-4">Recent Traces</h3>
            <div className="space-y-3">
              {MOCK_TRACES.map((trace) => (
                <div key={trace.id} className="flex justify-between items-center text-sm border-b-2 border-gray-100 pb-2 last:border-0">
                  <span className="font-medium">{trace.id}</span>
                  <span className="text-gray-500">{trace.type}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${trace.severity === 'Critical' ? 'bg-black text-white' : 'bg-gray-200'}`}>
                    {trace.severity}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
