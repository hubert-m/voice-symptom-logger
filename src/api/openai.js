export const transcribeAudio = async (audioBlob, apiKey) => {
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
  return data.text;
};

export const validateOpenAIApiKey = async (apiKey) => {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (response.status === 200) {
      console.log('Klucz jest poprawny.');
      return true;
    } else if (response.status === 401) {
      console.error('Klucz jest niepoprawny, nieważny lub usunięty.');
      return false;
    } else {
      console.error(`Wystąpił inny błąd HTTP: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('Błąd połączenia z OpenAI API:', error);
    return false;
  }
}

export const analyzeTranscription = async (transcriptionText, apiKey) => {
  const systemPrompt = "Jesteś asystentem medycznym. Przeanalizuj wypowiedź pacjenta i zwróć TYLKO obiekt JSON z czterema polami: 'symptom' (krótka nazwa objawu), 'severity' (liczba od 1 do 10 oceniająca nasilenie), 'notes' (dodatkowe szczegóły) oraz 'suggestion' (krótka porada co pacjent może zrobić w tej sytuacji). Jeśli brakuje nasilenia, oszacuj je na podstawie kontekstu lub zwróć null.";
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: transcriptionText }
      ],
      temperature: 0.1
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Błąd analizy tekstu');
  }

  const data = await response.json();
  const jsonString = data.choices[0].message.content;
  return JSON.parse(jsonString);
};
