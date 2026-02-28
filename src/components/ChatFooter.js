import React from "react";
import { chatStyles as styles } from "../utils/styles";
import { CHIPS } from "../utils/helpers";

export default function ChatFooter({
  busy,
  sendMessage,
  input,
  setInput,
  inputRef,
  fileInputRef,
  selectedImage,
  handleImageSelect,
  removeImage,
}) {
  const handleKeyDown = (e) => {
    // Submit on Enter without Shift Key
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const isSendDisabled = (!input.trim() && !selectedImage) || busy;

  return (
    <div style={styles.footer}>
      <div style={styles.chipsRow}>
        {CHIPS.map((c) => (
          <button
            key={c.label}
            className="chip"
            onClick={() => {
              setInput(c.text);
              if (inputRef.current) {
                inputRef.current.style.height = "auto";
                setTimeout(() => {
                  if (inputRef.current) {
                    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
                    inputRef.current.focus();
                  }
                }, 10);
              }
            }}
            disabled={busy}>
            {c.flag} {c.label}
          </button>
        ))}
      </div>

      <div style={{ ...styles.inputWrap, flexDirection: "column", alignItems: "stretch", padding: "10px 14px", transition: "all 0.3s" }} className="input-focus-wrap">
        
        {selectedImage && (
          <div style={{ position: "relative", display: "inline-flex", marginBottom: 10, alignSelf: "flex-start", borderRadius: 10, overflow: "hidden", border: `2px solid ${styles.inputWrap.borderColor || "#d29922"}` }}>
            <img
              src={selectedImage.preview}
              alt="preview"
              style={{ width: 80, height: 80, objectFit: "cover", display: "block" }}
            />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 10, padding: 2, textAlign: "center", fontFamily: 'monospace' }}>صورة مرفقة</div>
            <button
              onClick={removeImage}
              title="إزالة الصورة"
              style={{
                position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.8)",
                color: "#fff", border: "none", borderRadius: "50%", width: 22, height: 22,
                fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1
              }}>
              ✕
            </button>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
          <textarea
            ref={inputRef}
            style={{ 
                ...styles.input, 
                resize: "none", 
                overflowY: "auto", 
                maxHeight: 120, 
                lineHeight: 1.6, 
                padding: "2px 0",
                minHeight: 24
            }}
            placeholder={selectedImage ? "أضف رسالة تترافق مع الصورة (اختياري)..." : "اسأل عن أي محصول، أو ارفع صورة للتشخيص..."}
            value={input}
            rows={1}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={busy}
          />

          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}>
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
                width: 38, height: 38, fontSize: 18,
                ...(selectedImage ? styles.uploadBtnActive : {}),
              }}
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
              className="upload-btn"
              title="إرفاق صورة">
              ➕
            </button>

            <button
              style={{
                ...styles.sendBtn,
                width: 38, height: 38, fontSize: 18,
                ...(isSendDisabled ? styles.sendBtnDisabled : {}),
              }}
              onClick={() => sendMessage()}
              disabled={isSendDisabled}
              className="send-btn"
              title="إرسال (Enter)">
              ↑
            </button>
          </div>
        </div>
      </div>
      <div style={styles.footerNote}>
        نظام تجريبي مدعوم بالذكاء الاصطناعي — معلومات النظام قد تكون غير دقيقة أحياناً.
      </div>
    </div>
  );
}
