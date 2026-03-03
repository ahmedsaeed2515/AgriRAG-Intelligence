import React, { useState, useRef, useEffect } from "react";
import { formatLabel, formatText, getSourceClass } from "../utils/helpers";
import { chatStyles as styles } from "../utils/styles";

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

function MessageActions({ text, isLast, onRegenerate }) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleCopy = () => {
    // Strip HTML tags for clean copying
    const temp = document.createElement("div");
    temp.innerHTML = text;
    const cleanText = temp.textContent || temp.innerText || "";
    navigator.clipboard.writeText(cleanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="msg-actions">
      <button className="action-btn" title="نسخ" onClick={handleCopy}>
        {copied ? "✓" : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        )}
      </button>
      <button 
        className="action-btn" 
        title="أعجبتني" 
        style={{ color: feedback === 'like' ? '#16a34a' : 'inherit' }}
        onClick={() => setFeedback(feedback === 'like' ? null : 'like')}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill={feedback === 'like' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
        </svg>
      </button>
      <button 
        className="action-btn" 
        title="لم تعجبني" 
        style={{ color: feedback === 'dislike' ? '#f85149' : 'inherit' }}
        onClick={() => setFeedback(feedback === 'dislike' ? null : 'dislike')}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill={feedback === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2"></path>
        </svg>
      </button>
      {isLast && onRegenerate && (
        <button className="action-btn" title="إعادة التوليد" onClick={onRegenerate}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <polyline points="1 4 1 10 7 10"></polyline>
             <polyline points="23 20 23 14 17 14"></polyline>
             <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
          </svg>
        </button>
      )}
    </div>
  );
}

function TypewriterBubble({ text, sources, isLast, onRegenerate, isNew }) {
  const [displayed, setDisplayed] = useState(isNew ? "" : formatText(text));
  const [done, setDone] = useState(!isNew);
  const idxRef = useRef(0);

  useEffect(() => {
    if (!isNew) {
      setDisplayed(formatText(text));
      setDone(true);
      return;
    }

    const formatted = formatText(text);
    const chars = [...formatted];
    let timer;
    
    function tick() {
      const chunk = Math.min(6, chars.length - idxRef.current);
      idxRef.current += chunk;
      setDisplayed(chars.slice(0, idxRef.current).join(""));
      if (idxRef.current < chars.length) {
        timer = setTimeout(tick, 10);
      } else {
        setDone(true);
      }
    }
    
    // reset if text changes
    idxRef.current = 0;
    setDisplayed("");
    setDone(false);
    
    timer = setTimeout(tick, 10);
    return () => clearTimeout(timer);
  }, [text, isNew]);

  return (
    <div style={styles.aiBubble}>
      <span dangerouslySetInnerHTML={{ __html: displayed }} />
      {!done && <span style={styles.cursor} />}
      {done && sources && <SourceTags sources={sources} />}
      {done && <MessageActions text={displayed} isLast={isLast} onRegenerate={onRegenerate} />}
    </div>
  );
}

export default function Message({ msg, isLast, onRegenerate }) {
  if (msg.role === "user") {
    return (
      <div style={styles.msgRow}>
        <div style={{ ...styles.msgInner, ...styles.msgUser }}>
          <div style={{ ...styles.avatar, ...styles.userAv }}>👤</div>
          <div style={styles.userBubble}>
            {msg.image && (
              <img
                src={msg.image}
                alt="uploaded"
                style={{
                  display: "block",
                  maxWidth: 360,
                  maxHeight: 360,
                  width: "100%",
                  borderRadius: 14,
                  marginBottom: 10,
                  objectFit: "cover",
                  border: "1px solid rgba(22,163,74,0.2)",
                }}
              />
            )}
            {msg.content}
          </div>
        </div>
      </div>
    );
  }
  if (msg.role === "typing") {
    return (
      <div style={styles.msgRow}>
        <div style={styles.msgInner}>
          <div style={{ ...styles.avatar, ...styles.aiAv }}>🌿</div>
          <TypingDots text={msg.typingText} />
        </div>
      </div>
    );
  }
  if (msg.role === "diagnosis") {
    if (msg.type === "non_plant") {
      return (
        <div style={styles.msgRow}>
          <div style={styles.msgInner}>
            <div style={{ ...styles.avatar, ...styles.aiAv }}>⚠️</div>
            <div style={{ ...styles.aiBubble, ...styles.diagnosisCard, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)" }}>
              <div style={{ ...styles.diagnosisLabel, color: "#f59e0b" }}>تنبيه - كائن غير زراعي</div>
              <div style={styles.diagnosisDisease}>{msg.label}</div>
              {msg.message && (
                <div style={{ marginTop: 8, fontSize: 13, color: "#fde68a", lineHeight: 1.5 }}>
                  {msg.message}
                </div>
              )}
              <div style={styles.diagnosisConf}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <div style={{ ...styles.confBar, background: "rgba(245,158,11,0.2)", flex: 1 }}>
                      <div
                        style={{
                          ...styles.confFill,
                          background: "#f59e0b",
                          width: `${Math.min(msg.confidence * 100, 100).toFixed(0)}%`,
                        }}
                      />
                    </div>
                    <span style={{ ...styles.confText, color: "#fde68a" }}>
                      {(msg.confidence * 100).toFixed(1)}% ثقة (الخام)
                    </span>
                  </div>
                  
                  {msg.certainty !== undefined && (
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <div style={{ ...styles.confBar, background: "rgba(245,158,11,0.2)", flex: 1 }}>
                        <div
                          style={{
                            ...styles.confFill,
                            background: "#f59e0b",
                            width: `${Math.min(msg.certainty * 100, 100).toFixed(0)}%`,
                          }}
                        />
                      </div>
                      <span style={{ ...styles.confText, color: "#fde68a", fontWeight: 'bold' }}>
                        {(msg.certainty * 100).toFixed(1)}% يقين
                      </span>
                      {msg.tier && (
                        <span style={{ 
                          fontSize: 10, marginLeft: 6, fontWeight: 'bold',
                          color: msg.tier.toLowerCase() === 'high' ? '#4ade80' : msg.tier.toLowerCase() === 'medium' ? '#fcd34d' : '#f87171', 
                          background: msg.tier.toLowerCase() === 'high' ? 'rgba(22,163,74,0.2)' : msg.tier.toLowerCase() === 'medium' ? 'rgba(245,158,11,0.2)' : 'rgba(220,38,38,0.2)',
                          padding: '2px 6px', borderRadius: 4 
                        }}>
                          {msg.tier.toUpperCase()}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={styles.msgRow}>
        <div style={styles.msgInner}>
          <div style={{ ...styles.avatar, ...styles.aiAv }}>🔬</div>
          <div style={{ ...styles.aiBubble, ...styles.diagnosisCard }}>
            <div style={styles.diagnosisLabel}>نتيجة نموذج الرؤية</div>
            <div style={styles.diagnosisDisease}>{formatLabel(msg.label)}</div>
            {msg.message && (
              <div style={{ marginTop: 8, marginBottom: 8, fontSize: 13, color: "#d1fae5", lineHeight: 1.5 }}>
                ✅ {msg.message}
              </div>
            )}
            <div style={styles.diagnosisConf}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <div style={{ ...styles.confBar, flex: 1 }}>
                      <div
                        style={{
                          ...styles.confFill,
                          width: `${Math.min(msg.confidence * 100, 100).toFixed(0)}%`,
                        }}
                      />
                    </div>
                    <span style={styles.confText}>
                      {(msg.confidence * 100).toFixed(1)}% ثقة (الخام)
                    </span>
                  </div>

                  {msg.certainty !== undefined && (
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <div style={{ ...styles.confBar, flex: 1 }}>
                        <div
                          style={{
                            ...styles.confFill,
                            background: "#4ade80",
                            width: `${Math.min(msg.certainty * 100, 100).toFixed(0)}%`,
                          }}
                        />
                      </div>
                      <span style={{ ...styles.confText, fontWeight: 'bold' }}>
                        {(msg.certainty * 100).toFixed(1)}% يقين
                      </span>
                      {msg.tier && (
                        <span style={{ 
                          fontSize: 10, marginLeft: 6, fontWeight: 'bold',
                          color: msg.tier.toLowerCase() === 'high' ? '#4ade80' : msg.tier.toLowerCase() === 'medium' ? '#fcd34d' : '#f87171', 
                          background: msg.tier.toLowerCase() === 'high' ? 'rgba(22,163,74,0.2)' : msg.tier.toLowerCase() === 'medium' ? 'rgba(245,158,11,0.2)' : 'rgba(220,38,38,0.2)',
                          padding: '2px 6px', borderRadius: 4 
                        }}>
                          {msg.tier.toUpperCase()}
                        </span>
                      )}
                    </div>
                  )}
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // AI message — with extra bottom spacing to separate from the next user message
  return (
    <div style={{ ...styles.msgRow, marginBottom: 16 }}>
      <div style={styles.msgInner}>
        <div style={{ ...styles.avatar, ...styles.aiAv }}>🌿</div>
        <TypewriterBubble text={msg.content} sources={msg.sources} isLast={isLast} onRegenerate={onRegenerate} isNew={msg.isNew} />
      </div>
    </div>
  );
}

