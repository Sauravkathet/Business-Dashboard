import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Package, FileText, Bot, Menu, Bell, Search, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const SidebarItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
          isActive
            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`
      }
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

export const Layout: React.FC = () => {
  const { user } = useStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getPageTitle = () => {
    const path = location.pathname.substring(1);
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white border-r border-slate-800">
        <div className="flex items-center gap-2 px-6 py-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">FlowForge OS</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem to="/tasks" icon={CheckSquare} label="Tasks" />
          <SidebarItem to="/inventory" icon={Package} label="Inventory" />
          <SidebarItem to="/documents" icon={FileText} label="Documents" />
          <SidebarItem to="/assistant" icon={Bot} label="AI Assistant" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-slate-700" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{user.name}</span>
              <span className="text-xs text-slate-400">{user.role}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white shadow-xl p-4 animate-slide-in" onClick={e => e.stopPropagation()}>
             <div className="flex items-center justify-between mb-8">
               <span className="text-xl font-bold">FlowForge OS</span>
               <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400">
                 <X className="w-6 h-6"/>
               </button>
             </div>
             <nav className="space-y-2">
              <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
              <SidebarItem to="/tasks" icon={CheckSquare} label="Tasks" />
              <SidebarItem to="/inventory" icon={Package} label="Inventory" />
              <SidebarItem to="/documents" icon={FileText} label="Documents" />
              <SidebarItem to="/assistant" icon={Bot} label="AI Assistant" />
             </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500 hover:text-slate-700" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-slate-800">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-slate-100 rounded-full px-3 py-1.5 border border-transparent focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:outline-none text-sm text-slate-700 ml-2 w-48"
              />
            </div>
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-slate-50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
