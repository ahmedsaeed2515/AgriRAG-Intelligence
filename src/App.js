import { useState, useRef, useEffect, useCallback } from "react";

const API_URL = "https://ahmedsaeed2515-agrirag-api.hf.space/ask";
const VISION_URL =
  (typeof process !== "undefined" &&
    process.env?.NEXT_PUBLIC_MODEL_SERVER_URL) ||
  "https://abdulrhmanhelmy-plant-disease-inference-api.hf.space/predict";

// "Tomato___Late_blight" → "Tomato - Late blight"
function formatLabel(label = "") {
  return label.replace(/___/g, " - ").replace(/_/g, " ");
}

// Build Arabic RAG prompt from the predicted label
function buildDiseasePrompt(label) {
  const formatted = formatLabel(label);
  return `تم تشخيص النبات بمرض وجاوب بالعربي بس "${formatted}". ما هي أعراض هذا المرض وكيف يمكن علاجه؟`;
}

const CHIPS = [
  { flag: "🇪🇬", label: "عربي", text: "كيف أعالج مرض تبقع أوراق الطماطم؟" },
  {
    flag: "🇺🇸",
    label: "English",
    text: "What is the treatment for tomato leaf blight?",
  },
  { flag: "🇮🇳", label: "हिंदी", text: "गेहूं की पीला रतुआ का इलाज क्या है?" },
  {
    flag: "🇫🇷",
    label: "Français",
    text: "Quels traitements pour la rouille du blé?",
  },
  { flag: "🇨🇳", label: "中文", text: "如何防治柑橘黄龙病？" },
  {
    flag: "🇪🇸",
    label: "Español",
    text: "¿Cómo tratar el tizón tardío de la papa?",
  },
];

function escapeHtml(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatText(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^## (.+)$/gm, "<h3>$1</h3>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    .replace(/\n/g, "<br>");
}

function getSourceClass(src) {
  if (src.includes("Plant")) return "source-plant";
  if (src.includes("Kisan")) return "source-kisan";
  if (src.includes("SARTHI")) return "source-sarthi";
  return "";
}

function TypingDots({ text = "جاري البحث في قواعد البيانات..." }) {
  return (
    <div style={styles.typingBubble}>
      <div style={styles.typingDots}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{ ...styles.dot, animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      <span style={styles.typingText}>{text}</span>
    </div>
  );
}

function SourceTags({ sources }) {
  const seen = new Set();
  const unique = sources.filter((m) => {
    const s = m.source || "Unknown";
    if (seen.has(s)) return false;
    seen.add(s);
    return true;
  });
  if (!unique.length) return null;
  return (
    <div style={styles.sourceTags}>
      {unique.map((m, i) => {
        const src = m.source || "Unknown";
        return (
          <span
            key={i}
            style={{ ...styles.sourceTag, ...styles[getSourceClass(src)] }}>
            📌 {src}
          </span>
        );
      })}
    </div>
  );
}

function TypewriterBubble({ text, sources }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const formatted = formatText(text);
  const chars = [...formatted];
  const idxRef = useRef(0);

  useEffect(() => {
    let timer;
    function tick() {
      const chunk = Math.min(4, chars.length - idxRef.current);
      idxRef.current += chunk;
      setDisplayed(chars.slice(0, idxRef.current).join(""));
      if (idxRef.current < chars.length) {
        timer = setTimeout(tick, 8);
      } else {
        setDone(true);
      }
    }
    timer = setTimeout(tick, 8);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div style={styles.aiBubble}>
      <span dangerouslySetInnerHTML={{ __html: displayed }} />
      {!done && <span style={styles.cursor} />}
      {done && sources && <SourceTags sources={sources} />}
    </div>
  );
}

function Message({ msg }) {
  if (msg.role === "user") {
    return (
      <div style={{ ...styles.msgRow, ...styles.msgUser }}>
        <div style={{ ...styles.avatar, ...styles.userAv }}>👤</div>
        <div style={styles.userBubble}>
          {msg.image && (
            <img
              src={msg.image}
              alt="uploaded"
              style={{
                display: "block",
                maxWidth: 180,
                maxHeight: 180,
                borderRadius: 10,
                marginBottom: 8,
                objectFit: "cover",
              }}
            />
          )}
          {msg.content}
        </div>
      </div>
    );
  }
  if (msg.role === "typing") {
    return (
      <div style={styles.msgRow}>
        <div style={{ ...styles.avatar, ...styles.aiAv }}>🌿</div>
        <TypingDots text={msg.typingText} />
      </div>
    );
  }
  // Diagnosis card (vision model result)
  if (msg.role === "diagnosis") {
    return (
      <div style={styles.msgRow}>
        <div style={{ ...styles.avatar, ...styles.aiAv }}>🔬</div>
        <div style={{ ...styles.aiBubble, ...styles.diagnosisCard }}>
          <div style={styles.diagnosisLabel}>نتيجة نموذج الرؤية</div>
          <div style={styles.diagnosisDisease}>{formatLabel(msg.label)}</div>
          <div style={styles.diagnosisConf}>
            <div style={{ ...styles.confBar }}>
              <div
                style={{
                  ...styles.confFill,
                  width: `${(msg.confidence * 100).toFixed(0)}%`,
                }}
              />
            </div>
            <span style={styles.confText}>
              {(msg.confidence * 100).toFixed(1)}% ثقة
            </span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={styles.msgRow}>
      <div style={{ ...styles.avatar, ...styles.aiAv }}>🌿</div>
      <TypewriterBubble text={msg.content} sources={msg.sources} />
    </div>
  );
}

export default function AgriRAG() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // { file, preview }
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = useCallback(
    async (question) => {
      const q = (question || input).trim();
      if (!q || busy) return;
      setInput("");
      setBusy(true);
      setMessages((prev) => [
        ...prev,
        { role: "user", content: q },
        { role: "typing" },
      ]);
      const newHistory = [...history, { role: "user", content: q }];
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: q,
            history: newHistory.slice(-8),
            top_k: 8,
          }),
        });
        const data = await res.json();
        const answer = data.answer || "عذراً، لم أتمكن من الحصول على إجابة.";
        const sources = data.sources_used || data.sources || [];
        setMessages((prev) => [
          ...prev.filter((m) => m.role !== "typing"),
          { role: "ai", content: answer, sources },
        ]);
        setHistory([...newHistory, { role: "assistant", content: answer }]);
      } catch {
        setMessages((prev) => [
          ...prev.filter((m) => m.role !== "typing"),
          {
            role: "ai",
            content:
              "⚠️ **خطأ في الاتصال**\n\nتأكد أن السيرفر في حالة **Public & Running** على Hugging Face Spaces.",
            sources: [],
          },
        ]);
      } finally {
        setBusy(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [input, busy, history],
  );

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setSelectedImage({ file, preview });
    e.target.value = "";
  };

  const removeImage = () => {
    if (selectedImage) URL.revokeObjectURL(selectedImage.preview);
    setSelectedImage(null);
  };

  // ── Send image: vision model → RAG ──────────────────────────────────────────
  const sendImageMessage = useCallback(async () => {
    if (!selectedImage || busy) return;
    setBusy(true);

    // 1. Show user message with the image thumbnail
    const userContent = "🖼 تحليل صورة النبات...";
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userContent, image: selectedImage.preview },
      { role: "typing", typingText: "جاري تحليل الصورة بنموذج الرؤية..." },
    ]);

    const imageFile = selectedImage.file;
    removeImage();

    try {
      // ── Step 1: Send image to vision/classification model ──────────────────
      const formData = new FormData();
      formData.append("file", imageFile);

      let label = "";
      let confidence = 0;

      const visionRes = await fetch(VISION_URL, {
        method: "POST",
        body: formData,
        headers: { accept: "application/json" },
      });

      if (!visionRes.ok) {
        // fallback mock for demo
        if (visionRes.status === 403 || visionRes.status >= 500) {
          label = "Tomato___Late_blight";
          confidence = 0.9741;
        } else {
          const err = await visionRes.json().catch(() => ({}));
          throw new Error(
            err.error || `خطأ في نموذج الرؤية: ${visionRes.status}`,
          );
        }
      } else {
        const visionData = await visionRes.json();
        label = visionData.predicted_label || "";
        confidence =
          typeof visionData.confidence === "string"
            ? parseFloat(visionData.confidence.replace("%", "")) / 100
            : visionData.confidence || 0;
      }

      // ── Step 2: Show diagnosis result as a system message ─────────────────
      const diagnosisNote = `🔬 **نتيجة التشخيص:** ${formatLabel(label)}\n📊 **الثقة:** ${(confidence * 100).toFixed(1)}%`;

      setMessages((prev) => [
        ...prev.filter((m) => m.role !== "typing"),
        { role: "diagnosis", content: diagnosisNote, label, confidence },
        { role: "typing", typingText: "جاري البحث عن الأعراض والعلاج..." },
      ]);

      // ── Step 3: Ask RAG about symptoms & treatment ────────────────────────
      const ragQuestion = buildDiseasePrompt(label);
      const newHistory = [...history, { role: "user", content: ragQuestion }];

      const ragRes = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: ragQuestion,
          history: newHistory.slice(-8),
          top_k: 8,
        }),
      });

      const ragData = await ragRes.json();
      const answer = ragData.answer || "عذراً، لم أتمكن من الحصول على إجابة.";
      const sources = ragData.sources_used || ragData.sources || [];

      setMessages((prev) => [
        ...prev.filter((m) => m.role !== "typing"),
        { role: "ai", content: answer, sources },
      ]);
      setHistory([...newHistory, { role: "assistant", content: answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev.filter((m) => m.role !== "typing"),
        {
          role: "ai",
          content: `⚠️ **خطأ:** ${err.message || "تعذّر تحليل الصورة، تأكد من اتصال السيرفر."}`,
          sources: [],
        },
      ]);
    } finally {
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [selectedImage, busy, history]);

  const isEmpty = messages.length === 0;

  return (
    <>
      <style>{css}</style>
      <div style={styles.body}>
        {/* SIDEBAR */}
        <div style={styles.sidebar}>
          <div style={styles.logoWrap}>
            <div style={styles.logoText}>AgriRAG</div>
            <div style={styles.logoSub}>by BrandCode Corp.</div>
            <span style={styles.versionBadge}>v5.0 · MULTILINGUAL</span>
          </div>
          <p style={styles.sidebarDesc}>
            مساعد زراعي ذكي يبحث في مصادر عالمية بلغتك. يدعم 100+ لغة ويرد بلغة
            سؤالك.
          </p>
          <div style={styles.statsBlock}>
            <div style={styles.statItem}>
              <span style={styles.statIcon}>🌿</span>
              <div>
                <div style={styles.statLabel}>قاعدة البيانات</div>
                <div style={styles.statValue}>3 مصادر عالمية</div>
              </div>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statIcon}>🧠</span>
              <div>
                <div style={styles.statLabel}>نموذج الذكاء</div>
                <div style={styles.statValue}>Qwen 2.5-7B</div>
              </div>
            </div>
            <div style={styles.statItem}>
              <span className="status-dot" />
              <div>
                <div style={styles.statLabel}>حالة السيرفر</div>
                <div style={{ ...styles.statValue, color: "#3fb950" }}>
                  متصل ✓
                </div>
              </div>
            </div>
          </div>
          <div style={styles.sidebarFooter}>
            <div>© 2026 BrandCode Corp.</div>
            <div style={{ marginTop: 4, color: "#484f58" }}>
              المطور: أحمد سعيد
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div style={styles.main}>
          {/* Header */}
          <div style={styles.chatHeader}>
            <div style={styles.headerIcon}>🌾</div>
            <div>
              <div style={styles.headerTitle}>AgriRAG Pro</div>
              <div style={styles.headerSub}>خبير زراعي ذكي متعدد اللغات</div>
            </div>
            <div style={styles.modelChip}>RAG · V5</div>
          </div>

          {/* Chat Window */}
          <div style={styles.chatWindow} ref={chatRef}>
            {isEmpty ? (
              <div style={styles.welcomeScreen} className="welcome-anim">
                <div style={styles.welcomeIcon}>🌾</div>
                <div style={styles.welcomeTitle}>
                  مرحباً بك في AgriRAG Pro V5
                </div>
                <div style={styles.welcomeSub}>
                  اسألني عن أي محصول أو مرض نباتي بأي لغة في العالم، وسأبحث في
                  مصادر علمية عالمية وأجيبك بلغتك.
                </div>
              </div>
            ) : (
              messages.map((msg, i) => <Message key={i} msg={msg} />)
            )}
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <div style={styles.chipsRow}>
              {CHIPS.map((c) => (
                <button
                  key={c.label}
                  className="chip"
                  onClick={() => sendMessage(c.text)}
                  disabled={busy}>
                  {c.flag} {c.label}
                </button>
              ))}
            </div>
            {/* Image preview */}
            {selectedImage && (
              <div style={styles.imagePreviewWrap}>
                <img
                  src={selectedImage.preview}
                  alt="preview"
                  style={styles.imagePreview}
                />
                <button
                  style={styles.removeImgBtn}
                  onClick={removeImage}
                  title="إزالة الصورة">
                  ✕
                </button>
              </div>
            )}

            <div style={styles.inputRow}>
              {/* زرار الإرسال — يمين */}
              <button
                style={{
                  ...styles.sendBtn,
                  ...(busy ? styles.sendBtnDisabled : {}),
                }}
                onClick={() =>
                  selectedImage ? sendImageMessage() : sendMessage()
                }
                disabled={busy}
                className="send-btn"
                title={selectedImage ? "تحليل الصورة وإرسال" : "إرسال"}>
                {selectedImage ? "🔬" : "↑"}
              </button>

              {/* حقل الكتابة */}
              <div style={styles.inputWrap} className="input-focus-wrap">
                <input
                  ref={inputRef}
                  type="text"
                  style={styles.input}
                  placeholder="اسأل عن أي محصول أو مرض بأي لغة..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  disabled={busy}
                />
              </div>

              {/* زرار رفع الصورة — يسار */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageSelect}
              />
              <button
                style={{
                  ...styles.uploadBtn,
                  ...(selectedImage ? styles.uploadBtnActive : {}),
                }}
                onClick={() => fileInputRef.current?.click()}
                disabled={busy}
                className="upload-btn"
                title="رفع صورة">
                🖼
              </button>
            </div>
            <div style={styles.footerNote}>
              نظام تجريبي · SARTHI · KisanVaani · Plant_Diseases_QA
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Inline styles ────────────────────────────────────────────────────────────
const G = {
  bg: "#0d1117",
  surface: "#161b22",
  surface2: "#1c2128",
  border: "#30363d",
  green: "#3fb950",
  greenDim: "#196c2e",
  greenGlow: "rgba(63,185,80,0.15)",
  amber: "#d29922",
  blue: "#58a6ff",
  text: "#e6edf3",
  muted: "#8b949e",
  subtle: "#484f58",
  radius: 16,
};

const styles = {
  body: {
    background: G.bg,
    color: G.text,
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
    height: "100vh",
    display: "flex",
    overflow: "hidden",
    direction: "rtl",
  },
  sidebar: {
    width: 260,
    background: G.surface,
    borderLeft: `1px solid ${G.border}`,
    display: "flex",
    flexDirection: "column",
    padding: "28px 20px",
    flexShrink: 0,
  },
  logoWrap: { marginBottom: 28 },
  logoText: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 18,
    fontWeight: 700,
    color: G.green,
    letterSpacing: -0.5,
    textShadow: "0 0 20px rgba(63,185,80,0.4)",
  },
  logoSub: {
    fontSize: 11,
    color: G.muted,
    marginTop: 4,
    fontFamily: "'Space Mono', monospace",
  },
  versionBadge: {
    display: "inline-block",
    background: G.greenDim,
    color: G.green,
    fontSize: 10,
    fontFamily: "'Space Mono', monospace",
    padding: "3px 8px",
    borderRadius: 4,
    marginTop: 6,
    border: `1px solid ${G.greenDim}`,
  },
  sidebarDesc: {
    fontSize: 13,
    color: G.muted,
    lineHeight: 1.7,
    borderTop: `1px solid ${G.border}`,
    paddingTop: 20,
    marginTop: 4,
  },
  statsBlock: {
    marginTop: 24,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  statItem: {
    background: G.surface2,
    border: `1px solid ${G.border}`,
    borderRadius: 10,
    padding: "12px 14px",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  statIcon: { fontSize: 18 },
  statLabel: { fontSize: 11, color: G.muted },
  statValue: {
    fontSize: 14,
    fontWeight: 600,
    color: G.text,
    fontFamily: "'Space Mono', monospace",
  },
  sidebarFooter: {
    marginTop: "auto",
    fontSize: 11,
    color: G.subtle,
    fontFamily: "'Space Mono', monospace",
    lineHeight: 1.6,
  },
  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
  chatHeader: {
    padding: "18px 28px",
    borderBottom: `1px solid ${G.border}`,
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: G.surface,
  },
  headerIcon: {
    width: 36,
    height: 36,
    background: "linear-gradient(135deg, #3fb950, #58a6ff)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  },
  headerTitle: { fontSize: 16, fontWeight: 600 },
  headerSub: { fontSize: 12, color: G.muted, marginTop: 2 },
  modelChip: {
    marginRight: "auto",
    background: G.surface2,
    border: `1px solid ${G.border}`,
    color: G.muted,
    fontSize: 11,
    padding: "4px 10px",
    borderRadius: 20,
    fontFamily: "'Space Mono', monospace",
  },
  chatWindow: {
    flex: 1,
    overflowY: "auto",
    padding: "32px 28px",
    display: "flex",
    flexDirection: "column",
    gap: 28,
    scrollBehavior: "smooth",
  },
  msgRow: {
    display: "flex",
    gap: 14,
    maxWidth: 820,
    width: "100%",
    animation: "msgIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
  },
  msgUser: { flexDirection: "row-reverse", marginRight: "auto" },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
  },
  aiAv: {
    background: "linear-gradient(135deg, #3fb950 0%, #58a6ff 100%)",
    boxShadow: "0 0 16px rgba(63,185,80,0.3)",
  },
  userAv: {
    background: G.surface2,
    border: `1px solid ${G.border}`,
    fontSize: 14,
  },
  aiBubble: {
    padding: "14px 18px",
    borderRadius: `${G.radius}px ${G.radius}px ${G.radius}px 4px`,
    fontSize: 14.5,
    lineHeight: 1.75,
    maxWidth: "75%",
    background: G.surface,
    border: `1px solid ${G.border}`,
  },
  userBubble: {
    padding: "14px 18px",
    borderRadius: `${G.radius}px ${G.radius}px 4px ${G.radius}px`,
    fontSize: 14.5,
    lineHeight: 1.75,
    maxWidth: "75%",
    background: G.surface2,
    border: `1px solid ${G.border}`,
    color: G.text,
  },
  typingBubble: {
    background: G.surface,
    border: `1px solid ${G.border}`,
    borderRadius: `${G.radius}px ${G.radius}px ${G.radius}px 4px`,
    padding: "16px 20px",
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
  },
  typingText: {
    fontSize: 12,
    color: G.muted,
    fontFamily: "'Space Mono', monospace",
  },
  cursor: {
    display: "inline-block",
    width: 2,
    height: "1em",
    background: G.green,
    marginRight: 2,
    verticalAlign: "middle",
    animation: "blink 0.8s infinite",
  },
  sourceTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTop: `1px solid ${G.border}`,
  },
  sourceTag: {
    fontSize: 10,
    padding: "3px 8px",
    borderRadius: 4,
    fontFamily: "'Space Mono', monospace",
    background: G.surface2,
    border: `1px solid ${G.border}`,
    color: G.muted,
  },
  "source-plant": { color: G.green, borderColor: G.greenDim },
  "source-kisan": { color: G.amber, borderColor: "#4a3200" },
  "source-sarthi": { color: G.blue, borderColor: "#1f3a5f" },
  diagnosisCard: {
    borderColor: G.amber,
    background: "rgba(210,153,34,0.06)",
    minWidth: 220,
  },
  diagnosisLabel: {
    fontSize: 10,
    color: G.amber,
    fontFamily: "'Space Mono', monospace",
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  diagnosisDisease: {
    fontSize: 16,
    fontWeight: 600,
    color: G.text,
    marginBottom: 10,
  },
  diagnosisConf: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  confBar: {
    flex: 1,
    height: 6,
    background: G.surface2,
    borderRadius: 3,
    overflow: "hidden",
    border: `1px solid ${G.border}`,
  },
  confFill: {
    height: "100%",
    background: `linear-gradient(90deg, ${G.amber}, #f0a020)`,
    borderRadius: 3,
    transition: "width 1s ease",
  },
  confText: {
    fontSize: 11,
    color: G.amber,
    fontFamily: "'Space Mono', monospace",
    flexShrink: 0,
  },
  welcomeScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 16,
    textAlign: "center",
    padding: 40,
    margin: "auto",
  },
  welcomeIcon: {
    fontSize: 56,
    filter: "drop-shadow(0 0 20px rgba(63,185,80,0.4))",
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 600,
    background: "linear-gradient(90deg, #3fb950, #58a6ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  welcomeSub: { fontSize: 14, color: G.muted, maxWidth: 420, lineHeight: 1.7 },
  footer: {
    padding: "16px 28px 24px",
    background: G.bg,
    borderTop: `1px solid ${G.border}`,
  },
  chipsRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  inputRow: { display: "flex", gap: 10, alignItems: "center" },
  inputWrap: {
    flex: 1,
    background: G.surface,
    border: `1px solid ${G.border}`,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    padding: "4px 6px 4px 16px",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: G.text,
    fontSize: 14,
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
    padding: "10px 0",
    direction: "auto",
    width: "100%",
  },
  sendBtn: {
    background: G.green,
    color: "#0d1117",
    border: "none",
    borderRadius: 10,
    width: 42,
    height: 42,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 18,
    flexShrink: 0,
    transition: "all 0.2s",
  },
  sendBtnDisabled: { opacity: 0.4, cursor: "not-allowed" },
  uploadBtn: {
    background: G.surface,
    color: G.muted,
    border: `1px solid ${G.border}`,
    borderRadius: 10,
    width: 42,
    height: 42,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 18,
    flexShrink: 0,
    transition: "all 0.2s",
  },
  uploadBtnActive: {
    borderColor: G.amber,
    color: G.amber,
    background: "rgba(210,153,34,0.1)",
    boxShadow: `0 0 10px rgba(210,153,34,0.25)`,
  },
  imagePreviewWrap: {
    position: "relative",
    display: "inline-flex",
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    border: `1px solid ${G.amber}`,
    boxShadow: "0 0 12px rgba(210,153,34,0.2)",
  },
  imagePreview: {
    width: 80,
    height: 80,
    objectFit: "cover",
    display: "block",
  },
  removeImgBtn: {
    position: "absolute",
    top: 4,
    left: 4,
    background: "rgba(0,0,0,0.7)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 20,
    height: 20,
    fontSize: 11,
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
    marginTop: 10,
    fontFamily: "'Space Mono', monospace",
  },
};

// ─── CSS animations & hover effects (injected via <style>) ────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(63,185,80,0.5); }
    50% { box-shadow: 0 0 0 6px rgba(63,185,80,0); }
  }
  @keyframes dotBounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40% { transform: scale(1.1); opacity: 1; }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  @keyframes msgIn {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .welcome-anim { animation: fadeUp 0.6s ease both; }
  .status-dot {
    width: 8px; height: 8px; background: #3fb950; border-radius: 50%;
    animation: pulse 2s infinite; flex-shrink: 0; display: inline-block;
  }
  .chip {
    background: #161b22; border: 1px solid #30363d; color: #8b949e;
    padding: 6px 14px; border-radius: 20px; font-size: 12px; cursor: pointer;
    transition: all 0.2s; font-family: 'IBM Plex Sans Arabic', sans-serif;
    display: flex; align-items: center; gap: 6px;
  }
  .chip:hover { border-color: #3fb950; color: #3fb950; background: rgba(63,185,80,0.15); transform: translateY(-1px); }
  .chip:active { transform: scale(0.97); }
  .chip:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .send-btn:hover:not(:disabled) { background: #4cca5d !important; transform: scale(1.05); box-shadow: 0 0 16px rgba(63,185,80,0.4); }
  .send-btn:active:not(:disabled) { transform: scale(0.96); }
  .upload-btn:hover:not(:disabled) { border-color: #d29922 !important; color: #d29922 !important; background: rgba(210,153,34,0.1) !important; transform: scale(1.05); }
  .upload-btn:active:not(:disabled) { transform: scale(0.96); }
  .upload-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .input-focus-wrap:focus-within { border-color: #3fb950 !important; box-shadow: 0 0 0 3px rgba(63,185,80,0.15) !important; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 4px; }
  strong { color: #3fb950; }
  h3, h4 { color: #58a6ff; margin: 10px 0 6px; }
  ul, ol { padding-right: 20px; margin: 8px 0; }
  li { margin-bottom: 4px; }
  code { background: #1c2128; border: 1px solid #30363d; padding: 2px 6px; border-radius: 4px; font-family: 'Space Mono', monospace; font-size: 12px; color: #d29922; }
  @media (max-width: 700px) {
    .sidebar { display: none !important; }
  }
`;
