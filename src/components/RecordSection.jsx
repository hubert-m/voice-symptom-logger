import React from 'react';
import { Mic, Square } from 'lucide-react';

export default function RecordSection({ isRecording, onStart, onStop }) {
  return (
    <section className="text-center space-y-6">
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
        Jak się dzisiaj czujesz?
      </h2>
      <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
        Naciśnij przycisk, opisz swoje objawy i czas wystąpienia. Aplikacja automatycznie przetworzy mowę na ustrukturyzowany wpis.
      </p>

      <div className="pt-6 flex justify-center">
        <button 
          onClick={isRecording ? onStop : onStart}
          className={`relative group focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 rounded-full ${isRecording ? 'animate-pulse' : ''}`}
        >
          <div className={`absolute inset-0 rounded-full blur-md transition-opacity duration-300 ${isRecording ? 'bg-red-500 opacity-60' : 'bg-blue-500 opacity-40 group-hover:opacity-60 group-active:opacity-80'}`}></div>
          <div className={`relative bg-white border-4 p-10 rounded-full shadow-xl transition-transform duration-300 ease-out group-active:scale-95 ${isRecording ? 'border-red-500 scale-105' : 'border-blue-500 group-hover:scale-105'}`}>
            {isRecording ? <Square className="w-16 h-16 text-red-600" /> : <Mic className="w-16 h-16 text-blue-600" />}
          </div>
        </button>
      </div>
      <p className={`text-sm font-semibold tracking-wide uppercase mt-6 ${isRecording ? 'text-red-500' : 'text-slate-400'}`}>
        {isRecording ? 'Nagrywanie... (kliknij by zakończyć)' : 'Naciśnij i zacznij mówić'}
      </p>
    </section>
  );
}
