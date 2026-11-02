/*
 * Koala.ai — lokalny silnik edukacyjny
 * Nie korzysta z zewnętrznych modeli AI ani kluczy API.
 * Odpowiada na podstawie reguł, kalkulatora i wbudowanej bazy wiedzy.
 * To nie jest model językowy ogólnego przeznaczenia.
 */

const knowledge = [
  {
    title: "Rzeczownik",
    keywords: ["rzeczownik", "co to jest rzeczownik"],
    short: "Rzeczownik nazywa osoby, zwierzęta, rzeczy, miejsca, zjawiska i pojęcia.",
    explanation: "Odpowiada na pytania: kto? co? Odmienia się przez przypadki i liczby. Występuje w rodzaju męskim, żeńskim lub nijakim.",
    example: "W zdaniu „Pies biega” wyraz „pies” jest rzeczownikiem. Inne przykłady: uczeń, książka, szkoła, radość.",
    related: "Rzeczownik często występuje z przymiotnikiem, który opisuje jego cechy.",
    check: "W zdaniu „Zielony kot śpi” wskaż rzeczownik."
  },
  {
    title: "Czasownik",
    keywords: ["czasownik", "co to jest czasownik"],
    short: "Czasownik oznacza czynność, stan lub proces.",
    explanation: "Odpowiada na pytania: co robi? co się z nim dzieje? Czasowniki występują w czasie przeszłym, teraźniejszym i przyszłym oraz odmieniają się przez osoby i liczby.",
    example: "W zdaniu „Ola czyta książkę” wyraz „czyta” jest czasownikiem. Inne przykłady: pisze, biega, śpi.",
    related: "Czasownik jest ważnym elementem orzeczenia w zdaniu.",
    check: "Znajdź czasownik w zdaniu: „Dzieci grają w piłkę”."
  },
  {
    title: "Przymiotnik",
    keywords: ["przymiotnik", "co to jest przymiotnik"],
    short: "Przymiotnik określa cechy osób, rzeczy i zjawisk.",
    explanation: "Odpowiada na pytania: jaki? jaka? jakie? Dopasowuje się do rzeczownika pod względem rodzaju, liczby i przypadku.",
    example: "W wyrażeniu „zielona trawa” wyraz „zielona” jest przymiotnikiem. Inne przykłady: wysoki budynek, ciekawe książki.",
    related: "Przymiotnik najczęściej opisuje rzeczownik.",
    check: "Który wyraz jest przymiotnikiem: „mały pies szybko biegnie”?"
  },
  {
    title: "Przysłówek",
    keywords: ["przysłówek", "przyslowek", "co to jest przysłówek"],
    short: "Przysłówek określa sposób, miejsce, czas lub stopień wykonywania czynności.",
    explanation: "Odpowiada między innymi na pytania: jak? gdzie? kiedy? Często określa czasownik.",
    example: "W zdaniu „Ola biegnie szybko” wyraz „szybko” jest przysłówkiem. Inne przykłady: daleko, wczoraj, bardzo.",
    related: "Od wielu przymiotników można utworzyć przysłówki, np. szybki — szybko.",
    check: "Jakim pytaniem rozpoznasz przysłówek „wczoraj”?"
  },
  {
    title: "Liczby pierwsze",
    keywords: ["liczba pierwsza", "liczby pierwsze"],
    short: "Liczba pierwsza to liczba naturalna większa od 1, która ma dokładnie dwa dzielniki: 1 i samą siebie.",
    explanation: "Aby sprawdzić, czy liczba jest pierwsza, szukamy dzielników innych niż 1 i ona sama. Jeśli żadnego nie ma, liczba jest pierwsza.",
    example: "2, 3, 5, 7, 11 i 13 są pierwsze. 9 nie jest pierwsza, bo dzieli się przez 3.",
    related: "Liczba 2 jest jedyną parzystą liczbą pierwszą. Liczba 1 nie jest pierwsza.",
    check: "Czy 15 jest liczbą pierwszą? Spróbuj znaleźć jej dzielnik oprócz 1 i 15."
  },
  {
    title: "Ułamki zwykłe",
    keywords: ["ułamek zwykły", "ulamek zwykly", "ułamek", "ulamek", "ułamki", "ulamki"],
    short: "Ułamek zwykły przedstawia część całości. Składa się z licznika i mianownika.",
    explanation: "Mianownik jest pod kreską i mówi, na ile równych części podzielono całość. Licznik jest nad kreską i mówi, ile części wybrano.",
    example: "W ułamku 3/4 mianownik 4 oznacza cztery równe części, a licznik 3 oznacza trzy wybrane części.",
    related: "Ułamki można skracać, rozszerzać, dodawać, odejmować, mnożyć i dzielić.",
    check: "W ułamku 2/5 wskaż licznik i mianownik."
  },
  {
    title: "Procenty",
    keywords: ["procent", "procenty", "co to jest procent"],
    short: "Procent oznacza jedną setną całości. Zapisujemy go symbolem %.",
    explanation: "100% to całość, 50% to połowa, 25% to jedna czwarta, a 10% to jedna dziesiąta. Procent zamieniamy na ułamek dziesiętny, dzieląc przez 100.",
    example: "20% z 50 to 10, ponieważ 20/100 × 50 = 10.",
    related: "Procenty wykorzystujemy m.in. przy obniżkach, podwyżkach, wynikach i statystykach.",
    check: "Ile wynosi 10% z 80?"
  },
  {
    title: "Pole kwadratu",
    keywords: ["pole kwadratu", "jak obliczyć pole kwadratu", "jak obliczyc pole kwadratu"],
    short: "Pole kwadratu obliczamy ze wzoru P = a × a, czyli P = a².",
    explanation: "Litera a oznacza długość boku. Pole opisuje powierzchnię figury, dlatego wynik zapisujemy w jednostkach kwadratowych, np. cm².",
    example: "Jeśli bok ma 4 cm, to P = 4 × 4 = 16 cm².",
    related: "Obwód kwadratu obliczamy ze wzoru O = 4 × a.",
    check: "Kwadrat ma bok 5 cm. Jaki jest jego wzór na pole i wynik?"
  },
  {
    title: "Pole prostokąta",
    keywords: ["pole prostokąta", "pole prostokata", "prostokąt", "prostokat"],
    short: "Pole prostokąta obliczamy ze wzoru P = a × b.",
    explanation: "Mnożymy długość jednego boku przez długość drugiego boku. Wynik zapisujemy w jednostkach kwadratowych.",
    example: "Dla boków 6 cm i 3 cm: P = 6 × 3 = 18 cm².",
    related: "Obwód prostokąta to O = 2a + 2b.",
    check: "Prostokąt ma boki 7 cm i 2 cm. Jak obliczysz jego pole?"
  },
  {
    title: "Fotosynteza",
    keywords: ["fotosynteza", "co to jest fotosynteza"],
    short: "Fotosynteza to proces, w którym rośliny wykorzystują energię światła do wytwarzania substancji organicznych.",
    explanation: "Rośliny pobierają wodę i dwutlenek węgla. Dzięki energii światła i chlorofilowi wytwarzają związki organiczne, między innymi glukozę. W procesie uwalnia się tlen.",
    example: "Liście pobierają światło słoneczne, a roślina wykorzystuje jego energię podczas fotosyntezy.",
    related: "Fotosynteza dostarcza materii organicznej i uwalnia tlen, dlatego ma duże znaczenie dla życia na Ziemi.",
    check: "Jakie dwa surowce roślina pobiera do fotosyntezy?"
  },
  {
    title: "Komórka",
    keywords: ["komórka biologiczna", "komorka biologiczna", "komórka", "komorka"],
    short: "Komórka jest podstawową jednostką budowy i funkcjonowania organizmów.",
    explanation: "Wiele komórek zawiera błonę komórkową, cytoplazmę i materiał genetyczny. Komórki roślinne mają dodatkowo m.in. ścianę komórkową i chloroplasty.",
    example: "Komórki mięśniowe umożliwiają ruch, a komórki nerwowe uczestniczą w przekazywaniu informacji.",
    related: "Wiele komórek może tworzyć tkanki, narządy i układy narządów.",
    check: "Wymień jedną strukturę charakterystyczną dla komórki roślinnej."
  },
  {
    title: "Układ Słoneczny",
    keywords: ["układ słoneczny", "uklad sloneczny", "planety układu słonecznego", "planety ukladu slonecznego"],
    short: "Układ Słoneczny składa się ze Słońca oraz krążących wokół niego planet i innych ciał niebieskich.",
    explanation: "Grawitacja Słońca utrzymuje planety na orbitach. W Układzie Słonecznym są też księżyce, planety karłowate, asteroidy i komety.",
    example: "Osiem planet to: Merkury, Wenus, Ziemia, Mars, Jowisz, Saturn, Uran i Neptun.",
    related: "Ziemia jest trzecią planetą od Słońca.",
    check: "Która planeta znajduje się najbliżej Słońca?"
  },
  {
    title: "Grawitacja",
    keywords: ["grawitacja", "co to jest grawitacja"],
    short: "Grawitacja to oddziaływanie, dzięki któremu obiekty posiadające masę przyciągają się.",
    explanation: "Siła przyciągania zależy między innymi od mas obiektów i odległości między nimi. Grawitacja Ziemi utrzymuje nas na jej powierzchni.",
    example: "Gdy puścisz piłkę, spada ona w kierunku podłoża wskutek przyciągania grawitacyjnego Ziemi.",
    related: "Grawitacja wpływa także na ruch Księżyca wokół Ziemi i planet wokół Słońca.",
    check: "Dlaczego piłka puszczona z ręki spada na ziemię?"
  },
  {
    title: "Pan Tadeusz",
    keywords: ["pan tadeusz", "autor pana tadeusza", "kto napisał pana tadeusza", "kto napisal pana tadeusza"],
    short: "Autorem epopei „Pan Tadeusz” jest Adam Mickiewicz.",
    explanation: "Utwór został wydany w 1834 roku. Jego pełny tytuł brzmi „Pan Tadeusz, czyli Ostatni zajazd na Litwie”.",
    example: "Akcja utworu rozgrywa się na Litwie, a ważne tematy to życie szlachty i tęsknota za ojczyzną.",
    related: "Adam Mickiewicz jest jednym z najważniejszych polskich poetów romantycznych.",
    check: "Kto jest autorem „Pana Tadeusza”?"
  },
  {
    title: "Atom",
    keywords: ["atom", "co to jest atom", "budowa atomu"],
    short: "Atom to podstawowa jednostka budowy pierwiastka chemicznego.",
    explanation: "Atom składa się z jądra, w którym znajdują się protony i neutrony, oraz elektronów znajdujących się wokół jądra.",
    example: "Atom wodoru ma jeden proton w jądrze i zwykle jeden elektron.",
    related: "Liczba protonów określa, jaki to pierwiastek chemiczny.",
    check: "Jak nazywają się cząstki znajdujące się w jądrze atomu?"
  },
  {
    title: "Energia",
    keywords: ["energia", "co to jest energia", "energia kinetyczna", "energia potencjalna"],
    short: "Energia opisuje zdolność układu do wykonania pracy lub wywołania zmian.",
    explanation: "Wyróżnia się między innymi energię kinetyczną, potencjalną, cieplną, chemiczną i elektryczną. Energia może zmieniać formę.",
    example: "Poruszający się rower ma energię kinetyczną, a podniesiony przedmiot — energię potencjalną grawitacji.",
    related: "Zgodnie z zasadą zachowania energii nie znika ona, lecz ulega przemianom.",
    check: "Jaką energię ma poruszający się rower?"
  },
  {
    title: "Demokracja",
    keywords: ["demokracja", "co to jest demokracja"],
    short: "Demokracja to forma rządów, w której obywatele mają udział w podejmowaniu decyzji publicznych.",
    explanation: "Obywatele mogą uczestniczyć w życiu politycznym m.in. poprzez wybory. Ważne są też prawa obywatelskie, pluralizm i praworządność.",
    example: "Wybory parlamentarne są jednym ze sposobów udziału obywateli w demokracji.",
    related: "Demokracja może mieć różne formy i rozwiązania instytucjonalne.",
    check: "W jaki sposób obywatele mogą uczestniczyć w demokracji?"
  }
];

const MAX_QUESTION_LENGTH = 2000;
const MAX_HISTORY_ITEMS = 24;

export function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,!?;:()[\]{}"'„”]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsPhrase(text, phrase) {
  return (` ${text} `).includes(` ${normalize(phrase)} `);
}

function findKnowledge(question) {
  const text = normalize(question);
  let best = null;
  let bestScore = 0;

  for (const item of knowledge) {
    for (const keyword of item.keywords) {
      const normalizedKeyword = normalize(keyword);
      if (containsPhrase(text, normalizedKeyword) && normalizedKeyword.length > bestScore) {
        best = item;
        bestScore = normalizedKeyword.length;
      }
    }
  }
  return best;
}

function getIntent(question) {
  const text = normalize(question);
  if (/\b(notatk\w*|podsumuj\w*|podsumowani\w*|skroc\w*|najwazniejsz\w*)\b/.test(text)) return "summary";
  if (/\b(przyklad\w*|podaj przyklad|daj przyklad)\b/.test(text)) return "example";
  if (/\b(prosciej|latwiej|nie rozumiem|wytlumacz\w*|wyjasn\w*|po ludzku)\b/.test(text)) return "simple";
  if (/\b(dlaczego|czemu|z jakiego powodu)\b/.test(text)) return "why";
  if (/\b(rozwin\w*|rozszerz\w*|dokladniej|wiecej|opowiedz wiecej|szerzej)\b/.test(text)) return "expand";
  return "normal";
}

function isFollowUp(question) {
  const text = normalize(question);
  return /^(a\s+)?(mozesz\s+mi\s+to\s+)?(wyjasn\w*|wytlumacz\w*|dlaczego|czemu|jak to|rozwin\w*|rozszerz\w*|dokladniej|wiecej|przyklad|podaj przyklad|daj przyklad|prosciej|latwiej|nie rozumiem)( .*)?$/.test(text)
    || /\b(notatk\w*|podsumuj\w*|podsumowani\w*)\b/.test(text);
}

function isTopicChange(question) {
  const text = normalize(question);
  return /\b(zmienmy temat|zmien temat|zmieniamy temat|przejdzmy do|teraz matm\w*|teraz matematy\w*)\b/.test(text);
}

function formatNumber(value) {
  return new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 8 }).format(value);
}

function formatKnowledge(item, intent = "normal") {
  if (!item) return null;

  let response;
  if (intent === "example") {
    response = `🐨 Przykład — ${item.title}\n\n${item.example}`;
  } else if (intent === "simple") {
    response = `🐨 Wyjaśnię prościej — ${item.title}\n\n${item.short}\n\nPomyśl o tym tak: ${item.example}`;
  } else if (intent === "summary") {
    response = `📝 Notatka — ${item.title}\n\n• ${item.short}\n• ${item.explanation}\n• Przykład: ${item.example}`;
  } else if (intent === "why") {
    response = `🐨 Dlaczego to ważne?\n\n${item.related}\n\n${item.explanation}`;
  } else if (intent === "expand") {
    response = `📚 Rozwinięcie tematu: ${item.title}\n\n1. Podstawowa definicja\n${item.short}\n\n2. Dokładniejsze wyjaśnienie\n${item.explanation}\n\n3. Przykład\n${item.example}\n\n4. Co jeszcze warto wiedzieć?\n${item.related}`;
  } else {
    response = `🐨 ${item.title}\n\n${item.short}\n\nWyjaśnienie:\n${item.explanation}\n\nPrzykład:\n${item.example}`;
  }

  return `${response}\n\n🎓 Sprawdź, czy rozumiesz: ${item.check}`;
}

function getPreviousUserQuestion(history) {
  if (!Array.isArray(history)) return null;
  for (let i = history.length - 1; i >= 0; i--) {
    const item = history[i];
    if (item?.role === "user" && typeof item.text === "string") return item.text;
  }
  return null;
}

function getPreviousAnswer(history) {
  if (!Array.isArray(history)) return "";
  for (let i = history.length - 1; i >= 0; i--) {
    const item = history[i];
    if (item?.role === "model" && typeof item.text === "string") return item.text;
  }
  return "";
}

function getPreviousTopic(history) {
  if (!Array.isArray(history)) return null;
  for (let i = history.length - 1; i >= 0; i--) {
    const item = history[i];
    if (item?.role !== "user" || typeof item.text !== "string") continue;
    if (isTopicChange(item.text)) return null;
    const topic = findKnowledge(item.text);
    if (topic) return topic;
  }
  return null;
}

function cleanMathExpression(input) {
  return normalize(input)
    .replace(/^(ile to(?: jest)?|ile jest|oblicz|policz(?: mi)?|wynik)\s+/, "")
    .replace(/[?!]+$/g, "")
    .replace(/\b(pomnozone przez|mnozone przez|razy)\b/g, "*")
    .replace(/\b(plus|dodac)\b/g, "+")
    .replace(/\b(minus|odjac)\b/g, "-")
    .replace(/\b(podzielone przez|dzielone przez|podzielic przez|podziel przez)\b/g, "/")
    .replace(/\b(do potegi|podniesione do potegi)\b/g, "^")
    .replace(/\bprocent(?:y|ow)?\s+z\b/g, "% z")
    .replace(/(\d)\s*x\s*(?=\d)/g, "$1 * ")
    .trim();
}

function parseSimpleArithmetic(input) {
  const expression = cleanMathExpression(input);
  const match = expression.match(/^(-?\d+)\s*([+\-*/])\s*(-?\d+)$/);
  if (!match) return null;
  return { a: BigInt(match[1]), operator: match[2], b: BigInt(match[3]) };
}

function alignRight(value, width) {
  return String(value).padStart(width, " ");
}

function formatColumnWork(a, b, operator, result) {
  if (!["+", "-", "*", "/"].includes(operator)) return "";
  if (a < 0n || b < 0n || result < 0n) {
    return "Przy liczbach ujemnych najpierw ustalamy znak wyniku, a następnie wykonujemy działanie na wartościach bezwzględnych.";
  }
  const A = a;
  const B = b < 0n ? -b : b;
  const R = result < 0n ? -result : result;

  if (operator === "/") {
    const quotient = A / B;
    const remainder = A % B;
    return ` ${A}\n÷${B}\n───\n ${quotient}${remainder ? `\nReszta: ${remainder}` : ""}`;
  }

  if (operator === "*") {
    const width = Math.max(A.toString().length, B.toString().length + 1, R.toString().length);
    const top = alignRight(A.toString(), width);
    const multiplier = `×${B.toString()}`.padStart(width, " ");
    const rule = "─".repeat(width);
    if (B < 10n) {
      return [top, multiplier, rule, alignRight(result.toString(), width)].join("\n");
    }
    const partials = B.toString().split("").reverse().map((digit, index) => {
      const part = A * BigInt(digit) * (10n ** BigInt(index));
      return alignRight(part.toString(), width);
    });
    return [top, multiplier, rule, ...partials, rule, alignRight(result.toString(), width)].join("\n");
  }

  const width = Math.max(A.toString().length, B.toString().length, R.toString().length) + 1;
  return [alignRight(A.toString(), width), `${operator}${alignRight(B.toString(), width - 1)}`, "─".repeat(width), alignRight(result.toString(), width)].join("\n");
}

function calculate(text) {
  const simple = parseSimpleArithmetic(text);
  const needsDecimalDivision = simple && simple.operator === "/" && simple.b !== 0n && simple.a % simple.b !== 0n;
  if (simple && !needsDecimalDivision) {
    const { a, b, operator } = simple;
    if (operator === "/" && b === 0n) return "Nie można dzielić przez zero.";
    let result;
    if (operator === "+") result = a + b;
    else if (operator === "-") result = a - b;
    else if (operator === "*") result = a * b;
    else result = a / b;

    const resultText = result.toLocaleString("pl-PL");
    const column = formatColumnWork(a, b, operator, result);
    const label = operator === "*" ? "mnożenia" : operator === "+" ? "dodawania" : operator === "-" ? "odejmowania" : "dzielenia";
    return `Wynik działania: ${resultText}.\n\nZapis ${label} słupkiem:\n${column}\n\n💡 Zapamiętaj: ${operator === "*" ? "mnożenie to skrócony sposób wielokrotnego dodawania." : operator === "+" ? "dodawanie łączy wartości." : operator === "-" ? "odejmowanie pokazuje, ile zostaje po zabraniu części." : "dzielenie rozdziela liczbę na równe części."}\n\nChcesz przejść przez kolejne kroki razem?`;
  }

  let expression = cleanMathExpression(text);
  if (!expression || expression.length > 120) return null;

  const percent = expression.match(/^(-?\d+(?:[.,]\d+)?)\s*%\s*(?:z\s*)?(-?\d+(?:[.,]\d+)?)$/);
  if (percent) {
    const a = Number(percent[1].replace(",", "."));
    const b = Number(percent[2].replace(",", "."));
    const result = a * b / 100;
    if (!Number.isFinite(result)) return null;
    return `Wynik: ${formatNumber(result)}.\n\nKrok 1: Zamień procent na ułamek: ${a}% = ${formatNumber(a / 100)}.\nKrok 2: Pomnóż przez całość: ${formatNumber(a / 100)} × ${formatNumber(b)}.\nKrok 3: Otrzymujesz ${formatNumber(result)}.`;
  }

  const tokens = [];
  const tokenPattern = /\s*(\d+(?:[.,]\d+)?|[()+\-*/^])\s*/gy;
  let position = 0;
  while (position < expression.length) {
    tokenPattern.lastIndex = position;
    const match = tokenPattern.exec(expression);
    if (!match) return null;
    tokens.push(match[1]);
    position = tokenPattern.lastIndex;
  }
  if (!tokens.length) return null;

  let index = 0;
  function primary() {
    const token = tokens[index];
    if (token === "(") {
      index++;
      const value = addition();
      if (tokens[index] !== ")") throw new Error("Brak nawiasu");
      index++;
      return value;
    }
    if (/^\d/.test(token || "")) {
      index++;
      return Number(token.replace(",", "."));
    }
    throw new Error("Nieprawidłowa liczba");
  }
  function unary() {
    if (tokens[index] === "+") { index++; return unary(); }
    if (tokens[index] === "-") { index++; return -unary(); }
    return primary();
  }
  function power() {
    const left = unary();
    if (tokens[index] === "^") {
      index++;
      const right = power();
      if (Math.abs(right) > 10) throw new Error("Zbyt duża potęga");
      return left ** right;
    }
    return left;
  }
  function multiplication() {
    let value = power();
    while (["*", "/"].includes(tokens[index])) {
      const op = tokens[index++];
      const right = power();
      if (op === "/" && right === 0) throw new Error("Dzielenie przez zero");
      value = op === "*" ? value * right : value / right;
    }
    return value;
  }
  function addition() {
    let value = multiplication();
    while (tokens[index] === "+" || tokens[index] === "-") {
      const op = tokens[index++];
      const right = multiplication();
      value = op === "+" ? value + right : value - right;
    }
    return value;
  }

  try {
    const result = addition();
    if (index !== tokens.length || !Number.isFinite(result)) return null;
    return `Wynik działania: ${formatNumber(result)}.\n\n💡 Najpierw wykonujemy działania w nawiasach, następnie potęgi, mnożenie i dzielenie, a na końcu dodawanie i odejmowanie.`;
  } catch (error) {
    if (error.message === "Dzielenie przez zero") return "Nie można dzielić przez zero.";
    return null;
  }
}

function explainCalculation(question) {
  const parsed = parseSimpleArithmetic(question);
  if (!parsed) return null;
  const { a, b, operator } = parsed;
  if (operator === "/" && b === 0n) return "Nie można dzielić przez zero.";

  let result;
  let text;
  if (operator === "*") {
    result = a * b;
    text = `Mnożenie ${a} × ${b} oznacza dodawanie liczby ${a} wielokrotnie. Dla małych liczb można to pokazać tak: ${b > 0n && b <= 10n ? Array(Number(b)).fill(a.toString()).join(" + ") : "wielokrotne dodawanie"} = ${result}.`;
  } else if (operator === "+") {
    result = a + b;
    text = `Zaczynamy od ${a} i dokładamy ${b}. Razem otrzymujemy ${result}.`;
  } else if (operator === "-") {
    result = a - b;
    text = `Od ${a} zabieramy ${b}. Zostaje ${result}.`;
  } else {
    result = a / b;
    text = `Dzielimy ${a} na ${b} równych części. Wynik to ${result}.`;
  }
  return `🐨 Jasne, wyjaśnię krok po kroku.\n\n${text}\n\nZapis słupkiem:\n${formatColumnWork(a, b, operator, result)}\n\nSpróbuj teraz samodzielnie: ${operator === "*" ? `${a} × ${b + 1n}` : operator === "+" ? `${a} + ${b + 1n}` : operator === "-" ? `${a} − ${b + 1n}` : `${a} ÷ ${b + 1n}`}?`;
}

function isLearningQuestion(text) {
  return /\b(naucz|nauczyc|wytlumacz|wyjasnij|krok po kroku|jak rozwiazac|jak obliczyc|pomoz mi zrozumiec)\b/.test(normalize(text));
}

function formatUnknown() {
  return "Nie mam jeszcze wystarczająco pewnej odpowiedzi na to pytanie. Nie chcę zgadywać.\n\nMożesz wkleić treść zadania albo podać temat i klasę, a pomogę Ci rozłożyć problem na mniejsze kroki. 🐨";
}

export function answerQuestion(question, history = []) {
  const original = String(question || "").trim();
  const text = normalize(original);
  const safeHistory = Array.isArray(history) ? history.slice(-MAX_HISTORY_ITEMS) : [];

  if (!text) return "Napisz pytanie lub wklej zadanie, a przejdziemy przez nie razem. 🐨";
  if (original.length > MAX_QUESTION_LENGTH) return "Wiadomość jest za długa. Podziel ją na krótsze części.";

  if (/^(czesc|hej|siema|witaj|dzien dobry|dobry wieczor|hejka)\b/.test(text)) {
    return "Cześć! 🐨 W Koali uczymy się razem. Mogę wyjaśnić temat, pokazać rozwiązanie krok po kroku, przygotować krótką notatkę albo zadać Ci pytanie sprawdzające.";
  }
  if (/\b(jak masz na imie|kim jestes|co to koala)\b/.test(text)) return "Jestem Koala.ai — edukacyjny pomocnik, który ma pomagać Ci rozumieć, a nie tylko podawać gotowe odpowiedzi. 🐨";
  if (/\b(dziekuje|dzieki|thx)\b/.test(text)) return "Nie ma za co! Najważniejsze, żebyś rozumiał, skąd bierze się odpowiedź. 🐨";

  if (isTopicChange(original)) return "Jasne, zmieniamy temat! 🐨 Napisz, czego teraz się uczysz albo wklej zadanie. Najpierw sprawdzimy, co już wiesz, a potem przejdziemy przez kolejne kroki.";

  // Najpierw matematyka, aby np. "20 procent z 200" nie zostało
  // potraktowane jako ogólne pytanie o temat procentów.
  const calculation = calculate(original);
  if (calculation) return calculation;

  const intent = getIntent(original);
  const currentTopic = findKnowledge(original);
  if (currentTopic) return formatKnowledge(currentTopic, intent);

  if (isFollowUp(original)) {
    const previousQuestion = getPreviousUserQuestion(safeHistory);
    const previousTopic = getPreviousTopic(safeHistory);
    const previousAnswer = getPreviousAnswer(safeHistory);
    if (previousQuestion && isTopicChange(previousQuestion)) {
      return "Dobrze, zaczynamy nowy temat. Napisz konkretne zadanie lub zagadnienie. 🐨";
    }
    const calculationExplanation = previousQuestion ? explainCalculation(previousQuestion) : null;
    if (calculationExplanation) return calculationExplanation;
    if (previousTopic) return formatKnowledge(previousTopic, intent === "normal" ? "expand" : intent);
    if (previousAnswer && !normalize(previousAnswer).startsWith("nie mam jeszcze")) {
      return `Odnoszę się do poprzedniej odpowiedzi:\n\n${previousAnswer}\n\nPowiedz, która część jest niejasna, a rozłożę ją na prostsze kroki.`;
    }
    return "Chętnie wyjaśnię. Przypomnij proszę temat albo wklej zadanie, do którego się odnosisz. 🐨";
  }

  if (isLearningQuestion(original)) {
    return "Jasne, nauczymy się tego razem. 🐨 Wklej treść zadania lub napisz dokładny temat. Najpierw wyjaśnię potrzebną zasadę, potem zrobimy przykład i na końcu sprawdzimy, czy umiesz rozwiązać podobne zadanie.";
  }

  return formatUnknown();
}
