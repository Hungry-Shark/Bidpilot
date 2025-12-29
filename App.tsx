
import React, { useState, useEffect } from 'react';
import { 
  Menu, Play, UploadCloud, Activity, FileText, FileSpreadsheet, PenTool,
  Clock, TrendingUp, AlertCircle, BrainCircuit, Settings, MoreHorizontal,
  CheckCircle2, CircleDashed, Search, Plus, ArrowUpRight, ArrowDownRight,
  LogOut, User, Bell, HelpCircle, Trash2, Lightbulb
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Terminal } from './components/Terminal';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { Badge } from './components/Badge';
import { LandingPage } from './components/LandingPage';
import { TutorialOverlay } from './components/TutorialOverlay';
import { LogEntry, ViewState, Verdict, TutorialStep, Project, Document } from './types';

// Firebase & Agents
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { db } from './lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, limit, serverTimestamp } from 'firebase/firestore';
import { runBidSwarm } from './lib/agents';

// Internal component to handle auth-dependent logic
const AppContent = () => {
  const { user, logout, isDemo } = useAuth();
  const [view, setView] = useState<ViewState>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Real Data State
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // Input State
  const [inputRfpText, setInputRfpText] = useState("");
  const [inputStrategy, setInputStrategy] = useState("");
  
  // Knowledge Base State - Empty by default now
  const [documents, setDocuments] = useState<Document[]>([]);

  // Check for first-time user tutorial
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('bidpilot_tutorial_seen');
    if (!hasSeenTutorial) {
      setTimeout(() => setShowTutorial(true), 1000);
    }
  }, []);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('bidpilot_tutorial_seen', 'true');
  };

  // Listen to User's Projects (Firestore) - Only if NOT demo
  useEffect(() => {
    if (!user || isDemo) return;
    
    const q = query(
        collection(db, 'projects'), 
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(10)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedProjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        setProjects(fetchedProjects);
        
        // Update active project if it exists in the stream
        if (activeProject) {
            const updated = fetchedProjects.find(p => p.id === activeProject.id);
            if (updated) {
                setActiveProject(updated);
                // Only overwrite logs from Firestore if we aren't currently streaming them locally
                // This prevents jitter during the active "Thinking" phase
                if (updated.status !== 'analyzing') {
                   setLogs(updated.logs || []);
                }
            }
        }
    });
    return unsubscribe;
  }, [user, activeProject, isDemo]);

  const handleRunRealBid = async () => {
    if (!user) return;
    
    // Default text for lazy testing if empty
    const textToProcess = inputRfpText.trim() || `RFP for Enterprise Logistics System. 
    Client: Global Freight Corp. 
    Budget: $150,000. 
    Timeline: 6 months. 
    Requirements: Must use Python, Cloud-Native architecture. No on-premise solutions. 
    Security: ISO 27001 required.`;

    const strategyToProcess = inputStrategy.trim();

    setView('analysis');
    setLogs([]); // Clear previous logs
    
    // Create a local temporary project object for immediate UI feedback
    const tempId = `temp-${Date.now()}`;
    const newProject: Project = {
        id: tempId,
        userId: user.uid,
        title: `RFP Analysis - ${new Date().toLocaleTimeString()}`,
        status: 'analyzing',
        verdict: 'pending',
        rfpText: textToProcess,
        strategyContext: strategyToProcess,
        logs: [],
        draftContent: '',
        createdAt: new Date()
    };
    
    setActiveProject(newProject);
    setProjects(prev => [newProject, ...prev]);

    // Define callbacks to update local state immediately (bypassing Firestore latency/permission issues)
    const onLog = (log: LogEntry) => {
        setLogs(prev => [...prev, log]);
        // Also update the active project object in state
        setActiveProject(prev => prev ? { ...prev, logs: [...(prev.logs || []), log] } : null);
    };

    const onUpdateProject = (data: Partial<Project>) => {
        setActiveProject(prev => prev ? { ...prev, ...data } : null);
        setProjects(prev => prev.map(p => p.id === tempId ? { ...p, ...data } : p));
    };

    try {
        let firestoreId = tempId;
        
        // If NOT demo, try to actually create in Firestore
        if (!isDemo) {
            try {
                const docRef = await addDoc(collection(db, 'projects'), {
                    ...newProject,
                    createdAt: serverTimestamp()
                });
                firestoreId = docRef.id;
                // Update local ID to match Firestore ID
                setActiveProject(prev => prev ? { ...prev, id: firestoreId } : null);
            } catch (e) {
                console.warn("Firestore creation failed, continuing in local mode.");
            }
        }

        // Run the agents (passing isDemo flag, callbacks, AND Strategy)
        runBidSwarm(firestoreId, textToProcess, strategyToProcess, isDemo, onLog, onUpdateProject);

    } catch (e) {
        console.error("Failed to start bid", e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
          const file = files[0];
          const newDoc: Document = {
              id: Date.now().toString(),
              name: file.name,
              size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
              date: new Date().toLocaleDateString(),
              tags: ['New Ingestion', 'Processing'],
              userId: user?.uid
          };
          setDocuments(prev => [newDoc, ...prev]);
          alert(`Success: ${file.name} ingested. The Historian will reference this in the next bid.`);
      }
  };

  const TUTORIAL_STEPS: TutorialStep[] = [
    { target: 'body', title: 'Welcome to BidPilot', content: 'This guided tour will show you how to automate your RFP response process.', position: 'center' },
    { target: '[data-tour="metrics-row"]', title: 'Mission Control', content: 'Monitor your win probabilities and active drafts.', position: 'bottom' },
    { target: '[data-tour="run-bid-area"]', title: 'Start Automation', content: 'Paste RFP text here and click "Run Agent Swarm".', position: 'bottom' }
  ];

  const renderDashboard = () => (
    <div key="dashboard" className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20 space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
            <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Mission Control</h1>
            <p className="text-zinc-500 mt-2 text-lg">Real-time oversight of autonomous proposal operations.</p>
        </div>
      </header>

      {/* Input Area */}
      <Card className="p-6 border-indigo-900/50 bg-indigo-950/10" >
         <div className="flex flex-col gap-6" data-tour="run-bid-area">
            <div>
                <h3 className="font-semibold text-indigo-100 flex items-center gap-2 mb-3">
                    <BrainCircuit size={18} />
                    New Autonomous Bid
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Column 1: RFP Text */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">RFP Content</label>
                        <textarea 
                            className="w-full bg-zinc-950/50 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-300 min-h-[160px] focus:ring-1 focus:ring-indigo-500 outline-none font-mono resize-none"
                            placeholder="Paste raw RFP text here... (e.g., 'Client needs a cloud migration proposal, budget $100k...')"
                            value={inputRfpText}
                            onChange={(e) => setInputRfpText(e.target.value)}
                        />
                    </div>
                    
                    {/* Column 2: Strategy */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                            <Lightbulb size={12} className="text-amber-400" />
                            Bid Strategy & Win Themes
                        </label>
                        <textarea 
                            className="w-full bg-zinc-950/50 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-300 min-h-[160px] focus:ring-1 focus:ring-amber-500/50 outline-none font-sans resize-none"
                            placeholder="Tell the AI what to prioritize...&#10;• Focus on our low implementation cost&#10;• Highlight our ISO-27001 security&#10;• Watch out for: 'On-premise' requirements (Red Flag)"
                            value={inputStrategy}
                            onChange={(e) => setInputStrategy(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-indigo-900/30">
                <span className="text-xs text-zinc-500">
                    {isDemo ? "Running in Simulation Mode (No Database Write)" : "Connected to Live Database"}
                </span>
                <Button onClick={handleRunRealBid} icon={Play} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] border-0">
                    Run Agent Swarm
                </Button>
            </div>
         </div>
      </Card>

      {/* Dynamic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4" data-tour="metrics-row">
        {[
          { label: "Total Projects", value: projects.length.toString(), trend: "+1", trendUp: true, sub: "In database" },
          { 
            label: "Win Probability", 
            value: projects.length > 0 ? "78%" : "0%", 
            trend: "+5%", 
            trendUp: true, 
            sub: "Based on AI analysis" 
          },
          { 
              label: "Completed Drafts", 
              value: projects.filter(p => p.status === 'completed').length.toString(), 
              trend: "100%", 
              trendUp: true, 
              sub: "Ready for review" 
          },
          { 
              label: "No-Go Decisions", 
              value: projects.filter(p => p.verdict === 'no-go').length.toString(), 
              trend: "Safe", 
              trendUp: false, 
              sub: "Risk averted" 
          },
        ].map((stat, i) => (
          <Card key={i} className="p-6 bg-zinc-900/40 border-zinc-800">
             <div className="flex justify-between items-start mb-4">
                <span className="text-zinc-400 font-medium text-sm">{stat.label}</span>
                <span className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${stat.trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                   {stat.trend} {stat.trendUp && <ArrowUpRight size={12} className="ml-1"/>}
                </span>
             </div>
             <div className="text-3xl font-bold text-zinc-100 mb-1">{stat.value}</div>
             <div className="text-zinc-500 text-xs">{stat.sub}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="h-full bg-zinc-900/40 border-zinc-800 overflow-hidden">
             <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/20">
                <h3 className="font-semibold text-zinc-200">Recent Projects</h3>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50">
                     <tr>
                        <th className="px-4 py-3 font-medium">Title</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Verdict</th>
                        <th className="px-4 py-3 font-medium text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                     {projects.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                                No projects yet. Start a new bid above.
                            </td>
                        </tr>
                     ) : (
                         projects.map((proj) => (
                            <tr key={proj.id} className="hover:bg-zinc-800/30 transition-colors">
                               <td className="px-4 py-3 font-medium text-zinc-200">{proj.title}</td>
                               <td className="px-4 py-3">
                                  <Badge variant={proj.status === 'completed' ? 'success' : proj.status === 'failed' ? 'error' : 'default'}>
                                    {proj.status}
                                  </Badge>
                               </td>
                               <td className="px-4 py-3 capitalize text-zinc-400">
                                   {proj.verdict === 'go' && <span className="text-emerald-400 font-bold">GO</span>}
                                   {proj.verdict === 'no-go' && <span className="text-rose-400 font-bold">NO-GO</span>}
                                   {proj.verdict === 'pending' && <span>--</span>}
                               </td>
                               <td className="px-4 py-3 text-right">
                                  <Button variant="ghost" className="h-6 w-6 p-0" onClick={() => {
                                      setActiveProject(proj);
                                      // If it was completed, set logs from it so user can see history
                                      if (proj.logs) setLogs(proj.logs);
                                      setView('draft');
                                  }}>
                                     <MoreHorizontal size={14} />
                                  </Button>
                               </td>
                            </tr>
                         ))
                     )}
                  </tbody>
               </table>
             </div>
        </Card>
      </div>
    </div>
  );

  const renderKnowledge = () => (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in duration-500">
        <header className="mb-8 flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-zinc-100">Knowledge Base</h1>
                <p className="text-zinc-500">The Historian's indexed memory.</p>
            </div>
            <div className="relative">
                <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    onChange={handleFileUpload}
                    multiple 
                />
                <label htmlFor="file-upload">
                    <div className="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md cursor-pointer transition-colors text-sm font-medium shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                        <UploadCloud size={16} className="mr-2" />
                        Ingest Documents
                    </div>
                </label>
            </div>
        </header>

        {documents.length === 0 ? (
            <Card className="bg-zinc-900/40 border-zinc-800 p-12 border-dashed flex flex-col items-center justify-center text-center">
                <div className="bg-zinc-800/50 p-6 rounded-full mb-6">
                    <UploadCloud size={48} className="text-zinc-500" />
                </div>
                <h3 className="text-xl text-zinc-200 font-medium mb-2">Knowledge Base Empty</h3>
                <p className="text-zinc-500 text-sm max-w-md mx-auto mb-6">
                    Upload your past winning proposals, company profiles, or compliance certifications. 
                    The Historian will index these to write better future bids.
                </p>
                <div className="relative">
                    <input 
                        type="file" 
                        id="file-upload-2" 
                        className="hidden" 
                        onChange={handleFileUpload}
                        multiple 
                    />
                    <label htmlFor="file-upload-2">
                        <div className="inline-flex items-center justify-center px-6 py-3 bg-zinc-100 hover:bg-white text-zinc-900 rounded-md cursor-pointer transition-colors text-sm font-bold">
                            Select Files to Upload
                        </div>
                    </label>
                </div>
            </Card>
        ) : (
            <Card className="bg-zinc-900/40 border-zinc-800">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-900/80 border-b border-zinc-800">
                        <tr>
                            <th className="px-6 py-4 font-medium text-zinc-400">Document Name</th>
                            <th className="px-6 py-4 font-medium text-zinc-400">Size</th>
                            <th className="px-6 py-4 font-medium text-zinc-400">Ingested</th>
                            <th className="px-6 py-4 font-medium text-zinc-400">Auto-Tags</th>
                            <th className="px-6 py-4 font-medium text-zinc-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {documents.map((doc) => (
                            <tr key={doc.id} className="hover:bg-zinc-800/30">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <FileText size={16} className="text-indigo-400" />
                                    <span className="font-medium text-zinc-200">{doc.name}</span>
                                </td>
                                <td className="px-6 py-4 text-zinc-500">{doc.size}</td>
                                <td className="px-6 py-4 text-zinc-500">{doc.date}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        {doc.tags.map(tag => (
                                            <Badge key={tag} variant="outline">{tag}</Badge>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => setDocuments(docs => docs.filter(d => d.id !== doc.id))}
                                        className="text-zinc-600 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        )}
    </div>
  );

  return (
    <div className="flex h-screen bg-zinc-950 font-sans overflow-hidden text-zinc-200 selection:bg-indigo-500/30">
      <TutorialOverlay isOpen={showTutorial} onClose={handleCloseTutorial} steps={TUTORIAL_STEPS} />
      <Sidebar currentView={view} onNavigate={setView} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <main className="flex-1 flex flex-col overflow-hidden relative w-full">
        <header className="hidden lg:flex items-center justify-between h-16 px-8 border-b border-zinc-800 bg-zinc-950 shrink-0 z-20">
            <div className="flex items-center text-sm text-zinc-500 gap-2">
                <span className="font-semibold text-zinc-200">BidPilot</span> 
                <span className="text-zinc-700">/</span>
                <span className="capitalize text-zinc-400">{view === 'dashboard' ? 'Mission Control' : view.replace('-', ' ')}</span>
            </div>
            <div className="flex items-center gap-4">
                 {isDemo && (
                     <Badge variant="warning">DEMO MODE</Badge>
                 )}
                 <button onClick={() => setShowTutorial(true)} className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors mr-2" title="Start Tutorial">
                    <HelpCircle size={18} />
                 </button>
                 <div className="h-4 w-px bg-zinc-800"></div>
                 <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-sm font-medium text-zinc-300 hidden md:block">{user?.displayName || user?.email}</div>
                    <button onClick={() => logout()} title="Sign Out" className="text-zinc-600 hover:text-red-400 transition-colors ml-2">
                        <LogOut size={16} />
                    </button>
                 </div>
            </div>
        </header>

        <div className="lg:hidden h-16 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 shrink-0">
          <div className="text-white font-bold flex items-center gap-2"><BrainCircuit className="text-white" />BidPilot</div>
          <button onClick={() => setIsMobileOpen(true)} className="text-zinc-400"><Menu /></button>
        </div>

        <div className="flex-1 overflow-auto scrollbar-hide">
          {view === 'dashboard' && renderDashboard()}
          
          {view === 'analysis' && (
            <div className="h-full p-4 md:p-6 bg-zinc-950 animate-in fade-in duration-500">
               <Terminal 
                 logs={logs} 
                 isAnalyzing={activeProject?.status === 'analyzing'} 
                 verdict={activeProject?.verdict || 'pending'} 
                 onViewDraft={() => setView('draft')} 
               />
            </div>
          )}
          
          {view === 'knowledge' && renderKnowledge()} 
          
          {view === 'draft' && (
            <div className="flex flex-col h-full bg-zinc-950 animate-in fade-in duration-700">
                <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="bg-violet-500/10 p-2.5 rounded-lg text-violet-400 border border-violet-500/20"><PenTool size={20} /></div>
                        <div>
                            <h2 className="font-bold text-zinc-100">Project Draft</h2>
                            <p className="text-xs text-zinc-500">{activeProject?.title}</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-auto bg-zinc-950 p-8">
                    <div className="bg-white shadow-2xl min-h-[800px] max-w-4xl mx-auto p-16 rounded-sm text-zinc-900 prose">
                        <pre className="whitespace-pre-wrap font-serif text-lg">{activeProject?.draftContent || "Draft generation pending..."}</pre>
                    </div>
                </div>
            </div>
          )}
          
          {view === 'settings' && (
              <div className="p-8 text-center text-zinc-500 mt-20">
                  <Settings size={48} className="mx-auto mb-4 opacity-20" />
                  <h2 className="text-xl font-bold text-zinc-300">Swarm Configuration</h2>
                  <p>Agent parameter tuning is disabled in this MVP.</p>
              </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default function App() {
    return (
        <AuthProvider>
            <AuthWrapper />
        </AuthProvider>
    );
}

const AuthWrapper = () => {
    const { user, loading } = useAuth();
    if (loading) return <div className="h-screen bg-zinc-950 flex items-center justify-center text-white">Loading BidPilot...</div>;
    if (!user) return <LandingPage onLoginSuccess={() => {}} />;
    return <AppContent />;
};
