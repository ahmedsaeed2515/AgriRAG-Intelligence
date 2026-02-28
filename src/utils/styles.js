// ========================
// Agricultural Green Palette
// ========================
export const G = {
  bg: "#0d1a10",           // Deep forest dark background
  bgAlt: "#111c14",        // Slightly lighter alternate bg
  surface: "#162219",      // Card / input background
  surface2: "#1e3324",     // Hover states / elevated surfaces
  border: "rgba(22,163,74,0.18)",
  green: "#16a34a",        // Primary agricultural green
  greenBright: "#22c55e",  // Accent bright green
  greenDim: "rgba(22, 163, 74, 0.2)",
  greenGlow: "rgba(22, 163, 74, 0.12)",
  greenText: "#86efac",    // Soft green text
  amber: "#f59e0b",
  blue: "#3b82f6",
  text: "#e7f4ec",         // Slightly warm white text
  muted: "#8aad97",        // Muted grey-green
  subtle: "#4b6b55",       // Very subtle text
  radius: 20,
};

export const chatStyles = {
  body: {
    background: G.bg,
    color: G.text,
    fontFamily: "'Inter', 'IBM Plex Sans Arabic', sans-serif",
    height: "100vh",
    display: "flex",
    overflow: "hidden",
    direction: "rtl",
  },

  // ===== SIDEBAR =====
  sidebar: {
    width: 260,
    background: "#090f0b",
    display: "flex",
    flexDirection: "column",
    padding: "20px 14px",
    flexShrink: 0,
    zIndex: 10,
    borderLeft: `1px solid ${G.border}`,
  },
  logoWrap: { marginBottom: 24, padding: "10px" },
  logoText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: G.text,
    letterSpacing: -0.5,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  logoSub: {
    fontSize: 11,
    color: G.muted,
    marginTop: 4,
  },
  versionBadge: {
    display: "inline-block",
    background: G.greenDim,
    color: G.green,
    fontSize: 10,
    fontWeight: "bold",
    padding: "3px 8px",
    borderRadius: 6,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  sidebarDesc: {
    fontSize: 13,
    color: G.muted,
    lineHeight: 1.6,
    padding: "10px",
  },
  statsBlock: {
    marginTop: 16,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: "10px"
  },
  statItem: {
    padding: "10px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    borderRadius: 8,
    transition: "background 0.2s",
  },
  statIcon: { fontSize: 18 },
  statLabel: { fontSize: 12, color: G.muted },
  statValue: { fontSize: 13, fontWeight: 600, color: G.text },
  sidebarFooter: {
    marginTop: "auto",
    fontSize: 12,
    color: G.subtle,
    lineHeight: 1.6,
    padding: "10px"
  },

  // ===== MAIN AREA =====
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    position: "relative",
    background: `linear-gradient(160deg, #0d1a10 0%, #0a150c 50%, #081209 100%)`,
  },

  // ===== HEADER =====
  chatHeader: {
    padding: "14px 24px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    background: "rgba(13,26,16,0.85)",
    backdropFilter: "blur(12px)",
    borderBottom: `1px solid ${G.border}`,
  },
  headerIcon: { display: "none" },
  headerTitle: { fontSize: 17, fontWeight: 600, color: G.text },
  headerSub: { display: "none" },
  modelChip: {
    marginRight: "auto",
    color: G.muted,
    fontSize: 12,
    fontWeight: "500",
    padding: "4px 10px",
    borderRadius: 8,
  },

  // ===== CHAT WINDOW =====
  chatWindow: {
    flex: 1,
    overflowY: "auto",
    padding: "88px 24px 48px",
    display: "flex",
    flexDirection: "column",
    gap: 0,            // we'll use margin-bottom per row instead
    scrollBehavior: "smooth",
    alignItems: "stretch",  // rows take full width
  },
  // Wrapper centering each message row
  msgRow: {
    display: "flex",
    justifyContent: "center",   // center the inner content block
    width: "100%",
    padding: "6px 0",
    animation: "msgIn 0.35s cubic-bezier(.22,.61,.36,1) both",
  },
  // The actual message block (max-width container)
  msgInner: {
    display: "flex",
    gap: 12,
    maxWidth: 780,
    width: "100%",
    alignItems: "flex-start",
  },
  msgUser: {
    flexDirection: "row-reverse",  // avatar on left, bubble on right
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    marginTop: 2,
  },
  aiAv: {
    background: "linear-gradient(135deg, #16a34a, #15803d)",
    color: "#fff",
    boxShadow: "0 2px 8px rgba(22,163,74,0.3)",
  },
  userAv: {
    background: G.surface2,
    color: G.muted,
    border: `1px solid ${G.border}`,
  },

  // AI message bubble — clean, no bg box
  aiBubble: {
    fontSize: 15,
    lineHeight: 1.8,
    maxWidth: "90%",
    color: G.text,
    padding: "2px 0",
  },

  // User message bubble — styled pill
  userBubble: {
    padding: "13px 18px",
    borderRadius: "20px 6px 20px 20px",
    fontSize: 15,
    lineHeight: 1.65,
    maxWidth: "70%",
    background: "linear-gradient(135deg, #1a3d23, #162d1b)",
    color: "#d1fae5",
    border: "1px solid rgba(22,163,74,0.25)",
    boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
    wordBreak: "break-word",
  },

  // ===== TYPING INDICATOR =====
  typingBubble: {
    padding: "10px 0",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  typingDots: { display: "flex", gap: 5, alignItems: "center" },
  dot: {
    width: 7,
    height: 7,
    background: G.green,
    borderRadius: "50%",
    display: "inline-block",
    animation: "dotBounce 1.2s infinite ease-in-out",
    opacity: 0.8,
  },
  typingText: { fontSize: 13, color: G.muted, fontStyle: "italic" },

  // ===== TYPEWRITER CURSOR =====
  cursor: {
    display: "inline-block",
    width: 2,
    height: 16,
    background: G.green,
    marginLeft: 3,
    verticalAlign: "middle",
    animation: "blink 0.9s step-end infinite",
    borderRadius: 2,
    boxShadow: "0 0 6px rgba(22,163,74,0.6)",
  },

  // ===== SOURCE TAGS =====
  sourceTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  sourceTag: {
    fontSize: 11,
    padding: "4px 10px",
    borderRadius: 16,
    background: G.surface,
    color: G.muted,
    border: `1px solid ${G.border}`,
    display: "flex",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  "source-plant": { color: G.green },
  "source-kisan": { color: G.amber },
  "source-sarthi": { color: G.blue },

  // ===== DIAGNOSIS CARD =====
  diagnosisCard: {
    background: "linear-gradient(135deg, #1a3d23, #162d1b)",
    padding: "18px 22px",
    borderRadius: 16,
    border: `1px solid rgba(22,163,74,0.3)`,
    minWidth: 280,
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  },
  diagnosisLabel: {
    fontSize: 11,
    color: G.muted,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  diagnosisDisease: {
    fontSize: 19,
    fontWeight: 700,
    color: G.text,
    marginBottom: 18,
  },
  diagnosisConf: { display: "flex", alignItems: "center", gap: 12 },
  confBar: {
    flex: 1,
    height: 6,
    background: "rgba(255,255,255,0.06)",
    borderRadius: 3,
    overflow: "hidden",
  },
  confFill: {
    height: "100%",
    background: "linear-gradient(90deg, #16a34a, #22c55e)",
    borderRadius: 3,
    transition: "width 1.2s ease",
    boxShadow: "0 0 8px rgba(22,163,74,0.5)",
  },
  confText: {
    fontSize: 13,
    color: G.green,
    fontWeight: "600",
  },

  // ===== WELCOME SCREEN =====
  welcomeScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 24,
    textAlign: "center",
    padding: 20,
    margin: "auto",
  },
  welcomeIcon: {
    fontSize: 48,
    background: G.greenGlow,
    width: 90,
    height: 90,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    boxShadow: "0 0 40px rgba(22,163,74,0.15)",
    border: `1px solid rgba(22,163,74,0.3)`,
  },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#d1fae5",
    letterSpacing: -0.5,
  },
  welcomeSub: {
    fontSize: 15,
    color: G.muted,
    maxWidth: 480,
    lineHeight: 1.75,
  },

  // ===== FOOTER / INPUT BAR =====
  footer: {
    padding: "14px 20px 28px",
    background: "rgba(13,26,16,0.85)",
    backdropFilter: "blur(12px)",
    borderTop: `1px solid ${G.border}`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  chipsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
    maxWidth: 780,
    justifyContent: "center",
    width: "100%",
  },
  inputWrap: {
    width: "100%",
    maxWidth: 780,
    background: G.surface,
    border: `1px solid ${G.border}`,
    borderRadius: 24,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    padding: "12px 16px",
    transition: "all 0.25s",
    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: G.text,
    fontSize: 15,
    fontFamily: "inherit",
    padding: "4px 0",
    direction: "auto",
    width: "100%",
  },
  sendBtn: {
    background: G.green,
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 34,
    height: 34,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 16,
    flexShrink: 0,
    transition: "all 0.2s",
    boxShadow: "0 2px 8px rgba(22,163,74,0.35)",
  },
  sendBtnDisabled: { opacity: 0.3, cursor: "not-allowed" },
  uploadBtn: {
    background: "transparent",
    color: G.muted,
    border: "none",
    borderRadius: "50%",
    width: 34,
    height: 34,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 20,
    flexShrink: 0,
    transition: "all 0.2s",
  },
  uploadBtnActive: { color: G.greenText },
  imagePreviewWrap: {
    position: "relative",
    display: "inline-flex",
    marginBottom: 12,
    alignSelf: "flex-start",
    borderRadius: 12,
    overflow: "hidden",
    border: `2px solid rgba(22,163,74,0.4)`,
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  },
  imagePreview: {
    width: 72,
    height: 72,
    objectFit: "cover",
    display: "block",
  },
  removeImgBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    background: "rgba(0,0,0,0.7)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 20,
    height: 20,
    fontSize: 10,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
  },
  footerNote: {
    fontSize: 11,
    textAlign: "center",
    color: G.subtle,
    marginTop: 14,
  },
};
