
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Play, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { Button } from './Button';
import { LoginModal } from './LoginModal';
import { useAuth } from '../contexts/AuthContext';
import { MagnetLines } from './MagnetLines';
import { AgentMasonry } from './AgentMasonry';

interface LandingPageProps {
  onLoginSuccess: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />

      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b ${isScrolled ? 'h-16 bg-zinc-950/80 backdrop-blur-md border-zinc-800' : 'h-24 bg-transparent border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600/20 border border-indigo-500/30 p-2 rounded-lg">
                <BrainCircuit className="text-indigo-400" size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">BidPilot</span>
          </div>

          <div className="flex items-center gap-4">
             <button onClick={() => setShowLogin(true)} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Login</button>
             <Button onClick={() => setShowLogin(true)} className={`transition-all duration-300 ${isScrolled ? 'py-1.5 px-3 text-xs' : 'py-2 px-4'}`}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Magnet Lines */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden min-h-[90vh] flex items-center">
        
        {/* Magnet Lines Background - Absolute positioned but behind content */}
        <div className="absolute inset-0 z-0 opacity-40 md:opacity-100 pointer-events-none md:pointer-events-auto">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh]">
                 <MagnetLines 
                    rows={20} 
                    cols={30} 
                    lineColor="rgba(79, 70, 229, 0.4)" 
                    lineHeight="25px" 
                    lineWidth="2px"
                    className="w-full h-full"
                 />
            </div>
        </div>
        
        {/* Overlay gradient to fade edges of lines */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950 z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-zinc-950 z-0 pointer-events-none opacity-80" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                    <Zap size={12} />
                    <span>v2.1 Autonomous Swarm Live</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white animate-in slide-in-from-bottom-8 fade-in duration-700 delay-100">
                    Stop Writing. <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Start Winning.</span>
                </h1>
                
                <p className="text-xl text-zinc-400 max-w-lg mb-8 leading-relaxed animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
                    BidPilot replaces your proposal team with an autonomous swarm of AI agents. Ingest RFPs, analyze risk, and draft winning responses in seconds.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300">
                    <Button onClick={() => setShowLogin(true)} className="h-14 px-8 text-base bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.3)] border-0">
                    Simulate Bid <Play className="ml-2 fill-current" size={16} />
                    </Button>
                    <Button onClick={() => setShowLogin(true)} variant="secondary" className="h-14 px-8 text-base">
                    View Demo
                    </Button>
                </div>

                <div className="mt-8 flex items-center gap-6 text-sm text-zinc-500 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-400">
                    <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500"/> SOC2 Compliant</div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500"/> Zero-Retention</div>
                </div>
            </div>
            
            {/* Visual element for the right side - Glass card showing code/terminal */}
            <div className="hidden md:block relative animate-in zoom-in fade-in duration-1000 delay-500">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
                    <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="ml-2 text-xs text-zinc-500 font-mono">swarm_controller.ts</span>
                    </div>
                    <div className="space-y-3 font-mono text-xs">
                        <div className="flex gap-2"><span className="text-zinc-500">01</span> <span className="text-purple-400">const</span> <span className="text-blue-400">swarm</span> = <span className="text-purple-400">new</span> <span className="text-yellow-400">AgentSwarm</span>();</div>
                        <div className="flex gap-2"><span className="text-zinc-500">02</span> <span className="text-blue-400">swarm</span>.<span className="text-yellow-400">connect</span>(<span className="text-green-400">'Gemini-2.5-Flash'</span>);</div>
                        <div className="flex gap-2"><span className="text-zinc-500">03</span> </div>
                        <div className="flex gap-2"><span className="text-zinc-500">04</span> <span className="text-zinc-400">// Autonomous Ingestion</span></div>
                        <div className="flex gap-2"><span className="text-zinc-500">05</span> <span className="text-purple-400">await</span> <span className="text-blue-400">swarm</span>.<span className="text-cyan-400">historian</span>.<span className="text-yellow-400">ingest</span>(rfpDocs);</div>
                        <div className="flex gap-2"><span className="text-zinc-500">06</span> </div>
                        <div className="flex gap-2"><span className="text-zinc-500">07</span> <span className="text-zinc-400">// Go/No-Go Decision</span></div>
                        <div className="flex gap-2"><span className="text-zinc-500">08</span> <span className="text-purple-400">const</span> verdict = <span className="text-purple-400">await</span> <span className="text-blue-400">swarm</span>.<span className="text-rose-400">gatekeeper</span>.<span className="text-yellow-400">evaluate</span>();</div>
                        <div className="flex gap-2"><span className="text-zinc-500">09</span> <span className="text-purple-400">if</span> (verdict === <span className="text-green-400">'GO'</span>) {'{'}</div>
                        <div className="flex gap-2"><span className="text-zinc-500">10</span>   <span className="text-blue-400">swarm</span>.<span className="text-violet-400">architect</span>.<span className="text-yellow-400">draft</span>();</div>
                        <div className="flex gap-2"><span className="text-zinc-500">11</span> {'}'}</div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Masonry Section for Agents */}
      <section className="py-24 bg-zinc-950 relative z-10">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Meet the Swarm</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
                Specialized autonomous agents working in parallel to deliver 
                higher win rates with 90% less human effort.
            </p>
        </div>
        <AgentMasonry />
      </section>

      <footer className="border-t border-zinc-900 py-12 bg-zinc-950 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
             <div className="flex items-center gap-2 mb-4 md:mb-0">
                <div className="bg-zinc-800 p-1.5 rounded"><BrainCircuit className="text-zinc-400" size={18} /></div>
                <span className="font-bold text-zinc-300">BidPilot</span>
            </div>
            <p className="text-zinc-600 text-sm">&copy; 2025 BidPilot Inc. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};
