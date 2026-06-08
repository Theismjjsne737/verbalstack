import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { original, transcript } = req.body;

  if (!original || !transcript) {
    return res.status(400).json({ error: "Missing original or transcript" });
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 300,
      system: `You are a warm, encouraging professional language coach giving pronunciation feedback.
The student was asked to read a sentence aloud.
You will receive the original sentence and what was transcribed from their recording.
Compare them and give feedback in exactly this JSON format with no additional text:
{
  "well": "one or two sentences on what they did well",
  "work": "one or two sentences on specific sounds or words to improve",
  "tip": "one actionable sentence to help them improve"
}
Keep total response under 120 words. Be specific, warm, and encouraging. Never be harsh.`,
      messages: [
        {
          role: "user",
          content: `Original sentence: "${original}"\n\nWhat we heard: "${transcript}"`,
        },
      ],
    });

    const raw = message.content[0].text.trim();
    const clean = raw.replace(/```json|```/g, "").trim();
    const feedback = JSON.parse(clean);

    return res.status(200).json({ feedback });

  } catch (err) {
    console.error("Feedback error:", err);
    return res.status(500).json({ error: "Feedback generation failed" });
  }
}
