
import React from 'react';
import { 
  BrainCircuit, 
  LayoutDashboard, 
  Database, 
  Activity, 
  PenTool, 
  Settings 
} from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const ACTIVE_AGENTS = [
  { name: 'The Gatekeeper', color: 'bg-rose-500' },
  { name: 'The Architect', color: 'bg-violet-500' },
  { name: 'The Quant', color: 'bg-amber-500' },
  { name: 'The Historian', color: 'bg-cyan-500' }
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isMobileOpen, setIsMobileOpen }) => {
  
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Mission Control', tourId: 'nav-dashboard' },
    { id: 'knowledge', icon: Database, label: 'Knowledge Base', tourId: 'nav-knowledge' },
    { id: 'analysis', icon: Activity, label: 'Live Swarm', tourId: 'nav-analysis' },
    { id: 'draft', icon: PenTool, label: 'Drafting Room', tourId: 'nav-draft' },
    { id: 'settings', icon: Settings, label: 'Swarm Config', tourId: 'nav-settings' },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 text-zinc-400 flex flex-col h-screen border-r border-zinc-800 transition-transform duration-300 ease-in-out
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="p-6">
          <div className="flex items-center gap-3 text-zinc-100 font-bold text-xl tracking-tight">
            <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
              <BrainCircuit className="text-white" size={24} />
            </div>
            BidPilot
          </div>
          <p className="text-xs text-zinc-500 mt-3 pl-1">Autonomous Proposal Engine</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4" data-tour="sidebar-nav">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => {
                onNavigate(item.id as ViewState);
                setIsMobileOpen(false);
              }}
              data-tour={item.tourId}
              className={`flex items-center w-full px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group ${
                currentView === item.id 
                  ? 'bg-zinc-900 text-white border border-zinc-800' 
                  : 'hover:bg-zinc-900/50 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <item.icon 
                size={18} 
                className={`mr-3 transition-colors ${currentView === item.id ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} 
              />
              {item.label}
              {currentView === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800 bg-zinc-950">
          <div className="bg-zinc-900/30 rounded-lg p-4 border border-zinc-800/50">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Active Agents</div>
              <div className="flex gap-1">
                <span className="block w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="block w-1 h-1 bg-emerald-500 rounded-full animate-pulse delay-75"></span>
                <span className="block w-1 h-1 bg-emerald-500 rounded-full animate-pulse delay-150"></span>
              </div>
            </div>
            {ACTIVE_AGENTS.map(agent => (
              <div key={agent.name} className="flex items-center gap-2 text-xs text-zinc-400 mb-2 last:mb-0">
                <div className={`w-1.5 h-1.5 rounded-full ${agent.color} shadow-[0_0_6px_rgba(255,255,255,0.1)]`}></div>
                {agent.name}
              </div>
            ))}
          </div>
          <div className="mt-4 text-[10px] text-zinc-600 text-center">
            v2.0.4 • Stable Build
          </div>
        </div>
      </aside>
    </>
  );
};
