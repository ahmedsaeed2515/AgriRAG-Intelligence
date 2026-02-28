import React from "react";
import { chatStyles as styles } from "../utils/styles";

export default function WelcomeScreen() {
  return (
    <div style={styles.welcomeScreen} className="welcome-anim">
      <div style={{ ...styles.welcomeIcon, background: "rgba(22, 163, 74, 0.15)", color: "#16a34a", border: "1px solid rgba(22, 163, 74, 0.3)" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        </svg>
      </div>
      <div style={styles.welcomeTitle}>
        <span style={{color: "#16a34a"}}>Agri</span>RAG Intelligence
      </div>
      <div style={styles.welcomeSub}>
        مساعدك الزراعي المتقدم المدعوم بنموذج الرؤية الحاسوبية والذكاء الاصطناعي.<br />
        يمكنك رفع صورة لأي محصول أو طرح أسئلة زراعية معقدة وسأقوم بتحليلها فوراً.
      </div>
    </div>
  );
}
