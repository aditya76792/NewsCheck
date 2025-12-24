
import React from 'react';
import { VerificationResult } from '../types';

interface AnalysisResultProps {
  result: VerificationResult;
  compact?: boolean;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, compact = false }) => {
  const getVerdictStyles = (verdict: string) => {
    switch (verdict.toLowerCase()) {
      case 'reliable': return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', icon: '✅' };
      case 'partially true': return { color: 'text-lime-600', bg: 'bg-lime-50', border: 'border-lime-100', icon: '⚖️' };
      case 'misleading': return { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', icon: '⚠️' };
      case 'fake': return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: '❌' };
      default: return { color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100', icon: '❓' };
    }
  };

  const styles = getVerdictStyles(result.verdict);

  return (
    <div className="space-y-3">
      {/* Score Header */}
      <div className={`p-3 rounded-lg border ${styles.bg} ${styles.border} flex items-center justify-between`}>
        <div className="flex items-center space-x-2">
          <span className="text-xl">{styles.icon}</span>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${styles.color}`}>Verdict</p>
            <p className={`text-sm font-bold ${styles.color}`}>{result.verdict}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trust Score</p>
          <p className={`text-lg font-black ${styles.color}`}>{result.score}%</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-800 leading-snug">
          {result.summary}
        </h3>
        
        <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
          <p className="text-xs text-slate-600 leading-relaxed italic">
            {result.details}
          </p>
        </div>
      </div>

      {result.sources.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Credible Evidence</p>
          <div className="space-y-1">
            {result.sources.slice(0, 3).map((source, idx) => (
              <a 
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-2 bg-white border border-slate-200 rounded-lg hover:border-whatsapp-teal transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-800 truncate group-hover:text-whatsapp-teal">{source.title}</p>
                  <p className="text-[8px] text-slate-400 truncate uppercase">{new URL(source.uri).hostname}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-300 group-hover:text-whatsapp-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;
