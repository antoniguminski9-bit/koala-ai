
import { answerQuestion } from "./koala-engine.mjs";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_ITEMS = 24;

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

// Ujednolicamy tekst, aby wykrywać odpowiedź o braku wiedzy.
function normalizeSearchText(text) {
  return text
    .toLocaleLowerCase("pl-PL")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Sprawdzamy, czy lokalna baza nie zna odpowiedzi.
function isLocalUnknown(answer) {
  if (typeof answer !== "string") return false;

  const marker =
    "nie znalazlam jeszcze tego zagadnienia w mojej lokalnej bazie wiedzy";

  return normalizeSearchText(answer).includes(marker);
}

// Wyszukiwanie w polskiej Wikipedii.
async function searchWikipedia(question) {
  try {
    const params = new URLSearchParams({
      action: "query",
      list: "search",
      srsearch: question,
      srlimit: "3",
      format: "json",
      utf8: "1"
    });

    const searchResponse = await fetch(
      `https://pl.wikipedia.org/w/api.php?${params}`,
      {
        headers: {
          "Accept": "application/json",
          "Api-User-Agent": "KoalaAI/1.0 (educational project)"
        }
      }
    );

    if (!searchResponse.ok) return null;

    const searchData = await searchResponse.json();
    const results = searchData?.query?.search || [];

    if (results.length === 0) return null;

    // Pobieramy krótkie opisy znalezionych artykułów.
    const articles = await Promise.all(
      results.slice(0, 3).map(async result => {
        try {
          const title = result.title;

          const summaryResponse = await fetch(
            `https://pl.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
              title.replace(/ /g, "_")
            )}`,
            {
              headers: {
                "Accept": "application/json",
                "Api-User-Agent": "KoalaAI/1.0 (educational project)"
              }
            }
          );

          if (!summaryResponse.ok) return null;

          const page = await summaryResponse.json();

          if (!page.extract || typeof page.extract !== "string") {
            return null;
          }

          return {
            title: page.title || title,
            extract: page.extract,
            url:
              page.content_urls?.desktop?.page ||
              `https://pl.wikipedia.org/wiki/${encodeURIComponent(
                title.replace(/ /g, "_")
              )}`
          };
        } catch {
          return null;
        }
      })
    );

    const validArticles = articles.filter(Boolean);

    if (validArticles.length === 0) return null;

    const articleText = validArticles.map((article, index) => {
      return `${index + 1}. **${article.title}**

${article.extract.slice(0, 850)}

Źródło: ${article.url}`;
    });

    return `🐨 Znalazłam informacje w internecie!

Nie znalazłam odpowiedzi w mojej lokalnej bazie, dlatego sprawdziłam polską Wikipedię.

${articleText.join("\n\n")}

---

Pamiętaj, aby sprawdzić podane źródła. Są to materiały pomocnicze, a nie gwarancja poprawności każdej informacji.`;
  } catch (error) {
    console.error("Wikipedia search error:", error);
    return null;
  }
}

export default async function handler(request) {
  if (request.method !== "POST") {
    return jsonResponse(
      { answer: "Ta funkcja obsługuje żądania POST." },
      405
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      { answer: "Nie udało się odczytać wiadomości. Wyślij ją ponownie." },
      400
    );
  }

  if (
    !body ||
    typeof body.message !== "string" ||
    !body.message.trim()
  ) {
    return jsonResponse(
      { answer: "Napisz pytanie, a Koala spróbuje Ci pomóc." },
      400
    );
  }

  const message = body.message.trim();

  if (message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse(
      {
        answer: `Wiadomość jest za długa. Maksymalnie ${MAX_MESSAGE_LENGTH} znaków.`
      },
      413
    );
  }

  if (typeof body.image === "string" && body.image.length > 0) {
    return jsonResponse({
      answer: "🐨 W tej wersji nie potrafię jeszcze odczytywać obrazów. Wklej treść zadania jako tekst, a spróbuję Ci pomóc."
    });
  }

  const history = Array.isArray(body.history)
    ? body.history
        .filter(item => item && typeof item === "object")
        .slice(-MAX_HISTORY_ITEMS)
    : [];

  try {
    // Najpierw korzystamy z lokalnej wiedzy Koali.
    const localAnswer = answerQuestion(message, history);

    let finalAnswer =
      typeof localAnswer === "string"
        ? localAnswer
        : "Nie udało mi się przygotować odpowiedzi. Spróbuj ponownie.";

    // Dopiero gdy lokalna baza nie zna odpowiedzi,
    // próbujemy wyszukać informacje w internecie.
    if (isLocalUnknown(finalAnswer)) {
      const internetAnswer = await searchWikipedia(message);

      if (internetAnswer) {
        finalAnswer = internetAnswer;
      } else {
        finalAnswer +=
          "\n\n🐨 Nie udało mi się teraz znaleźć dodatkowych materiałów w internecie. Spróbuj ponownie później.";
      }
    }

    return jsonResponse({
      answer: finalAnswer
    });
  } catch (error) {
    console.error("Koala function error:", error);

    return jsonResponse(
      {
        answer: "🐨 Wystąpił błąd podczas przygotowywania odpowiedzi. Spróbuj ponownie."
      },
      500
    );
  }
}
