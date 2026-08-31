import React, { useState, useEffect, useRef } from 'react';
import ApiKeyModal from './components/ApiKeyModal';
import Header from './components/Header';
import RecordSection from './components/RecordSection';
import TranscriptionFeedback from './components/TranscriptionFeedback';
import SymptomsList from './components/SymptomsList';
import { transcribeAudio, analyzeTranscription } from './api/openai';

export default function App() {
  const [apiKey, setApiKey] = useState('');
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

  const handleSaveApiKey = (newKey) => {
    localStorage.setItem('openai_api_key', newKey);
    setApiKey(newKey);
    setShowSettings(false);
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
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
        await handleTranscription(audioBlob);
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

  const handleTranscription = async (audioBlob) => {
    setIsTranscribing(true);
    try {
      const text = await transcribeAudio(audioBlob, apiKey);
      setTranscription(text);
      
      // Pass the text to Chat Completions
      const analyzedData = await analyzeTranscription(text, apiKey);
      
      // Add the current date to the data
      const newSymptom = {
        ...analyzedData,
        date: new Date().toLocaleString('pl-PL', { 
          day: '2-digit', month: '2-digit', year: 'numeric', 
          hour: '2-digit', minute: '2-digit' 
        })
      };
      
      setSymptoms(prev => [newSymptom, ...prev]);
    } catch (err) {
      console.error("Error during processing:", err);
      alert(`Błąd przetwarzania: ${err.message}`);
    } finally {
      setIsTranscribing(false);
    }
  };

  // The modal blocking interactions
  if (!isInitializing && (!apiKey || showSettings)) {
    return (
      <ApiKeyModal 
        apiKey={apiKey} 
        onSave={handleSaveApiKey} 
        onRemove={handleRemoveApiKey} 
        onCancel={() => setShowSettings(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      <Header onOpenSettings={() => setShowSettings(true)} />

      <main className="max-w-3xl mx-auto px-4 pt-10 pb-12 space-y-12">
        <RecordSection 
          isRecording={isRecording} 
          onStart={startRecording} 
          onStop={stopRecording} 
        />
        
        <TranscriptionFeedback 
          transcription={transcription} 
          isTranscribing={isTranscribing} 
        />

        <SymptomsList symptoms={symptoms} />
      </main>
    </div>
  );
}
