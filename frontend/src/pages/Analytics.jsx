import React from 'react';
import { motion } from 'framer-motion';
import Card from '../components/Common/Card';

const Analytics = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
      <div className="mb-8">
        <span className="pill-header">Data & Risk</span>
        <h2 className="text-3xl font-bold">Analytics & Scoring</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="h-64 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg border-b-2 border-gray-100 pb-2 mb-4">Risk Distribution</h3>
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 pt-4">
             {/* Mock grayscale bar chart */}
             {[40, 70, 30, 90, 50, 20].map((h, i) => (
               <div key={i} className="w-1/6 bg-gray-200 rounded-t-xl relative group">
                 <div className="absolute bottom-0 w-full bg-black rounded-t-xl transition-all duration-500 ease-out" style={{ height: `${h}%` }}></div>
               </div>
             ))}
          </div>
          <div className="flex justify-between text-xs font-bold text-gray-500 mt-2">
            <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-center items-center text-center">
          <h3 className="font-bold text-2xl mb-2">Overall Security Posture</h3>
          <div className="relative w-48 h-48 my-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-gray-200" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-black" strokeWidth="4" strokeDasharray="87, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-4xl font-extrabold">87%</span>
              <span className="text-xs font-bold tracking-widest uppercase">Secured</span>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-bold text-xl mb-4 border-b-2 border-gray-100 pb-4">Vulnerability Matrix</h3>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 border-b-2 border-gray-100">
              <th className="pb-2 font-bold">Threat Type</th>
              <th className="pb-2 font-bold">Occurrences</th>
              <th className="pb-2 font-bold">Severity</th>
              <th className="pb-2 font-bold text-right">Patched</th>
            </tr>
          </thead>
          <tbody>
            {['Prompt Injection', 'Data Exfiltration', 'Tool Hijack'].map((t, i) => (
              <tr key={i} className="border-b-2 border-gray-100 last:border-0">
                <td className="py-4 font-bold">{t}</td>
                <td className="py-4">{42 - i * 12}</td>
                <td className="py-4">
                  <span className="bg-black text-white px-2 py-1 rounded-full text-xs font-bold">Critical</span>
                </td>
                <td className="py-4 text-right font-bold text-black">100%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </motion.div>
  );
};

export default Analytics;
