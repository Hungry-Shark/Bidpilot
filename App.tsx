import React, { useState } from 'react';
import { 
  Menu, 
  Play, 
  UploadCloud, 
  Activity, 
  FileText, 
  FileSpreadsheet, 
  PenTool,
  Clock,
  TrendingUp,
  AlertCircle,
  BrainCircuit,
  Settings
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Terminal } from './components/Terminal';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { Badge } from './components/Badge';
import { LogEntry, MOCK_KNOWLEDGE_BASE, ViewState, Verdict } from './types';

export default function App() {
  const [view, setView] = useState<ViewState>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Simulation State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [verdict, setVerdict] = useState<Verdict>('pending');
  const [draftContent, setDraftContent] = useState("");

  const addLog = (agent: string, message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Date.now() + Math.random(),
      agent,
      message,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      type
    }]);
  };

  const startFullSimulation = () => {
    setIsAnalyzing(true);
    setLogs([]);
    setVerdict('pending');
    setDraftContent("");
    setView('analysis');

    const steps = [
      { delay: 800, agent: 'System', msg: 'Initializing Autonomous Swarm Protocol v2.0...', type: 'info' },
      { delay: 1500, agent: 'The Shredder', msg: 'Ingesting "Gov_RFP_Transport_2025.pdf" (45MB)...', type: 'info' },
      { delay: 2800, agent: 'The Shredder', msg: 'Parsing Complete: 120 pages processed. Extracted 4 Tables. OCR Confidence: 99.2%.', type: 'success' },
      { delay: 4000, agent: 'The Historian', msg: 'Querying Knowledge Graph for semantic matches...', type: 'info' },
      { delay: 5200, agent: 'The Historian', msg: 'Context Retrieval: Found 12 matching past proposals for "Transportation Logistics" > 85% similarity.', type: 'success' },
      { delay: 6500, agent: 'The Gatekeeper', msg: 'Analyzing RFP Constraints against Company Policy...', type: 'info' },
      { delay: 7500, agent: 'The Gatekeeper', msg: 'Constraint Check: Budget > $500k (PASS). Tech Stack: Python/Cloud (PASS). Location: Remote (PASS).', type: 'success' },
      { delay: 8200, agent: 'The Gatekeeper', msg: 'VERDICT: GREEN LIGHT. Initiating Drafting Sequence.', type: 'success' },
      { delay: 9500, agent: 'The Quant', msg: 'Detected "Security_Questionnaire.xlsx" in attachment list.', type: 'warning' },
      { delay: 10500, agent: 'The Quant', msg: 'Executing python script: map_iso27001_answers(file="Security.xlsx")', type: 'code' },
      { delay: 12000, agent: 'The Quant', msg: 'Automation Complete: Filled 45/50 rows automatically. 5 flagged for review.', type: 'success' },
      { delay: 13500, agent: 'The Architect', msg: 'Synthesizing Executive Summary using tone source "BankOfAmerica_2024"...', type: 'info' },
      { delay: 15000, agent: 'The Architect', msg: 'Generating Section 4.2: Technical Approach (Cloud Migration Strategy)...', type: 'info' },
      { delay: 16500, agent: 'The Auditor', msg: 'Running Final Compliance Audit...', type: 'info' },
      { delay: 17500, agent: 'The Auditor', msg: 'Validation Passed: Font (Times New Roman), Margins (1.0"), Prohibited Terms (0).', type: 'success' },
      { delay: 18500, agent: 'System', msg: 'Proposal Package Generated. Ready for Human Review.', type: 'success' },
    ];

    let totalDelay = 0;
    steps.forEach(step => {
      totalDelay += step.delay;
      setTimeout(() => {
        addLog(step.agent, step.msg, step.type as LogEntry['type']);
        if (step.agent === 'The Gatekeeper' && step.msg.includes('GREEN LIGHT')) {
            setVerdict('go');
        }
        if (step.agent === 'The Architect' && step.msg.includes('Synthesizing Executive')) {
            setDraftContent(`EXECUTIVE SUMMARY

BidPilot Solutions is pleased to submit this proposal for the Transport Logistics System. Leveraging our 10 years of experience with cloud-native architectures (demonstrated in our Bank of America success story), we propose a scalable, Python-based solution designed to modernize your fleet management operations.

Our approach prioritizes three key pillars:
1. Autonomous Efficiency: Reducing operational overhead by 40%.
2. Security First: ISO 27001 compliant infrastructure.
3. Rapid Deployment: Phased rollout completing within 6 months.

TECHNICAL APPROACH (Section 4.2)

We will deploy a microservices architecture on AWS, utilizing Kubernetes for orchestration. This ensures high availability and seamless scaling during peak logistics windows. Our proprietary "RouteOptimizer" engine will be integrated via RESTful APIs...`);
        }
      }, step.delay); 
    });

    setTimeout(() => {
      setIsAnalyzing(false);
    }, 19000);
  };

  const renderDashboard = () => (
    <div key="dashboard" className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
            <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Mission Control</h1>
            <p className="text-zinc-500 mt-2 text-lg">Your autonomous sales operations center.</p>
        </div>
        <Button onClick={startFullSimulation} icon={Play} className="w-full md:w-auto py-3 text-base">Run New Bid Simulation</Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[
          { icon: TrendingUp, label: "Win Probability", value: "78%", sub: "+12% vs Manual", color: "text-emerald-500", border: "border-l-emerald-500" },
          { icon: Clock, label: "Hours Saved", value: "342", sub: "~ 2.5 FTEs", color: "text-indigo-400", border: "border-l-indigo-500" },
          { icon: PenTool, label: "Active Drafts", value: "3", sub: "The Architect", color: "text-violet-400", border: "border-l-violet-500" },
          { icon: AlertCircle, label: "Blocked Bids", value: "14", sub: "Gatekeeper", color: "text-amber-400", border: "border-l-amber-500" },
        ].map((stat, i) => (
          <Card key={i} className={`p-6 border-l-4 ${stat.border} hover:bg-zinc-900 transition-all duration-300 group`}>
             <div className="text-zinc-500 text-xs font-bold uppercase mb-2 flex items-center gap-2">
                <stat.icon size={14} className={stat.color} /> {stat.label}
             </div>
             <div className="text-4xl font-bold text-zinc-100 tracking-tight group-hover:scale-105 transition-transform origin-left">{stat.value}</div>
             <p className="text-xs text-zinc-500 mt-2 font-medium bg-zinc-800/50 inline-block px-2 py-1 rounded border border-zinc-800">{stat.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="font-bold text-zinc-100 flex items-center gap-2">
                  <Activity size={20} className="text-zinc-400" />
                  Recent Agent Activity
              </h3>
              <Button variant="ghost" className="text-xs h-8">View Full Logs</Button>
            </div>
            <div className="divide-y divide-zinc-800/50">
                {[
                    { agent: "The Quant", action: "Filled Security Questionnaire for Client X", time: "10 min ago", color: "bg-amber-500/10 text-amber-500" },
                    { agent: "The Historian", action: "Indexed 4 new case studies from G-Drive", time: "1 hour ago", color: "bg-cyan-500/10 text-cyan-500" },
                    { agent: "The Gatekeeper", action: "Rejected 'Project Alpha' (Budget too low)", time: "2 hours ago", color: "bg-rose-500/10 text-rose-500" },
                    { agent: "The Architect", action: "Drafted Executive Summary for Acme Corp", time: "3 hours ago", color: "bg-violet-500/10 text-violet-500" },
                ].map((item, i) => (
                    <div key={i} className="flex items-start justify-between p-4 hover:bg-zinc-800/30 transition-colors">
                        <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${item.color} shrink-0 ring-1 ring-inset ring-white/10`}>
                              {item.agent.split(' ')[1].substring(0,2).toUpperCase()}
                            </div>
                            <div>
                                <span className="font-medium text-zinc-200 block text-sm">{item.agent}</span>
                                <span className="text-zinc-500 text-sm">{item.action}</span>
                            </div>
                        </div>
                        <span className="text-zinc-600 text-xs whitespace-nowrap ml-4">{item.time}</span>
                    </div>
                ))}
            </div>
            <div className="p-4 bg-zinc-900/50 rounded-b-xl text-center border-t border-zinc-800">
               <span className="text-xs text-zinc-500 cursor-pointer hover:text-white font-medium transition-colors">Show older activities</span>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="p-8 flex flex-col items-center justify-center text-center bg-zinc-900/30 border-dashed border-2 border-zinc-800 h-full min-h-[300px] hover:border-zinc-700 transition-colors group cursor-pointer">
              <div className="bg-zinc-800 p-4 rounded-full mb-6 ring-8 ring-zinc-800/50 group-hover:scale-110 transition-transform duration-500">
                <UploadCloud size={40} className="text-zinc-100" />
              </div>
              <h3 className="font-bold text-zinc-100 text-lg">Zero-Touch Ingestion</h3>
              <p className="text-zinc-500 text-sm mt-3 mb-8 leading-relaxed max-w-[250px]">
                Drag & Drop Zip files, or connect Google Drive. 
                The Historian will index everything automatically.
              </p>
              <Button variant="secondary" className="w-full">Connect Data Source</Button>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderKnowledge = () => (
    <div key="knowledge" className="p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-zinc-100">The Historian</h1>
                <p className="text-zinc-500 mt-1">Autonomous Knowledge Graph. No manual tagging required.</p>
            </div>
            <Button variant="secondary" icon={UploadCloud}>Ingest New Folder</Button>
        </header>

        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-900/50 border-b border-zinc-800 text-zinc-400">
                      <tr>
                          <th className="px-6 py-4 font-medium">Document Name</th>
                          <th className="px-6 py-4 font-medium">Size</th>
                          <th className="px-6 py-4 font-medium">Ingested</th>
                          <th className="px-6 py-4 font-medium">Auto-Tags</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                      {MOCK_KNOWLEDGE_BASE.map((doc) => (
                          <tr key={doc.id} className="hover:bg-zinc-800/50 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="bg-zinc-800 p-2 rounded text-zinc-300 group-hover:text-white transition-colors">
                                    <FileText size={16} />
                                  </div>
                                  <span className="font-medium text-zinc-200 group-hover:text-white">{doc.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{doc.size}</td>
                              <td className="px-6 py-4 text-zinc-500">{doc.date}</td>
                              <td className="px-6 py-4">
                                  <div className="flex gap-2 flex-wrap">
                                      {doc.tags.map(tag => (
                                          <Badge key={tag} variant="outline" className="text-zinc-400 border-zinc-700">{tag}</Badge>
                                      ))}
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <Badge variant="success" className="pl-1 pr-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                                    Indexed
                                  </Badge>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
            </div>
        </Card>
    </div>
  );

  const renderDraft = () => (
    <div key="draft" className="flex flex-col h-full bg-zinc-950 animate-in fade-in duration-700">
        <div className="border-b border-zinc-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10 gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="bg-violet-500/10 p-2.5 rounded-lg text-violet-400 border border-violet-500/20 shadow-sm">
                    <PenTool size={20} />
                </div>
                <div>
                    <h2 className="font-bold text-zinc-100">Proposal Draft: Gov_RFP_Transport</h2>
                    <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                      Generated by <span className="font-semibold text-violet-400">The Architect</span> • Verified by <span className="font-semibold text-emerald-400">The Auditor</span>
                    </p>
                </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
                <Button variant="secondary" icon={FileSpreadsheet} className="flex-1 sm:flex-none">View Excel</Button>
                <Button variant="primary" className="flex-1 sm:flex-none">Export to Word</Button>
            </div>
        </div>
        <div className="flex-1 overflow-auto bg-zinc-950 p-4 md:p-8 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 pointer-events-none" />
            
            <div className="bg-white shadow-2xl shadow-black/50 min-h-[800px] max-w-4xl mx-auto p-8 md:p-16 rounded-sm relative z-10 transition-all duration-500">
                {draftContent ? (
                    <div className="prose prose-slate max-w-none whitespace-pre-wrap font-serif text-lg leading-relaxed text-zinc-800 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {draftContent}
                    </div>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 p-8 text-center bg-zinc-50/50">
                        <div className="bg-zinc-100 p-6 rounded-full mb-4 animate-pulse">
                          <Activity size={48} className="text-zinc-300" />
                        </div>
                        <h3 className="text-zinc-900 font-medium mb-2">Workspace Empty</h3>
                        <p className="max-w-md mx-auto mb-8 text-zinc-500">No active draft found. Run a simulation in Mission Control to generate content.</p>
                        <Button variant="secondary" onClick={() => {
                          setView('dashboard');
                          setTimeout(() => startFullSimulation(), 100);
                        }} className="bg-zinc-900 text-white hover:bg-zinc-800">
                          Generate Draft
                        </Button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-zinc-950 font-sans overflow-hidden text-zinc-200 selection:bg-indigo-500/30">
      <Sidebar 
        currentView={view} 
        onNavigate={setView} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden relative w-full">
        {/* Mobile Header */}
        <div className="lg:hidden h-16 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 shrink-0">
          <div className="text-white font-bold flex items-center gap-2">
            <BrainCircuit className="text-white" />
            BidPilot
          </div>
          <button onClick={() => setIsMobileOpen(true)} className="text-zinc-400">
            <Menu />
          </button>
        </div>

        <div className="flex-1 overflow-auto scrollbar-hide">
          {view === 'dashboard' && renderDashboard()}
          
          {view === 'analysis' && (
            <div className="h-full p-4 md:p-6 bg-zinc-950 animate-in fade-in duration-500">
               <Terminal 
                 logs={logs} 
                 isAnalyzing={isAnalyzing} 
                 verdict={verdict} 
                 onViewDraft={() => setView('draft')} 
               />
            </div>
          )}
          
          {view === 'knowledge' && renderKnowledge()}
          
          {view === 'draft' && renderDraft()}
          
          {view === 'settings' && (
              <div key="settings" className="p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
                  <h1 className="text-2xl font-bold text-zinc-100 mb-2">Swarm Configuration</h1>
                  <p className="text-zinc-500 mb-8">Configure global parameters for The Gatekeeper and The Auditor.</p>
                  
                  <Card className="p-16 text-center border-dashed border-zinc-800 bg-zinc-900/20">
                    <Settings size={48} className="mx-auto text-zinc-700 mb-4" />
                    <p className="text-zinc-500">Settings module configuration is locked in this demo.</p>
                  </Card>
              </div>
          )}
        </div>
      </main>
    </div>
  );
}