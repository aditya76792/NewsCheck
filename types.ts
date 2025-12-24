
export interface GroundingSource {
  title: string;
  uri: string;
}

export interface VerificationResult {
  score: number; // 0-100
  verdict: 'Reliable' | 'Partially True' | 'Misleading' | 'Fake' | 'Unknown';
  summary: string;
  details: string;
  sources: GroundingSource[];
  timestamp: string;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  result: VerificationResult | null;
  error: string | null;
  step: 'idle' | 'scanning' | 'searching' | 'evaluating' | 'completed';
}
