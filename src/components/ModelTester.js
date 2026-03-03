import React, { useState, useRef } from "react";
import { G } from "../utils/styles";
import { VISION_URL, VISION_NEW_URL } from "../utils/constants";
import { formatLabel } from "../utils/helpers";

export default function ModelTester({ onBack }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [busy1, setBusy1] = useState(false);
  const [busy2, setBusy2] = useState(false);
  const [results, setResults] = useState({ model1: null, model2: null });
  const fileInputRef = useRef(null);

  const isBusy = busy1 || busy2;

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage({ file, preview: reader.result });
      setResults({ model1: null, model2: null });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeImage = () => {
    setSelectedImage(null);
    setResults({ model1: null, model2: null });
  };

  const runTest = () => {
    if (!selectedImage || isBusy) return;
    setBusy1(true);
    setBusy2(true);
    setResults({ model1: null, model2: null });

    const formData1 = new FormData();
    formData1.append("file", selectedImage.file);

    const formData2 = new FormData();
    formData2.append("file", selectedImage.file);

    const testModel1 = async () => {
      const startTime = Date.now();
      try {
        const res = await fetch(VISION_URL, {
          method: "POST",
          body: formData1,
          headers: { accept: "application/json" },
        });
        const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
        
        let result;
        if (!res.ok) {
            result = { error: `خطأ ${res.status}`, timeTaken };
        } else {
            try {
                const data = await res.json();
                const label = data.predicted_label || data.class || "غير معروف";
                const confidenceStr = data.confidence || data.score || "0";
                const confidence = typeof confidenceStr === "string" 
                  ? parseFloat(confidenceStr.replace("%", "")) / 100 
                  : confidenceStr;
                result = { label, confidence, timeTaken };
            } catch (e) {
                result = { error: "خطأ في قراءة البيانات", timeTaken };
            }
        }
        setResults(prev => ({ ...prev, model1: result }));
      } catch (error) {
         setResults(prev => ({ ...prev, model1: { error: "فشل الاتصال", timeTaken: ((Date.now() - startTime) / 1000).toFixed(2) } }));
      } finally {
        setBusy1(false);
      }
    };

    const testModel2 = async () => {
      const startTime = Date.now();
      try {
        const res = await fetch(VISION_NEW_URL, {
          method: "POST",
          body: formData2,
        });
        const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
        
        let result;
        try {
            const data = await res.json();
            
            if (data.success === false) {
              result = { error: data.error || "حدث خطأ أثناء معالجة الصورة.", timeTaken };
            } else {
                const label = data.disease || "غير معروف";
                const confidence = typeof data.confidence === 'number' ? data.confidence / 100 : 0;
                
                result = { 
                  label, 
                  confidence, 
                  type: data.type || "plant",
                  message: data.message || "",
                  timeTaken
                };
            }
        } catch (e) {
            result = { error: "خطأ في قراءة البيانات", timeTaken };
        }
        setResults(prev => ({ ...prev, model2: result }));
      } catch (error) {
          setResults(prev => ({ ...prev, model2: { error: "فشل الاتصال", timeTaken: ((Date.now() - startTime) / 1000).toFixed(2) } }));
      } finally {
        setBusy2(false);
      }
    };

    testModel1();
    testModel2();
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, gap: 12 }}>
        <button 
          onClick={onBack}
          style={{
            background: G.surface, color: G.text, border: `1px solid ${G.border}`, 
            borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit'
          }}
        >
          &rarr; عودة للمحادثة
        </button>
        <h2 style={{ color: G.greenText, margin: 0 }}>مقارنة واختبار موديل الـ CNN</h2>
      </div>

      <div style={{ 
        background: G.surface, borderRadius: 16, border: `1px solid ${G.border}`, padding: '24px', 
        marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 
      }}>
        {selectedImage ? (
          <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: `2px solid rgba(22,163,74,0.4)` }}>
            <img src={selectedImage.preview} alt="preview" style={{ width: 300, height: 300, objectFit: "cover", display: 'block' }} />
            <button
               onClick={removeImage}
              style={{
                position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.7)", color: "#fff",
                border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <div 
             onClick={() => fileInputRef.current?.click()}
             style={{
               width: "100%", maxWidth: 400, border: `2px dashed ${G.border}`, borderRadius: 16, padding: '40px 20px',
               textAlign: 'center', cursor: 'pointer', color: G.muted, background: G.bgAlt
             }}
          >
             <div style={{ fontSize: 40, marginBottom: 12 }}>🖼️</div>
             <div>اضغط هنا لاختيار صورة للاختبار</div>
          </div>
        )}
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          style={{ display: "none" }} 
          onChange={handleImageSelect} 
        />
        
        <button 
          onClick={runTest}
          disabled={!selectedImage || isBusy}
          style={{
            background: !selectedImage || isBusy ? G.surface2 : G.green,
            color: !selectedImage || isBusy ? G.subtle : '#fff',
            border: 'none', borderRadius: 12, padding: '12px 32px', fontSize: 16, fontWeight: 'bold',
            cursor: !selectedImage || isBusy ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            transition: 'all 0.2s', width: "100%", maxWidth: 400
          }}
        >
          {isBusy ? "جاري التحليل بالموديلين..." : "بدء الاختبار والمقارنة 🚀"}
        </button>
      </div>

      {(results.model1 || results.model2 || isBusy) && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {/* Model 1 */}
            <div style={{ background: "linear-gradient(135deg, #1a3d23, #162d1b)", border: `1px solid ${G.amber}44`, padding: 20, borderRadius: 16, opacity: busy1 ? 0.6 : 1 }}>
              <h3 style={{ color: G.text, marginTop: 0, marginBottom: 6, fontSize: 16 }}>النموذج الأول (القديم)</h3>
              <div style={{ color: G.muted, fontSize: 11, marginBottom: 16, wordBreak: 'break-all' }}>{VISION_URL}</div>
              
              {busy1 && <div style={{ color: G.muted }}>جاري التحليل... ⏳</div>}

              {results.model1 && !busy1 && (
                <>
                  {results.model1.error ? (
                    <div style={{ color: "#ef4444" }}>⚠️ {results.model1.error}</div>
                  ) : (
                    <>
                      <div style={{ fontSize: 20, fontWeight: "bold", color: "#d1fae5", marginBottom: 12 }}>
                        {formatLabel(results.model1.label)}
                      </div>
                      <div style={{ color: G.muted, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                        نسبة الثقة: 
                        <span style={{ color: G.green, fontWeight: 'bold' }}>
                          {(results.model1.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </>
                  )}
                  <div style={{ color: G.muted, fontSize: 12, marginTop: 12 }}>
                    ⏱️ استغرق: {results.model1.timeTaken} ثانية
                  </div>
                </>
              )}
            </div>

            {/* Model 2 */}
            <div style={{ 
              background: results.model2?.type === "non_plant" 
                  ? "linear-gradient(135deg, #3f2e12, #2d210b)" 
                  : "linear-gradient(135deg, #162d1b, #1a3d23)", 
              border: `1px solid ${results.model2?.type === "non_plant" ? G.amber : G.green}66`, 
              padding: 20, 
              borderRadius: 16, 
              opacity: busy2 ? 0.6 : 1,
              boxShadow: results.model2?.type === "non_plant" 
                  ? "0 4px 16px rgba(245,158,11,0.15)"
                  : "0 4px 16px rgba(22,163,74,0.15)" 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: G.text, marginTop: 0, marginBottom: 6, fontSize: 16 }}>النموذج الجديد (FastAPI) ✨</h3>
              </div>
              <div style={{ color: G.muted, fontSize: 11, marginBottom: 16, wordBreak: 'break-all' }}>{VISION_NEW_URL}</div>
              
              {busy2 && <div style={{ color: G.muted }}>جاري التحليل... ⏳</div>}

              {results.model2 && !busy2 && (
                <>
                  {results.model2.error ? (
                    <div style={{ color: "#ef4444" }}>⚠️ {results.model2.error}</div>
                  ) : (
                    <>
                      <div style={{ fontSize: 20, fontWeight: "bold", color: results.model2.type === "non_plant" ? G.amber : "#d1fae5", marginBottom: 12 }}>
                        {results.model2.type === "non_plant" ? results.model2.label : formatLabel(results.model2.label)}
                      </div>

                      <div style={{ color: G.muted, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, marginBottom: results.model2.message ? 12 : 0 }}>
                        نسبة الثقة: 
                        <span style={{ color: results.model2.type === "non_plant" ? G.amber : G.greenBright, fontWeight: 'bold' }}>
                          {(results.model2.confidence * 100).toFixed(1)}%
                        </span>
                      </div>

                      {results.model2.message && (
                        <div style={{ 
                          marginTop: 12, 
                          padding: 10, 
                          borderRadius: 8, 
                          fontSize: 13,
                          color: results.model2.type === "non_plant" ? "#fde68a" : "#d1fae5",
                          background: results.model2.type === "non_plant" ? "rgba(245,158,11,0.15)" : "rgba(22,163,74,0.15)"
                        }}>
                          {results.model2.type === "non_plant" ? "⚠️ " : "✅ "}
                          {results.model2.message}
                        </div>
                      )}
                    </>
                  )}
                  <div style={{ color: G.muted, fontSize: 12, marginTop: 12 }}>
                    ⏱️ استغرق: {results.model2.timeTaken} ثانية
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
