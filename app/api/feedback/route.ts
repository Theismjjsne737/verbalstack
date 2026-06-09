import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { transcript, targetPhrase } = await req.json()

  if (!transcript || !targetPhrase) {
    return NextResponse.json(
      { error: 'Missing transcript or targetPhrase' },
      { status: 400 }
    )
  }

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are a speech pronunciation coach. A user attempted to say a target phrase and speech recognition captured what they said. Compare the two and provide pronunciation feedback.

Target phrase: "${targetPhrase}"
What speech recognition captured: "${transcript}"

Respond with a JSON object with this exact structure:
{
  "score": <number 0-100>,
  "overallFeedback": "<2-3 sentence assessment>",
  "strengths": ["<strength>", ...],
  "improvements": ["<area to improve>", ...],
  "phonemeNotes": "<specific sounds to practice, or empty string if none>"
}

Scoring guide:
- 90-100: Near-perfect match, excellent pronunciation
- 70-89: Good, minor differences likely from natural variation
- 50-69: Noticeable words missed or changed
- Below 50: Significant inaccuracies

Return only the JSON object.`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const match = text.match(/\{[\s\S]*\}/)
    const feedback = JSON.parse(match ? match[0] : text)
    return NextResponse.json(feedback)
  } catch {
    return NextResponse.json({
      score: 0,
      overallFeedback: 'Unable to analyze pronunciation at this time. Please try again.',
      strengths: [],
      improvements: [],
      phonemeNotes: '',
    })
  }
}
