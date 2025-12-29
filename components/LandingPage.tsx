import React, { useState, useEffect } from 'react';
import { BrainCircuit, CheckCircle2, Play, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { LoginModal } from './LoginModal';

interface LandingPageProps {
  onLoginSuccess: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginSuccess }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onLogin={() => {
          setShowLogin(false);
          onLoginSuccess();
        }} 
      />

      {/* Animated Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b ${
          isScrolled 
            ? 'h-16 bg-zinc-950/80 backdrop-blur-md border-zinc-800' 
            : 'h-24 bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2 transition-transform duration-300 origin-left" style={{ transform: isScrolled ? 'scale(0.9)' : 'scale(1)' }}>
            <div className="bg-zinc-100 p-2 rounded-lg">
               <BrainCircuit className="text-zinc-900" size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">BidPilot</span>
          </div>

          <div className="flex items-center gap-4">
             <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400 mr-4">
                <a href="#" className="hover:text-white transition-colors">Features</a>
                <a href="#" className="hover:text-white transition-colors">Pricing</a>
                <a href="#" className="hover:text-white transition-colors">Enterprise</a>
             </nav>
             <button 
               onClick={() => setShowLogin(true)}
               className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
             >
               Login
             </button>
             <Button 
               onClick={() => setShowLogin(true)} 
               className={`transition-all duration-300 ${isScrolled ? 'py-1.5 px-3 text-xs' : 'py-2 px-4'}`}
             >
               Sign Up
             </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-48 pb-24 px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl -z-10 opacity-50"></div>
        
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             v2.0 Now Available
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-6 duration-700">
            Autonomous RFP <br/> Response Engine.
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            BidPilot uses a swarm of AI agents to ingest, analyze, and write winning proposals in minutes, not days. Stop manual tagging. Start winning.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <Button onClick={() => setShowLogin(true)} className="h-12 px-8 text-base shadow-[0_0_20px_rgba(79,70,229,0.3)]">
               Start Free Trial <ArrowRight className="ml-2" size={18} />
            </Button>
            <Button variant="secondary" className="h-12 px-8 text-base bg-zinc-900 border-zinc-700 hover:bg-zinc-800">
               <Play className="mr-2 fill-current" size={16} /> Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* UI Mockup / Visual */}
      <section className="px-4 pb-32">
        <div className="max-w-6xl mx-auto relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
           <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
              <div className="h-10 bg-zinc-950 border-b border-zinc-800 flex items-center px-4 gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
              </div>
              <div className="p-1">
                 {/* Simplified UI Representation */}
                 <div className="grid grid-cols-4 gap-1 h-[400px]">
                    <div className="col-span-1 bg-zinc-950/50 rounded-lg p-4 space-y-4 border-r border-zinc-800/50">
                       <div className="h-4 w-24 bg-zinc-800 rounded"></div>
                       <div className="space-y-2 pt-4">
                          <div className="h-8 w-full bg-indigo-500/10 border border-indigo-500/20 rounded"></div>
                          <div className="h-8 w-full bg-zinc-800/30 rounded"></div>
                          <div className="h-8 w-full bg-zinc-800/30 rounded"></div>
                       </div>
                    </div>
                    <div className="col-span-3 bg-zinc-950 p-6 relative overflow-hidden">
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                             <div className="inline-flex p-4 bg-zinc-900 rounded-full mb-4 ring-1 ring-zinc-700 shadow-xl">
                                <BrainCircuit className="text-indigo-400" size={32} />
                             </div>
                             <h3 className="text-zinc-300 font-medium">Agent Swarm Active</h3>
                             <p className="text-zinc-600 text-sm mt-1">Analyzing 45 documents...</p>
                          </div>
                       </div>
                       {/* Animated Lines */}
                       <div className="absolute top-1/4 left-10 right-10 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent w-3/4 mx-auto animate-pulse"></div>
                       <div className="absolute bottom-1/3 left-20 right-20 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent w-1/2 mx-auto animate-pulse delay-700"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-zinc-900">
         <div className="grid md:grid-cols-3 gap-12">
            {[
               { title: "Zero-Touch Ingestion", desc: "Drag & drop raw folders. The Historian agent auto-indexes and tags content." },
               { title: "Generative Drafting", desc: "The Architect agent mimics your company's writing style for indistinguishable drafts." },
               { title: "Compliance Guardrails", desc: "The Auditor agent checks 100+ constraints including font, budget, and tech stack." }
            ].map((f, i) => (
               <div key={i} className="space-y-4">
                  <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800 text-zinc-100 font-bold">
                     {i+1}
                  </div>
                  <h3 className="text-xl font-bold text-white">{f.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{f.desc}</p>
               </div>
            ))}
         </div>
      </section>
      
      <footer className="border-t border-zinc-900 py-12 text-center text-zinc-600 text-sm">
         <p>&copy; 2025 BidPilot Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};