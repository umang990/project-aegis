import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, LayoutDashboard, Activity, Zap, PlaySquare, BarChart2 } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Overview', path: '/overview', icon: Activity },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Attack Lab', path: '/', icon: Zap },
    { name: 'Replay Center', path: '/replay', icon: PlaySquare },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 flex flex-col p-6 bg-white shrink-0 h-screen sticky top-0 overflow-y-auto">
      <div className="flex items-center space-x-3 mb-12">
        <div className="bg-black text-white p-1.5 rounded-full flex items-center justify-center">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">AEGIS</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map(item => (
          <NavLink 
            key={item.name} 
            to={item.path}
            className={({ isActive }) => 
              `w-full flex items-center space-x-3 px-4 py-3 rounded-full text-sm font-medium transition-colors ${
                isActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-12 border border-gray-200 rounded-2xl p-4">
        <h3 className="text-sm font-semibold mb-1">System Status</h3>
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <div className="w-2 h-2 rounded-full bg-gray-600"></div>
          <span>All Agents Active</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
