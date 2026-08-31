import React, { useState } from 'react';
import { KeyRound, Save, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { validateOpenAIApiKey } from '../api/openai';

export default function ApiKeyModal({ apiKey, onSave, onRemove, onCancel }) {
  const [tempApiKey, setTempApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async () => {
    const key = tempApiKey.trim();
    if (!key) return;

    setErrorMsg('');
    setIsValidating(true);
    
    const isValid = await validateOpenAIApiKey(key);
    
    setIsValidating(false);
    
    if (isValid) {
      onSave(key);
      setTempApiKey('');
    } else {
      setErrorMsg('Podany klucz jest niepoprawny lub nieważny.');
    }
  };

  const handleRemove = () => {
    onRemove();
    setTempApiKey('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8 space-y-6">
        <div className="flex justify-center">
          <div className="bg-blue-50 p-4 rounded-full">
            <KeyRound className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-slate-800">Klucz dostępu API</h1>
          <p className="text-slate-500 text-sm">
            Do działania aplikacji wymagany jest klucz API OpenAI. Aplikacja zapisuje go wyłącznie bezpiecznie na Twoim urządzeniu.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <label htmlFor="apiKey" className="text-sm font-medium text-slate-700 ml-1">OpenAI API Key</label>
            <input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={tempApiKey}
              onChange={(e) => {
                setTempApiKey(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800 font-mono shadow-sm bg-slate-50"
            />
          </div>
          
          {errorMsg && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl text-sm font-medium border border-red-100">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={!tempApiKey.trim() || isValidating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-[0.98]"
          >
            {isValidating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isValidating ? 'Weryfikacja klucza...' : 'Zapisz klucz i rozpocznij'}
          </button>
          
          {apiKey && (
             <button
               onClick={onCancel}
               className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-2xl transition-colors"
             >
               Anuluj
             </button>
          )}
          
          {apiKey && (
            <div className="pt-4 border-t border-slate-100 mt-4">
              <button
                 onClick={handleRemove}
                 className="w-full text-red-600 hover:bg-red-50 font-medium py-3 px-4 rounded-2xl transition-colors flex justify-center items-center gap-2"
               >
                 <Trash2 className="w-5 h-5" />
                 Usuń zapisany klucz
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
