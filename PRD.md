# VerbalStack — Product Requirements Document

## Overview

VerbalStack is a web-based pronunciation coaching app. Users read a target sentence aloud, the audio is transcribed by Whisper, and Claude provides structured, warm feedback on their pronunciation.

---

## Problem

Language learners lack immediate, specific feedback on pronunciation. Traditional options (tutors, apps) are either expensive, asynchronous, or generic. VerbalStack gives instant, AI-powered coaching on demand.

---

## Target Users

- Non-native English speakers practicing pronunciation
- Language students doing self-directed study
- Teachers looking for supplementary tools for students

---

## Core User Flow

1. User lands on the page and sees the target sentence
2. User clicks the mic button to start recording
3. User reads the sentence aloud, then clicks to stop
4. Audio is sent to Whisper (OpenAI) for transcription
5. Transcript + original sentence are sent to Claude for analysis
6. User receives three feedback cards: what went well, what to work on, a tip

---

## Features

### MVP (Current)
- [ ] Single practice sentence displayed on load
- [ ] Browser-based audio recording (MediaRecorder API)
- [ ] Animated waveform while recording
- [ ] Whisper transcription via `/api/transcribe`
- [ ] Claude pronunciation feedback via `/api/feedback`
- [ ] Feedback displayed in three color-coded cards (green / orange / yellow)
- [ ] "We heard: …" transcript display

### V2 (Next)
- [ ] Multiple selectable sentences (difficulty levels: beginner / intermediate / advanced)
- [ ] Pronunciation score (0–100) derived from word-level diff
- [ ] Highlighted word diff: show which words were missed or mispronounced
- [ ] Session history (last 5 attempts, score trend)
- [ ] Re-record button without page reload

### V3 (Future)
- [ ] User accounts and progress tracking
- [ ] Custom sentence input
- [ ] Phoneme-level breakdown
- [ ] Mobile-optimized experience / PWA
- [ ] Language selection (Spanish, French, etc.)

---

## Technical Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (Pages Router), React, inline styles |
| Transcription | OpenAI Whisper (`whisper-1`) via `/api/transcribe` |
| Feedback | Anthropic Claude (`claude-sonnet-4-5`) via `/api/feedback` |
| File parsing | `formidable` (multipart audio upload) |
| Hosting | Vercel (`project-cvx5l`, domain: verbalstack.com) |

---

## API Routes

### `POST /api/transcribe`
- Accepts: `multipart/form-data` with `audio` field (`.webm`)
- Returns: `{ transcript: string }`
- Uses: OpenAI Whisper

### `POST /api/feedback`
- Accepts: `{ original: string, transcript: string }`
- Returns: `{ feedback: { well: string, work: string, tip: string } }`
- Uses: Claude `claude-sonnet-4-5`, max 300 tokens

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | Whisper transcription |
| `ANTHROPIC_API_KEY` | Claude feedback generation |

---

## Non-Goals (MVP)

- No user authentication
- No persistent storage
- No mobile app
- No multi-language support
- No real-time streaming feedback

---

## Success Metrics

- Feedback latency < 5 seconds end-to-end
- Transcription accuracy sufficient for word-level comparison
- Feedback is specific to the target sentence (not generic)
- Zero crashes on record → transcribe → feedback flow
