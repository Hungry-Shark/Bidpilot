import React from 'react';
import { X, Apple, Command } from 'lucide-react'; // Using Command as a placeholder for a generic logo icon or Loop
import { Button } from './Button';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 p-4">
      <div className="relative w-full max-w-4xl h-[600px] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-zinc-900/50 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors md:hidden"
        >
          <X size={20} />
        </button>

        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-zinc-950">
          <div className="flex items-center gap-2 mb-8 md:absolute md:top-8 md:left-8">
            <div className="w-6 h-6 bg-zinc-100 rounded-md flex items-center justify-center">
              <div className="w-3 h-3 bg-zinc-900 rounded-sm"></div>
            </div>
            <span className="font-semibold text-zinc-100">BidPilot</span>
          </div>

          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-zinc-100">Welcome back</h2>
              <p className="text-sm text-zinc-400 mt-1">Login to your BidPilot account</p>
            </div>

            <div className="space-y-3">
              <button onClick={onLogin} className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 p-2.5 rounded-lg transition-all text-sm font-medium">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.64 3.98-1.54 1.29.08 2.36.57 2.96 1.54-2.72 1.34-2.11 5.37.5 6.44-.64 1.76-1.56 3.73-2.52 5.79zM12.03 5.4c-.16-1.92 1.6-3.79 3.32-3.97.23 2.1-1.96 3.75-3.32 3.97z"/></svg>
                Login with Apple
              </button>
              <button onClick={onLogin} className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 p-2.5 rounded-lg transition-all text-sm font-medium">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Login with Google
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-950 px-2 text-zinc-500">Or continue with</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400">Email</label>
                <input 
                  type="email" 
                  placeholder="m@example.com"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-zinc-400">Password</label>
                  <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300">Forgot your password?</a>
                </div>
                <input 
                  type="password" 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
                />
              </div>
            </div>

            <Button onClick={onLogin} className="w-full bg-zinc-100 text-zinc-950 hover:bg-white py-2.5 mt-2">
              Login
            </Button>

            <div className="text-center text-sm text-zinc-500 mt-4">
              Don't have an account? <button onClick={onLogin} className="text-zinc-300 hover:underline">Sign up</button>
            </div>
          </div>

          <div className="mt-8 text-center text-[10px] text-zinc-600">
             By clicking continue, you agree to our <a href="#" className="underline hover:text-zinc-400">Terms of Service</a> and <a href="#" className="underline hover:text-zinc-400">Privacy Policy</a>.
          </div>
        </div>

        {/* Right Side: Image/Art */}
        <div className="hidden md:flex w-1/2 bg-zinc-900 relative items-center justify-center overflow-hidden border-l border-zinc-800">
           {/* Abstract Background Pattern */}
           <div className="absolute inset-0 opacity-20">
              <svg className="h-full w-full text-zinc-700" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
              </svg>
           </div>
           
           {/* Content overlay */}
           <div className="relative z-10 text-center p-8">
              <div className="w-24 h-24 bg-zinc-800 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl border border-zinc-700/50 rotate-3 hover:rotate-6 transition-transform duration-500">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-200">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-200 mb-2">Automate your Workflow</h3>
              <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                Join thousands of companies using BidPilot to streamline their proposal process with AI agents.
              </p>
           </div>
           
           {/* Gradient Overlay */}
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};