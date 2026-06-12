import { useState } from "react";
import { SENTENCES, DIFFICULTY_TIERS } from "../data/sentences";

export default function SentenceSelector({ selectedId, onSelect, bestScores }) {
  const [activeTier, setActiveTier] = useState("easy");

  const tiers = ["easy", "medium", "hard"];
  const filtered = SENTENCES.filter((s) => s.tier === activeTier);

  return (
    <div style={styles.wrapper}>
      <div style={styles.tierTabs}>
        {tiers.map((tier) => {
          const t = DIFFICULTY_TIERS[tier];
          const isActive = activeTier === tier;
          return (
            <button
              key={tier}
              onClick={() => setActiveTier(tier)}
              style={{
                ...styles.tab,
                background: isActive ? t.color : "transparent",
                color: isActive ? "white" : t.color,
                border: `1.5px solid ${t.color}`,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <p style={styles.tierDesc}>{DIFFICULTY_TIERS[activeTier].description}</p>

      <div style={styles.list}>
        {filtered.map((s) => {
          const isSelected = s.id === selectedId;
          const best = bestScores?.[s.id];
          const t = DIFFICULTY_TIERS[s.tier];
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              style={{
                ...styles.sentenceBtn,
                border: isSelected
                  ? `2px solid ${t.color}`
                  : "2px solid transparent",
                background: isSelected ? t.bg : "#F7F4EF",
              }}
            >
              <div style={styles.sentenceText}>"{s.text}"</div>
              <div style={styles.meta}>
                <span style={styles.focus}>{s.focus}</span>
                {best !== undefined && (
                  <span style={{ ...styles.score, color: t.color }}>
                    Best: {best}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    marginBottom: "24px",
  },
  tierTabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "8px",
  },
  tab: {
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    letterSpacing: "0.05em",
    transition: "all 0.15s ease",
  },
  tierDesc: {
    fontSize: "12px",
    color: "#6B7A94",
    marginBottom: "12px",
    fontStyle: "italic",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  sentenceBtn: {
    textAlign: "left",
    padding: "12px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.15s ease",
    width: "100%",
  },
  sentenceText: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#1A2B47",
    lineHeight: "1.5",
    marginBottom: "4px",
  },
  meta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  focus: {
    fontSize: "11px",
    color: "#6B7A94",
    fontWeight: "500",
  },
  score: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.04em",
  },
};
