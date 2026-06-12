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
      model: "claude-sonnet-4-6",
      max_tokens: 450,
      system: `You are a warm, encouraging professional pronunciation coach.
The student read a sentence aloud and an automatic transcriber captured what was heard.
Important: even when the transcript matches the original, the student may have mispronounced sounds
subtly — for example, substituting TH with D/T/F/V, weak R or L, missing final consonants, or
non-native vowel shifts. Reason about what phoneme errors are plausible given the sentence's sounds,
even if the transcript looks perfect.

Give feedback in exactly this JSON format with no additional text:
{
  "score": <integer 0–100, reflecting pronunciation accuracy; 100 = perfect>,
  "well": "<one or two sentences on what they did well>",
  "work": "<one or two sentences on specific sounds or words to improve, including any likely subtle mispronunciations not captured by the transcript>",
  "tip": "<one actionable drill or technique to improve the hardest sound in this sentence>"
}
Keep total response under 180 words. Be specific, warm, and encouraging. Never be harsh.`,
      messages: [
        {
          role: "user",
          content: `Original sentence: "${original}"\n\nWhat the transcriber heard: "${transcript}"`,
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
