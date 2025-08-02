export default {
  async fetch(request, env, ctx) {
    const GROQ_API_KEY = "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";

    // ✅ List of allowed model IDs (updated Aug 2025)
    const allowedModels = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "llama3-8b-8192",
    "llama3-70b-8192",
    "mixtral-8x7b-32768",
    "qwen/qwen3-32b",
    "moonshotai/kimi-k2-instruct",
    "compound-beta",
    "compound-beta-mini",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "meta-llama/llama-4-maverick-17b-128e-instruct",
    "deepseek-r1-distill-llama-70b"
  ];

    if (request.method === 'GET') {
      const { searchParams } = new URL(request.url);
      const prompt = searchParams.get("prompt") || "Hello";

      const modelParam = searchParams.get("model") || "";
      const model = allowedModels.includes(modelParam) ? modelParam : null;

      if (!model) {
        return new Response(JSON.stringify({
          error: "Invalid or missing model name.",
          allowed_models: allowedModels
        }, null, 2), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

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

    // POST method handler
    if (request.method === 'POST') {
      const body = await request.json();

      const modelParam = body.model || "";
      const model = allowedModels.includes(modelParam) ? modelParam : null;

      if (!model) {
        return new Response(JSON.stringify({
          error: "Invalid or missing model name.",
          allowed_models: allowedModels
        }, null, 2), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...body, model })
      });

      return new Response(await response.text(), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    return new Response("Method Not Allowed", { status: 405 });
  }
};
