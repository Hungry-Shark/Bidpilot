
import React, { useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  BrainCircuit, 
  CheckCircle, 
  Database, 
  ShieldAlert, 
  PenTool, 
  FileSearch,
  Loader2
} from 'lucide-react';
import { LogEntry, Verdict } from '../types';
import { Badge } from './Badge';
import { Button } from './Button';

interface TerminalProps {
  logs: LogEntry[];
  isAnalyzing: boolean;
  verdict: Verdict;
  onViewDraft: () => void;
}

const AGENT_CONFIG = [
  { id: 'The Historian', icon: Database, color: 'cyan', description: 'Context Retrieval' },
  { id: 'The Gatekeeper', icon: ShieldAlert, color: 'rose', description: 'Risk Analysis' },
  { id: 'The Architect', icon: PenTool, color: 'violet', description: 'Content Generation' },
  { id: 'The Auditor', icon: FileSearch, color: 'emerald', description: 'Compliance Check' },
];

export const Terminal: React.FC<TerminalProps> = ({ logs, isAnalyzing, verdict, onViewDraft }) => {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Determine active agent based on the latest log
  const lastLog = logs[logs.length - 1];
  const activeAgentId = isAnalyzing && lastLog ? lastLog.agent : null;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col h-full max-h-[calc(100vh-2rem)] gap-4">
      
      {/* Visual Swarm Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {AGENT_CONFIG.map((agent) => {
          const isActive = activeAgentId === agent.id;
          const isFinished = !isActive && logs.some(l => l.agent === agent.id);
          const hasError = logs.some(l => l.agent === agent.id && l.type === 'error');
          
          // Dynamic styles based on color prop
          const colorStyles: Record<string, string> = {
            cyan: isActive ? 'border-cyan-500 bg-cyan-950/30 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'border-zinc-800 bg-zinc-900/40 text-zinc-500',
            rose: isActive ? 'border-rose-500 bg-rose-950/30 text-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.2)]' : 'border-zinc-800 bg-zinc-900/40 text-zinc-500',
            violet: isActive ? 'border-violet-500 bg-violet-950/30 text-violet-400 shadow-[0_0_15px_rgba(167,139,250,0.2)]' : 'border-zinc-800 bg-zinc-900/40 text-zinc-500',
            emerald: isActive ? 'border-emerald-500 bg-emerald-950/30 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.2)]' : 'border-zinc-800 bg-zinc-900/40 text-zinc-500',
          };
          
          const iconColor: Record<string, string> = {
             cyan: 'text-cyan-400', rose: 'text-rose-400', violet: 'text-violet-400', emerald: 'text-emerald-400'
          };

          return (
            <div 
              key={agent.id}
              className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${colorStyles[agent.color]} ${isActive ? 'scale-105 z-10' : 'scale-100'}`}
            >
              {isActive && (
                <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-${agent.color}-400`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-${agent.color}-500`}></span>
                </span>
              )}
              
              <div className={`p-3 rounded-full bg-zinc-950/50 mb-3 border border-white/5 ${isActive ? 'animate-bounce-subtle' : ''}`}>
                 <agent.icon size={24} className={isActive || isFinished ? iconColor[agent.color] : 'text-zinc-600'} />
              </div>
              
              <h3 className={`font-bold text-xs uppercase tracking-wider mb-1 ${isActive ? 'text-white' : ''}`}>{agent.id}</h3>
              <p className="text-[10px] opacity-70 font-mono text-center leading-tight">{agent.description}</p>
              
              {isActive && <div className="mt-2 text-[10px] flex items-center gap-1 font-mono animate-pulse"><Loader2 size={10} className="animate-spin" /> ACTIVE</div>}
            </div>
          );
        })}
      </div>

      {/* Terminal Output */}
      <div className="flex-1 flex flex-col min-h-0 bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg overflow-hidden">
        <div className="bg-zinc-950 border-b border-zinc-800 p-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-zinc-900 rounded text-zinc-400 border border-zinc-800">
              <TerminalIcon size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-300 font-bold text-xs">Swarm Activity Log</span>
              <span className="text-zinc-600 text-[10px] font-mono">/var/log/bidpilot_swarm.log</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="h-2 w-2 rounded-full bg-zinc-800 animate-pulse"></div>
             <span className="text-[10px] text-zinc-500 font-mono">LIVE STREAM</span>
          </div>
        </div>
        
        <div className="flex-1 bg-black/40 p-4 overflow-y-auto font-mono text-sm relative scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_100%)] pointer-events-none" />
          
          {logs.length === 0 && !isAnalyzing && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-700 select-none">
              <BrainCircuit size={48} className="mb-4 opacity-10 animate-pulse text-zinc-500" />
              <p className="text-zinc-600 text-xs">System Idle. Awaiting RFP Input...</p>
            </div>
          )}

          <div className="space-y-3 relative z-10">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3 group hover:bg-white/5 p-1.5 rounded -mx-1.5 transition-colors animate-in slide-in-from-left-2 fade-in duration-200">
                <span className="text-zinc-600 text-[10px] w-14 pt-0.5 shrink-0 opacity-50 font-light font-mono tabular-nums">{log.timestamp}</span>
                <div className="flex-1 min-w-0">
                  <span className={`inline-block font-bold mr-2 uppercase text-[9px] tracking-wider px-1.5 rounded-sm border ${
                    log.agent === 'The Gatekeeper' ? 'text-rose-400 border-rose-900/30 bg-rose-950/30' : 
                    log.agent === 'The Architect' ? 'text-violet-400 border-violet-900/30 bg-violet-950/30' :
                    log.agent === 'The Quant' ? 'text-amber-400 border-amber-900/30 bg-amber-950/30' :
                    log.agent === 'The Historian' ? 'text-cyan-400 border-cyan-900/30 bg-cyan-950/30' : 
                    log.agent === 'The Auditor' ? 'text-emerald-400 border-emerald-900/30 bg-emerald-950/30' : 
                    'text-zinc-400 border-zinc-800 bg-zinc-900'
                  }`}>
                    {log.agent}
                  </span>
                  <span className={`text-xs break-words ${
                    log.type === 'error' ? 'text-rose-400' : 
                    log.type === 'warning' ? 'text-amber-400' : 
                    log.type === 'code' ? 'text-blue-300 font-mono bg-blue-950/20 px-1 rounded' :
                    log.type === 'success' ? 'text-emerald-400' : 'text-zinc-300'
                  }`}>
                    {log.message}
                  </span>
                </div>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>

      {verdict === 'go' && (
         <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 rounded-xl flex flex-col sm:flex-row justify-between items-center animate-in zoom-in slide-in-from-bottom-4 duration-500 shadow-xl backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-4 mb-3 sm:mb-0">
                <div className="bg-emerald-500/10 p-2.5 rounded-full ring-1 ring-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <CheckCircle className="text-emerald-400" size={24} />
                </div>
                <div>
                    <h4 className="text-emerald-100 font-bold">Proposal Generation Complete</h4>
                    <p className="text-emerald-400/60 text-xs">The Architect has finalized the draft based on retrieved context.</p>
                </div>
            </div>
            <Button onClick={onViewDraft} variant="primary" className="bg-emerald-600 hover:bg-emerald-500 text-white w-full sm:w-auto shadow-[0_0_20px_rgba(16,185,129,0.2)] border-0 ring-0">
              Open Drafting Room
            </Button>
         </div>
      )}
    </div>
  );
};
