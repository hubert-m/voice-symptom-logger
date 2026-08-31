import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function SymptomsList({ symptoms }) {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between pl-1">
        <h3 className="text-xl font-bold text-slate-800">Twoje wpisy</h3>
        <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 shadow-sm">
          {symptoms.length} wpisów
        </span>
      </div>

      {symptoms.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-5 shadow-sm">
          <div className="flex justify-center">
            <div className="bg-slate-50 p-4 rounded-full">
              <AlertCircle className="w-12 h-12 text-slate-300" />
            </div>
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <p className="font-bold text-slate-700 text-lg">Brak zapisanych objawów</p>
            <p className="text-slate-500 text-sm leading-relaxed">Twoje ustrukturyzowane notatki pojawią się tutaj po zakończeniu dyktowania.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {symptoms.map((symptom, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
               <div className="flex justify-between items-start mb-3">
                 <span className="font-bold text-slate-800 text-lg leading-tight">{symptom.title || "Nieznany objaw"}</span>
                 <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
                   {symptom.date || "Brak daty"}
                 </span>
               </div>
               <p className="text-slate-600 text-sm leading-relaxed">{symptom.description || "Brak opisu"}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
