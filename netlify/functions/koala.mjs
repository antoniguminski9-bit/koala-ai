/*
 * Netlify Function dla Koala.ai.
 * Kontrakt zgodny z obecnym frontendem:
 * POST JSON { message, history } -> JSON { answer }
 * Nie korzysta z zewnętrznego modelu AI ani klucza API.
 */

import { answerQuestion } from "./koala-engine.mjs";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

function jsonResponse(answer, status = 200) {
  return new Response(JSON.stringify({ answer }), {
    status,
    headers: JSON_HEADERS
  });
}

function cleanHistory(value) {
  if (!Array.isArray(value)) return [];

  return value
    .filter(item =>
      item &&
      (item.role === "user" || item.role === "model") &&
      typeof item.text === "string"
    )
    .slice(-24)
    .map(item => ({
      role: item.role,
      text: item.text.slice(0, 2000)
    }));
}

export default async function handler(request) {
  if (request.method !== "POST") {
    return jsonResponse("Dozwolone jest tylko POST.", 405);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return jsonResponse("Nie udało się odczytać wysłanej wiadomości.", 400);
  }

  const message = typeof data?.message === "string" ? data.message.trim() : "";
  if (!message) {
    return jsonResponse("Napisz pytanie lub wklej treść zadania. 🐨", 400);
  }

  if (message.length > 2000) {
    return jsonResponse("Wiadomość jest za długa. Podziel ją na krótsze części.", 413);
  }

  // Obecny lokalny silnik nie analizuje obrazów. Zwracamy jasny komunikat,
  // zamiast udawać, że zdjęcie zostało odczytane.
  if (data?.image) {
    return jsonResponse(
      "Na razie nie potrafię odczytać treści ze zdjęcia. Przepisz zadanie lub wklej jego tekst, a pomogę Ci je rozwiązać krok po kroku. 🐨",
      422
    );
  }

  const history = cleanHistory(data?.history);

  try {
    const answer = answerQuestion(message, history);
    return jsonResponse(typeof answer === "string" ? answer : "Wystąpił nieoczekiwany błąd odpowiedzi. 🐨");
  } catch (error) {
    console.error("Koala.ai engine error:", error);
    return jsonResponse("Wystąpił błąd w silniku Koali. Spróbuj ponownie za chwilę. 🐨", 500);
  }
}
