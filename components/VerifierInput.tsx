
import React, { useState, useRef } from 'react';

interface VerifierInputProps {
  onVerify: (text: string, imageUri?: string) => void;
  isLoading: boolean;
}

const VerifierInput: React.FC<VerifierInputProps> = ({ onVerify, isLoading }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isLoading) return;
    if (text.trim() || image) {
      onVerify(text, image || undefined);
      setText('');
      setImage(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-2">
      {image && (
        <div className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-slate-200 shadow-lg animate-in fade-in zoom-in duration-200">
          <img src={image} className="w-16 h-16 object-cover rounded-lg" />
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-slate-700 truncate">Screenshot selected</p>
            <p className="text-[10px] text-slate-400">Ready for analysis</p>
          </div>
          <button 
            onClick={() => setImage(null)}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      <div className="flex items-end space-x-2">
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 flex items-end px-3 py-1.5 focus-within:border-whatsapp-teal transition-colors">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-400 hover:text-whatsapp-teal transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type or paste message..."
            rows={1}
            disabled={isLoading}
            className="flex-1 max-h-32 min-h-[40px] bg-transparent border-none focus:ring-0 py-2.5 text-sm resize-none"
            style={{ height: 'auto' }}
          />
          
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || (!text.trim() && !image)}
          className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all transform active:scale-90 ${
            isLoading || (!text.trim() && !image)
              ? 'bg-slate-300' 
              : 'bg-whatsapp-teal hover:bg-whatsapp-dark'
          }`}
        >
          {isLoading ? (
             <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default VerifierInput;
