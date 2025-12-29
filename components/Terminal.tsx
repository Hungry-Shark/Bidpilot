import React, { useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, BrainCircuit, CheckCircle } from 'lucide-react';
import { LogEntry, Verdict } from '../types';
import { Badge } from './Badge';
import { Button } from './Button';

interface TerminalProps {
  logs: LogEntry[];
  isAnalyzing: boolean;
  verdict: Verdict;
  onViewDraft: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ logs, isAnalyzing, verdict, onViewDraft }) => {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col h-full max-h-[calc(100vh-2rem)]">
      <div className="bg-zinc-900 rounded-t-xl border border-zinc-800 p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-zinc-800 rounded text-zinc-300 border border-zinc-700">
            <TerminalIcon size={16} />
          </div>
          <div>
            <span className="text-zinc-200 font-bold block text-sm">BidPilot Agent Swarm</span>
            <span className="text-zinc-500 text-[10px] font-mono">/var/log/swarm_activity.log</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-600 font-mono hidden sm:inline">Latency: 24ms</span>
          {isAnalyzing ? (
            <Badge variant="warning" className="animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.1)]">PROCESSING</Badge>
          ) : (
            <Badge variant="success" className="shadow-[0_0_10px_rgba(16,185,129,0.1)]">IDLE</Badge>
          )}
        </div>
      </div>
      
      <div className="flex-1 bg-black/40 border-x border-b border-zinc-800 rounded-b-xl p-6 overflow-y-auto font-mono text-sm relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_100%)] pointer-events-none" />
        
        {logs.length === 0 && !isAnalyzing && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-700 select-none">
            <BrainCircuit size={64} className="mb-6 opacity-10 animate-pulse text-zinc-500" />
            <p className="text-zinc-500">Ready to Initialize Swarm Protocol</p>
            <p className="text-zinc-700 text-xs mt-2">Awaiting Trigger...</p>
          </div>
        )}

        <div className="space-y-4 relative z-10">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-4 group hover:bg-zinc-900/30 p-1 rounded -mx-1 transition-colors animate-in slide-in-from-bottom-2 fade-in duration-300">
              <span className="text-zinc-600 text-xs w-16 pt-0.5 shrink-0 opacity-50 font-light">{log.timestamp}</span>
              <div className="flex-1 break-words">
                <span className={`font-bold mr-3 uppercase text-[10px] tracking-widest border px-1.5 py-0.5 rounded ${
                  log.agent === 'The Gatekeeper' ? 'text-rose-400 border-rose-900/50 bg-rose-950/20' : 
                  log.agent === 'The Architect' ? 'text-violet-400 border-violet-900/50 bg-violet-950/20' :
                  log.agent === 'The Quant' ? 'text-amber-400 border-amber-900/50 bg-amber-950/20' :
                  log.agent === 'The Historian' ? 'text-cyan-400 border-cyan-900/50 bg-cyan-950/20' : 
                  log.agent === 'The Auditor' ? 'text-emerald-400 border-emerald-900/50 bg-emerald-950/20' : 
                  'text-zinc-400 border-zinc-800 bg-zinc-900'
                }`}>
                  {log.agent}
                </span>
                <span className={
                  log.type === 'error' ? 'text-rose-400' : 
                  log.type === 'warning' ? 'text-amber-400' : 
                  log.type === 'code' ? 'text-blue-300 font-mono bg-blue-950/20 px-1 rounded' :
                  log.type === 'success' ? 'text-emerald-400' : 'text-zinc-300'
                }>
                  {log.message}
                </span>
              </div>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>

      {verdict === 'go' && (
         <div className="mt-4 p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-lg flex flex-col sm:flex-row justify-between items-center animate-in zoom-in slide-in-from-bottom-4 duration-500 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-3 sm:mb-0">
                <div className="bg-emerald-500/10 p-2 rounded-full ring-1 ring-emerald-500/20">
                  <CheckCircle className="text-emerald-400" size={24} />
                </div>
                <div>
                    <h4 className="text-emerald-400 font-bold text-lg">Bid Approved</h4>
                    <p className="text-emerald-500/70 text-xs">The Architect has finalized the proposal draft.</p>
                </div>
            </div>
            <Button onClick={onViewDraft} variant="primary" className="bg-emerald-600 hover:bg-emerald-500 text-white w-full sm:w-auto shadow-[0_0_15px_rgba(16,185,129,0.3)] border-none">
              Open Drafting Room
            </Button>
         </div>
      )}
    </div>
  );
};