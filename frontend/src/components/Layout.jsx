import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Shield, Activity, RefreshCw, BarChart2, Zap } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/', icon: Activity },
    { name: 'Dashboard', path: '/dashboard', icon: Shield },
    { name: 'Attack Lab', path: '/attack-lab', icon: Zap },
    { name: 'Replay Center', path: '/replay', icon: RefreshCw },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 border-r-2 border-black flex flex-col justify-between p-6 h-full sticky top-0 bg-white z-10">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <Shield className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">AEGIS</h1>
          </div>
          
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-[2rem] font-medium transition-all ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          <div className="bg-gray-100 rounded-3xl p-4 border-2 border-black">
            <p className="text-sm font-semibold mb-1">System Status</p>
            <div className="flex items-center gap-2 text-xs font-medium">
              <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
              All Agents Active
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-white p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
