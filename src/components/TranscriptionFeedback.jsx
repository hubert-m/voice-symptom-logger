import React from 'react';
import { Loader2 } from 'lucide-react';

export default function TranscriptionFeedback({ transcription, processingStatus }) {
  if (!transcription && processingStatus === 'idle') return null;

  return (
    <div className="mt-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm w-full max-w-xl mx-auto text-left transition-all">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
        {processingStatus !== 'idle' ? 'Status' : 'Wynik transkrypcji:'}
      </h3>
      
      {processingStatus === 'transcribing' && (
         <div className="flex items-center gap-3 text-blue-600">
           <Loader2 className="w-5 h-5 animate-spin" />
           <span className="text-sm font-medium">Przetwarzanie głosu na tekst (Whisper)...</span>
         </div>
      )}

      {processingStatus === 'analyzing' && (
         <div className="flex items-center gap-3 text-purple-600">
           <Loader2 className="w-5 h-5 animate-spin" />
           <span className="text-sm font-medium">Analizowanie medyczne (GPT)...</span>
         </div>
      )}

      {processingStatus === 'idle' && transcription && (
        <p className="text-slate-700 text-lg leading-relaxed">{transcription}</p>
      )}
    </div>
  );
}
