
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
  return String(text || "")
    .toLocaleLowerCase("pl-PL")
    .replace(/ł/g, "l")
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
// WYSZUKIWANIE W WIKIDANYCH
async function searchWikidata(question) {
  try {
    const params = new URLSearchParams({
      action: "wbsearchentities",
      search: question,
      language: "pl",
      uselang: "pl",
      type: "item",
      limit: "3",
      format: "json"
    });

    const response = await fetch(
      `https://www.wikidata.org/w/api.php?${params}`,
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "KoalaAI/1.0 (educational project)"
        }
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const results = data?.search || [];

    if (results.length === 0) return null;

    const entries = results.slice(0, 3).map(item => {
      return `**${item.label || "Brak nazwy"}**

${item.description || "Brak opisu"}

Źródło: https://www.wikidata.org/wiki/${item.id}`;
    });

    return `### Wikidane

${entries.join("\n\n")}`;
  } catch (error) {
    console.error("Wikidata search error:", error);
    return null;
  }
}


// WYSZUKIWANIE PUBLIKACJI NAUKOWYCH
async function searchCrossref(question) {
  try {
    const params = new URLSearchParams({
      "query.bibliographic": question,
      rows: "3",
      select: "DOI,title,author,published,container-title,URL"
    });

    const response = await fetch(
      `https://api.crossref.org/works?${params}`,
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "KoalaAI/1.0 (educational project)"
        }
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const results = data?.message?.items || [];

    if (results.length === 0) return null;

    const entries = results.slice(0, 3).map((item, index) => {
      const title = item.title?.[0] || "Publikacja bez tytułu";

      const authors = (item.author || [])
        .slice(0, 3)
        .map(author =>
          [author.given, author.family].filter(Boolean).join(" ")
        )
        .filter(Boolean)
        .join(", ");

      const dateParts =
        item.published?.["date-parts"]?.[0] || [];

      const year = dateParts[0] || "Brak daty";

      const journal =
        item["container-title"]?.[0] || "Nie podano czasopisma";

      const url =
        item.URL ||
        (item.DOI ? `https://doi.org/${item.DOI}` : null);

      return `${index + 1}. **${title}**

Autorzy: ${authors || "Nie podano"}

Rok: ${year}

Publikacja: ${journal}

${url ? `Źródło: ${url}` : "Brak linku do publikacji"}`;
    });

    return `### Publikacje naukowe — Crossref

${entries.join("\n\n")}`;
  } catch (error) {
    console.error("Crossref search error:", error);
    return null;
  }
}


// ŁĄCZY WYNIKI Z RÓŻNYCH ŹRÓDEŁ
async function searchAllSources(question) {
  const [wikipedia, wikidata, crossref] = await Promise.all([
    searchWikipedia(question),
    searchWikidata(question),
    searchCrossref(question)
  ]);

  const sections = [
    wikipedia,
    wikidata,
    crossref
  ].filter(Boolean);

  if (sections.length === 0) return null;

  return `🐨 Sprawdziłam kilka źródeł internetowych.

${sections.join("\n\n---\n\n")}

---

**Ważne:** znalezione materiały nie zawsze potwierdzają tę samą informację. Wikidane zawierają dane encyklopedyczne, a Crossref przede wszystkim metadane publikacji. Warto otworzyć źródła i sprawdzić ich treść.`;
}


// ROZPOZNAWANIE PROŚBY O WERYFIKACJĘ
function asksToVerifyOnline(message) {
  const text = normalizeSearchText(message);

  return /\b(sprawdz|zweryfikuj|potwierdz|skontroluj)\b/.test(text);
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
const shouldSearchOnline =
  isLocalUnknown(finalAnswer) ||
  asksToVerifyOnline(message);

if (shouldSearchOnline) {
  const internetAnswer = await searchAllSources(message);

  if (internetAnswer) {
    if (isLocalUnknown(finalAnswer)) {
      finalAnswer = internetAnswer;
    } else {
      finalAnswer += `

---

🐨 Sprawdziłam również informacje w internecie.

${internetAnswer}`;
    }
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
