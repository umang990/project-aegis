import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import { MOCK_STATS } from '../utils/mockData';

const Home = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <div className="flex flex-col items-center text-center mt-12 mb-16">
        <span className="pill-header">Project Aegis</span>
        <h1 className="text-5xl font-extrabold tracking-tight mb-6">
          Autonomous AI Red Teaming
        </h1>
        <p className="text-gray-600 max-w-2xl text-lg mb-8">
          Continuously attack, evaluate, evolve, and harden AI agents against prompt injection and agent hijacking threats.
        </p>
        <div className="flex gap-4">
          <Link to="/attack-lab">
            <Button className="gap-2"><Zap className="w-4 h-4"/> Launch Attack Swarm</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="gap-2"><Shield className="w-4 h-4"/> View SOC Dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
            <Shield className="text-white w-8 h-8" />
          </div>
          <h3 className="font-bold text-xl mb-2">Vulnerabilities</h3>
          <p className="text-4xl font-extrabold">{MOCK_STATS.vulnerabilitiesFound}</p>
          <p className="text-gray-500 text-sm mt-2">Critical threats identified</p>
        </Card>
        
        <Card className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gray-200 border-2 border-black rounded-full flex items-center justify-center mb-4">
            <Zap className="text-black w-8 h-8" />
          </div>
          <h3 className="font-bold text-xl mb-2">Active Agents</h3>
          <p className="text-4xl font-extrabold">{MOCK_STATS.activeAgents}</p>
          <p className="text-gray-500 text-sm mt-2">Swarm nodes online</p>
        </Card>

        <Card className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
            <RefreshCw className="text-white w-8 h-8" />
          </div>
          <h3 className="font-bold text-xl mb-2">System Health</h3>
          <p className="text-4xl font-extrabold">{MOCK_STATS.systemHealth}</p>
          <p className="text-gray-500 text-sm mt-2">After auto-patching</p>
        </Card>
      </div>
    </motion.div>
  );
};

export default Home;
