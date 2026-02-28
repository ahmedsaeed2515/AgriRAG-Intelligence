export function formatLabel(label = "") {
  return label.replace(/___/g, " - ").replace(/_/g, " ");
}

export function buildDiseasePrompt(label) {
  const formatted = formatLabel(label);
  return `تم تشخيص النبات بمرض وجاوب بالعربي بس "${formatted}". ما هي أعراض هذا المرض وكيف يمكن علاجه؟`;
}

export function formatText(text) {
  let formatted = text
    .replace(/### (.+)/g, "<h4>$1</h4>")
    .replace(/## (.+)/g, "<h3>$1</h3>")
    .replace(/# (.+)/g, "<h2>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)/gm, "<li>$1</li>");

  // Wrap lists
  formatted = formatted.replace(/(<li>.*<\/li>(\n<li>.*<\/li>)*)/g, "<ul>$1</ul>");
  
  // Replace newlines with breaks
  formatted = formatted.replace(/\n/g, "<br>");
  
  // Clean up extra breaks around headings and lists
  formatted = formatted.replace(/<\/h2><br>/g, "</h2>");
  formatted = formatted.replace(/<\/h3><br>/g, "</h3>");
  formatted = formatted.replace(/<\/h4><br>/g, "</h4>");
  formatted = formatted.replace(/<\/ul><br>/g, "</ul>");

  return `<div class="ai-content">${formatted}</div>`;
}

export function getSourceClass(src) {
  if (src.includes("Plant")) return "source-plant";
  if (src.includes("Kisan")) return "source-kisan";
  if (src.includes("SARTHI")) return "source-sarthi";
  return "";
}

export const CHIPS = [
  // Arabic (Current & New)
  { flag: "🔍", label: "تشخيص مرض", text: "هل يمكنك مساعدة في تحديد نوع هذا المرض النباتي من العلامات والأعراض الظاهرة؟" },
  { flag: "🌿", label: "برنامج تسميد", text: "ما هي أفضل المعايير لجدولة برنامج التسميد بالنيتروجين لمحصول القمح؟" },
  { flag: "💧", label: "تحسين الري", text: "كيف يمكنني تحسين كفاءة الري وتقليل استهلاك المياه لمحصول الطماطم؟" },
  { flag: "📊", label: "تحليل إنتاجية", text: "أعطني أهم 5 ممارسات حديثة لزيادة المحصول وتقليل الفاقد في الحصاد." },
  { flag: "🐛", label: "مكافحة الآفات", text: "كيف يمكنني مكافحة حشرة المن والذبابة البيضاء بأقل استخدام للمبيدات الكيميائية؟" },
  { flag: "🌍", label: "التغير المناخي", text: "ما هي الحلول والتوصيات لمواجهة تأثير التغير المناخي والحرارة الشديدة على المحاصيل؟" },

  // English
  { flag: "🌾", label: "Crop Yield", text: "What are the best modern agricultural practices to maximize corn crop yield?" },
  { flag: "🍂", label: "Plant Disease", text: "Can you help identify plant diseases based on yellowing leaf symptoms and dark spots?" },
  { flag: "🌦️", label: "Weather Impact", text: "How does unexpected heavy rainfall affect newly planted cotton seeds?" },
];
