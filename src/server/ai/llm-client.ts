/**
 * Universal LLM Client for Saathi AI
 * Supports Google Gemini, OpenAI, and Groq with automatic model cascade & fallback.
 */

export interface LLMRequestOptions {
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  responseFormatJson?: boolean;
}

export async function callLLM({
  systemPrompt,
  userPrompt,
  temperature = 0.7,
  responseFormatJson = false,
}: LLMRequestOptions): Promise<string | null> {
  const geminiKey = (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    ""
  ).trim();

  const openaiKey = (process.env.OPENAI_API_KEY || "").trim();
  const groqKey = (process.env.GROQ_API_KEY || "").trim();

  // 1. Try Google Gemini API with verified active models
  if (geminiKey && geminiKey.length > 10 && !geminiKey.includes("your-gemini")) {
    const activeGeminiModels = [
      "gemini-3.6-flash",
      "gemini-3.8-flash",
      "gemini-3.1-flash-lite",
      "gemini-flash-lite-latest",
      "gemini-flash-latest",
    ];

    for (const model of activeGeminiModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;

        const body: any = {
          contents: [
            {
              role: "user",
              parts: [{ text: userPrompt }],
            },
          ],
          generationConfig: {
            temperature,
            ...(responseFormatJson ? { responseMimeType: "application/json" } : {}),
          },
        };

        if (systemPrompt) {
          body.system_instruction = {
            parts: [{ text: systemPrompt }],
          };
        }

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          const data = await res.json();
          const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (responseText && responseText.trim().length > 0) {
            return responseText.trim();
          }
        }
      } catch (err) {
        // Try next model in list
      }
    }
  }

  // 2. Try Groq (Llama 3.3 / 3.1)
  if (groqKey && groqKey.length > 10 && !groqKey.includes("your-groq")) {
    try {
      const messages: any[] = [];
      if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
      messages.push({ role: "user", content: userPrompt });

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages,
          temperature,
          ...(responseFormatJson ? { response_format: { type: "json_object" } } : {}),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const responseText = data.choices?.[0]?.message?.content;
        if (responseText) return responseText.trim();
      }
    } catch (err) {
      console.warn("[Saathi AI] Groq API call failed:", err);
    }
  }

  // 3. Try OpenAI API
  if (openaiKey && openaiKey.length > 15 && !openaiKey.includes("your-openai")) {
    try {
      const messages: any[] = [];
      if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
      messages.push({ role: "user", content: userPrompt });

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          temperature,
          ...(responseFormatJson ? { response_format: { type: "json_object" } } : {}),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const responseText = data.choices?.[0]?.message?.content;
        if (responseText) return responseText.trim();
      }
    } catch (err) {
      console.warn("[Saathi AI] OpenAI API call failed:", err);
    }
  }

  return null;
}
