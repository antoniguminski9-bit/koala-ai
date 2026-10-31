const knowledge = [
  {
    keywords: ["stolica polski", "stolicą polski", "jakie miasto jest stolicą polski"],
    answer: "Stolicą Polski jest Warszawa.",
    details: "Warszawa jest stolicą Polski i znajduje się w województwie mazowieckim."
  },
  {
    keywords: ["stolica niemiec", "stolicą niemiec"],
    answer: "Stolicą Niemiec jest Berlin.",
    details: "Berlin jest największym miastem Niemiec i siedzibą najważniejszych władz państwowych."
  },
  {
    keywords: ["stolica francji", "stolicą francji"],
    answer: "Stolicą Francji jest Paryż.",
    details: "Paryż leży nad Sekwaną i jest głównym ośrodkiem politycznym i kulturalnym Francji."
  },
  {
    keywords: ["ile dni ma tydzien", "dni w tygodniu"],
    answer: "Tydzień ma 7 dni.",
    details: "Dni tygodnia to: poniedziałek, wtorek, środa, czwartek, piątek, sobota i niedziela."
  },
  {
    keywords: ["co to jest rzeczownik", "rzeczownik"],
    answer: "Rzeczownik to część mowy nazywająca osoby, zwierzęta, rzeczy, miejsca, zjawiska i pojęcia. Odpowiada na pytania: kto? co?",
    details: "Przykłady rzeczowników: uczeń, pies, książka, szkoła, radość. Rzeczowniki mogą występować w różnych przypadkach i liczbach."
  },
  {
    keywords: ["co to jest czasownik", "czasownik"],
    answer: "Czasownik to część mowy oznaczająca czynność lub stan. Odpowiada na pytania: co robi? co się z nim dzieje?",
    details: "Przykłady: czyta, pisze, biega, śpi. Czasowniki mogą określać czas przeszły, teraźniejszy i przyszły."
  },
  {
    keywords: ["co to jest przymiotnik", "przymiotnik"],
    answer: "Przymiotnik określa cechy osób, rzeczy i zjawisk. Odpowiada na pytania: jaki? jaka? jakie?",
    details: "Przykłady: wysoki, zielona, interesujące. Przymiotnik dopasowuje się do rzeczownika pod względem rodzaju, liczby i przypadku."
  },
  {
    keywords: ["co to jest przysłówek", "przysłówek"],
    answer: "Przysłówek określa sposób, miejsce, czas lub stopień wykonywania czynności. Odpowiada między innymi na pytania: jak? gdzie? kiedy?",
    details: "Przykłady: szybko, daleko, wczoraj, bardzo."
  },
  {
    keywords: ["co to jest liczba pierwsza", "liczba pierwsza"],
    answer: "Liczba pierwsza to liczba naturalna większa od 1, która ma dokładnie dwa dzielniki: 1 i samą siebie.",
    details: "Przykłady liczb pierwszych: 2, 3, 5, 7, 11, 13. Liczba 1 nie jest liczbą pierwszą."
  },
  {
    keywords: ["co to jest ułamek", "ulamki", "ułamek zwykły"],
    answer: "Ułamek zwykły przedstawia część całości. Składa się z licznika i mianownika.",
    details: "W ułamku 3/4 licznik 3 oznacza liczbę wybranych części, a mianownik 4 oznacza, na ile równych części podzielono całość."
  },
  {
    keywords: ["co to jest procent", "procenty"],
    answer: "Procent oznacza jedną setną całości. Zapisujemy go symbolem %.",
    details: "Na przykład 25% to 25/100, czyli 1/4 całości. Aby obliczyć procent liczby, mnożymy tę liczbę przez procent zapisany jako ułamek dziesiętny."
  },
  {
    keywords: ["pole kwadratu", "jak obliczyc pole kwadratu"],
    answer: "Pole kwadratu obliczamy ze wzoru P = a × a, czyli P = a².",
    details: "Litera a oznacza długość boku kwadratu. Jeśli bok ma 4 cm, pole wynosi 4 × 4 = 16 cm²."
  },
  {
    keywords: ["obwod kwadratu", "obwód kwadratu"],
    answer: "Obwód kwadratu obliczamy ze wzoru O = 4 × a.",
    details: "Kwadrat ma cztery równe boki. Jeśli jeden bok ma 5 cm, obwód wynosi 4 × 5 = 20 cm."
  },
  {
    keywords: ["pole prostokata", "pole prostokąta"],
    answer: "Pole prostokąta obliczamy ze wzoru P = a × b.",
    details: "Mnożymy długość prostokąta przez jego szerokość. Dla boków 6 cm i 3 cm pole wynosi 18 cm²."
  },
  {
    keywords: ["co to jest fotosynteza", "fotosynteza"],
    answer: "Fotosynteza to proces, podczas którego rośliny wykorzystują energię światła do wytwarzania substancji odżywczych z wody i dwutlenku węgla.",
    details: "W procesie fotosyntezy powstaje między innymi glukoza i uwalniany jest tlen. Do fotosyntezy potrzebne jest światło oraz chlorofil."
  },
  {
    keywords: ["co to jest komórka", "komórka biologiczna"],
    answer: "Komórka jest podstawową jednostką budowy i funkcjonowania organizmów.",
    details: "W komórkach zachodzą procesy niezbędne do życia. Komórki mogą różnić się budową i funkcją."
  },
  {
    keywords: ["uklad sloneczny", "układ słoneczny", "planety ukladu slonecznego"],
    answer: "Układ Słoneczny składa się ze Słońca oraz krążących wokół niego planet i innych ciał niebieskich.",
    details: "Osiem planet Układu Słonecznego to: Merkury, Wenus, Ziemia, Mars, Jowisz, Saturn, Uran i Neptun."
  },
  {
    keywords: ["ile planet jest w ukladzie slonecznym", "ile planet ma uklad sloneczny"],
    answer: "W Układzie Słonecznym są 8 planet.",
    details: "Są to: Merkury, Wenus, Ziemia, Mars, Jowisz, Saturn, Uran i Neptun."
  },
  {
    keywords: ["co to jest grawitacja", "grawitacja"],
    answer: "Grawitacja to oddziaływanie, dzięki któremu obiekty posiadające masę przyciągają się.",
    details: "Grawitacja Ziemi sprawia, że przedmioty spadają w kierunku jej powierzchni, a Księżyc pozostaje na orbicie wokół Ziemi."
  },
  {
    keywords: ["co to jest fotosynteza"],
    answer: "Fotosynteza jest procesem wykorzystywania energii światła przez rośliny do wytwarzania substancji odżywczych."
  },
  {
    keywords: ["najdluzsza rzeka polski", "najdłuższa rzeka polski"],
    answer: "Najdłuższą rzeką Polski jest Wisła.",
    details: "Wisła ma około 1047 km długości i uchodzi do Morza Bałtyckiego."
  },
  {
    keywords: ["najwyzszy szczyt polski", "najwyższy szczyt polski"],
    answer: "Najwyższym szczytem Polski są Rysy.",
    details: "Najwyższy punkt Polski znajduje się na wysokości 2499 m n.p.m."
  },
  {
    keywords: ["kto napisal pana tadeusza", "autor pana tadeusza"],
    answer: "Autorem epopei „Pan Tadeusz” jest Adam Mickiewicz.",
    details: "Utwór został wydany w 1834 roku w Paryżu."
  },
  {
    keywords: ["kiedy byla druga wojna swiatowa", "druga wojna światowa"],
    answer: "II wojna światowa trwała od 1 września 1939 roku do 2 września 1945 roku.",
    details: "W Europie działania wojenne zakończyły się w maju 1945 roku."
  }
];

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,!?;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* MATEMATYKA — bez używania eval() */

function calculate(text) {
  let expression = normalize(text);

  expression = expression
    .replace(/^(ile to|oblicz|policz|policz mi|wynik)\s+/, "")
    .replace(/[=?]+$/g, "")
    .trim();

  if (!expression || expression.length > 150) {
    return null;
  }

  const percent = expression.match(
    /^(-?\d+(?:[.,]\d+)?)\s*%\s*(?:z|of)\s*(-?\d+(?:[.,]\d+)?)$/
  );

  if (percent) {
    const a = Number(percent[1].replace(",", "."));
    const b = Number(percent[2].replace(",", "."));
    const result = a * b / 100;

    if (!Number.isFinite(result)) return null;

    return `Wynik: ${formatNumber(result)}.\n\nObliczenie: ${a}% × ${b} = ${formatNumber(result)}.`;
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
        throw new Error("Brak nawiasu.");
      }

      index++;
      return value;
    }

    if (/^\d/.test(token || "")) {
      index++;
      return Number(token.replace(",", "."));
    }

    throw new Error("Nieprawidłowe wyrażenie.");
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
        throw new Error("Za duża potęga.");
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
        throw new Error("Dzielenie przez zero.");
      }

      if (operator === "*" || operator === "×") {
        value *= right;
      } else {
        value /= right;
      }
    }

    return value;
  }

  function addition() {
    let value = multiplication();

    while (tokens[index] === "+" || tokens[index] === "-") {
      const operator = tokens[index++];
      const right = multiplication();

      value = operator === "+"
        ? value + right
        : value - right;
    }

    return value;
  }

  try {
    const result = addition();

    if (index !== tokens.length) return null;

    if (!Number.isFinite(result)) return null;

    return `Wynik działania: ${formatNumber(result)}.`;
  } catch (error) {
    if (error.message === "Dzielenie przez zero.") {
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

function findKnowledge(question) {
  const text = normalize(question);

  for (const item of knowledge) {
    for (const keyword of item.keywords) {
      if (text.includes(normalize(keyword))) {
        return item;
      }
    }
  }

  return null;
}

function isFollowUp(text) {
  return /\b(dlaczego|jak to|rozwin|rozwiniesz|wyjasnij bardziej|powiedz wiecej|co masz na mysli|a czemu|a jak)\b/.test(text);
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
    return "Cześć! 🐨 Co dzisiaj robimy? Mogę pomóc Ci z matematyką, językiem polskim, przyrodą i innymi tematami.";
  }

  if (/\b(jak masz na imie|kim jestes|co to koala)\b/.test(text)) {
    return "Jestem Koala.ai — własny asystent edukacyjny rozwijany krok po kroku. 🐨";
  }

  if (/\b(dziekuje|dzieki|thx)\b/.test(text)) {
    return "Nie ma za co! 🐨 Powodzenia w nauce!";
  }

  if (/\b(do widzenia|pa|na razie)\b/.test(text)) {
    return "Do zobaczenia! 🐨 Wróć, gdy będziesz potrzebować pomocy.";
  }

  const calculation = calculate(original);

  if (calculation) {
    return calculation;
  }

  const found = findKnowledge(original);

  if (found) {
    return found.answer +
      (found.details ? `\n\nWyjaśnienie: ${found.details}` : "");
  }

  if (isFollowUp(text) && Array.isArray(history)) {
    const previousQuestion = [...history]
      .reverse()
      .find(item =>
        item &&
        item.role === "user" &&
        typeof item.text === "string"
      );

    if (previousQuestion) {
      const previousTopic = findKnowledge(previousQuestion.text);

      if (previousTopic) {
        return `${previousTopic.answer}\n\nRozwinięcie: ${previousTopic.details || "Mogę wyjaśnić ten temat na przykładzie."}`;
      }
    }
  }

  return `Jeszcze nie znam odpowiedzi na to pytanie. 🐨

Moja baza wiedzy jest rozwijana.

Możesz zadać pytanie inaczej albo poprosić o wyjaśnienie konkretnego tematu.

Z czasem będziemy dodawać kolejne zagadnienia do mojego własnego silnika.`;
}
