'use client'

import { useState } from 'react'
import AudioRecorder from '@/components/AudioRecorder'

const PHRASES = [
  { id: 1, text: 'The quick brown fox jumps over the lazy dog', level: 'Beginner' },
  { id: 2, text: 'She sells seashells by the seashore', level: 'Intermediate' },
  { id: 3, text: 'How much wood would a woodchuck chuck', level: 'Intermediate' },
  { id: 4, text: 'Red leather, yellow leather', level: 'Advanced' },
  { id: 5, text: 'Unique New York, unique New York', level: 'Advanced' },
]

interface FeedbackResult {
  score: number
  overallFeedback: string
  strengths: string[]
  improvements: string[]
  phonemeNotes: string
}

export default function Home() {
  const [selectedPhrase, setSelectedPhrase] = useState(PHRASES[0])
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [transcript, setTranscript] = useState('')

  const handleTranscriptReady = async (spokenText: string) => {
    setTranscript(spokenText)
    setIsLoading(true)
    setFeedback(null)

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: spokenText, targetPhrase: selectedPhrase.text }),
      })
      const data = await res.json()
      setFeedback(data)
    } catch (err) {
      console.error('Failed to get feedback:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhraseSelect = (phrase: typeof PHRASES[0]) => {
    setSelectedPhrase(phrase)
    setFeedback(null)
    setTranscript('')
  }

  const scoreColor = (score: number) =>
    score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'

  const scoreBorder = (score: number) =>
    score >= 80
      ? 'bg-green-900/20 border-green-800'
      : score >= 60
      ? 'bg-yellow-900/20 border-yellow-800'
      : 'bg-red-900/20 border-red-800'

  const levelBadge = (level: string) =>
    level === 'Beginner'
      ? 'bg-green-900/50 text-green-400'
      : level === 'Intermediate'
      ? 'bg-yellow-900/50 text-yellow-400'
      : 'bg-red-900/50 text-red-400'

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-2">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Verbal<span className="text-blue-400">Stack</span>
          </h1>
          <p className="text-gray-500 text-sm">AI-powered speech pronunciation feedback</p>
        </div>

        {/* Phrase Selection */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
            Select Phrase
          </h2>
          <div className="space-y-2">
            {PHRASES.map((phrase) => (
              <button
                key={phrase.id}
                onClick={() => handlePhraseSelect(phrase)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  selectedPhrase.id === phrase.id
                    ? 'bg-blue-900/40 border-blue-600 text-white'
                    : 'border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                }`}
              >
                <span className="text-sm font-medium">{phrase.text}</span>
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${levelBadge(phrase.level)}`}>
                  {phrase.level}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Target Phrase Display */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 text-center">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Say this phrase</p>
          <p className="text-2xl font-medium text-white leading-relaxed">
            &ldquo;{selectedPhrase.text}&rdquo;
          </p>
        </div>

        {/* Audio Recorder */}
        <AudioRecorder onTranscriptReady={handleTranscriptReady} />

        {/* Transcript */}
        {transcript && !isLoading && (
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">You said</p>
            <p className="text-gray-200 italic">&ldquo;{transcript}&rdquo;</p>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400">Analyzing pronunciation…</span>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className={`rounded-2xl p-6 border ${scoreBorder(feedback.score)}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Pronunciation Score</h2>
              <span className={`text-4xl font-bold ${scoreColor(feedback.score)}`}>
                {feedback.score}
                <span className="text-lg text-gray-500">/100</span>
              </span>
            </div>

            <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
              <div
                className={`h-2 rounded-full transition-all duration-700 ${
                  feedback.score >= 80
                    ? 'bg-green-500'
                    : feedback.score >= 60
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${feedback.score}%` }}
              />
            </div>

            <p className="text-gray-300 text-sm mb-4">{feedback.overallFeedback}</p>

            {feedback.strengths.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-green-400 mb-2">
                  Strengths
                </p>
                <ul className="space-y-1">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-gray-300 flex gap-2">
                      <span className="text-green-400 shrink-0">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.improvements.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-2">
                  Areas to Improve
                </p>
                <ul className="space-y-1">
                  {feedback.improvements.map((s, i) => (
                    <li key={i} className="text-sm text-gray-300 flex gap-2">
                      <span className="text-yellow-400 shrink-0">→</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.phonemeNotes && (
              <div className="mt-3 p-3 bg-black/20 rounded-lg">
                <p className="text-xs text-gray-400">{feedback.phonemeNotes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
