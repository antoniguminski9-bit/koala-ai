export default async (request) => {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ answer: "Dozwolone jest tylko POST." }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  try {
    const data = await request.json();
    const pytanie = String(data.message || "").trim();

    const history = Array.isArray(data.history)
      ? data.history
          .filter(
            (item) =>
              item &&
              ["user", "model"].includes(item.role) &&
              typeof item.text === "string"
          )
          .slice(-20)
      : [];

    const image = data.image || null;

    if (!pytanie && !image) {
      return new Response(
        JSON.stringify({
          answer: "Napisz pytanie albo dołącz zdjęcie. 🐨"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const apiKey = Netlify.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({ answer: "Brak konfiguracji klucza AI." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const instrukcja = `
Jesteś Koala.ai — polskim asystentem pomagającym uczniom i odpowiadającym na pytania z różnych dziedzin.

ZASADY OGÓLNE:
- Odpowiadaj po polsku, jasno, naturalnie i konkretnie.
- Dopasuj długość odpowiedzi do pytania.
- Pomagaj w matematyce, fizyce, chemii, biologii, historii, geografii, językach, informatyce i innych dziedzinach.
- Przy zadaniach szkolnych wyjaśniaj rozwiązanie krok po kroku, prostym językiem.
- Sprawdzaj obliczenia i nie wymyślaj faktów.
- Jeśli nie masz pewności, powiedz o tym.
- Jeśli pytanie jest niejasne, poproś o doprecyzowanie.
- Korzystaj z historii rozmowy, aby rozumieć kontekst.
- Nie pokazuj wewnętrznego procesu rozumowania.

ZDJĘCIA:
- Jeśli użytkownik prześle zdjęcie, dokładnie przeanalizuj jego widoczną treść.
- Odczytaj zadanie, tekst, liczby, wykresy lub schematy, jeśli są czytelne.
- Pomóż rozwiązać zadanie i wyjaśnij najważniejsze kroki.
- Nie zgaduj nieczytelnych fragmentów. Powiedz, jeśli zdjęcie jest niewyraźne.

MATEMATYKA:
- Pokazuj działania pisemne w czytelnym układzie.
- Wyrównuj cyfry w kolumnach, gdy format na to pozwala.
- Przy mnożeniu pokaż iloczyny cząstkowe i wynik.
- Pamiętaj o przesunięciu iloczynów cząstkowych przy mnożeniu przez dziesiątki.
- Po obliczeniu krótko wyjaśnij wynik.

FORMAT:
- Nie wypisuj dosłownie znaczników formatowania, takich jak **.
- Unikaj zbędnych wstępów i technicznych oznaczeń.
- Możesz używać emotikonów, ale bez przesady.
`;

    const contents = [
      ...history.map((item) => ({
        role: item.role,
        parts: [{ text: item.text }]
      })),
      {
        role: "user",
        parts: [
          ...(pytanie ? [{ text: pytanie }] : [
            { text: "Proszę przeanalizuj dołączone zdjęcie." }
          ]),
          ...(image
            ? [{
                inline_data: {
                  mime_type: image.mimeType,
                  data: image.data
                }
              }]
            : [])
        ]
      }
    ];

    const url =
     "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent";

    let result = null;

    for (let proba = 1; proba <= 3; proba++) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: instrukcja }]
            },
            contents
          })
        });

        result = await response.json();

        if (response.ok) {
          const answer =
            result?.candidates?.[0]?.content?.parts
              ?.map((part) => part.text || "")
              .join("")
              .trim();

          if (answer) {
            return new Response(
              JSON.stringify({ answer }),
              {
                status: 200,
                headers: { "Content-Type": "application/json" }
              }
            );
          }

          console.error("Gemini nie zwróciło tekstowej odpowiedzi:", result);
          break;
        }

        console.error("Błąd Gemini:", response.status, result);

        if (response.status !== 503) {
          break;
        }

        if (proba < 3) {
          await new Promise((resolve) =>
            setTimeout(resolve, proba * 1000)
          );
        }
      } catch (error) {
        console.error(error);

        if (proba < 3) {
          await new Promise((resolve) =>
            setTimeout(resolve, proba * 1000)
          );
        }
      }
    }

    return new Response(
      JSON.stringify({
        answer:
          "🐨 Nie udało mi się uzyskać odpowiedzi. Spróbuj ponownie za chwilę."
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        answer: "Wystąpił błąd podczas łączenia z AI."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
