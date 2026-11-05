import { answerQuestion } from "./koala-engine.mjs";

// ==========================================
// KOALA.AI — USTAWIENIA
// ==========================================

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_ITEMS = 24;

const CRAWLER_USER_AGENT = "KoalaAI-Crawler/1.0";
const CRAWLER_TIMEOUT = 1800;
const CRAWLER_MAX_PAGE_SIZE = 500000;
const CRAWLER_MAX_PAGES_PER_SITE = 2;
const CRAWLER_MAX_RESULTS = 5;
const CRAWLER_MAX_SOURCES = 3;

const CRAWLER_SOURCES = [
  {
    name: "FC Barcelona — oficjalna strona",
    url: "https://www.fcbarcelona.com/en/football/first-team/schedule",
    category: "sport",
    hints: ["schedule", "match", "fixture", "football"]
  },
  {
    name: "LaLiga — FC Barcelona",
    url: "https://www.laliga.com/en-GB/clubs/fc-barcelona",
    category: "sport",
    hints: ["match", "schedule", "fixture", "barcelona"]
  },
  {
    name: "UEFA",
    url: "https://www.uefa.com/",
    category: "sport",
    hints: ["match", "schedule", "fixture", "barcelona"]
  },
  {
    name: "Wikipedia Polska",
    url: "https://pl.wikipedia.org/wiki/Strona_g%C5%82%C3%B3wna",
    category: "general",
    hints: ["encyklopedia", "informacje"]
  },
  {
    name: "NASA",
    url: "https://www.nasa.gov/",
    category: "science",
    hints: ["science", "research", "space"]
  },
  {
    name: "Gov.pl",
    url: "https://www.gov.pl/",
    category: "poland",
    hints: ["polska", "ministerstwo", "informacje"]
  }
];

// ==========================================
// PODSTAWOWE FUNKCJE
// ==========================================

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function normalizeSearchText(text) {
  return String(text || "")
    .toLocaleLowerCase("pl-PL")
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isLocalUnknown(answer) {
  if (typeof answer !== "string") return false;

  return normalizeSearchText(answer).includes(
    "nie znalazlam jeszcze tego zagadnienia w mojej lokalnej bazie wiedzy"
  );
}

function asksToVerifyOnline(message) {
  const text = normalizeSearchText(message);

  return /\b(sprawdz|zweryfikuj|potwierdz|skontroluj|w internecie|online)\b/
    .test(text);
}

function asksForCurrentInformation(message) {
  const text = normalizeSearchText(message);

  if (
    /\b(aktualnie|obecnie|dzisiaj|jutro|wczoraj|najnowszy|najnowsza|najnowsze|na zywo|najblizszy|najblizsza|najblizsze)\b/
      .test(text)
  ) {
    return true;
  }

  return /\b(mecz|spotkanie|terminarz|wynik meczu|pogoda|kurs walut)\b/
    .test(text);
}

function shouldSearchOnline(message, answer) {
  return (
    isLocalUnknown(answer) ||
    asksToVerifyOnline(message) ||
    asksForCurrentInformation(message)
  );
}

// ==========================================
// BEZPIECZNE POBIERANIE STRON
// ==========================================

async function requestSiteText(
  url,
  expectedHost,
  accept = "text/html,application/xhtml+xml",
  maxSize = CRAWLER_MAX_PAGE_SIZE
) {
  try {
    let target = new URL(url);

    if (
      !["http:", "https:"].includes(target.protocol) ||
      target.hostname !== expectedHost ||
      target.username ||
      target.password
    ) {
      return null;
    }

    let response = null;

    for (let attempt = 0; attempt < 2; attempt++) {
      const controller = new AbortController();

      const timer = setTimeout(
        () => controller.abort(),
        CRAWLER_TIMEOUT
      );

      try {
        response = await fetch(target.href, {
          method: "GET",
          redirect: "manual",
          headers: {
            "User-Agent": CRAWLER_USER_AGENT,
            "Accept": accept
          },
          signal: controller.signal
        });
      } finally {
        clearTimeout(timer);
      }

      if (
        response.status >= 300 &&
        response.status < 400
      ) {
        const location = response.headers.get("location");

        if (!location || attempt === 1) return null;

        const redirected = new URL(location, target);

        if (
          redirected.hostname !== expectedHost ||
          !["http:", "https:"].includes(redirected.protocol)
        ) {
          return null;
        }

        target = redirected;
        continue;
      }

      break;
    }

    if (!response) return null;

    if ([404, 410].includes(response.status)) {
      return {
        status: response.status,
        text: "",
        url: target.href
      };
    }

    if (!response.ok) return null;

    const contentLength = Number(
      response.headers.get("content-length") || 0
    );

    if (contentLength > maxSize) return null;

    const contentType =
      response.headers.get("content-type") || "";

    if (
      !accept.includes("*/*") &&
      !accept.split(",").some(type =>
        contentType.toLowerCase().includes(
          type.trim().split(";")[0].toLowerCase()
        )
      )
    ) {
      return null;
    }

    const text = await response.text();

    if (
      new TextEncoder().encode(text).length > maxSize
    ) {
      return null;
    }

    return {
      status: response.status,
      text,
      url: target.href,
      contentType
    };
  } catch (error) {
    console.error("Koala fetch error:", error);
    return null;
  }
}

// ==========================================
// ROBOTS.TXT — ZASADY DOSTĘPU ROBOTA
// ==========================================

function parseRobotsFile(text) {
  const groups = [];
  const sitemaps = [];

  let agents = [];
  let rules = [];
  let hasRules = false;

  function saveGroup() {
    if (agents.length > 0) {
      groups.push({
        agents: [...agents],
        rules: [...rules]
      });
    }
  }

  for (const rawLine of String(text || "").split(/\r?\n/)) {
    const line = rawLine.split("#")[0].trim();

    if (!line) continue;

    const sitemapMatch = line.match(
      /^sitemap\s*:\s*(.+)$/i
    );

    if (sitemapMatch) {
      sitemaps.push(sitemapMatch[1].trim());
      continue;
    }

    const agentMatch = line.match(
      /^user-agent\s*:\s*(.+)$/i
    );

    if (agentMatch) {
      if (hasRules) {
        saveGroup();
        agents = [];
        rules = [];
        hasRules = false;
      }

      agents.push(agentMatch[1].trim().toLowerCase());
      continue;
    }

    const ruleMatch = line.match(
      /^(allow|disallow)\s*:\s*(.*)$/i
    );

    if (ruleMatch && agents.length > 0) {
      const path = ruleMatch[2].trim();

      if (path) {
        rules.push({
          allow: ruleMatch[1].toLowerCase() === "allow",
          path
        });

        hasRules = true;
      }
    }
  }

  saveGroup();

  return { groups, sitemaps };
}

function getApplicableRobotsRules(robots) {
  const agent = CRAWLER_USER_AGENT.toLowerCase();

  const specificGroups = robots.groups.filter(group =>
    group.agents.some(
      name => name !== "*" && agent.includes(name)
    )
  );

  const wildcardGroups = robots.groups.filter(group =>
    group.agents.includes("*")
  );

  const selected =
    specificGroups.length > 0
      ? specificGroups
      : wildcardGroups;

  return selected.flatMap(group => group.rules);
}

function robotsPatternMatches(path, pattern) {
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*");

  const expression = pattern.endsWith("$")
    ? new RegExp("^" + escaped)
    : new RegExp("^" + escaped);

  return expression.test(path);
}

function crawlerCanVisit(url, robots) {
  if (!robots) return false;

  try {
    const parsed = new URL(url);
    const path = parsed.pathname + parsed.search;

    const rules = getApplicableRobotsRules(robots)
      .filter(rule =>
        robotsPatternMatches(path, rule.path.replace(/\$$/, ""))
      )
      .sort((a, b) => {
        if (b.path.length !== a.path.length) {
          return b.path.length - a.path.length;
        }

        if (a.allow !== b.allow) {
          return a.allow ? -1 : 1;
        }

        return 0;
      });

    if (rules.length === 0) return true;

    return rules[0].allow;
  } catch {
    return false;
  }
}

async function getCrawlerRobots(origin, host) {
  const result = await requestSiteText(
    `${origin}/robots.txt`,
    host,
    "text/plain",
    100000
  );

  if (!result) return null;

  if ([404, 410].includes(result.status)) {
    return {
      groups: [],
      sitemaps: []
    };
  }

  return parseRobotsFile(result.text);
}

// ==========================================
// MAPY WITRYN
// ==========================================

function extractSitemapUrls(xml, host) {
  const urls = [];
  const regex = /<loc>\s*([\s\S]*?)\s*<\/loc>/gi;

  let match;

  while ((match = regex.exec(xml)) !== null) {
    const raw = match[1]
      .replace(/&amp;/g, "&")
      .trim();

    try {
      const url = new URL(raw);

      if (
        url.hostname === host &&
        ["http:", "https:"].includes(url.protocol)
      ) {
        url.hash = "";
        urls.push(url.href);
      }
    } catch {
      // Pomijamy nieprawidłowy adres.
    }

    if (urls.length >= 1000) break;
  }

  return [...new Set(urls)];
}

async function getSitemapPages(origin, host, robots, terms) {
  const sitemapAddresses = [
    ...robots.sitemaps,
    `${origin}/sitemap.xml`
  ];

  const pages = [];

  for (const sitemapAddress of sitemapAddresses.slice(0, 2)) {
    let sitemapUrl;

    try {
      sitemapUrl = new URL(sitemapAddress);

      if (sitemapUrl.hostname !== host) continue;
    } catch {
      continue;
    }

    if (!crawlerCanVisit(sitemapUrl.href, robots)) continue;

    const response = await requestSiteText(
      sitemapUrl.href,
      host,
      "application/xml,text/xml,application/gzip",
      300000
    );

    if (!response) continue;

    let urls = extractSitemapUrls(response.text, host);

    if (
      /<sitemapindex\b/i.test(response.text) &&
      urls.length > 0
    ) {
      const nested = urls
        .filter(url => /\.xml(?:\?|$)/i.test(url))
        .slice(0, 1);

      for (const nestedUrl of nested) {
        if (!crawlerCanVisit(nestedUrl, robots)) continue;

        const nestedResponse = await requestSiteText(
          nestedUrl,
          host,
          "application/xml,text/xml",
          300000
        );

        if (nestedResponse) {
          urls = extractSitemapUrls(
            nestedResponse.text,
            host
          );
        }
      }
    }

    pages.push(...urls);
  }

  return [...new Set(pages)]
    .map(url => ({
      url,
      score: scoreCrawlerText(url, terms)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 30)
    .map(item => item.url);
}

// ==========================================
// ANALIZA TREŚCI HTML
// ==========================================

function decodeCrawlerEntities(text) {
  return String(text || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, number) => {
      const value = Number(number);

      return Number.isSafeInteger(value) &&
        value >= 0 &&
        value <= 1114111
        ? String.fromCodePoint(value)
        : "";
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, number) => {
      const value = parseInt(number, 16);

      return Number.isSafeInteger(value) &&
        value >= 0 &&
        value <= 1114111
        ? String.fromCodePoint(value)
        : "";
    });
}

function cleanCrawlerHtml(html) {
  return decodeCrawlerEntities(
    String(html || "")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
      .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, " ")
      .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, " ")
      .replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function getMetaContent(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regex = new RegExp(
    `<meta[^>]+(?:name|property)=["']${escaped}["'][^>]+content=["']([^"']*)["']|<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${escaped}["']`,
    "i"
  );

  const match = html.match(regex);

  return match
    ? decodeCrawlerEntities(match[1] || match[2] || "")
    : "";
}

function extractCrawlerLinks(html, pageUrl, host) {
  const links = [];
  const regex = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;

  let match;

  while ((match = regex.exec(html)) !== null) {
    const hrefMatch = match[1].match(
      /href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i
    );

    if (!hrefMatch) continue;

    const rawUrl =
      hrefMatch[1] || hrefMatch[2] || hrefMatch[3];

    try {
      const url = new URL(rawUrl, pageUrl);

      if (
        url.hostname !== host ||
        !["http:", "https:"].includes(url.protocol) ||
        url.username ||
        url.password
      ) {
        continue;
      }

      if (
        /\.(pdf|jpg|jpeg|png|gif|svg|zip|mp4|mp3|css|js|woff2?)(?:$|\?)/i
          .test(url.href)
      ) {
        continue;
      }

      url.hash = "";

      links.push({
        url: url.href,
        label: cleanCrawlerHtml(match[2])
      });
    } catch {
      // Pomijamy nieprawidłowy link.
    }

    if (links.length >= 150) break;
  }

  return links;
}

function extractCrawlerPage(html, pageUrl, host) {
  const titleMatch = html.match(
    /<title[^>]*>([\s\S]*?)<\/title>/i
  );

  const title = titleMatch
    ? cleanCrawlerHtml(titleMatch[1])
    : "Strona internetowa";

  const description =
    getMetaContent(html, "description") ||
    getMetaContent(html, "og:description");

  const date =
    getMetaContent(html, "article:published_time") ||
    getMetaContent(html, "datePublished") ||
    getMetaContent(html, "date");

  const mainMatch = html.match(
    /<main\b[^>]*>([\s\S]*?)<\/main>/i
  );

  const content = mainMatch
    ? mainMatch[1]
    : html;

  const paragraphMatches =
    content.match(/<(?:p|h1|h2|h3|li)\b[^>]*>[\s\S]*?<\/(?:p|h1|h2|h3|li)>/gi) || [];

  const paragraphs = paragraphMatches
    .map(cleanCrawlerHtml)
    .filter(text => text.length > 35)
    .slice(0, 100);

  const text = cleanCrawlerHtml(content).slice(0, 12000);

  return {
    title,
    description,
    date,
    text,
    paragraphs,
    links: extractCrawlerLinks(html, pageUrl, host)
  };
}

// ==========================================
// DOBIERANIE TEMATU
// ==========================================

function getCrawlerTerms(question) {
  const normalized = normalizeSearchText(question);

  const stopWords = new Set([
    "czy", "jak", "jaki", "jaka", "jakie",
    "jest", "sa", "sie", "oraz", "dla",
    "przez", "podaj", "prosze", "chce",
    "sprawdz", "zweryfikuj", "potwierdz",
    "internet", "internecie", "online",
    "informacje", "informacja", "kiedy",
    "gdzie", "dlaczego", "czemu",
    "najblizszy", "najblizsza", "najblizsze",
    "teraz", "dzisiaj", "jutro", "wczoraj",
    "mecz", "mecze", "spotkanie", "spotkania",
    "aktualnie", "obecnie", "najnowszy"
  ]);

  const terms = normalized
    .split(" ")
    .filter(term =>
      term.length >= 3 && !stopWords.has(term)
    );

  if (/\b(barcelona|barcelony|barca)\b/.test(normalized)) {
    terms.push("barcelona", "barca");
  }

  if (/\b(mecz|mecze|spotkanie|terminarz|pilka|pilkarski)\b/.test(normalized)) {
    terms.push(
      "match",
      "matches",
      "fixture",
      "fixtures",
      "schedule",
      "calendar"
    );
  }

  if (/\b(nauka|naukowy|badania|kosmos|astronomia)\b/.test(normalized)) {
    terms.push("science", "research", "study", "space");
  }

  return [...new Set(terms)].slice(0, 18);
}

function selectCrawlerSources(question) {
  const text = normalizeSearchText(question);

  const sportsQuestion =
    /\b(mecz|mecze|barcelona|barcelony|barca|liga|pilka|pilkarski|terminarz|uefa)\b/
      .test(text);

  const scienceQuestion =
    /\b(nauka|naukowy|kosmos|astronomia|biologia|fizyka|chemia|planeta|planety)\b/
      .test(text);

  const polandQuestion =
    /\b(polska|polski|polskie|urzad|prawo|przepisy|ministerstwo)\b/
      .test(text);

  let selected;

  if (sportsQuestion) {
    selected = CRAWLER_SOURCES.filter(
      source => source.category === "sport"
    );
  } else if (scienceQuestion) {
    selected = CRAWLER_SOURCES.filter(
      source =>
        source.category === "science" ||
        source.category === "general"
    );
  } else if (polandQuestion) {
    selected = CRAWLER_SOURCES.filter(
      source =>
        source.category === "poland" ||
        source.category === "general"
    );
  } else {
    selected = CRAWLER_SOURCES.filter(
      source => source.category === "general"
    );
  }

  return selected.slice(0, CRAWLER_MAX_SOURCES);
}

// ==========================================
// OCENIANIE ZNALEZIONYCH STRON
// ==========================================

function scoreCrawlerText(text, terms) {
  const normalized = normalizeSearchText(text);

  let score = 0;

  for (const term of terms) {
    if (normalized.includes(term)) {
      score++;
    }
  }

  return score;
}

function getCrawlerSnippet(page, terms) {
  const ranked = page.paragraphs
    .map(paragraph => ({
      text: paragraph,
      score: scoreCrawlerText(paragraph, terms)
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length > 0) {
    return ranked
      .slice(0, 4)
      .map(item => item.text)
      .join("\n\n")
      .slice(0, 1800);
  }

  return (
    page.description ||
    page.text.slice(0, 1000)
  );
}

// ==========================================
// WŁASNY CRAWLER WITRYN
// ==========================================

async function crawlPublicSite(source, question, terms) {
  const results = [];
  const visited = new Set();

  try {
    const seed = new URL(source.url);
    const host = seed.hostname;

    const robots = await getCrawlerRobots(
      seed.origin,
      host
    );

    if (!robots) return [];

    const sitemapPages = await getSitemapPages(
      seed.origin,
      host,
      robots,
      [...terms, ...(source.hints || [])]
    );

    const initialUrls = [
      seed.href,
      ...sitemapPages
    ];

    const queue = [...new Set(initialUrls)]
      .slice(0, 20);

    while (
      queue.length > 0 &&
      visited.size < CRAWLER_MAX_PAGES_PER_SITE
    ) {
      const url = queue.shift();

      if (!url || visited.has(url)) continue;

      if (!crawlerCanVisit(url, robots)) continue;

      visited.add(url);

      const response = await requestSiteText(
        url,
        host,
        "text/html,application/xhtml+xml",
        CRAWLER_MAX_PAGE_SIZE
      );

      if (!response || !response.text) continue;

      const page = extractCrawlerPage(
        response.text,
        response.url,
        host
      );

      if (
        page.text.length < 80 &&
        page.description.length < 30
      ) {
        continue;
      }

      const pageScore =
        scoreCrawlerText(
          `${page.title} ${page.description} ${url}`,
          terms
        ) * 3 +
        scoreCrawlerText(page.text, terms);

      if (pageScore > 0) {
        results.push({
          source: source.name,
          title: page.title,
          url: response.url,
          description: page.description,
          date: page.date,
          text: getCrawlerSnippet(page, terms),
          score: pageScore
        });
      }

      const candidates = page.links
        .map(link => ({
          ...link,
          score:
            scoreCrawlerText(
              `${link.label} ${link.url}`,
              [...terms, ...(source.hints || [])]
            )
        }))
        .filter(link => link.score > 0)
        .sort((a, b) => b.score - a.score);

      for (const link of candidates.slice(0, 8)) {
        if (
          !visited.has(link.url) &&
          !queue.includes(link.url) &&
          queue.length < 20
        ) {
          queue.push(link.url);
        }
      }
    }
  } catch (error) {
    console.error(
      `Koala crawler error: ${source.name}`,
      error
    );
  }

  return results;
}

// ==========================================
// GŁÓWNE WYSZUKIWANIE INTERNETOWE KOALI
// ==========================================

async function searchAllSources(question) {
  const terms = getCrawlerTerms(question);

  if (terms.length === 0) return null;

  const sources = selectCrawlerSources(question);

  const resultsBySite = await Promise.all(
    sources.map(source =>
      crawlPublicSite(source, question, terms)
    )
  );

  const allResults = resultsBySite.flat();

  const uniqueResults = [];
  const seenUrls = new Set();

  for (const result of allResults) {
    if (seenUrls.has(result.url)) continue;

    seenUrls.add(result.url);
    uniqueResults.push(result);
  }

  const results = uniqueResults
    .sort((a, b) => b.score - a.score)
    .slice(0, CRAWLER_MAX_RESULTS);

  if (results.length === 0) return null;

  const sections = results.map((result, index) => {
    return `${index + 1}. **${result.title}**

Witryna: ${result.source}

${result.date ? `Data: ${result.date}` : ""}

${result.text}

Źródło: ${result.url}`;
  });

  return `🐨 KOALA WEB CRAWLER

Znalazłam publiczne strony pasujące do Twojego pytania.

${sections.join("\n\n---\n\n")}

---

**Ważne:** Koala pobrała fragmenty stron i oceniła ich podobieństwo do pytania. Nie oznacza to, że wszystkie informacje zostały niezależnie potwierdzone. Sprawdź linki i daty publikacji.`;
}

// ==========================================
// GŁÓWNA FUNKCJA NETLIFY
// ==========================================

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

  if (
    typeof body.image === "string" &&
    body.image.length > 0
  ) {
    return jsonResponse({
      answer: "🐨 W tej wersji nie potrafię jeszcze odczytywać obrazów. Wklej treść zadania jako tekst, a spróbuję Ci pomóc."
    });
  }

  const history = Array.isArray(body.history)
    ? body.history
        .filter(item =>
          item &&
          typeof item === "object" &&
          ["user", "model"].includes(item.role) &&
          typeof item.text === "string"
        )
        .map(item => ({
          role: item.role,
          text: item.text.slice(0, MAX_MESSAGE_LENGTH)
        }))
        .slice(-MAX_HISTORY_ITEMS)
    : [];

  try {
    const localAnswer = answerQuestion(
      message,
      history
    );

    let finalAnswer =
      typeof localAnswer === "string"
        ? localAnswer
        : "Nie udało mi się przygotować odpowiedzi. Spróbuj ponownie.";

    const localUnknown = isLocalUnknown(finalAnswer);

    const onlineSearch = shouldSearchOnline(
      message,
      finalAnswer
    );

    if (onlineSearch) {
      const internetAnswer = await searchAllSources(message);

      if (internetAnswer) {
        if (localUnknown || asksForCurrentInformation(message)) {
          finalAnswer = internetAnswer;
        } else {
          finalAnswer += `

---

🐨 Sprawdziłam również publiczne strony internetowe.

${internetAnswer}`;
        }
      } else if (localUnknown || asksForCurrentInformation(message)) {
        finalAnswer = `🐨 Nie udało mi się znaleźć dostępnych materiałów pasujących do tego pytania.

Nie chcę wymyślać odpowiedzi.

Możliwe przyczyny:
• witryna nie pozwala robotom pobierać treści;
• strona ładuje informacje dynamicznie;
• mapa witryny nie zawiera szukanej strony;
• nie znalazłam pasujących stron w katalogu Koali.

Spróbuj podać bardziej szczegółowe pytanie lub wkleić link do strony.`;
      } else {
        finalAnswer +=
          "\n\n🐨 Nie udało mi się znaleźć dodatkowych materiałów w dostępnych witrynach.";
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
