import React from "react";
import { chatStyles as styles, G } from "../utils/styles";

export default function Sidebar({ messages, resetChat, isOpen, onClose }) {
  const userMessages = messages.filter((m) => m.role === "user").reverse();

  return (
    <div style={styles.sidebar} className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      {/* Close button — mobile only */}
      <button
        className="sidebar-close-btn"
        onClick={onClose}
        style={{
          display: "none",
          position: "absolute",
          top: 14,
          left: 14,
          background: "transparent",
          border: "none",
          color: G.muted,
          cursor: "pointer",
          padding: 6,
          borderRadius: 6,
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, padding: "0 4px" }}>
        <img 
          src="/logo.png" 
          alt="AgriRAG Logo" 
          style={{ 
            width: 38, 
            height: 38, 
            borderRadius: 12, 
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            border: "1px solid rgba(22,163,74,0.3)"
          }} 
        />
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#d1fae5", letterSpacing: -0.2 }}>
            <span style={{ color: G.green }}>Agri</span>RAG
          </div>
          <div style={{ fontSize: 10, color: G.muted, fontWeight: 500, opacity: 0.8 }}>Intelligence Pro</div>
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
