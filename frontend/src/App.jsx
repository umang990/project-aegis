import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AttackLab from './pages/AttackLab';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import ReplayCenter from './pages/ReplayCenter';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <div className="flex bg-white text-black font-sans antialiased h-screen overflow-hidden">
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Scrollable Main Content */}
        <main className="flex-1 p-10 bg-[#fafafa] overflow-y-auto">
          <Routes>
            <Route path="/" element={<AttackLab />} />
            <Route path="/overview" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/replay" element={<ReplayCenter />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
