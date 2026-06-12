export default function Feedback({ feedback }) {
  const items = [
    { key: "well", label: "What you did well", color: "#22C55E", bg: "#F0FDF4", border: "#22C55E" },
    { key: "work", label: "What to work on", color: "#E8622A", bg: "#FFF7F4", border: "#E8622A" },
    { key: "tip", label: "Tip to improve", color: "#F5A623", bg: "#FFFBF0", border: "#F5A623" },
  ];

  const score = feedback.score ?? null;
  const scoreColor = score >= 80 ? "#22C55E" : score >= 55 ? "#F5A623" : "#E8622A";

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <p style={styles.heading}>Your feedback</p>
        {score !== null && (
          <div style={{ ...styles.scoreBadge, borderColor: scoreColor }}>
            <span style={{ ...styles.scoreNum, color: scoreColor }}>{score}</span>
            <span style={styles.scoreMax}>/100</span>
          </div>
        )}
      </div>
      {items.map((item) => (
        <div
          key={item.key}
          style={{
            ...styles.item,
            background: item.bg,
            borderLeft: `3px solid ${item.border}`,
          }}
        >
          <div style={{ ...styles.tag, color: item.color }}>{item.label}</div>
          <div style={styles.text}>{feedback[item.key]}</div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "8px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "4px",
  },
  heading: {
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#6B7A94",
    margin: 0,
  },
  scoreBadge: {
    display: "flex",
    alignItems: "baseline",
    gap: "2px",
    padding: "4px 10px",
    borderRadius: "20px",
    border: "1.5px solid",
    background: "white",
  },
  scoreNum: {
    fontSize: "18px",
    fontWeight: "800",
    lineHeight: 1,
  },
  scoreMax: {
    fontSize: "11px",
    color: "#6B7A94",
    fontWeight: "500",
  },
  item: {
    padding: "14px 16px",
    borderRadius: "10px",
  },
  tag: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "6px",
  },
  text: {
    fontSize: "14px",
    lineHeight: "1.65",
    color: "#1A2B47",
    fontWeight: "300",
  },
};
