
import React, { useEffect, useState } from 'react';
import { TutorialStep } from '../types';
import { Button } from './Button';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface TutorialOverlayProps {
  steps: TutorialStep[];
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ steps, isOpen, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset to start when opening
      setCurrentStepIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const step = steps[currentStepIndex];
    // Small delay to allow DOM updates if views are changing
    const timer = setTimeout(() => {
      const element = document.querySelector(step.target);
      if (element) {
        setTargetRect(element.getBoundingClientRect());
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Fallback for center positioning if element not found
        setTargetRect(null); 
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentStepIndex, isOpen, steps]);

  if (!isOpen) return null;

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  // Calculate tooltip position
  let style: React.CSSProperties = {};
  
  if (currentStep.position === 'center' || !targetRect) {
    style = {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
  } else if (targetRect) {
    const gap = 12;
    // Basic positioning logic (can be expanded for edge detection)
    if (currentStep.position === 'bottom') {
        style = { top: targetRect.bottom + gap, left: targetRect.left };
    } else if (currentStep.position === 'top') {
        style = { bottom: window.innerHeight - targetRect.top + gap, left: targetRect.left };
    } else if (currentStep.position === 'right') {
        style = { top: targetRect.top, left: targetRect.right + gap };
    } else if (currentStep.position === 'left') {
        style = { top: targetRect.top, right: window.innerWidth - targetRect.left + gap };
    }
    
    // Safety check to keep tooltip on screen horizontally
    if (style.left && (Number(style.left) > window.innerWidth - 300)) {
       style.left = undefined;
       style.right = 20;
    }
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Semi-transparent backdrop with a "hole" effect would go here, 
          but for simplicity/reliability we use a dimmer and highlight the box */}
      <div className="absolute inset-0 bg-black/60 transition-opacity duration-500" />

      {/* Highlighter Box (The "Spotlight") */}
      {targetRect && currentStep.position !== 'center' && (
        <div 
            className="absolute border-2 border-indigo-500 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] pointer-events-none transition-all duration-300 ease-in-out z-10 box-content"
            style={{
                top: targetRect.top - 4,
                left: targetRect.left - 4,
                width: targetRect.width + 8,
                height: targetRect.height + 8,
            }}
        />
      )}

      {/* Tooltip Card */}
      <div 
        className="absolute w-80 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-6 z-20 flex flex-col gap-4 transition-all duration-300 animate-in fade-in zoom-in-95"
        style={style}
      >
        <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-300"
        >
            <X size={16} />
        </button>

        <div>
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20 mb-3">
                {currentStepIndex + 1}/{steps.length}
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{currentStep.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{currentStep.content}</p>
        </div>

        <div className="flex items-center justify-between pt-2">
            <button 
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="text-zinc-500 text-sm hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center"
            >
                <ChevronLeft size={16} className="mr-1" /> Back
            </button>
            <Button onClick={handleNext} className="h-8 px-4 text-xs">
                {isLastStep ? 'Finish' : 'Next'} <ChevronRight size={14} className="ml-1" />
            </Button>
        </div>
      </div>
    </div>
  );
};
