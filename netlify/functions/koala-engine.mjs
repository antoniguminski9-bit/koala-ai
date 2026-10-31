const knowledge = [
  {
    title: "Rzeczownik",
    keywords: ["rzeczownik", "co to jest rzeczownik"],
    short: "Rzeczownik to część mowy nazywająca osoby, zwierzęta, rzeczy, miejsca, zjawiska i pojęcia.",
    explanation: "Rzeczownik odpowiada na pytania kto? co? W języku polskim odmienia się przez przypadki i liczby. Występuje w rodzaju męskim, żeńskim lub nijakim.",
    example: "Przykłady: uczeń, pies, książka, szkoła, radość. W zdaniu „Pies biega” wyraz „pies” jest rzeczownikiem.",
    related: "Rzeczownik często występuje razem z przymiotnikiem, który opisuje jego cechy."
  },
  {
    title: "Czasownik",
    keywords: ["czasownik", "co to jest czasownik"],
    short: "Czasownik oznacza czynność, stan lub proces.",
    explanation: "Odpowiada na pytania co robi? co się z nim dzieje? Czasowniki mogą występować w czasie przeszłym, teraźniejszym i przyszłym. Odmieniają się między innymi przez osoby i liczby.",
    example: "Przykłady: czytam, piszesz, biega, śpi, będzie uczyć się. W zdaniu „Ola czyta książkę” wyraz „czyta” jest czasownikiem.",
    related: "Czasownik jest ważnym elementem orzeczenia w zdaniu."
  },
  {
    title: "Przymiotnik",
    keywords: ["przymiotnik", "co to jest przymiotnik"],
    short: "Przymiotnik określa cechy osób, rzeczy i zjawisk.",
    explanation: "Odpowiada na pytania jaki? jaka? jakie? Przymiotnik dopasowuje się do rzeczownika pod względem rodzaju, liczby i przypadku.",
    example: "Przykłady: wysoki budynek, zielona trawa, ciekawe książki.",
    related: "Przymiotnik często występuje obok rzeczownika i dokładniej go opisuje."
  },
  {
    title: "Przysłówek",
    keywords: ["przyslowek", "co to jest przysłówek"],
    short: "Przysłówek określa sposób, miejsce, czas lub stopień wykonywania czynności.",
    explanation: "Odpowiada między innymi na pytania jak? gdzie? kiedy? Przysłówek często określa czasownik.",
    example: "Szybko biega. Mieszka daleko. Przyjdzie jutro. W tych zdaniach szybko, daleko i jutro są przysłówkami.",
    related: "Od wielu przymiotników można utworzyć przysłówki, np. szybki – szybko."
  },
  {
    title: "Liczby pierwsze",
    keywords: ["liczba pierwsza", "liczby pierwsze"],
    short: "Liczba pierwsza to liczba naturalna większa od 1, która ma dokładnie dwa dzielniki: 1 i samą siebie.",
    explanation: "Liczba pierwsza nie dzieli się bez reszty przez inne liczby naturalne poza jedynką i samą sobą.",
    example: "Liczby 2, 3, 5, 7, 11 i 13 są pierwsze. Liczba 9 nie jest pierwsza, ponieważ dzieli się przez 1, 3 i 9.",
    related: "Liczba 2 jest jedyną parzystą liczbą pierwszą. Liczba 1 nie jest pierwsza."
  },
  {
    title: "Ułamki zwykłe",
    keywords: ["ulamek", "ułamki", "ulamek zwykly", "ułamki zwykłe"],
    short: "Ułamek zwykły przedstawia część całości. Składa się z licznika i mianownika.",
    explanation: "Mianownik znajduje się pod kreską ułamkową i mówi, na ile równych części podzielono całość. Licznik znajduje się nad kreską i informuje, ile części wybrano.",
    example: "W ułamku 3/4 mianownik 4 oznacza cztery równe części, a licznik 3 oznacza trzy wybrane części.",
    related: "Ułamki można skracać, rozszerzać, dodawać, odejmować, mnożyć i dzielić."
  },
  {
    title: "Procenty",
    keywords: ["procent", "procenty"],
    short: "Procent oznacza jedną setną całości. Zapisujemy go symbolem %.",
    explanation: "100% to całość, 50% to połowa, 25% to jedna czwarta, a 10% to jedna dziesiąta.",
    example: "20% z 50 to 10. Obliczamy: 20/100 × 50 = 10.",
    related: "Aby zamienić procent na ułamek dziesiętny, dzielimy jego wartość przez 100."
  },
  {
    title: "Pole kwadratu",
    keywords: ["pole kwadratu", "jak obliczyc pole kwadratu"],
    short: "Pole kwadratu obliczamy ze wzoru P = a × a, czyli P = a².",
    explanation: "Litera a oznacza długość boku kwadratu. Pole określa powierzchnię figury.",
    example: "Jeśli bok ma 4 cm, to P = 4 × 4 = 16 cm².",
    related: "Obwód kwadratu obliczamy ze wzoru O = 4a."
  },
  {
    title: "Pole prostokąta",
    keywords: ["pole prostokata", "prostokat", "prostokąt"],
    short: "Pole prostokąta obliczamy ze wzoru P = a × b.",
    explanation: "Mnożymy długość jednego boku przez długość drugiego boku. Wynik zapisujemy w jednostkach kwadratowych.",
    example: "Dla boków 6 cm i 3 cm: P = 6 × 3 = 18 cm².",
    related: "Obwód prostokąta to O = 2a + 2b."
  },
  {
    title: "Fotosynteza",
    keywords: ["fotosynteza", "co to jest fotosynteza"],
    short: "Fotosynteza to proces, w którym rośliny wykorzystują energię światła do wytwarzania substancji odżywczych.",
    explanation: "Rośliny pobierają wodę i dwutlenek węgla. Dzięki energii światła, przy udziale chlorofilu, wytwarzają związki organiczne, między innymi glukozę. W procesie uwalniany jest tlen.",
    example: "Liście roślin pobierają światło słoneczne, a roślina wykorzystuje je do przeprowadzania fotosyntezy.",
    related: "Fotosynteza ma duże znaczenie dla życia na Ziemi, ponieważ dostarcza materii organicznej i uwalnia tlen."
  },
  {
    title: "Komórka",
    keywords: ["komorka", "komórka biologiczna", "komorka biologiczna"],
    short: "Komórka jest podstawową jednostką budowy i funkcjonowania organizmów.",
    explanation: "Komórki mają różną budowę i funkcje. Wiele z nich zawiera błonę komórkową, cytoplazmę i materiał genetyczny. Komórki roślinne mają dodatkowo między innymi ścianę komórkową i chloroplasty.",
    example: "Komórki mięśniowe umożliwiają ruch, a komórki nerwowe uczestniczą w przekazywaniu informacji.",
    related: "Wiele komórek może tworzyć tkanki, narządy i układy narządów."
  },
  {
    title: "Układ Słoneczny",
    keywords: ["uklad sloneczny", "układ słoneczny", "planety ukladu slonecznego"],
    short: "Układ Słoneczny składa się ze Słońca oraz krążących wokół niego planet i innych ciał niebieskich.",
    explanation: "Grawitacja Słońca utrzymuje planety na orbitach. W Układzie Słonecznym znajdują się również księżyce, planety karłowate, asteroidy i komety.",
    example: "Osiem planet to: Merkury, Wenus, Ziemia, Mars, Jowisz, Saturn, Uran i Neptun.",
    related: "Ziemia jest trzecią planetą od Słońca."
  },
  {
    title: "Grawitacja",
    keywords: ["grawitacja", "co to jest grawitacja"],
    short: "Grawitacja to oddziaływanie, dzięki któremu obiekty posiadające masę przyciągają się.",
    explanation: "Siła przyciągania zależy między innymi od mas obiektów i odległości między nimi. Grawitacja Ziemi utrzymuje nas na jej powierzchni i wpływa na ruch Księżyca wokół Ziemi.",
    example: "Gdy puścisz piłkę, spada ona w kierunku podłoża wskutek przyciągania grawitacyjnego Ziemi.",
    related: "Grawitacja jest jednym z podstawowych oddziaływań występujących we Wszechświecie."
  },
  {
    title: "Najdłuższa rzeka Polski",
    keywords: ["najdluzsza rzeka polski", "najdłuższa rzeka polski", "wisla"],
    short: "Najdłuższą rzeką Polski jest Wisła.",
    explanation: "Wisła ma około 1047 km długości. Przepływa przez wiele regionów Polski i uchodzi do Morza Bałtyckiego.",
    example: "Do ważnych miast położonych nad Wisłą należą Kraków, Warszawa i Toruń.",
    related: "Wisła jest ważnym elementem geografii i historii Polski."
  },
  {
    title: "Rysy",
    keywords: ["najwyzszy szczyt polski", "najwyższy szczyt polski", "rysy"],
    short: "Najwyższym punktem Polski jest północno-zachodni wierzchołek Rysów o wysokości 2499 m n.p.m.",
    explanation: "Rysy znajdują się w Tatrach, na granicy polsko-słowackiej.",
    example: "Tatry są najwyższym pasmem górskim w Polsce.",
    related: "Wysokości szczytów podaje się zwykle w metrach nad poziomem morza."
  },
  {
    title: "Pan Tadeusz",
    keywords: ["pan tadeusz", "autor pana tadeusza", "kto napisal pana tadeusza"],
    short: "Autorem epopei „Pan Tadeusz” jest Adam Mickiewicz.",
    explanation: "Utwór został wydany w 1834 roku. Jego pełny tytuł brzmi „Pan Tadeusz, czyli Ostatni zajazd na Litwie”.",
    example: "Akcja utworu rozgrywa się na Litwie, a jednym z głównych tematów jest życie szlachty i tęsknota za ojczyzną.",
    related: "Adam Mickiewicz jest jednym z najważniejszych polskich poetów romantycznych."
  },
  {
    title: "Druga wojna światowa",
    keywords: ["druga wojna swiatowa", "ii wojna światowa", "ii wojna swiatowa"],
    short: "II wojna światowa trwała od 1939 do 1945 roku.",
    explanation: "Rozpoczęła się 1 września 1939 roku atakiem Niemiec na Polskę. Był to największy konflikt zbrojny w historii.",
    example: "W Europie wojna zakończyła się w maju 1945 roku, a kapitulacja Japonii nastąpiła we wrześniu 1945 roku.",
    related: "Skutkami wojny były ogromne straty ludzkie, zniszczenia miast i zmiany granic państw."
  },
  {
    title: "Fotosynteza i oddychanie komórkowe",
    keywords: ["oddychanie komorkowe", "oddychanie komórkowe"],
    short: "Oddychanie komórkowe to proces uwalniania energii ze związków organicznych.",
    explanation: "W typowym oddychaniu tlenowym komórki wykorzystują tlen do rozkładania glukozy. Powstają dwutlenek węgla, woda i energia magazynowana między innymi w ATP.",
    example: "Komórki mięśni wykorzystują energię uzyskaną w oddychaniu komórkowym do pracy.",
    related: "Fotosynteza magazynuje energię w związkach organicznych, a oddychanie komórkowe pozwala ją uwalniać."
  },
  {
    title: "Atom",
    keywords: ["atom", "co to jest atom", "budowa atomu"],
    short: "Atom to podstawowa jednostka budowy pierwiastka chemicznego.",
    explanation: "Atom składa się z jądra, w którym znajdują się protony i neutrony, oraz elektronów znajdujących się wokół jądra.",
    example: "Atom wodoru ma jeden proton w jądrze i zwykle jeden elektron.",
    related: "Liczba protonów określa, jaki to pierwiastek chemiczny."
  },
  {
    title: "Pierwiastki chemiczne",
    keywords: ["pierwiastek chemiczny", "pierwiastki chemiczne"],
    short: "Pierwiastek chemiczny to substancja zbudowana z atomów o tej samej liczbie protonów.",
    explanation: "Każdy pierwiastek ma własną nazwę i symbol chemiczny. Pierwiastki uporządkowano w układzie okresowym.",
    example: "Wodór ma symbol H, tlen O, a węgiel C.",
    related: "Związki chemiczne powstają z atomów różnych pierwiastków połączonych wiązaniami chemicznymi."
  },
  {
    title: "Energia",
    keywords: ["energia", "co to jest energia"],
    short: "Energia to wielkość fizyczna opisująca zdolność układu do wykonania pracy lub wywołania zmian.",
    explanation: "Wyróżnia się między innymi energię kinetyczną, potencjalną, cieplną, chemiczną i elektryczną. Energia może zmieniać formę.",
    example: "Poruszający się rower ma energię kinetyczną, a podniesiony przedmiot ma energię potencjalną grawitacji.",
    related: "Zgodnie z zasadą zachowania energii nie powstaje ona z niczego ani nie znika, lecz ulega przemianom."
  },
  {
    title: "Demokracja",
    keywords: ["demokracja", "co to jest demokracja"],
    short: "Demokracja to forma rządów, w której obywatele mają udział w podejmowaniu decyzji publicznych.",
    explanation: "Obywatele mogą uczestniczyć w życiu politycznym między innymi poprzez wybory. Ważne są także prawa obywatelskie, pluralizm i praworządność.",
    example: "Wybory parlamentarne są jednym ze sposobów udziału obywateli w demokracji.",
    related: "Demokracja może mieć różne formy i rozwiązania instytucjonalne."
  }
];

function normalize(value) {
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

      if (containsPhrase(text, normalizedKeyword)) {
        const score = normalizedKeyword.length;

        if (score > bestScore) {
          best = item;
          bestScore = score;
        }
      }
    }
  }

  return best;
}

function getIntent(question) {
  const text = normalize(question);

  if (/\b(przyklad\w*|przyklady|podaj przyklad|daj przyklad)\b/.test(text)) {
    return "example";
  }

  if (/\b(prosciej|latwiej|nie rozumiem|wytlumacz prosciej|po ludzku)\b/.test(text)) {
    return "simple";
  }

  if (/\b(notatk\w*|podsumuj\w*|podsumowani\w*|skroc\w*|najwazniejsz\w*)\b/.test(text)) {
    return "summary";
  }

  if (/\b(dlaczego|czemu|z jakiego powodu)\b/.test(text)) {
    return "why";
  }

  if (/\b(rozwin\w*|rozszerz\w*|dokladniej|wiecej|opowiedz wiecej|szerzej)\b/.test(text)) {
    return "expand";
  }

  return "normal";
}

function isFollowUp(question) {
  const text = normalize(question);

  return (
    /^(a\s+)?(dlaczego|czemu|jak to|rozwin|rozwin to|rozwin mi to|dokladniej|wiecej|przyklad|podaj przyklad|daj przyklad|prosciej|latwiej|nie rozumiem)( .*)?$/.test(text) ||
    /\b(notatk\w*|podsumuj\w*)\b/.test(text)
  );
}

function formatKnowledge(item, intent = "normal") {
  if (!item) return null;

  if (intent === "example") {
    return `🐨 Przykład — ${item.title}\n\n${item.example}`;
  }

  if (intent === "simple") {
    return `🐨 Wyjaśnię prościej — ${item.title}\n\n${item.short}\n\n${item.example}`;
  }

  if (intent === "summary") {
    return `📝 Notatka — ${item.title}\n\n• ${item.short}\n\n• ${item.explanation}\n\n• Przykład: ${item.example}`;
  }

  if (intent === "why") {
    return `🐨 Dlaczego to ważne?\n\n${item.related}\n\n${item.explanation}`;
  }

  if (intent === "expand") {
    return `📚 Rozwinięcie tematu: ${item.title}\n\n1. Podstawowa definicja\n${item.short}\n\n2. Dokładniejsze wyjaśnienie\n${item.explanation}\n\n3. Przykład\n${item.example}\n\n4. Co jeszcze warto wiedzieć?\n${item.related}`;
  }

  return `🐨 ${item.title}\n\n${item.short}\n\nWyjaśnienie:\n${item.explanation}\n\nPrzykład:\n${item.example}`;
}

/* Kalkulator z bezpiecznym parserem, bez eval(). */

function calculate(text) {
  let expression = normalize(text)
    .replace(/^(ile to|oblicz|policz|policz mi|wynik)\s+/, "")
    .replace(/[=?]+$/g, "")
    .trim();

  if (!expression || expression.length > 120) return null;

  const percent = expression.match(
    /^(-?\d+(?:[.,]\d+)?)\s*%\s*(?:z|of)\s*(-?\d+(?:[.,]\d+)?)$/
  );

  if (percent) {
    const a = Number(percent[1].replace(",", "."));
    const b = Number(percent[2].replace(",", "."));
    const result = a * b / 100;

    return Number.isFinite(result)
      ? `Wynik: ${formatNumber(result)}.\n\nObliczenie: ${a}% × ${b} = ${formatNumber(result)}.`
      : null;
  }

  const tokens = [];
  const pattern = /\s*(\d+(?:[.,]\d+)?|[()+\-*/×÷^])\s*/gy;
  let position = 0;

  while (position < expression.length) {
    pattern.lastIndex = position;
    const match = pattern.exec(expression);

    if (!match) return null;

    tokens.push(match[1]);
    position = pattern.lastIndex;
  }

  if (!tokens.length) return null;

  let index = 0;

  function primary() {
    const token = tokens[index];

    if (token === "(") {
      index++;
      const value = addition();

      if (tokens[index] !== ")") {
        throw new Error("Nawias");
      }

      index++;
      return value;
    }

    if (/^\d/.test(token || "")) {
      index++;
      return Number(token.replace(",", "."));
    }

    throw new Error("Wartość");
  }

  function unary() {
    if (tokens[index] === "+") {
      index++;
      return unary();
    }

    if (tokens[index] === "-") {
      index++;
      return -unary();
    }

    return primary();
  }

  function power() {
    const left = unary();

    if (tokens[index] === "^") {
      index++;
      const right = power();

      if (Math.abs(right) > 10) {
        throw new Error("Potęga");
      }

      return Math.pow(left, right);
    }

    return left;
  }

  function multiplication() {
    let value = power();

    while (["*", "/", "×", "÷"].includes(tokens[index])) {
      const operator = tokens[index++];
      const right = power();

      if ((operator === "/" || operator === "÷") && right === 0) {
        throw new Error("Dzielenie przez zero");
      }

      value = operator === "*" || operator === "×"
        ? value * right
        : value / right;
    }

    return value;
  }

  function addition() {
    let value = multiplication();

    while (tokens[index] === "+" || tokens[index] === "-") {
      const operator = tokens[index++];
      const right = multiplication();

      value = operator === "+" ? value + right : value - right;
    }

    return value;
  }

  try {
    const result = addition();

    if (index !== tokens.length || !Number.isFinite(result)) {
      return null;
    }

    return `Wynik działania: ${formatNumber(result)}.`;
  } catch (error) {
    if (error.message === "Dzielenie przez zero") {
      return "Nie można dzielić przez zero.";
    }

    return null;
  }
}

function formatNumber(value) {
  return new Intl.NumberFormat("pl-PL", {
    maximumFractionDigits: 8
  }).format(value);
}

function getPreviousTopic(history) {
  if (!Array.isArray(history)) return null;

  for (let i = history.length - 1; i >= 0; i--) {
    const item = history[i];

    if (item && item.role === "user" && typeof item.text === "string") {
      const topic = findKnowledge(item.text);

      if (topic) {
        return topic;
      }
    }
  }

  return null;
}
function getPreviousAnswer(history) {
  if (!Array.isArray(history)) return "";

  for (let i = history.length - 1; i >= 0; i--) {
    if (
      history[i] &&
      history[i].role === "model" &&
      typeof history[i].text === "string"
    ) {
      return history[i].text;
    }
  }

  return "";
}

export function answerQuestion(question, history = []) {
  const original = String(question || "").trim();
  const text = normalize(original);

  if (!text) {
    return "Napisz pytanie, a spróbuję Ci pomóc! 🐨";
  }

  if (text.length > 2000) {
    return "Twoja wiadomość jest za długa. Podziel ją na kilka krótszych części. 🐨";
  }

  if (/^(czesc|hej|siema|witaj|dzien dobry|dobry wieczor|hejka)\b/.test(text)) {
    return "Cześć! 🐨 Co dzisiaj poznajemy? Mogę wyjaśniać tematy, podawać przykłady, tworzyć notatki i pomagać w obliczeniach.";
  }

  if (/\b(jak masz na imie|kim jestes|co to koala)\b/.test(text)) {
    return "Jestem Koala.ai — własny asystent edukacyjny. Pomagam w nauce, wyjaśniam pojęcia i rozwiązuję wybrane zadania. 🐨";
  }

  if (/\b(dziekuje|dzieki|thx)\b/.test(text)) {
    return "Nie ma za co! 🐨";
  }

  if (/\b(do widzenia|na razie)\b/.test(text)) {
    return "Do zobaczenia! 🐨 Powodzenia w nauce!";
  }

  const intent = getIntent(original);
  const currentTopic = findKnowledge(original);

  // Najpierw rozpoznaj temat z aktualnego pytania.
  if (currentTopic) {
    return formatKnowledge(currentTopic, intent);
  }

  // Potem sprawdź, czy użytkownik nawiązuje do wcześniejszej wiadomości.
  if (isFollowUp(original)) {
const previousTopic = getPreviousTopic(history);
const previousAnswer = getPreviousAnswer(history);

    if (previousTopic) {
      return formatKnowledge(previousTopic, intent === "normal" ? "expand" : intent);
    }

    if (previousAnswer && !normalize(previousAnswer).startsWith("jeszcze nie znam")) {
      return `🐨 Odnoszę się do poprzedniej odpowiedzi:\n\n${previousAnswer}\n\nNie mam jeszcze wystarczającej wiedzy, żeby dopowiedzieć nowe, sprawdzone fakty do tego tematu. Możesz podać jego nazwę lub wkleić fragment, który mam wyjaśnić.`;
    }

    return "🐨 Jasne, mogę rozwinąć temat. Napisz tylko, czego dotyczyło poprzednie pytanie, żebym nie zgadywała.";
  }

  // Obliczenia matematyczne.
  const calculation = calculate(original);

  if (calculation) {
    return calculation;
  }

  return `🐨 Nie mam jeszcze potwierdzonej odpowiedzi na to pytanie.

Moja baza wiedzy jest rozwijana. Nie chcę wymyślać faktów ani podawać Ci błędnych informacji.

Możesz:
• zadać pytanie innymi słowami,
• podać temat i poprosić o przykład,
• poprosić o prostsze wyjaśnienie,
• poprosić o krótką notatkę.`;
}
