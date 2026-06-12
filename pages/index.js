import { useState, useEffect } from "react";
import Recorder from "../components/Recorder";
import Feedback from "../components/Feedback";
import SentenceSelector from "../components/SentenceSelector";
import StreakBar from "../components/StreakBar";
import { SENTENCES } from "../data/sentences";

const STORAGE_KEY = "verbalstack_progress";

function loadProgress() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress(data) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function Home() {
  const [selectedSentence, setSelectedSentence] = useState(SENTENCES[10]); // h1 default
  const [showSelector, setShowSelector] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Habit state
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [bestScores, setBestScores] = useState({});

  useEffect(() => {
    const p = loadProgress();
    setStreak(p.streak || 0);
    setXp(p.xp || 0);
    setBestScores(p.bestScores || {});
  }, []);

  function updateProgress(sentenceId, score) {
    const p = loadProgress() || {};
    const today = todayStr();
    const lastDay = p.lastPracticeDay;

    let newStreak = p.streak || 0;
    if (lastDay === today) {
      // already practiced today, streak unchanged
    } else if (lastDay === getPrevDay(today)) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    const newXp = (p.xp || 0) + Math.round(score / 10);
    const newBest = { ...(p.bestScores || {}) };
    if (!newBest[sentenceId] || score > newBest[sentenceId]) {
      newBest[sentenceId] = score;
    }

    const updated = {
      ...p,
      streak: newStreak,
      xp: newXp,
      bestScores: newBest,
      lastPracticeDay: today,
    };
    saveProgress(updated);
    setStreak(newStreak);
    setXp(newXp);
    setBestScores(newBest);
  }

  async function handleRecordingComplete(audioBlob) {
    setLoading(true);
    setFeedback(null);
    setError("");

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const transcribeRes = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!transcribeRes.ok) throw new Error("Transcription failed");
      const { transcript: t } = await transcribeRes.json();
      setTranscript(t);

      const feedbackRes = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original: selectedSentence.text, transcript: t }),
      });

      if (!feedbackRes.ok) throw new Error("Feedback failed");
      const { feedback: fb } = await feedbackRes.json();
      setFeedback(fb);

      if (fb.score !== undefined) {
        updateProgress(selectedSentence.id, fb.score);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.topRow}>
          <div style={styles.logo}>VerbalStack</div>
        </div>

        <StreakBar streak={streak} xp={xp} />

        {showSelector ? (
          <>
            <p style={styles.label}>Choose a sentence</p>
            <SentenceSelector
              selectedId={selectedSentence.id}
              onSelect={(s) => {
                setSelectedSentence(s);
                setShowSelector(false);
                setFeedback(null);
                setTranscript("");
              }}
              bestScores={bestScores}
            />
          </>
        ) : (
          <>
            <div style={styles.sentenceHeader}>
              <p style={styles.label}>Practice sentence</p>
              <button style={styles.changeBtn} onClick={() => setShowSelector(true)}>
                Change
              </button>
            </div>
            <div style={styles.sentence}>"{selectedSentence.text}"</div>
            <div style={styles.focusPill}>{selectedSentence.focus}</div>

            <Recorder onRecordingComplete={handleRecordingComplete} />

            {loading && <div style={styles.loading}>Analyzing pronunciation...</div>}
            {error && <div style={styles.error}>{error}</div>}
            {transcript && (
              <div style={styles.transcript}>
                <span style={styles.transcriptLabel}>We heard:</span> "{transcript}"
              </div>
            )}
            {feedback && <Feedback feedback={feedback} />}
          </>
        )}
      </div>
    </main>
  );
}

function getPrevDay(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

const styles = {
  main: {
    minHeight: "100vh",
    background: "#1A2B47",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "48px",
    maxWidth: "620px",
    width: "100%",
    boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  logo: {
    fontFamily: "sans-serif",
    fontSize: "22px",
    fontWeight: "800",
    color: "#E8622A",
    letterSpacing: "-0.5px",
  },
  sentenceHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  label: {
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#6B7A94",
    margin: 0,
  },
  changeBtn: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#E8622A",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px 0",
    textDecoration: "underline",
  },
  sentence: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1A2B47",
    lineHeight: "1.5",
    marginBottom: "10px",
    padding: "20px",
    background: "#F7F4EF",
    borderRadius: "12px",
  },
  focusPill: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: "600",
    color: "#6B7A94",
    background: "#F0EDE8",
    padding: "4px 10px",
    borderRadius: "20px",
    marginBottom: "8px",
  },
  loading: {
    textAlign: "center",
    color: "#6B7A94",
    fontSize: "14px",
    padding: "16px 0",
    fontStyle: "italic",
  },
  error: {
    textAlign: "center",
    color: "#EF4444",
    fontSize: "14px",
    padding: "16px 0",
  },
  transcript: {
    fontSize: "14px",
    color: "#6B7A94",
    padding: "12px 16px",
    background: "#F7F4EF",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  transcriptLabel: {
    fontWeight: "600",
    color: "#1A2B47",
  },
};
