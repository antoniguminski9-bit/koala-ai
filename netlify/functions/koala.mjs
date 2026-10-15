export default async (request) => {
  const headers = { "Content-Type": "application/json" };

  const json = (answer, status = 200) =>
    new Response(JSON.stringify({ answer }), { status, headers });

  if (request.method !== "POST") {
    return json("Dozwolone jest tylko POST.", 405);
  }

  try {
    const data = await request.json();
    const pytanie = String(data.message || "").trim();
    const image = data.image || null;

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

    if (!pytanie && !image) {
      return json("Napisz pytanie albo dołącz zdjęcie. 🐨", 400);
    }

    if (
      image &&
      (!String(image.mimeType || "").startsWith("image/") ||
        typeof image.data !== "string")
    ) {
      return json("Nie udało się odczytać zdjęcia. Wybierz je ponownie.", 400);
    }

    const apiKey = Netlify.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      console.error("Brak zmiennej GEMINI_API_KEY w Netlify.");
      return json("Brak konfiguracji klucza AI w Netlify.", 500);
    }

    const instrukcja = `
Jesteś Koala.ai — polskim asystentem dla uczniów.
Odpowiadaj po polsku, jasno, naturalnie i konkretnie.
W zadaniach szkolnych wyjaśniaj rozwiązanie krok po kroku.
Sprawdzaj obliczenia i nie wymyślaj faktów.
Jeśli czegoś nie wiesz, powiedz o tym.
Korzystaj z historii rozmowy.
Nie pokazuj wewnętrznego procesu rozumowania.
Jeśli otrzymasz zdjęcie, przeanalizuj jego treść.
Nie zgaduj nieczytelnych fragmentów.
Przy mnożeniu pisemnym pokazuj czytelne działania i iloczyny cząstkowe.
Nie wypisuj dosłownie znaczników formatowania, takich jak **.
`;

    const contents = [
      ...history.map((item) => ({
        role: item.role,
        parts: [{ text: item.text }]
      })),
      {
        role: "user",
        parts: [
          {
            text: pytanie || "Przeanalizuj załączone zdjęcie i pomóż mi."
          },
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

    // Jeśli model jest niedostępny lub przeciążony,
    // spróbuj kolejnego modelu.
    const modele = [
      "gemini-3.8-flash",
      "gemini-3.7-flash",
      "gemini-3.6-flash",
      "gemini-3.5-flash-lite"
    ];

    let ostatniBlad = "";

    for (const model of modele) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey
            },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: instrukcja }]
              },
              contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048
              }
            })
          }
        );

        const result = await response.json().catch(() => ({}));

        if (response.ok) {
          const answer = result?.candidates?.[0]?.content?.parts
            ?.map((part) => part.text || "")
            .join("")
            .trim();

          if (answer) {
            return json(answer);
          }

          ostatniBlad =
            result?.promptFeedback?.blockReason ||
            result?.candidates?.[0]?.finishReason ||
            "Model nie zwrócił tekstowej odpowiedzi.";

          console.error(`Gemini ${model}: brak odpowiedzi tekstowej.`);
          continue;
        }

        const szczegoly =
          result?.error?.message || `HTTP ${response.status}`;

        ostatniBlad = szczegoly;

        console.error(`Gemini ${model}: HTTP ${response.status}`, szczegoly);

        // Dla tych błędów spróbuj następnego modelu.
        if ([400, 401, 403, 404, 429, 500, 503].includes(response.status)) {
          continue;
        }

        break;
      } catch (error) {
        ostatniBlad = error?.message || "Błąd połączenia";
        console.error(`Błąd połączenia z Gemini ${model}:`, ostatniBlad);
      }
    }

    console.error("Wszystkie modele Gemini zawiodły:", ostatniBlad);

    if (/API key|API_KEY|invalid key/i.test(ostatniBlad)) {
      return json("Klucz API Gemini jest nieprawidłowy. Sprawdź konfigurację w Netlify.", 502);
    }

    if (/quota|billing|resource_exhausted/i.test(ostatniBlad)) {
      return json("Limit zapytań Gemini został osiągnięty. Sprawdź limity API.", 503);
    }

    return json(
      "🐨 Nie udało mi się uzyskać odpowiedzi z Gemini. Spróbuj ponownie za chwilę. Jeśli problem się powtarza, sprawdź logi funkcji koala w Netlify.",
      503
    );
  } catch (error) {
    console.error("Błąd funkcji Koala.ai:", error);
    return json("Wystąpił błąd podczas obsługi wiadomości.", 500);
  }
};
