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
