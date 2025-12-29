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
  id: number;
  name: string;
  size: string;
  date: string;
  tags: string[];
}

export type Verdict = 'pending' | 'go' | 'no-go';

export const MOCK_KNOWLEDGE_BASE: Document[] = [
  { id: 1, name: "Proposal_BankOfAmerica_2024.pdf", size: "12MB", date: "Oct 2024", tags: ["Finance", "Security", "Cloud"] },
  { id: 2, name: "CaseStudy_HealthPlus.docx", size: "2MB", date: "Sep 2024", tags: ["Healthcare", "Migration"] },
  { id: 3, name: "ISO_27001_Cert.pdf", size: "1MB", date: "Jan 2025", tags: ["Compliance"] },
  { id: 4, name: "Team_Bios_Engineering.pdf", size: "4MB", date: "Aug 2024", tags: ["HR", "Staffing"] },
];