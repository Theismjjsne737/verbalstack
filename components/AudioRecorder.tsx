'use client'

import { useState, useRef, useEffect } from 'react'

interface Props {
  onTranscriptReady: (transcript: string) => void
}

type RecordingState = 'idle' | 'recording' | 'processing'

declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

export default function AudioRecorder({ onTranscriptReady }: Props) {
  const [state, setState] = useState<RecordingState>('idle')
  const [liveText, setLiveText] = useState('')
  const [error, setError] = useState('')
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const finalTranscriptRef = useRef('')

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
    }
  }, [])

  const startRecording = () => {
    setError('')
    setLiveText('')
    finalTranscriptRef.current = ''

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setError('Speech recognition is not supported in this browser. Try Chrome or Edge.')
      return
    }

    const recognition = new SR()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += t
        } else {
          interim += t
        }
      }
      finalTranscriptRef.current += final
      setLiveText(finalTranscriptRef.current + interim)
    }

    recognition.onerror = (e) => {
      if (e.error !== 'no-speech') {
        setError(`Recognition error: ${e.error}`)
      }
      setState('idle')
    }

    recognitionRef.current = recognition
    recognition.start()
    setState('recording')
  }

  const stopRecording = () => {
    recognitionRef.current?.stop()
    setState('processing')

    setTimeout(() => {
      const transcript = finalTranscriptRef.current || liveText
      if (transcript.trim()) {
        onTranscriptReady(transcript.trim())
      } else {
        setError('No speech detected. Please try again.')
        setState('idle')
        return
      }
      setState('idle')
    }, 600)
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 text-center">
      {state === 'idle' && (
        <>
          <button
            onClick={startRecording}
            className="w-20 h-20 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all flex items-center justify-center mx-auto shadow-lg shadow-blue-900/40"
            aria-label="Start recording"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm6 10a1 1 0 0 1 1 1 7 7 0 0 1-14 0 1 1 0 0 1 2 0 5 5 0 0 0 10 0 1 1 0 0 1 1-1zM13 21v-2a1 1 0 0 0-2 0v2H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2z" />
            </svg>
          </button>
          <p className="text-gray-500 text-sm mt-4">Tap to start recording</p>
        </>
      )}

      {state === 'recording' && (
        <>
          <button
            onClick={stopRecording}
            className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 transition-all flex items-center justify-center mx-auto shadow-lg shadow-red-900/40 animate-pulse"
            aria-label="Stop recording"
          >
            <div className="w-7 h-7 bg-white rounded-sm" />
          </button>
          <p className="text-red-400 text-sm mt-4 font-medium">Recording… tap to stop</p>
          {liveText && (
            <p className="text-gray-400 text-sm mt-3 italic max-w-md mx-auto">
              &ldquo;{liveText}&rdquo;
            </p>
          )}
        </>
      )}

      {state === 'processing' && (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Processing…</p>
        </div>
      )}

      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
    </div>
  )
}
