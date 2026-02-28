import React from "react";
import { chatStyles as styles, G } from "../utils/styles";

export default function Sidebar({ messages, resetChat }) {
  const userMessages = messages.filter((m) => m.role === "user");

  return (
    <div style={styles.sidebar}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, padding: "0 4px" }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#16a34a,#15803d)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 10px rgba(22,163,74,0.3)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#d1fae5" }}><span style={{ color: G.green }}>Agri</span>RAG</div>
          <div style={{ fontSize: 10, color: G.muted }}>Agricultural Intelligence</div>
        </div>
      </div>

      {/* New Chat Button */}
      <button
        className="new-chat-btn"
        onClick={resetChat}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "11px 14px",
          background: "rgba(22,163,74,0.08)",
          border: "1px solid rgba(22,163,74,0.2)",
          borderRadius: 10,
          color: G.greenText,
          cursor: "pointer",
          marginBottom: 20,
          fontFamily: "'IBM Plex Sans Arabic', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          transition: "all 0.2s",
          width: "100%",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        محادثة جديدة
      </button>

      {/* Chat History */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {userMessages.length > 0 ? (
          <div>
            <div style={{ fontSize: 10, color: G.subtle, marginBottom: 10, padding: "0 6px", textTransform: "uppercase", letterSpacing: 0.8 }}>
              سجل المحادثة
            </div>
            {userMessages.map((msg, i) => (
              <div
                key={i}
                className="history-item"
                style={{
                  padding: "9px 12px",
                  borderRadius: 8,
                  color: G.muted,
                  fontSize: 13,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginBottom: 3,
                  transition: "all 0.2s",
                  borderRight: "2px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
                title={msg.content}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: G.subtle }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{msg.content}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "16px 8px", fontSize: 12, color: G.subtle, textAlign: "center", marginTop: 30 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🌱</div>
            لا يوجد سجل حالياً
          </div>
        )}
      </div>

      {/* User Profile Footer */}
      <div style={{ borderTop: `1px solid ${G.border}`, paddingTop: 14, marginTop: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 6px" }}>
          <div style={{ width: 33, height: 33, borderRadius: "50%", background: "linear-gradient(135deg,#16a34a,#15803d)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 14, flexShrink: 0, boxShadow: "0 2px 8px rgba(22,163,74,0.3)" }}>أ</div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 13, color: G.text, fontWeight: "600", whiteSpace: "nowrap" }}>أحمد سعيد</div>
            <div style={{ fontSize: 10, color: G.muted, display: "flex", alignItems: "center", gap: 5 }}>
              <span className="status-dot" style={{ width: 6, height: 6 }}></span>
              نشط الآن
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
