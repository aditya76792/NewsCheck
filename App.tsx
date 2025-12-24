
import React, { useState, useRef, useEffect } from 'react';
import { AnalysisState, VerificationResult } from './types';
import { verifyContent } from './services/geminiService';
import VerifierInput from './components/VerifierInput';
import AnalysisResult from './components/AnalysisResult';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    isAnalyzing: false,
    result: null,
    error: null,
    step: 'idle',
  });
  
  const [history, setHistory] = useState<{ type: 'user' | 'bot', content: string, image?: string, result?: VerificationResult }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, state.isAnalyzing]);

  const handleVerify = async (text: string, imageUri?: string) => {
    // Add user message to history
    setHistory(prev => [...prev, { type: 'user', content: text, image: imageUri }]);
    
    setState({ 
      isAnalyzing: true, 
      result: null, 
      error: null, 
      step: 'scanning' 
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setState(prev => ({ ...prev, step: 'searching' }));
      await new Promise(resolve => setTimeout(resolve, 1000));
      setState(prev => ({ ...prev, step: 'evaluating' }));

      const result = await verifyContent(text, imageUri);
      
      setState({
        isAnalyzing: false,
        result,
        error: null,
        step: 'completed'
      });

      // Add bot response to history
      setHistory(prev => [...prev, { type: 'bot', content: result.summary, result }]);
    } catch (err: any) {
      setState({
        isAnalyzing: false,
        result: null,
        error: err.message || 'An unexpected error occurred.',
        step: 'idle'
      });
    }
  };

  const getStepMessage = () => {
    switch (state.step) {
      case 'scanning': return 'Scanning claims...';
      case 'searching': return 'Cross-referencing web sources...';
      case 'evaluating': return 'Confirming truth score...';
      default: return 'Processing...';
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto shadow-2xl bg-white relative">
      {/* WhatsApp style Header */}
      <header className="bg-whatsapp-teal text-white p-3 flex items-center shadow-md z-10 shrink-0">
        <div className="bg-white/20 p-2 rounded-full mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-lg leading-tight">VeriFact Bot</h1>
          <p className="text-xs text-whatsapp-light/80 font-medium">Fact-checking misinformation in real-time</p>
        </div>
        <div className="flex space-x-3 opacity-80">
          <button className="hover:bg-white/10 p-1 rounded transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg></button>
        </div>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 chat-bg space-y-4 pb-32"
      >
        {history.length === 0 && !state.isAnalyzing && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <p className="text-slate-600 text-sm mb-4">
                <strong>Hello!</strong> Send me a forwarded message or a screenshot, and I'll verify if it's true using Google Search.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                <div className="p-2 border border-slate-100 rounded-lg">Paste Text</div>
                <div className="p-2 border border-slate-100 rounded-lg">Upload Photo</div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 bg-white/50 px-2 py-1 rounded">MESSAGES ARE ANALYZED BY AI</p>
          </div>
        )}

        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] rounded-lg p-3 shadow-sm relative ${
              msg.type === 'user' 
                ? 'bg-whatsapp-light rounded-tr-none' 
                : 'bg-white rounded-tl-none'
            }`}>
              {msg.image && (
                <img src={msg.image} className="rounded-md mb-2 max-h-48 w-full object-cover border border-slate-100" />
              )}
              {msg.type === 'bot' && msg.result ? (
                <AnalysisResult result={msg.result} compact={true} />
              ) : (
                <p className="text-sm text-slate-800 whitespace-pre-wrap">{msg.content}</p>
              )}
              <div className="flex justify-end items-center mt-1 space-x-1">
                <span className="text-[10px] text-slate-500 uppercase">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {msg.type === 'user' && (
                  <svg className="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M10,17l-5-5l1.41-1.41L10,14.17l7.59-7.59L19,8 L10,17z"></path>
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}

        {state.isAnalyzing && (
          <div className="flex justify-start animate-in slide-in-from-bottom-2">
            <div className="bg-white rounded-lg rounded-tl-none p-4 shadow-sm space-y-3 min-w-[200px]">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-whatsapp-teal rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-whatsapp-teal rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-whatsapp-teal rounded-full animate-bounce"></div>
                </div>
                <span className="text-sm font-semibold text-whatsapp-teal">{getStepMessage()}</span>
              </div>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full bg-whatsapp-teal transition-all duration-1000 ${
                  state.step === 'scanning' ? 'w-1/3' : state.step === 'searching' ? 'w-2/3' : 'w-[90%]'
                }`}></div>
              </div>
            </div>
          </div>
        )}

        {state.error && (
          <div className="flex justify-center">
            <div className="bg-red-50 text-red-600 text-xs py-1 px-4 rounded-full border border-red-100 shadow-sm">
              {state.error}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-50 border-t border-slate-200 z-20">
        <VerifierInput onVerify={handleVerify} isLoading={state.isAnalyzing} />
      </div>
    </div>
  );
};

export default App;
