import { useState } from "react";
import Recorder from "../components/Recorder";
import Feedback from "../components/Feedback";

const SENTENCE = "The thirty-three thieves thought that they thrilled the throne throughout Thursday.";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const { transcript } = await transcribeRes.json();
      setTranscript(transcript);

      const feedbackRes = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original: SENTENCE, transcript }),
      });

      if (!feedbackRes.ok) throw new Error("Feedback failed");
      const { feedback } = await feedbackRes.json();
      setFeedback(feedback);

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.logo}>VerbalStack</div>
        <p style={styles.label}>Practice sentence</p>
        <div style={styles.sentence}>"{SENTENCE}"</div>
        <Recorder onRecordingComplete={handleRecordingComplete} />
        {loading && <div style={styles.loading}>Analyzing pronunciation...</div>}
        {error && <div style={styles.error}>{error}</div>}
        {transcript && (
          <div style={styles.transcript}>
            <span style={styles.transcriptLabel}>We heard:</span> "{transcript}"
          </div>
        )}
        {feedback && <Feedback feedback={feedback} />}
      </div>
    </main>
  );
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
  logo: {
    fontFamily: "sans-serif",
    fontSize: "22px",
    fontWeight: "800",
    color: "#E8622A",
    marginBottom: "32px",
    letterSpacing: "-0.5px",
  },
  label: {
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#6B7A94",
    marginBottom: "10px",
  },
  sentence: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1A2B47",
    lineHeight: "1.5",
    marginBottom: "32px",
    padding: "20px",
    background: "#F7F4EF",
    borderRadius: "12px",
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
