import { useState, useRef, useEffect, useCallback } from "react";
import { API_URL, VISION_NEW_URL } from "../utils/constants";
import { buildDiseasePrompt, formatLabel } from "../utils/helpers";

export function useChat() {
  // Load initial history from localStorage
  const loadInitialMessages = () => {
    try {
      const saved = localStorage.getItem("agrirag_messages");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  };

  const loadInitialHistory = () => {
    try {
      const saved = localStorage.getItem("agrirag_history");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  };

  const [messages, setMessages] = useState(loadInitialMessages);
  const [history, setHistory] = useState(loadInitialHistory);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Save to localStorage whenever messages or history change
  useEffect(() => {
    const savedMessages = messages.map(m => ({ ...m, isNew: false }));
    localStorage.setItem("agrirag_messages", JSON.stringify(savedMessages));
    localStorage.setItem("agrirag_history", JSON.stringify(history));
  }, [messages, history]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, busy]);

  const removeImage = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const sendMessage = useCallback(
    async (manualQuestion) => {
      const q = (manualQuestion || input).trim();
      
      // -- FLOW 1: With Image --
      if (selectedImage) {
        if (busy) return;
        setBusy(true);
        
        const userContent = q || "🖼 هل يمكنك تحليل حالة هذا النبات من الصورة؟";
        setMessages((prev) => [
          ...prev,
          { role: "user", content: userContent, image: selectedImage.preview },
          { role: "typing", typingText: "جاري تحليل الصورة باستخدام نموذج الرؤية..." },
        ]);
        
        const imageFile = selectedImage.file;
        removeImage();
        setInput("");
        if (inputRef.current) inputRef.current.style.height = 'auto';

        try {
          const formData = new FormData();
          formData.append("file", imageFile);

          let label = "";
          let confidence = 0;
          let type = "plant";
          let message = "";
          let certainty = 0;
          let tier = "low";

          const visionRes = await fetch(VISION_NEW_URL, {
            method: "POST",
            body: formData,
          });

          if (!visionRes.ok) {
            const err = await visionRes.json().catch(() => ({}));
            throw new Error(err.error || `خطأ في الاتصال بنموذج الرؤية: ${visionRes.status}`);
          } else {
            const visionData = await visionRes.json();
            
            if (visionData.success === false) {
              throw new Error(visionData.error || visionData.message || "حدث خطأ أثناء معالجة الصورة.");
            }

            label = visionData.disease || "";
            confidence = typeof visionData.confidence === 'number' ? visionData.confidence / 100 : 0;
            certainty = typeof visionData.certainty === 'number' ? visionData.certainty / 100 : confidence;
            tier = visionData.tier || "low";
            type = visionData.type || "plant";
            message = visionData.message || "";
          }

          setMessages((prev) => [
            ...prev.filter((m) => m.role !== "typing"),
            { role: "diagnosis", label, confidence, certainty, tier, type, message },
          ]);

          const ragQuestion = type === "non_plant" 
            ? `المستخدم أرسل صورة لـ (${label}) وليس لنبات. هل يمكنك توضيح ذلك؟` 
            : q 
              ? `قمنا بتشخيص هذه النبتة بمرض ${formatLabel(label)}. إضافة لذلك، المستخدم يسأل: ${q}` 
              : buildDiseasePrompt(label);
          const newHistory = [...history, { role: "user", content: ragQuestion }];

          const answer = "مش عاوز اخلص الليمت بتاع الapi كفايه عليك تعرف اسمه اي";

          setMessages((prev) => [
            ...prev.filter((m) => m.role !== "typing"),
            { role: "ai", content: answer, sources: [], isNew: true },
          ]);
          setHistory([...newHistory, { role: "assistant", content: answer }]);
        } catch (err) {
          setMessages((prev) => [
            ...prev.filter((m) => m.role !== "typing"),
            {
              role: "ai",
              content: `⚠️ **حدث خطأ:** ${err.message || "تعذّر تحليل الصورة. يُرجى التحقق من اتصال السيرفر."}`,
              sources: [],
              isNew: true
            },
          ]);
        } finally {
          setBusy(false);
          setTimeout(() => inputRef.current?.focus(), 50);
        }
        return;
      }

      // -- FLOW 2: Text Only --
      if (!q || busy) return;
      setInput("");
      if (inputRef.current) inputRef.current.style.height = 'auto';
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
          { role: "ai", content: answer, sources, isNew: true },
        ]);
        setHistory([...newHistory, { role: "assistant", content: answer }]);
      } catch {
        setMessages((prev) => [
          ...prev.filter((m) => m.role !== "typing"),
          {
            role: "ai",
            content: "⚠️ **خطأ في الاتصال**\n\nتأكد أن السيرفر في حالة **Public & Running** على Hugging Face Spaces.",
            sources: [],
            isNew: true
          },
        ]);
      } finally {
        setBusy(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [input, busy, history, selectedImage, removeImage]
  );



  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage({ file, preview: reader.result });
      if (inputRef.current) inputRef.current.focus();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  
  const resetChat = useCallback(() => {
      setMessages([]);
      setHistory([]);
      localStorage.removeItem("agrirag_messages");
      localStorage.removeItem("agrirag_history");
  }, []);

  const regenerateLast = useCallback(async () => {
    if (busy || history.length === 0) return;
    const lastUserHistory = history.filter(h => h.role === "user").pop();
    if (!lastUserHistory) return;
    
    // Remove the last AI response from messages and history
    setMessages((prev) => {
      const newMessages = [...prev];
      if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === "ai") {
         newMessages.pop();
      }
      return newMessages;
    });
    
    setHistory((prev) => {
      const newHistory = [...prev];
      if (newHistory.length > 0 && newHistory[newHistory.length - 1].role === "assistant") {
         newHistory.pop();
      }
      return newHistory;
    });
    
    const q = lastUserHistory.content;

    setBusy(true);
    setMessages((prev) => [
      ...prev,
      { role: "typing", typingText: "جاري إعادة توليد الإجابة..." },
    ]);
    
    // Use the history without the last assistant response
    const newHistory = history.slice(0, -1);
    
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
        { role: "ai", content: answer, sources, isNew: true },
      ]);
      setHistory([...newHistory, { role: "assistant", content: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => m.role !== "typing"),
        {
          role: "ai",
          content: "⚠️ **خطأ في الاتصال**\n\nتأكد أن السيرفر في حالة **Public & Running** على Hugging Face Spaces.",
          sources: [],
          isNew: true
        },
      ]);
    } finally {
      setBusy(false);
      if (inputRef.current) setTimeout(() => inputRef.current.focus(), 50);
    }
  }, [busy, history]);

  return {
    messages,
    input,
    setInput,
    busy,
    selectedImage,
    chatRef,
    inputRef,
    fileInputRef,
    sendMessage,
    handleImageSelect,
    removeImage,
    resetChat,
    regenerateLast
  };
}
