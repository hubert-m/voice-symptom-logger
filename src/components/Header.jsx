import React from 'react';
import { Activity, Settings } from 'lucide-react';

export default function Header({ onOpenSettings }) {
  return (
    <header className="bg-white sticky top-0 z-10 border-b border-slate-200/60 shadow-sm backdrop-blur-md bg-white/80">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2.5 rounded-2xl shadow-sm">
            <Activity className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 tracking-tight">
            Dziennik Objawów
          </h1>
        </div>
        <button 
          onClick={onOpenSettings}
          className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors active:scale-95"
          title="Ustawienia"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
