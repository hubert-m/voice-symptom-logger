import React from 'react';
import { AlertCircle } from 'lucide-react';

const getSeverityColor = (severity) => {
  const num = parseInt(severity, 10);
  if (isNaN(num)) return 'text-slate-600 bg-slate-50 border-slate-200';
  if (num <= 3) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (num <= 7) return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-red-700 bg-red-50 border-red-200';
};

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
                 <span className="font-bold text-slate-800 text-lg leading-tight">{symptom.symptom || "Nieznany objaw"}</span>
                 <div className="flex gap-2 items-center flex-wrap justify-end">
                   {symptom.severity && (
                     <span className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border ${getSeverityColor(symptom.severity)}`}>
                       Nasilenie: {symptom.severity}/10
                     </span>
                   )}
                   <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
                     {symptom.date || "Brak daty"}
                   </span>
                 </div>
               </div>
               <p className="text-slate-600 text-sm leading-relaxed">{symptom.notes || "Brak opisu"}</p>
               
               {symptom.suggestion && (
                 <div className="mt-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                   <h4 className="text-sm font-bold text-blue-800 mb-1">Sugestia AI</h4>
                   <p className="text-sm text-blue-700 leading-relaxed mb-3">{symptom.suggestion}</p>
                   <div className="flex items-start gap-2 text-blue-600 bg-blue-100/50 p-2.5 rounded-xl text-xs font-medium">
                     <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                     <p>Powyższa sugestia została wygenerowana automatycznie i nie stanowi porady medycznej. W przypadku problemów zdrowotnych zawsze najważniejsza jest opinia lekarza specjalisty.</p>
                   </div>
                 </div>
               )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
