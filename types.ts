
export type ViewState = 'dashboard' | 'analysis' | 'knowledge' | 'draft' | 'settings';

export type LogType = 'info' | 'success' | 'error' | 'warning' | 'code';

export interface LogEntry {
  id: number;
  agent: string;
  message: string;
  timestamp: string;
  type: LogType;
}

export interface Document {
  id: string; // Changed to string for Firestore IDs
  name: string;
  size: string;
  date: string;
  tags: string[];
  userId?: string;
}

export type Verdict = 'pending' | 'go' | 'no-go';

export interface TutorialStep {
  target: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  rfpText: string;
  strategyContext?: string; // New field for user strategy/win themes
  status: 'analyzing' | 'completed' | 'failed';
  verdict: Verdict;
  logs: LogEntry[];
  draftContent: string;
  createdAt: any; // Firestore Timestamp
}
