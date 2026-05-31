import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (amount: string, category: string, note: string) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Speech recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (e: any) => {
      setError(e.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      
      const amountMatch = transcript.match(/\d+/);
      const amount = amountMatch ? amountMatch[0] : '';
      
      let category = '';
      if (transcript.includes('food') || transcript.includes('eat')) category = 'Food';
      if (transcript.includes('travel') || transcript.includes('cab')) category = 'Transport';
      if (transcript.includes('shop')) category = 'Shopping';

      const note = transcript.split('for').pop()?.trim() || transcript;
      
      onTranscript(amount, category, note);
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={isListening ? () => {} : startListening}
        className={`p-4 rounded-full transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-white/5 text-gray-500 hover:text-primary-start hover:bg-white/10'}`}
      >
        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
      </button>
      {isListening && (
        <span className="text-[8px] font-black uppercase tracking-widest text-red-500">Listening...</span>
      )}
      {error && (
        <span className="text-[8px] font-bold text-red-500">{error}</span>
      )}
    </div>
  );
};
