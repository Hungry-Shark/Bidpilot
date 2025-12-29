
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Database, ShieldAlert, PenTool, FileSearch, Terminal, ArrowRight } from "lucide-react";

let interval: any;

type Card = {
  id: number;
  name: string;
  role: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
};

const items: Card[] = [
  {
    id: 0,
    name: "The Historian",
    role: "Ingestion Engine",
    description: "Ingests terabytes of past proposals. Creates a queryable Knowledge Graph instantly from your PDFs and Docs.",
    icon: Database,
    color: "text-cyan-400",
    gradient: "from-cyan-500/20 to-cyan-900/5",
  },
  {
    id: 1,
    name: "The Gatekeeper",
    role: "Risk Analysis",
    description: "Scans RFPs for deal-breakers like budget constraints, tech stack mismatches, or impossible deadlines.",
    icon: ShieldAlert,
    color: "text-rose-400",
    gradient: "from-rose-500/20 to-rose-900/5",
  },
  {
    id: 2,
    name: "The Architect",
    role: "Drafting Core",
    description: "Generates executive summaries and technical answers using style-transfer from your previous winning bids.",
    icon: PenTool,
    color: "text-violet-400",
    gradient: "from-violet-500/20 to-violet-900/5",
  },
  {
    id: 3,
    name: "The Auditor",
    role: "Compliance",
    description: "Validates every sentence against RFP constraints, ISO standards, and formatting requirements.",
    icon: FileSearch,
    color: "text-emerald-400",
    gradient: "from-emerald-500/20 to-emerald-900/5",
  },
  {
    id: 4,
    name: "Mission Control",
    role: "Orchestrator",
    description: "A Glass-Box terminal allowing you to watch the agent swarm think, plan, and execute in real-time.",
    icon: Terminal,
    color: "text-amber-400",
    gradient: "from-amber-500/20 to-amber-900/5",
  },
];

export const CardStack = ({ offset = 10, scaleFactor = 0.06 }) => {
  const [cards, setCards] = useState<Card[]>(items);

  useEffect(() => {
    startFlip();
    return () => clearInterval(interval);
  }, []);

  const startFlip = () => {
    interval = setInterval(() => {
      setCards((prev: Card[]) => {
        const newArray = [...prev];
        const front = newArray.shift();
        if (front) newArray.push(front);
        return newArray;
      });
    }, 5000); // Auto swap every 5 seconds
  };

  const moveToEnd = (from: number) => {
    setCards((prev) => {
        const newCards = [...prev];
        const moved = newCards.splice(from, 1)[0];
        newCards.push(moved);
        return newCards;
    });
  };

  return (
    <div className="relative h-[420px] w-full max-w-[400px]">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className={`absolute top-0 left-0 h-[380px] w-full rounded-3xl p-8 border border-zinc-800 shadow-2xl flex flex-col justify-between cursor-grab active:cursor-grabbing backdrop-blur-xl bg-zinc-950/80`}
            style={{
              transformOrigin: "top center",
              background: `linear-gradient(180deg, rgba(24,24,27,0.9) 0%, rgba(9,9,11,1) 100%)`,
            }}
            animate={{
              top: index * -offset,
              scale: 1 - index * scaleFactor,
              zIndex: cards.length - index,
              y: index === 0 ? 0 : 0, // Ensure front card is neutral
              opacity: index < 3 ? 1 : 0, // Hide cards deeper in stack
            }}
            drag={index === 0 ? "y" : false} // Only allow dragging the top card
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={() => moveToEnd(0)}
            onClick={() => {
                if (index === 0) moveToEnd(0);
            }}
            transition={{
                duration: 0.4,
                ease: "easeInOut"
            }}
          >
            {/* Ambient Gradient Background */}
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-b ${card.gradient} opacity-20 pointer-events-none`} />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl bg-zinc-900 border border-zinc-800 ${card.color}`}>
                        <card.icon size={32} />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 border border-zinc-800 px-2 py-1 rounded-full">
                        Agent 0{card.id + 1}
                    </span>
                </div>
                
                <h3 className={`text-2xl font-bold mb-2 text-zinc-100`}>{card.name}</h3>
                <div className={`text-xs font-mono uppercase tracking-wide mb-4 ${card.color}`}>{card.role}</div>
            </div>

            <div className="relative z-10">
                 <p className="text-zinc-400 text-sm leading-relaxed">
                    {card.description}
                 </p>
                 <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500 group">
                    <span>View Capabilities</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
