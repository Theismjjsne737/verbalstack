export default function StreakBar({ streak, xp }) {
  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;

  return (
    <div style={styles.wrapper}>
      <div style={styles.stat}>
        <span style={styles.icon}>🔥</span>
        <span style={styles.value}>{streak}</span>
        <span style={styles.subLabel}>day streak</span>
      </div>
      <div style={styles.divider} />
      <div style={styles.xpBlock}>
        <div style={styles.xpHeader}>
          <span style={styles.levelLabel}>Level {level}</span>
          <span style={styles.xpLabel}>{xpInLevel} / 100 XP</span>
        </div>
        <div style={styles.track}>
          <div
            style={{
              ...styles.fill,
              width: `${xpInLevel}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "12px 16px",
    background: "#F7F4EF",
    borderRadius: "12px",
    marginBottom: "24px",
  },
  stat: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexShrink: 0,
  },
  icon: {
    fontSize: "18px",
    lineHeight: 1,
  },
  value: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#1A2B47",
    lineHeight: 1,
  },
  subLabel: {
    fontSize: "11px",
    color: "#6B7A94",
    fontWeight: "500",
  },
  divider: {
    width: "1px",
    height: "28px",
    background: "#D9D5CE",
    flexShrink: 0,
  },
  xpBlock: {
    flex: 1,
  },
  xpHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
  },
  levelLabel: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#E8622A",
  },
  xpLabel: {
    fontSize: "11px",
    color: "#6B7A94",
  },
  track: {
    height: "6px",
    background: "#D9D5CE",
    borderRadius: "3px",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    background: "linear-gradient(90deg, #E8622A, #F5A623)",
    borderRadius: "3px",
    transition: "width 0.4s ease",
  },
};
