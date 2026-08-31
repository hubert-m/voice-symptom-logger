import React, { useState, useEffect, useRef } from 'react';
import { Mic, Activity, KeyRound, AlertCircle, Save, Settings, Trash2, Square, Loader2 } from 'lucide-react';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [tempApiKey, setTempApiKey] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  useEffect(() => {
    // Load config from LocalStorage on mount
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
    
    const storedSymptoms = localStorage.getItem('symptoms');
    if (storedSymptoms) {
      try {
        setSymptoms(JSON.parse(storedSymptoms));
      } catch (e) {
        console.error("Błąd podczas parsowania objawów", e);
      }
    }
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    // Save symptoms whenever they change
    if (!isInitializing) {
      localStorage.setItem('symptoms', JSON.stringify(symptoms));
    }
  }, [symptoms, isInitializing]);

  const saveApiKey = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem('openai_api_key', tempApiKey.trim());
      setApiKey(tempApiKey.trim());
      setShowSettings(false);
    }
  };

  const removeApiKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setTempApiKey('');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTranscription('');
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Nie udało się uzyskać dostępu do mikrofonu. Sprawdź uprawnienia przeglądarki.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      formData.append('model', 'whisper-1');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Błąd API OpenAI');
      }

      const data = await response.json();
      setTranscription(data.text);
    } catch (err) {
      console.error("Transcription error:", err);
      alert(`Błąd transkrypcji: ${err.message}`);
    } finally {
      setIsTranscribing(false);
    }
  };

  // The modal blocking interactions
  if (!isInitializing && (!apiKey || showSettings)) {
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
                onChange={(e) => setTempApiKey(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800 font-mono shadow-sm bg-slate-50"
              />
            </div>
            
            <button
              onClick={saveApiKey}
              disabled={!tempApiKey.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-[0.98]"
            >
              <Save className="w-5 h-5" />
              Zapisz klucz i rozpocznij
            </button>
            
            {apiKey && (
               <button
                 onClick={() => setShowSettings(false)}
                 className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-2xl transition-colors"
               >
                 Anuluj
               </button>
            )}
            
            {apiKey && (
              <div className="pt-4 border-t border-slate-100 mt-4">
                <button
                   onClick={removeApiKey}
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
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
            onClick={() => setShowSettings(true)}
            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors active:scale-95"
            title="Ustawienia"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-10 pb-12 space-y-12">
        
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Jak się dzisiaj czujesz?
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
            Naciśnij przycisk, opisz swoje objawy i czas wystąpienia. Aplikacja automatycznie przetworzy mowę na ustrukturyzowany wpis.
          </p>

          <div className="pt-6 flex justify-center">
            <button 
              onClick={isRecording ? stopRecording : startRecording}
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

          {/* Wynik transkrypcji (Feedback) */}
          {(transcription || isTranscribing) && (
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
          )}
        </section>

        {/* Log List Section */}
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

      </main>
    </div>
  );
}
