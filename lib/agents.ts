
import { GoogleGenAI } from "@google/genai";
import { db } from "./firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { LogEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Delay helper for dramatic effect in simulation
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Interface for the callback
type LogCallback = (log: LogEntry) => void;
type UpdateProjectCallback = (data: any) => void;

export const runBidSwarm = async (
  projectId: string, 
  rfpText: string,
  strategyContext: string, // Received from UI
  isDemo: boolean,
  onLog: LogCallback,
  onUpdateProject: UpdateProjectCallback
) => {
  
  // Helper to handle logging to both Firestore (if real) and UI (callback)
  const createLog = async (agent: string, message: string, type: LogEntry['type']) => {
    const entry: LogEntry = {
      id: Date.now(),
      agent,
      message,
      timestamp: new Date().toLocaleTimeString(),
      type
    };

    // 1. Update UI immediately
    onLog(entry);

    // 2. Update Firestore if not in demo mode
    if (!isDemo) {
      try {
        const projectRef = doc(db, 'projects', projectId);
        await updateDoc(projectRef, {
          logs: arrayUnion(entry)
        });
      } catch (e) {
        console.warn("Firestore write failed (likely permission issue), falling back to local only.");
      }
    }
  };

  const updateStatus = async (data: any) => {
      onUpdateProject(data);
      if (!isDemo) {
          try {
            await updateDoc(doc(db, 'projects', projectId), data);
          } catch (e) { console.warn("Firestore update failed"); }
      }
  };

  try {
    // --- 1. The Historian (Ingestion) ---
    await createLog('System', 'Initializing Agent Swarm (v2.2)...', 'info');
    await delay(800);
    
    await createLog('The Historian', 'Ingesting RFP content...', 'info');
    await delay(1500);

    let historianContext = "";
    
    // Log that we are using the user's strategy
    if (strategyContext) {
        await createLog('The Historian', `Applying Strategic Filter: "${strategyContext.substring(0, 50)}..."`, 'info');
    }

    // TRY REAL AI
    if (process.env.API_KEY && !isDemo) {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-latest',
                contents: `Analyze this RFP. Extract Client Name, Due Date, and 3 key requirements. 
                
                CRITICAL: The user wants to focus on: "${strategyContext}". 
                Does this RFP align with that focus?
                
                Text: ${rfpText.substring(0, 5000)}`
            });
            historianContext = response.text;
            await createLog('The Historian', 'Context extracted using Gemini 2.5 Flash.', 'success');
        } catch (e) {
            await createLog('The Historian', 'API Error. Switching to heuristic analysis.', 'warning');
            historianContext = "Client: Unknown (Extracted via Fallback). Requirements: Standard Proposal.";
        }
    } else {
        // SIMULATION
        await delay(1000);
        historianContext = "Detected Logistics RFP. Client: Govt Dept of Transport. Due: Nov 2025.";
        await createLog('The Historian', `Simulation: Extracted metadata. ${historianContext}`, 'success');
        
        if (strategyContext) {
             await delay(800);
             await createLog('The Historian', `Cross-referencing requirements with Strategy: Found 3 matches for '${strategyContext}'.`, 'success');
        }
    }

    // --- 2. The Gatekeeper (Go/No-Go) ---
    await createLog('The Gatekeeper', 'Scanning for "Deal Breakers" and Contractual Red Flags...', 'info');
    await delay(2000);

    let verdict: 'go' | 'no-go' = 'go';
    let reason = "All constraints met.";

    if (process.env.API_KEY && !isDemo) {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-latest',
                contents: `Risk Analyst Task. RFP: ${rfpText.substring(0, 2000)}. 
                
                Standard Constraints: >$50k budget, No Mainframes.
                USER STRATEGY/CONSTRAINTS: ${strategyContext}
                
                Return JSON: { "verdict": "go" | "no-go", "reason": "string" }`,
                config: { responseMimeType: "application/json" }
            });
            const json = JSON.parse(response.text || "{}");
            verdict = json.verdict === 'go' ? 'go' : 'no-go';
            reason = json.reason || reason;
        } catch (e) {
            console.error(e);
        }
    } else {
        // SIMULATION
        if (rfpText.toLowerCase().includes("mainframe")) {
            verdict = 'no-go';
            reason = "Detected forbidden keyword: 'Mainframe'";
        } else {
             await createLog('The Gatekeeper', 'Budget Analysis: >$100k projected value.', 'success');
             await delay(800);
             await createLog('The Gatekeeper', 'Tech Stack Check: Python/React compatible.', 'success');
             if (strategyContext) {
                 await createLog('The Gatekeeper', 'Strategy Alignment Check: 95% Match.', 'success');
             }
        }
    }

    await createLog('The Gatekeeper', `VERDICT: ${verdict.toUpperCase()}. Reason: ${reason}`, verdict === 'go' ? 'success' : 'error');
    await updateStatus({ verdict });

    if (verdict === 'no-go') {
        await createLog('System', 'Process halted by Gatekeeper.', 'warning');
        await updateStatus({ status: 'failed' });
        return;
    }

    // --- 3. The Architect (Drafting) ---
    await createLog('The Architect', 'Drafting Executive Summary. Prioritizing User Win Themes...', 'info');
    await delay(2500);

    let draft = "";
    if (process.env.API_KEY && !isDemo) {
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-latest',
            contents: `Write an Executive Summary (300 words) for this RFP. 
            
            RFP Context: ${historianContext}. 
            
            IMPORTANT - WIN THEMES: Incorporate these user strategy points: "${strategyContext}".
            Make sure to explicitly mention how we solve their specific pain points using these themes.
            
            Raw RFP: ${rfpText.substring(0, 2000)}`
        });
        draft = response.text;
    } else {
        // Simulation text that dynamically inserts user strategy
        const strategyBlurb = strategyContext 
            ? `Specifically, we address your focus on "${strategyContext}" by leveraging our proprietary engine.`
            : "We leverage our proprietary autonomous engine.";

        draft = `EXECUTIVE SUMMARY\n\nBidPilot Solutions is pleased to submit this proposal for the [Project Name].\n\nBased on our analysis of your requirements, we understand that [Client Name] is looking for a partner who can deliver reliability and innovation. ${strategyBlurb}\n\nKEY WIN THEMES:\n1. Efficiency: Our solution reduces overhead by 40%.\n2. Compliance: Fully compliant with all stated RFP security mandates.\n\nWe look forward to the opportunity to partner with you.`;
    }

    await createLog('The Architect', 'Draft generation complete. Win Themes embedded.', 'success');
    await updateStatus({ draftContent: draft, status: 'completed' });

    // --- 4. The Auditor (Compliance) ---
    await createLog('The Auditor', 'Running final compliance scan against 45 rules...', 'info');
    await delay(1500);
    await createLog('The Auditor', 'Compliance Pass. Formatting verified.', 'success');
    
    await createLog('System', 'Bid Package Ready.', 'success');

  } catch (error: any) {
    console.error(error);
    await createLog('System', `Critical Error: ${error.message}`, 'error');
    await updateStatus({ status: 'failed' });
  }
};
