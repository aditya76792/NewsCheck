
import React from 'react';

interface TrustMeterProps {
  score: number;
}

const TrustMeter: React.FC<TrustMeterProps> = ({ score }) => {
  const getProgressColor = (val: number) => {
    if (val >= 80) return 'bg-green-500';
    if (val >= 60) return 'bg-lime-500';
    if (val >= 40) return 'bg-yellow-500';
    if (val >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTextColor = (val: number) => {
    if (val >= 80) return 'text-green-600';
    if (val >= 60) return 'text-lime-600';
    if (val >= 40) return 'text-yellow-600';
    if (val >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="relative w-48 h-24 overflow-hidden">
        {/* Semi-circle track */}
        <div className="absolute top-0 left-0 w-48 h-48 border-[16px] border-slate-100 rounded-full"></div>
        {/* Semi-circle progress */}
        <div 
          className={`absolute top-0 left-0 w-48 h-48 border-[16px] border-transparent border-t-current rounded-full transition-all duration-1000 ease-out ${getTextColor(score)}`}
          style={{ 
            transform: `rotate(${(score / 100) * 180 - 180}deg)`,
          }}
        ></div>
        {/* Center Text */}
        <div className="absolute bottom-0 left-0 w-full text-center">
          <span className={`text-4xl font-bold ${getTextColor(score)}`}>{score}%</span>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-medium mt-1">Trust Score</p>
        </div>
      </div>
    </div>
  );
};

export default TrustMeter;
