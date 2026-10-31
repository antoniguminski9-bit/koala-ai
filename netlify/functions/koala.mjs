
import { answerQuestion } from "./koala-engine.mjs";

export default async (request) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8"
  };

  const json = (answer, status = 200) =>
    new Response(JSON.stringify({ answer }), {
      status,
      headers
    });

  if (request.method !== "POST") {
    return json("Dozwolone jest tylko POST.", 405);
  }

  try {
    const data = await request.json();

    const question = String(data.message || "").trim();

    const history = Array.isArray(data.history)
      ? data.history
          .filter(
            item =>
              item &&
              ["user", "model"].includes(item.role) &&
              typeof item.text === "string"
          )
          .slice(-20)
      : [];

    if (!question) {
      return json(
        "Na razie mój własny silnik obsługuje pytania tekstowe. 🐨",
        400
      );
    }

    const answer = answerQuestion(question, history);

    return json(answer);
  } catch (error) {
    console.error("Błąd własnego silnika Koali:", error);

    return json(
      "Wystąpił błąd w moim własnym silniku. 🐨",
      500
    );
  }
};
