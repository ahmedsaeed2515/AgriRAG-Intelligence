import React from "react";
import { chatStyles as styles } from "../utils/styles";

export default function WelcomeScreen() {
  return (
    <div style={styles.welcomeScreen} className="welcome-anim">
      <div style={{ ...styles.welcomeIcon, background: "transparent", border: "none", width: 100, height: 100, marginBottom: 12 }}>
        <img 
          src="/logo.png" 
          alt="AgriRAG Logo" 
          style={{ 
            width: "100%", 
            height: "100%", 
            borderRadius: 24, 
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            border: "1px solid rgba(22,163,74,0.4)"
          }} 
        />
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
