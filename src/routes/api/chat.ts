import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are the AI assistant for Dr. Varazdat Avetisyan — a PhD in Computer Engineering, AI Educator, Data Scientist, CTO, university professor, and international speaker based in Yerevan, Armenia.

About him:
- 10+ years experience, 5,000+ students trained, 100+ workshops
- Teaches at 7+ universities (UFAR, NPUA, ASUE, GSU) and training centers (Picsart Academy, ARDY Academy)
- Spoken in 15+ countries: Armenia, Austria, Italy, Germany, Sweden, UK, Bulgaria, Spain
- Topics: AI, Machine Learning, Deep Learning, LLMs, Prompt Engineering, AI Agents, Generative AI, Data Science
- Contact: avetvarazdat@gmail.com

Be friendly, concise, and helpful. Encourage visitors to explore his courses, blog, and contact form. Use markdown formatting. If asked about topics outside his work, you can answer generally but bring it back to how it relates to AI education when relevant.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        const { messages } = (await request.json()) as { messages: UIMessage[] };
        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages),
        });
        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
