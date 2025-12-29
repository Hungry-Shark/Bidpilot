
import React, { useState } from 'react';
import { X, BrainCircuit, Lightbulb, FileText, Type } from 'lucide-react';
import { Button } from './Button';

interface CreateProjectData {
  title: string;
  rfpText: string;
  strategy: string;
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProjectData) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [rfpText, setRfpText] = useState('');
  const [strategy, setStrategy] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!rfpText.trim()) {
        alert("Please paste the RFP text to proceed.");
        return;
    }

    setIsLoading(true);
    // Simulate a brief setup delay for effect
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit({
        title: title.trim() || `RFP Analysis - ${new Date().toLocaleTimeString()}`,
        rfpText,
        strategy
    });
    
    setIsLoading(false);
    setTitle('');
    setRfpText('');
    setStrategy('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 p-4">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center gap-3">
                <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-400 border border-indigo-500/20">
                    <BrainCircuit size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-zinc-100">Initialize New Bid</h2>
                    <p className="text-xs text-zinc-400">Configure parameters for the agent swarm.</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-zinc-300 transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            
            {/* Project Title */}
            <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <Type size={14} /> Project Title
                </label>
                <input 
                    type="text" 
                    className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 focus:ring-2 focus:ring-indigo-500/50 outline-none placeholder:text-zinc-600"
                    placeholder="e.g. Global Logistics RFP 2025"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                />
            </div>

            {/* RFP Text */}
            <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText size={14} /> RFP Content <span className="text-rose-400">*</span>
                </label>
                <textarea 
                    className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 min-h-[200px] focus:ring-2 focus:ring-indigo-500/50 outline-none font-mono resize-y placeholder:text-zinc-600"
                    placeholder="Paste the raw RFP text here..."
                    value={rfpText}
                    onChange={(e) => setRfpText(e.target.value)}
                />
            </div>

            {/* Strategy */}
            <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <Lightbulb size={14} className="text-amber-400" />
                    Win Themes & Strategy (Optional)
                </label>
                <textarea 
                    className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 min-h-[100px] focus:ring-2 focus:ring-amber-500/30 outline-none resize-y placeholder:text-zinc-600"
                    placeholder="What should the agents prioritize? (e.g., 'Focus on our ISO certification and 24/7 support')"
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value)}
                />
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-900/30 flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isLoading || !rfpText.trim()} className="bg-indigo-600 hover:bg-indigo-500 w-full sm:w-auto">
                {isLoading ? 'Initializing Swarm...' : 'Launch Agents'}
            </Button>
        </div>

      </div>
    </div>
  );
};
