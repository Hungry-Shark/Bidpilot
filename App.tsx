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
  Settings,
  MoreHorizontal,
  CheckCircle2,
  CircleDashed,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  LogOut,
  User
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Terminal } from './components/Terminal';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { Badge } from './components/Badge';
import { LandingPage } from './components/LandingPage';
import { LogEntry, MOCK_KNOWLEDGE_BASE, ViewState, Verdict } from './types';

export default function App() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // App State
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

  const PROPOSAL_OUTLINE = [
    { id: 1, section: 'Cover Page', type: 'Cover', status: 'In Process', target: 50, limit: 100, reviewer: 'The Architect' },
    { id: 2, section: 'Executive Summary', type: 'Narrative', status: 'Done', target: 1200, limit: 1500, reviewer: 'The Gatekeeper' },
    { id: 3, section: 'Technical Approach', type: 'Narrative', status: 'Done', target: 3500, limit: 5000, reviewer: 'The Auditor' },
    { id: 4, section: 'Security Compliance', type: 'Table', status: 'In Process', target: 800, limit: 1000, reviewer: 'The Quant' },
    { id: 5, section: 'Pricing Model', type: 'Financial', status: 'Pending', target: 0, limit: 500, reviewer: 'The Quant' },
    { id: 6, section: 'Case Studies', type: 'Narrative', status: 'Pending', target: 2000, limit: 2500, reviewer: 'The Historian' },
  ];

  const renderDashboard = () => (
    <div key="dashboard" className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
            <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Mission Control</h1>
            <p className="text-zinc-500 mt-2 text-lg">Real-time oversight of autonomous proposal operations.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="secondary" icon={UploadCloud}>Import RFP</Button>
           <Button onClick={startFullSimulation} icon={Play} className="w-full md:w-auto py-3 text-base">Run New Bid</Button>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Active Pipeline Value", value: "$1.2M", trend: "+12.5%", trendUp: true, sub: "Trending up this month" },
          { label: "Win Probability", value: "78%", trend: "+5%", trendUp: true, sub: "Above industry average" },
          { label: "Active Drafts", value: "3", trend: "-1", trendUp: false, sub: "Processing normally" },
          { label: "Avg. Response Time", value: "1.2d", trend: "-20%", trendUp: true, sub: "Efficiency increasing" },
        ].map((stat, i) => (
          <Card key={i} className="p-6 bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 transition-colors">
             <div className="flex justify-between items-start mb-4">
                <span className="text-zinc-400 font-medium text-sm">{stat.label}</span>
                <span className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${stat.trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                   {stat.trend} {stat.trendUp ? <ArrowUpRight size={12} className="ml-1"/> : <ArrowDownRight size={12} className="ml-1"/>}
                </span>
             </div>
             <div className="text-3xl font-bold text-zinc-100 mb-1">{stat.value}</div>
             <div className="text-zinc-500 text-xs">{stat.sub}</div>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <Card className="p-6 bg-zinc-900/40 border-zinc-800">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">Bid Activity Volume</h3>
            <p className="text-zinc-500 text-sm">Processing load over last 30 days</p>
          </div>
          <div className="flex gap-2">
             <Button variant="ghost" className="text-xs h-8 bg-zinc-800/50 text-zinc-300">Last 30 days</Button>
             <Button variant="ghost" className="text-xs h-8 text-zinc-500">Last 7 days</Button>
          </div>
        </div>
        <div className="h-64 w-full relative">
           {/* Decorative Chart SVG */}
           <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
              <defs>
                 <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0"/>
                 </linearGradient>
              </defs>
              <path d="M0,250 C100,200 200,300 300,150 C400,0 500,200 600,180 C700,160 800,250 900,100 L1000,250 L1000,300 L0,300 Z" fill="url(#chartGradient)" />
              <path d="M0,250 C100,200 200,300 300,150 C400,0 500,200 600,180 C700,160 800,250 900,100 L1000,250" fill="none" stroke="#818cf8" strokeWidth="3" vectorEffect="non-scaling-stroke" />
              
              {/* Secondary Line */}
              <path d="M0,280 C150,260 250,280 400,200 C550,120 650,220 750,200 C850,180 900,220 1000,180" fill="none" stroke="#4f46e5" strokeWidth="2" strokeDasharray="5,5" strokeOpacity="0.5" vectorEffect="non-scaling-stroke" />
           </svg>
           {/* Labels */}
           <div className="absolute bottom-0 w-full flex justify-between text-[10px] text-zinc-600 px-2">
              <span>Apr 7</span>
              <span>Apr 14</span>
              <span>Apr 21</span>
              <span>Apr 28</span>
              <span>May 5</span>
              <span>May 12</span>
              <span>May 19</span>
           </div>
        </div>
      </Card>

      {/* Bottom Section: Document Outline & Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Proposal Outline Table */}
        <div className="xl:col-span-2">
          <Card className="h-full bg-zinc-900/40 border-zinc-800 overflow-hidden">
             <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/20">
                <div className="flex items-center gap-4">
                   <h3 className="font-semibold text-zinc-200">Active Proposal Outline</h3>
                   <div className="flex gap-2">
                      <Badge variant="outline" className="bg-zinc-800/50 text-zinc-300">Gov_RFP_Transport</Badge>
                      <Badge variant="outline" className="bg-zinc-800/50 text-zinc-500">v2.4</Badge>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="ghost" className="h-7 w-7 p-0"><Search size={14}/></Button>
                   <Button variant="ghost" className="h-7 w-7 p-0"><Plus size={14}/></Button>
                </div>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50">
                     <tr>
                        <th className="px-4 py-3 font-medium">Section</th>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium text-right">Target Words</th>
                        <th className="px-4 py-3 font-medium">Agent Owner</th>
                        <th className="px-4 py-3 font-medium"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                     {PROPOSAL_OUTLINE.map((row) => (
                        <tr key={row.id} className="hover:bg-zinc-800/30 transition-colors group">
                           <td className="px-4 py-3 font-medium text-zinc-200">{row.section}</td>
                           <td className="px-4 py-3">
                              <span className="px-2 py-1 rounded text-xs bg-zinc-800 text-zinc-400 border border-zinc-700">{row.type}</span>
                           </td>
                           <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                 {row.status === 'Done' && <CheckCircle2 size={14} className="text-emerald-500" />}
                                 {row.status === 'In Process' && <CircleDashed size={14} className="text-amber-500 animate-spin-slow" />}
                                 {row.status === 'Pending' && <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-700" />}
                                 <span className={
                                    row.status === 'Done' ? 'text-emerald-400' : 
                                    row.status === 'In Process' ? 'text-amber-400' : 'text-zinc-500'
                                 }>{row.status}</span>
                              </div>
                           </td>
                           <td className="px-4 py-3 text-right font-mono text-zinc-400">{row.target}</td>
                           <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                 <div className={`w-1.5 h-1.5 rounded-full ${
                                    row.reviewer === 'The Architect' ? 'bg-violet-500' : 
                                    row.reviewer === 'The Quant' ? 'bg-amber-500' :
                                    'bg-cyan-500'
                                 }`} />
                                 <span className="text-zinc-400">{row.reviewer}</span>
                              </div>
                           </td>
                           <td className="px-4 py-3 text-right">
                              <Button variant="ghost" className="h-6 w-6 p-0 text-zinc-600 hover:text-zinc-300">
                                 <MoreHorizontal size={14} />
                              </Button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
             </div>
          </Card>
        </div>

        {/* Recent Activity Feed */}
        <div className="xl:col-span-1">
          <Card className="h-full bg-zinc-900/40 border-zinc-800">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/20">
              <h3 className="font-semibold text-zinc-200 flex items-center gap-2">
                  <Activity size={16} className="text-indigo-400" />
                  Live Feed
              </h3>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/5 text-emerald-400 border-emerald-500/20">Online</Badge>
            </div>
            <div className="divide-y divide-zinc-800/50">
                {[
                    { agent: "The Quant", action: "Filled Security Questionnaire", time: "2m ago", color: "bg-amber-500/10 text-amber-500" },
                    { agent: "The Historian", action: "Ingested 4 case studies", time: "15m ago", color: "bg-cyan-500/10 text-cyan-500" },
                    { agent: "The Gatekeeper", action: "Flagged budget discrepancy", time: "1h ago", color: "bg-rose-500/10 text-rose-500" },
                    { agent: "The Architect", action: "Drafting: Exec Summary", time: "2h ago", color: "bg-violet-500/10 text-violet-500" },
                    { agent: "The Architect", action: "Completed: Cover Letter", time: "3h ago", color: "bg-violet-500/10 text-violet-500" },
                ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 hover:bg-zinc-800/30 transition-colors">
                        <div className={`mt-0.5 w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${item.color} shrink-0 ring-1 ring-inset ring-white/5`}>
                          {item.agent.split(' ')[1].substring(0,1)}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex justify-between items-start">
                               <span className="font-medium text-zinc-300 text-xs">{item.agent}</span>
                               <span className="text-zinc-600 text-[10px] whitespace-nowrap">{item.time}</span>
                            </div>
                            <p className="text-zinc-500 text-xs mt-0.5 truncate">{item.action}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-3 bg-zinc-900/30 text-center border-t border-zinc-800">
               <button className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors">View System Logs</button>
            </div>
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

  // Conditional Rendering for Landing Page
  if (!isAuthenticated) {
     return <LandingPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // Dashboard Layout (Authenticated)
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

        {/* User Profile Bar (Top Right) */}
        <div className="hidden lg:flex absolute top-4 right-8 z-50">
           <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 rounded-full px-4 py-2 hover:bg-zinc-900 transition-colors cursor-pointer group backdrop-blur-md">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                 BP
              </div>
              <div className="text-sm font-medium text-zinc-300 group-hover:text-white">Admin User</div>
              <button 
                onClick={() => setIsAuthenticated(false)}
                className="ml-2 text-zinc-500 hover:text-red-400 transition-colors" 
                title="Logout"
              >
                 <LogOut size={14} />
              </button>
           </div>
        </div>

        <div className="flex-1 overflow-auto scrollbar-hide pt-16 lg:pt-0">
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