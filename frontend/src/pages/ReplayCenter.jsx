import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import { PlayCircle, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';

const ReplayCenter = () => {
  const [step, setStep] = useState(0);
  const steps = [
    { title: 'Attack Initiated', icon: ShieldAlert, desc: 'Swarm launched against target memory constraints.' },
    { title: 'Vulnerability Exploited', icon: Cpu, desc: 'Prompt injection successful. Salary data leaked.' },
    { title: 'Auto-Patch Applied', icon: CheckCircle, desc: 'System constraints updated to block override commands.' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
      <div className="mb-8">
        <span className="pill-header">Cinematic View</span>
        <h2 className="text-3xl font-bold">Attack Replay Theater</h2>
      </div>

      <Card className="mb-8 overflow-hidden p-0 border-2 border-black">
        <div className="bg-black text-white p-6 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-xl">Incident #8892 - PII Extraction</h3>
            <p className="text-gray-400 text-sm">Target: HR Bot | Vector: Prompt Injection</p>
          </div>
          <Button variant="outline" className="!bg-black !text-white border-white hover:!bg-white hover:!text-black gap-2">
            <PlayCircle className="w-5 h-5"/> Play Sequence
          </Button>
        </div>
        
        <div className="p-8 bg-gray-50 min-h-[300px] flex items-center justify-center">
           <div className="w-full max-w-2xl relative">
             <div className="absolute left-8 top-0 bottom-0 w-1 bg-black"></div>
             
             {steps.map((s, idx) => (
               <div key={idx} className={`relative flex items-center gap-8 mb-12 last:mb-0 transition-opacity ${step >= idx ? 'opacity-100' : 'opacity-30'}`} onClick={() => setStep(idx)}>
                 <div className="w-16 h-16 bg-white border-4 border-black rounded-full flex items-center justify-center z-10 shrink-0 cursor-pointer hover:scale-110 transition-transform">
                   <s.icon className="w-6 h-6" />
                 </div>
                 <Card className="flex-1 cursor-pointer hover:shadow-solid transition-shadow">
                   <h4 className="font-bold text-lg">{s.title}</h4>
                   <p className="text-gray-600">{s.desc}</p>
                 </Card>
               </div>
             ))}
           </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ReplayCenter;
