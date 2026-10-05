/**
 * Generic LLM Caller for Saathi AI
 * Supports Google Gemini API (1.5 Flash / 2.0 Flash) and OpenAI API with automatic fallback.
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

  // 1. Try Gemini API first if configured with valid API key
  if (geminiKey && geminiKey.startsWith("AIzaSy")) {
    try {
      const model = "gemini-1.5-flash";
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
        if (responseText) return responseText;
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back:", err);
    }
  }

  // 2. Try OpenAI API if configured
  if (openaiKey && openaiKey.startsWith("sk-")) {
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

  // Return null if no LLM key is configured or API calls failed
  return null;
}
