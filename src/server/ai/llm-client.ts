/**
 * Generic LLM Caller for Saathi AI
 * Supports Google Gemini API and OpenAI API with automatic fallback to heuristics.
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
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  // 1. Try Gemini API first if configured
  if (geminiKey && geminiKey !== "your-gemini-api-key") {
    try {
      const model = "gemini-1.5-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;

      const contents: any[] = [];
      if (systemPrompt) {
        contents.push({
          role: "user",
          parts: [{ text: `SYSTEM INSTRUCTIONS:\n${systemPrompt}` }],
        });
        contents.push({
          role: "model",
          parts: [{ text: "Understood. I will follow all instructions and tone." }],
        });
      }
      contents.push({
        role: "user",
        parts: [{ text: userPrompt }],
      });

      const body: any = {
        contents,
        generationConfig: {
          temperature,
          ...(responseFormatJson ? { responseMimeType: "application/json" } : {}),
        },
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) return responseText;
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back:", err);
    }
  }

  // 2. Try OpenAI API if configured
  if (openaiKey && openaiKey !== "your-openai-api-key") {
    try {
      const messages: any[] = [];
      if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt });
      }
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
        if (responseText) return responseText;
      }
    } catch (err) {
      console.warn("OpenAI API call failed, falling back:", err);
    }
  }

  // Return null if no LLM key is configured or both calls failed
  return null;
}
