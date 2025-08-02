export default {
  async fetch(request, env, ctx) {
    const GROQ_API_KEY = env.GROQ_API_KEY;

    if (request.method === 'GET') {
      const { searchParams } = new URL(request.url);
      const prompt = searchParams.get("prompt") || "Hello";
      const model = searchParams.get("model") || "llama-3.1-8b-instant";

      const groqPayload = {
        model,
        messages: [{ role: "user", content: prompt }]
      };

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(groqPayload)
      });

      return new Response(await response.text(), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // POST Forwarding (OpenAI-style)
    if (request.method === 'POST') {
      const body = await request.text();

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body
      });

      return new Response(await response.text(), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    return new Response("Method Not Allowed", { status: 405 });
  }
};
