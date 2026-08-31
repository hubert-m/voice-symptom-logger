# Voice Symptom Logger (Głosowy Dziennik Objawów)

Aplikacja pozwalająca na dyktowanie objawów, gdzie sztuczna inteligencja przetwarza mowę na ustrukturyzowany wpis. Zbudowana przy użyciu technologii React i Tailwind CSS.

> 🚀 **Live Demo:** [voice-symptom-logger.machala.dev](https://voice-symptom-logger.machala.dev/)

## 1. Problem
Aplikacja ułatwia notowanie objawów osobom starszym lub osłabionym. Dyktowanie głosowe znacząco minimalizuje konieczność pisania na klawiaturze, co w przypadku pogorszonego samopoczucia, osłabienia lub problemów z motoryką bywa dla użytkownika trudne, a czasem wręcz niemożliwe.

## 2. Architektura
Aplikacja opiera się na jednym prostym i płynnym obiegu informacji:
1. **Nagranie dźwięku:** Użytkownik dyktuje swoje objawy bezpośrednio do mikrofonu urządzenia.
2. **Transkrypcja:** Nagrany głos jest automatycznie przetwarzany na tekst.
3. **Ekstrakcja danych ustrukturyzowanych:** Model sztucznej inteligencji analizuje tekst i wydobywa z niego konkretne informacje (np. rodzaj dolegliwości, siłę bólu, czas wystąpienia).
4. **Lokalny zapis:** Gotowy, ustrukturyzowany wpis jest zapisywany lokalnie w pamięci przeglądarki.

## 3. Decyzje projektowe i kompromisy
Aby szybko dowieźć w pełni działający i stabilny "core flow" aplikacji z wykorzystaniem zewnętrznych API, zrezygnowano z kilku tradycyjnych elementów architektury:
- **Brak backendu i tradycyjnej bazy danych:** Dane są przechowywane wyłącznie na urządzeniu użytkownika przy użyciu mechanizmu `LocalStorage`. Dzięki temu aplikacja jest szybsza, nie wymaga skomplikowanej infrastruktury i zachowuje prywatność użytkownika.
- **Brak autoryzacji:** Aplikacja jest gotowa do użycia natychmiast po uruchomieniu, co zmniejsza barierę wejścia (szczególnie istotne dla osób starszych), jednak oznacza to brak możliwości synchronizacji danych między różnymi urządzeniami.

## 4. Plany rozwoju
W przyszłości aplikacja może zostać rozbudowana o kolejne kluczowe funkcjonalności:
- **Przygotowanie backendu z funkcjonalnościami logowania/rejestracji:** Aby umożliwić przypisywanie wpisów do konkretnego konta i ich bezpieczny podgląd na różnych urządzeniach pacjenta.
- **Podpięcie alternatywnych integracji z możliwością wyboru:** Dodanie integracji takich jak ElevenLabs, Deepgram, czy Groq. Obecnie podpięty jest tylko ekosystem OpenAI.
