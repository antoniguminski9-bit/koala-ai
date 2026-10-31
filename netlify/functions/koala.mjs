import { answerQuestion } from "./koala-engine.mjs";

export default async (request) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  };

  const json = (answer, status = 200) =>
    new Response(
      JSON.stringify({ answer }),
      {
        status,
        headers
      }
    );

  if (request.method !== "POST") {
    return json("Dozwolone jest tylko POST.", 405);
  }

  try {
    let data;

    try {
      data = await request.json();
    } catch {
      return json("Nie udało się odczytać wiadomości.", 400);
    }

    if (data.image) {
      return json(
        "Na razie nie potrafię jeszcze analizować zdjęć. Możesz przepisać treść zadania i wysłać ją jako wiadomość tekstową. 🐨",
        422
      );
    }

    const question = String(data.message || "").trim();

    if (!question) {
      return json(
        "Napisz pytanie, a spróbuję Ci pomóc! 🐨",
        400
      );
    }

    if (question.length > 2000) {
      return json(
        "Wiadomość jest za długa. Podziel ją na krótsze części.",
        413
      );
    }

    const history = Array.isArray(data.history)
      ? data.history
          .filter(item =>
            item &&
            ["user", "model"].includes(item.role) &&
            typeof item.text === "string"
          )
          .slice(-20)
          .map(item => ({
            role: item.role,
            text: item.text.slice(0, 2000)
          }))
      : [];

    const answer = answerQuestion(question, history);

    return json(answer);
  } catch (error) {
    console.error("Błąd własnego silnika Koali:", error);

    return json(
      "Wystąpił błąd w moim własnym silniku. Spróbuj ponownie. 🐨",
      500
    );
  }
};
