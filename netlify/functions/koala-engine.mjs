
const knowledge = [
  {
    keywords: ["stolica polski", "stolicą polski"],
    answer: "Stolicą Polski jest Warszawa."
  },
  {
    keywords: ["ile dni ma tydzień", "dni w tygodniu"],
    answer: "Tydzień ma 7 dni."
  },
  {
    keywords: ["co to jest rzeczownik", "rzeczownik"],
    answer: "Rzeczownik to część mowy nazywająca osoby, zwierzęta, rzeczy, miejsca, zjawiska i pojęcia. Odpowiada na pytania: kto? co?"
  },
  {
    keywords: ["co to jest czasownik", "czasownik"],
    answer: "Czasownik to część mowy oznaczająca czynność lub stan. Odpowiada na pytania: co robi? co się z nim dzieje?"
  },
  {
    keywords: ["co to jest przymiotnik", "przymiotnik"],
    answer: "Przymiotnik określa cechy osób, rzeczy i zjawisk. Odpowiada na pytania: jaki? jaka? jakie?"
  }
];

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,!?;:]/g, " ")
    .trim();
}

function calculate(text) {
  const match = text.match(
    /^\s*(-?\d+(?:[.,]\d+)?)\s*([+\-*/×÷])\s*(-?\d+(?:[.,]\d+)?)\s*[=?]?\s*$/
  );

  if (!match) return null;

  const a = Number(match[1].replace(",", "."));
  const b = Number(match[3].replace(",", "."));
  const operator = match[2];

  let result;

  switch (operator) {
    case "+": result = a + b; break;
    case "-": result = a - b; break;
    case "*":
    case "×": result = a * b; break;
    case "/":
    case "÷":
      if (b === 0) return "Nie można dzielić przez zero.";
      result = a / b;
      break;
    default: return null;
  }

  if (!Number.isFinite(result)) return null;

  return `Wynik działania: ${result}`;
}

export function answerQuestion(question, history = []) {
  const original = String(question || "").trim();
  const text = normalize(original);

  if (!text) {
    return "Napisz pytanie, a spróbuję Ci pomóc! 🐨";
  }

  if (/^(czesc|hej|siema|witaj|dzien dobry|dobry wieczor)\b/.test(text)) {
    return "Cześć! 🐨 Jestem Koala. Mogę pomóc Ci w nauce, podstawowych obliczeniach i pytaniach z mojej bazy wiedzy.";
  }

  if (/\b(jak masz na imie|kim jestes)\b/.test(text)) {
    return "Jestem Koala.ai — własny asystent edukacyjny rozwijany krok po kroku. 🐨";
  }

  if (/\b(dziekuje|dzieki)\b/.test(text)) {
    return "Nie ma za co! 🐨";
  }

  const calculation = calculate(original);
  if (calculation) return calculation;

  for (const item of knowledge) {
    if (item.keywords.some(keyword => text.includes(normalize(keyword)))) {
      return item.answer;
    }
  }

  const previous = history.length
    ? "Widzę wcześniejsze wiadomości, ale mój obecny silnik nie potrafi jeszcze dobrze analizować kontekstu."
    : "";

  return `Jeszcze nie znam odpowiedzi na to pytanie. 🐨

Moja baza wiedzy jest dopiero rozwijana. Możemy dodać odpowiedź na takie pytanie, aby Koala znała ją następnym razem.

${previous}`;
}
