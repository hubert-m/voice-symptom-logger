import React from 'react';
import { Loader2 } from 'lucide-react';

export default function TranscriptionFeedback({ transcription, isTranscribing }) {
  if (!transcription && !isTranscribing) return null;

  return (
    <div className="mt-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm w-full max-w-xl mx-auto text-left transition-all">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Wynik transkrypcji:</h3>
      {isTranscribing ? (
         <div className="flex items-center gap-3 text-blue-600">
           <Loader2 className="w-5 h-5 animate-spin" />
           <span className="text-sm font-medium">Przetwarzanie głosu na tekst...</span>
         </div>
      ) : (
        <p className="text-slate-700 text-lg leading-relaxed">{transcription}</p>
      )}
    </div>
  );
}
