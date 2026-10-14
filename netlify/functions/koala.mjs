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

    if (!pytanie) {
      return new Response(
        JSON.stringify({ answer: "Napisz najpierw pytanie." }),
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

const prompt = `
Jesteś Koala.ai — polskim asystentem pomagającym uczniom.

ZASADY ODPOWIADANIA:
- Odpowiadaj po polsku, jasno, krótko i konkretnie.
- Dopasuj długość odpowiedzi do pytania.
- Przy zadaniach szkolnych wyjaśniaj rozwiązanie prostymi krokami.
- Nie wymyślaj danych ani wyników. Sprawdzaj obliczenia.
- Nie pokazuj wewnętrznego procesu rozumowania.

MATEMATYKA:
- Pokazuj działania pisemne w czytelnym układzie.
- Wyrównuj cyfry w kolumnach.
- Nie pokazuj technicznych znaczników formatowania ani kodowych ogrodzeń w odpowiedzi.
- Nie dodawaj technicznych oznaczeń, cudzysłowów ani zbędnych wstępów.
- Przy mnożeniu pokaż liczby, kreskę, iloczyny cząstkowe i wynik.
- Pamiętaj o przesunięciu iloczynów cząstkowych przy mnożeniu przez dziesiątki.
- Po działaniu krótko wyjaśnij wynik.
- Możesz używać emotikonów, ale bez przesady.
Pytanie ucznia:
${pytanie}
`;

const url =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent";

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
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ]
          })
        });

        result = await response.json();

        if (response.ok) {
          const answer =
            result?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (answer) {
            return new Response(
              JSON.stringify({ answer }),
              {
                status: 200,
                headers: { "Content-Type": "application/json" }
              }
            );
          }

          break;
        }

        if (response.status !== 503) {
          console.error(result);
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
          "🐨 Gemini jest chwilowo przeciążone. Spróbuj ponownie za kilka sekund."
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
