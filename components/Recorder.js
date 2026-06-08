import { useState, useRef } from "react";

export default function Recorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        onRecordingComplete(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied. Please allow microphone access and try again.");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        style={{
          ...styles.btn,
          background: isRecording ? "#EF4444" : "#E8622A",
          boxShadow: isRecording
            ? "0 0 0 8px rgba(239,68,68,0.15)"
            : "0 8px 24px rgba(232,98,42,0.35)",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v6a2 2 0 0 0 4 0V5a2 2 0 0 0-2-2zm-1 16.93V22h2v-2.07A8 8 0 0 0 20 12h-2a6 6 0 0 1-12 0H4a8 8 0 0 0 7 7.93z" />
        </svg>
      </button>
      <p style={styles.label}>
        {isRecording ? "Recording... click to stop" : "Click to record"}
      </p>
      {isRecording && (
        <div style={styles.waveform}>
          {[...Array(7)].map((_, i) => (
            <span
              key={i}
              style={{
                ...styles.bar,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}
      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "24px 0",
  },
  btn: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  label: {
    fontSize: "13px",
    color: "#6B7A94",
    fontWeight: "500",
  },
  waveform: {
    display: "flex",
    alignItems: "center",
    gap: "3px",
    height: "24px",
  },
  bar: {
    display: "block",
    width: "3px",
    height: "100%",
    background: "#E8622A",
    borderRadius: "2px",
    animation: "wave 1.1s ease-in-out infinite",
  },
};
