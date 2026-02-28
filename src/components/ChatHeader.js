import React from "react";
import { chatStyles as styles, G } from "../utils/styles";

export default function ChatHeader({ onMenuClick }) {
  return (
    <div style={styles.chatHeader}>
      {/* Hamburger menu — visible only on mobile via CSS */}
      <button
        className="menu-btn"
        onClick={onMenuClick}
        aria-label="فتح القائمة"
        style={{
          background: "transparent",
          border: "none",
          color: G.muted,
          cursor: "pointer",
          display: "none",          // hidden by default, shown via CSS on mobile
          alignItems: "center",
          justifyContent: "center",
          padding: 6,
          borderRadius: 8,
          flexShrink: 0,
          transition: "all 0.2s",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Leaf icon */}
      <div style={{ color: "#16a34a", display: "flex", filter: "drop-shadow(0 0 6px rgba(22,163,74,0.4))", flexShrink: 0 }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        </svg>
      </div>

      {/* Title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={styles.headerTitle}>
          <span style={{ color: "#16a34a", fontWeight: "bold" }}>Agri</span>RAG Intelligence
        </div>
        <div style={{ color: G.muted, fontSize: 11, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          النظام الزراعي الخبير — رؤية حاسوبية + ذكاء اصطناعي
        </div>
      </div>

      {/* Model badge */}
      <div style={{
        background: "rgba(22,163,74,0.1)",
        color: "#16a34a",
        border: "1px solid rgba(22,163,74,0.25)",
        fontSize: 11,
        fontWeight: 600,
        padding: "4px 10px",
        borderRadius: 8,
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}>
        RAG Vision
      </div>
    </div>
  );
}
