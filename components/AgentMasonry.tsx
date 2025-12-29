
import React from 'react';
import { Database, ShieldAlert, PenTool, FileSearch, Terminal, ArrowUpRight } from 'lucide-react';

export const AgentMasonry = () => {
  const agents = [
    {
      id: "The Historian",
      role: "Ingestion Engine",
      icon: Database,
      color: "text-cyan-400",
      bg: "bg-cyan-950/30",
      border: "border-cyan-500/20",
      description: "Ingests terabytes of past proposals. Creates a queryable Knowledge Graph instantly."
    },
    {
      id: "The Gatekeeper",
      role: "Risk Analysis",
      icon: ShieldAlert,
      color: "text-rose-400",
      bg: "bg-rose-950/30",
      border: "border-rose-500/20",
      description: "Scans RFPs for deal-breakers (Budget, Tech Stack, Location) before you waste time."
    },
    {
      id: "Mission Control",
      role: "Dashboard",
      icon: Terminal,
      color: "text-zinc-100",
      bg: "bg-zinc-900",
      border: "border-zinc-800",
      description: "A Glass-Box terminal to watch the swarm think in real-time."
    },
    {
      id: "The Architect",
      role: "Drafting Core",
      icon: PenTool,
      color: "text-violet-400",
      bg: "bg-violet-950/30",
      border: "border-violet-500/20",
      description: "Generates executive summaries using style-transfer from your winning bids."
    },
    {
      id: "The Auditor",
      role: "Compliance",
      icon: FileSearch,
      color: "text-emerald-400",
      bg: "bg-emerald-950/30",
      border: "border-emerald-500/20",
      description: "Validates every sentence against RFP constraints and ISO standards."
    }
  ];

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 w-full max-w-6xl mx-auto p-6">
      {agents.map((agent, i) => (
        <div 
          key={agent.id}
          className={`break-inside-avoid rounded-2xl p-6 border ${agent.border} ${agent.bg} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-full bg-black/20 ${agent.color}`}>
              <agent.icon size={24} />
            </div>
            <ArrowUpRight className={`opacity-0 group-hover:opacity-100 transition-opacity ${agent.color}`} size={16} />
          </div>
          
          <h3 className={`text-xl font-bold mb-1 ${agent.color}`}>{agent.id}</h3>
          <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">{agent.role}</div>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {agent.description}
          </p>
        </div>
      ))}
    </div>
  );
};
