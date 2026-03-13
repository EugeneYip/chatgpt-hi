import React, { useMemo, useState, useCallback } from "react";

/* ─────────────────────────────────────────────
   INLINE SVG आइकन सिस्टम (lucide-react के बिना)
   24x24 viewBox, स्ट्रोक-आधारित, 2px स्ट्रोक
   ───────────────────────────────────────────── */
const ICON_PATHS = {
  bookOpen: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  brain: "M9.5 2a3.5 3.5 0 0 0-3 5.1A3.5 3.5 0 0 0 5 10.5 3.5 3.5 0 0 0 6 14a3.5 3.5 0 0 0 2.8 4A3.5 3.5 0 0 0 12 21a3.5 3.5 0 0 0 3.2-3 3.5 3.5 0 0 0 2.8-4 3.5 3.5 0 0 0 1-3.5 3.5 3.5 0 0 0-1.5-3.4A3.5 3.5 0 0 0 14.5 2 3.5 3.5 0 0 0 12 3.5 3.5 3.5 0 0 0 9.5 2zM12 3.5v17.5",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  globe: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  folderOpen: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2zM2 10h20",
  settings: "M12 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  settingsGear: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  bot: "M12 8V4H8M8 2h8M2 14a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM9 16h.01M15 16h.01",
  penTool: "M12 19l7-7 3 3-7 7zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18z M2 2l7.586 7.586M11 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  checkCircle: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM9 12l2 2 4-4",
  sparkles: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5zM19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75z",
  mic: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8",
  imagePlus: "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7M16 5h6M19 2v6M21 15l-5-5L5 21",
  fileText: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  clock: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
  panelsTopLeft: "M3 3h18a0 0 0 0 1 0 0v18a0 0 0 0 1 0 0H3a0 0 0 0 1 0 0V3zM3 9h18M9 21V9",
  workflow: "M3 3h4v4H3zM17 3h4v4h-4zM10 17h4v4h-4zM5 7v3a4 4 0 0 0 4 4h2M19 7v3a4 4 0 0 1-4 4h-2",
  laptop: "M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9M2 20h20M12 16v4",
  wrench: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  compass: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  refreshCcw: "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15",
  link2: "M9 17H7a5 5 0 0 1 0-10h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  headphones: "M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z",
  table2: "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18",
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  layoutGrid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  school: "M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5",
  share2: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98",
  lightbulb: "M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z",
  chevronDown: "M6 9l6 6 6-6",
  alertTriangle: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  layers: "M12 2l10 6.5v7L12 22 2 15.5v-7zM2 8.5l10 6.5 10-6.5M12 22V15",
  messageSquare: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  database: "M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3zM21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5",
};

function Ico({ name, className = "", style = {} }) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d={d} />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   फ़ॉन्ट + ग्लोबल स्टाइल्स
   ───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
    .ff-display { font-family: 'Fraunces', Georgia, serif; }
    .ff-body { font-family: 'DM Sans', system-ui, sans-serif; }
    .ff-mono { font-family: 'JetBrains Mono', monospace; }
    * { font-family: 'DM Sans', system-ui, sans-serif; }
    .clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  `}</style>
);

/* ─────────────────────────────────────────────
   रंग
   ───────────────────────────────────────────── */
const C = {
  cream: "#FAF8F4", creamDark: "#F0EDE6", ink: "#1A1A1A", inkLight: "#6B6B6B",
  inkMuted: "#9B9B9B", border: "#E2DFD8", borderLight: "#ECEAE4",
  greenDeep: "#0A3D2E", greenMid: "#10a37f", greenLight: "#E8F5EE", roseAccent: "#E11D48",
};

/* ─────────────────────────────────────────────
   डेटा
   ───────────────────────────────────────────── */
const VERIFIED_DATE = "12 मार्च 2026";
const LEVELS = [
  { key: "all", label: "सभी" }, { key: "आधार", label: "आधार" },
  { key: "मुख्य", label: "मुख्य" }, { key: "उन्नत", label: "उन्नत" }, { key: "विशेषज्ञ", label: "विशेषज्ञ" },
];

const CORE_FEATURES = [
  { title: "Search", ico: "globe", color: "#0284c7", description: "वर्तमान तथ्यों, कीमतों, समाचार, कानूनों और बदलती चीज़ों के लिए वास्तविक समय के वेब परिणाम।", when: "जो भी चीज़ मॉडल की प्रशिक्षण-सीमा के बाद बदल चुकी हो सकती है।" },
  { title: "Deep Research", ico: "search", color: "#4f46e5", description: "वेब स्रोतों, फाइलों और जुड़े ऐप्स पर बहु-चरणीय, प्रलेखित शोध।", when: "जब आपको त्वरित उत्तर नहीं, बल्कि स्रोतों सहित रिपोर्ट चाहिए।" },
  { title: "Projects", ico: "folderOpen", color: "#059669", description: "साझा फाइलों, कस्टम निर्देशों और बातचीत की स्मृति वाला स्थायी कार्यक्षेत्र।", when: "ऐसा कोई भी काम जिस पर आप लौटकर आएँगे: कोर्स, क्लाइंट, स्टार्टअप।" },
  { title: "Memory", ico: "database", color: "#d97706", description: "बातचीतों के बीच टिकाऊ पसंदें और बार-बार काम आने वाला संदर्भ सहेजती है।", when: "पसंदों और पैटर्न के लिए, न कि दस्तावेज़ों को जस का तस रखने के लिए।" },
  { title: "Custom Instructions", ico: "settingsGear", color: "#57534e", description: "टोन, फ़ॉर्मैट और उत्तर की संरचना के लिए हमेशा लागू रहने वाले नियम।", when: "जब आप चाहते हैं कि हर चैट डिफ़ॉल्ट रूप से आपके नियम माने।" },
  { title: "Canvas", ico: "panelsTopLeft", color: "#334155", description: "लेखन और कोड के लिए दिखाई देने वाला ड्राफ्टिंग क्षेत्र, जिसमें लक्षित inline edits किए जा सकते हैं।", when: "लंबे लेखन या कोड को चरण-दर-चरण सुधारने के लिए।" },
  { title: "Tasks", ico: "clock", color: "#7c3aed", description: "ऐसे आउटपुट शेड्यूल करें जो बाद में चलें और आपको सूचित करें।", when: "रिमाइंडर, दैनिक ब्रीफ, आवर्ती सारांश।" },
  { title: "Apps (Connectors)", ico: "wrench", color: "#0d9488", description: "बाहरी टूल्स जोड़ें ताकि ChatGPT आपका डेटा पढ़ सके और उस पर काम कर सके।", when: "जब सबसे अच्छा संदर्भ चैट के बाहर हो।" },
  { title: "Agent", ico: "workflow", color: "#16a34a", description: "ब्राउज़र, फाइलों, कोड और जुड़े ऐप्स पर स्वायत्त निष्पादन।", when: "जब काम कई चरणों, साइटों और कार्रवाइयों में फैला हो।" },
  { title: "Custom GPTs", ico: "bot", color: "#44403c", description: "स्थिर निर्देशों और ज्ञान फाइलों वाले पुन: उपयोग योग्य सहायक।", when: "जब कोई वर्कफ़्लो इतना दोहराया जाए कि उसे औपचारिक रूप दिया जा सके।" },
  { title: "Voice", ico: "mic", color: "#e11d48", description: "कम रुकावट वाले सोच-विचार और खोज के लिए बोली जाने वाली बातचीत।", when: "जब आप बोलकर सोचना चाहते हों या साथ-साथ दूसरा काम कर रहे हों।" },
  { title: "Images", ico: "imagePlus", color: "#c026d3", description: "विश्लेषण के लिए अपलोड करें, विवरण से बनाएँ, और inline संपादन करें।", when: "दृश्य समझ, निर्माण या परिष्कार।" },
  { title: "Files & Data", ico: "fileText", color: "#0891b2", description: "PDF, स्प्रेडशीट और दस्तावेज़ अपलोड करें; विश्लेषण के लिए कोड चलाएँ।", when: "चार्ट, सारांश, गणनाएँ।" },
  { title: "Models", ico: "brain", color: "#65a30d", description: "तेज़, संतुलित या गहन-विचार वाले मोड चुनें।", when: "काम की जटिलता के अनुसार क्षमता मिलाएँ।" },
];

const ADDITIONAL_FEATURES = [
  { title: "Study Mode", ico: "school", color: "#059669", description: "प्रश्नों और समझ-जाँच के साथ मार्गदर्शित अध्ययन।" },
  { title: "Record", ico: "headphones", color: "#0284c7", description: "बोली गई बैठकों को रिकॉर्ड करें, फिर सारांश तैयार करें।" },
  { title: "Group Chats", ico: "users", color: "#7c3aed", description: "साझा योजना के लिए दूसरों को बातचीत में शामिल करें।" },
  { title: "Shared Links", ico: "link2", color: "#57534e", description: "किसी बातचीत को URL के माध्यम से साझा करें।" },
  { title: "Image Editing", ico: "camera", color: "#c026d3", description: "बनी हुई छवियों के हिस्सों को चुनकर सुधारें।" },
  { title: "Interactive Tables", ico: "table2", color: "#0891b2", description: "विश्लेषण से पहले अपलोड किए गए डेटा को दृश्य रूप से परखें।" },
  { title: "Skills", ico: "share2", color: "#0d9488", description: "एक जैसे दोहराए जाने वाले कामों के लिए पुन: उपयोग योग्य वर्कफ़्लो।" },
  { title: "Pulse", ico: "sparkles", color: "#4f46e5", description: "असमकालिक शोध जो दृश्य सारांश वापस लाता है।" },
];

const TOOL_CHOOSER = [
  { goal: "त्वरित उत्तर या ड्राफ्ट", tool: "सामान्य चैट", ico: "messageSquare", reason: "सबसे कम रुकावट।" },
  { goal: "ताज़ा जानकारी", tool: "Search", ico: "globe", reason: "जो भी बदल चुका हो सकता है।" },
  { goal: "फाइलों के साथ चल रहा काम", tool: "Project", ico: "folderOpen", reason: "सत्रों के बीच संदर्भ बनाए रखता है।" },
  { goal: "लंबा दस्तावेज़ संपादित करना", tool: "Canvas", ico: "panelsTopLeft", reason: "सूक्ष्म संशोधन के लिए बेहतर।" },
  { goal: "बहु-स्रोत रिपोर्ट", tool: "Deep Research", ico: "search", reason: "उद्धरणों सहित बहु-चरणीय संश्लेषण।" },
  { goal: "जटिल ऑनलाइन काम", tool: "Agent", ico: "workflow", reason: "कई साइटों और कार्रवाइयों में काम करता है।" },
  { goal: "आवर्ती आउटपुट", tool: "Tasks", ico: "clock", reason: "असमकालिक रूप से चलता है, आपको सूचित करता है।" },
  { goal: "एक ही वर्कफ़्लो बार-बार", tool: "GPT या Skill", ico: "bot", reason: "दोहराए जाने वाले पैटर्न को प्रणाली में बदलता है।" },
];

const PROMPT_BLOCKS = [
  { label: "लक्ष्य", example: "निवेशक बैठक के लिए एक पेज का प्रोजेक्ट ब्रीफ लिखिए।", color: "#10a37f" },
  { label: "संदर्भ", example: "यह स्टार्टअप pre-revenue है, Series A चरण में है, और climate tech में है।", color: "#0284c7" },
  { label: "सीमाएँ", example: "400 शब्दों के भीतर। कोई jargon नहीं। bullet points नहीं।", color: "#7c3aed" },
  { label: "प्रारूप", example: "संरचना यह हो: समस्या, समाधान, traction, अनुरोध।", color: "#d97706" },
  { label: "गुणवत्ता", example: "McKinsey associate स्तर पर लिखिए, किसी template की तरह नहीं।", color: "#e11d48" },
  { label: "सत्यापन", example: "जिस दावे के लिए स्रोत चाहिए, उसे चिह्नित कीजिए।", color: "#334155" },
];

const GUIDE_SECTIONS = [
  { id:"mental-model", level:"आधार", number:"01", title:"सही मानसिक मॉडल से शुरुआत करें", ico:"brain", color:"#65a30d",
    summary:"ChatGPT को किसी सर्वज्ञ स्रोत की तरह नहीं, बल्कि reasoning partner की तरह देखें। इसका पहला उत्तर अंतिम सत्य नहीं, बल्कि उपयोगी ड्राफ्ट होता है। हर आउटपुट को जाँचने तक अस्थायी मानें।",
    whyItMatters:"अधिकांश निराशा गलत अपेक्षाओं से आती है। निश्चितता नहीं, बल्कि एक सक्षम पहला ड्राफ्ट अपेक्षित रखें।",
    beginnerMoves:["पहले उत्तर को ड्राफ्ट मानें। उसे आलोचनात्मक नज़र से पढ़ें।","पूछें कि किन मान्यताओं के आधार पर उत्तर दिया गया।","निर्णय को बदलने के लिए नहीं, निर्णय को तेज़ करने के लिए ChatGPT का उपयोग करें।"],
    advancedMoves:["सबसे मज़बूत counter-argument माँगें।","अन्वेषण, सिफारिश और risk review को अलग-अलग चरणों में बाँटें।","महत्वपूर्ण निर्णयों पर इसे second opinion की तरह इस्तेमाल करें।"],
    commonMistakes:["संख्यात्मक दावों को सत्यापित किए बिना मान लेना।","यह मान लेना कि चुप्पी मतलब भरोसा।","आउटपुट को ज्यों का त्यों कॉपी कर देना।"],
    promptExamples:[{prompt:"आपने कौन-कौन सी मान्यताएँ लीं?",why:"छिपी हुई सोच सामने आती है।"},{prompt:"एक संदेहशील विशेषज्ञ इसमें क्या चुनौती देगा?",why:"आत्म-परीक्षण को तीखा बनाता है।"},{prompt:"अपनी सिफारिश के खिलाफ सबसे मज़बूत तर्क दीजिए।",why:"confirmation bias कम करता है।"},{prompt:"हर दावे का confidence 1-5 में रेट कीजिए।",why:"तथ्य और अनुमान अलग होते हैं।"}],
    beforeAfter:{before:"मेरे लिए एक कॉफी शॉप का business plan लिखो।",after:"डाउनटाउन बोस्टन में एक specialty coffee shop के लिए एक पेज की योजना लिखिए। लक्ष्य: graduate students और remote workers। जो भी अनुमान हो, उसे sourced fact से अलग चिह्नित करें।",improvement:"इसमें संदर्भ, स्थान, श्रोता और सत्यापन का नियम जोड़ दिया गया है।"},
    visual:"mental" },
  { id:"workspace", level:"आधार", number:"02", title:"prompts पर अटकने से पहले workspace समझें", ico:"laptop", color:"#059669",
    summary:"आधुनिक ChatGPT कई परतों वाला workspace है। अलग-अलग काम अलग परतों में बेहतर होते हैं। सही layer में दिया गया साधारण prompt, गलत layer में दिए गए चतुर prompt से बेहतर होता है।",
    whyItMatters:"कुछ भी टाइप करने से पहले सही workspace चुनना सबसे अधिक leverage देता है।",
    beginnerMoves:["त्वरित एकबारगी काम के लिए सामान्य चैट।","जिस काम पर बार-बार लौटना हो, उसके लिए Project।","बिलकुल साफ़ शुरुआत के लिए Temporary Chat।"],
    advancedMoves:["हर course, client या initiative के लिए अलग project।","Projects को दीर्घकालिक knowledge hub की तरह उपयोग करें।","रणनीति के लिए chat, क्रमिक editing के लिए canvas।"],
    commonMistakes:["हर बार नया chat खोलना और संदर्भ खो देना।","लंबे दस्तावेज़ों के लिए chat का उपयोग करना, canvas नहीं।","Tasks और Agent को पूरी तरह नज़रअंदाज़ करना।"],
    promptExamples:[{prompt:"क्या यह काम chat, project या GPT में होना चाहिए?",why:"मॉडल सही workspace चुनने में मदद करता है।"},{prompt:"मेरे semester के लिए ideal project structure सुझाइए।",why:"पहले architecture तय होता है।"},{prompt:"मुझे कौन-सी files और instructions जोड़नी चाहिए?",why:"project context बेहतर बनता है।"}],
    beforeAfter:{before:"मैं हर बार नया chat शुरू करता हूँ और context खो देता हूँ।",after:"एक Project बनाइए। references अपलोड कीजिए। instructions सेट कीजिए। फिर उसी project में वापस आइए।",improvement:"क्षणिक चैट स्थायी workspace में बदल जाती है।"},
    visual:"layers" },
  { id:"prompting", level:"आधार", number:"03", title:"Prompting: स्पष्टता चालाकी से बेहतर है", ico:"penTool", color:"#0284c7",
    summary:"अच्छे prompts ऑपरेटिंग ब्रीफ़ की तरह होते हैं। चतुर शब्दावली वैकल्पिक है, स्पष्ट सीमाएँ नहीं। आपके मन के मानक मॉडल को तभी दिखते हैं जब आप उन्हें लिखते हैं।",
    whyItMatters:"अस्पष्ट prompts से generic output आते हैं। अधिकांश निराशा अधूरी input specification से होती है।",
    beginnerMoves:["audience और use case साफ़-साफ़ लिखें।","बताइए कि अच्छा परिणाम कैसा दिखना चाहिए।","format, tone, length और किन चीज़ों से बचना है, यह स्पष्ट करें।"],
    advancedMoves:["पहले outline, फिर approval, उसके बाद full draft।","तथ्य और व्याख्या को अलग रखें।","self-grading के लिए rubric दीजिए।"],
    commonMistakes:["तीन शब्दों के prompt से tailored output की उम्मीद करना।","एक ही बार में बहुत सारी सीमाएँ डाल देना।","सीधे निर्देश देने की बजाय बस 'क्या आप...?' पूछना।"],
    promptExamples:[{prompt:"लक्ष्य: ___. संदर्भ: ___. सीमाएँ: ___. आउटपुट: ___.",why:"हर काम के लिए उपयोगी skeleton।"},{prompt:"पहले outline दीजिए। अभी draft मत लिखिए।",why:"गलत संरचना पर rewrite की ज़रूरत घटती है।"},{prompt:"लिखने से पहले बताइए कि आपको क्या जानना ज़रूरी है।",why:"मॉडल clarifying questions पूछता है।"},{prompt:"ऐसे लिखिए जैसे [role] [audience] को समझा रहा हो।",why:"tone और depth स्थिर होते हैं।"}],
    beforeAfter:{before:"एक cover letter लिखो।",after:"McKinsey में Strategy Analyst पद के लिए cover letter लिखिए। मैं International Management का grad student हूँ, SOP और CRM का अनुभव है। tone आत्मविश्वासी हो, अहंकारी नहीं। 350 शब्द। 'I am passionate about' न लिखें।",improvement:"भूमिका, पृष्ठभूमि, tone, लंबाई और negative constraint स्पष्ट हो गए।"},
    visual:"prompt" },
  { id:"revision", level:"मुख्य", number:"04", title:"Revision workflows, one-shot perfection से बेहतर हैं", ico:"refreshCcw", color:"#7c3aed",
    summary:"मजबूत उपयोग iterative होता है: फ्रेम करें, draft बनाएँ, critique करें, revise करें, फिर package करें। अधिकतर लोग refine करने के बजाय फिर से शुरू कर देते हैं।",
    whyItMatters:"एक ही कोशिश गुणवत्ता को पहले प्रयास तक सीमित कर देती है। revision लगभग हमेशा बेहतर परिणाम देता है।",
    beginnerMoves:["draft के बाद पूछें: 'इसमें क्या कमज़ोर है या क्या छूटा है?'","अगला revision अधिक संकीर्ण लक्ष्य के साथ करें।","जब तक दिशा मूल रूप से गलत न हो, फिर से शुरू न करें।"],
    advancedMoves:["fixed passes रखें: structure, accuracy, tone, compression, packaging।","rewrite से पहले self-critique कराएँ।","compression ratio स्पष्ट रूप से दें।"],
    commonMistakes:["model से self-diagnosis कराने की बजाय सब कुछ हाथ से दोबारा लिखना।","'इसे बेहतर बनाओ' जैसा अस्पष्ट feedback देना।","बहुत सारी unfocused passes चलाना।"],
    promptExamples:[{prompt:"आपका उत्तर लक्ष्य तक क्यों नहीं पहुँचा?",why:"revision से पहले self-diagnosis।"},{prompt:"तर्क को और तीखा कीजिए, संरचना वही रखें।",why:"काम का दायरा सीमित रहता है।"},{prompt:"ज़रूरी बातों को बचाते हुए इसे 35% छोटा कीजिए।",why:"प्राथमिकता तय करनी पड़ती है।"},{prompt:"इन मानकों पर इसे grade कीजिए। कहाँ 4/5 से नीचे है?",why:"संरचित self-evaluation।"}],
    beforeAfter:{before:"यह सही नहीं है। फिर से कोशिश करो।",after:"Section 2 का तर्क गोल-गोल घूम रहा है। uploaded report से एक data point जोड़कर सिर्फ़ वही हिस्सा rewrite कीजिए। बाकी वैसा ही रखें।",improvement:"यह स्पष्ट करता है कि क्या गलत है, क्या बदलना है, और क्या जस का तस रहना चाहिए।"},
    visual:"workflow" },
  { id:"writing", level:"मुख्य", number:"05", title:"लिखना, फिर से लिखना और रूपांतरण", ico:"fileText", color:"#57534e",
    summary:"ChatGPT transformation में बहुत अच्छा है: अलग audience के लिए rewrite करना, tone बदलना, summarize करना, reorganize करना। अक्सर यह शून्य से draft लिखने की तुलना में मौजूदा text को बेहतर करने में अधिक शक्तिशाली होता है।",
    whyItMatters:"ज़्यादातर पेशेवर लेखन transformation ही होता है। यहीं AI का सबसे अधिक प्रतिफल मिलता है।",
    beginnerMoves:["मूल text paste करें। क्या बदलना है और क्या नहीं बदलना, बताइए।","audience, channel और tone स्पष्ट करें।","अगर tone को लेकर अनिश्चित हों तो multiple versions माँगें।"],
    advancedMoves:["contrastive versions माँगें: formal, concise, persuasive।","sentence-level diagnosis कराएँ।","facts वही रखते हुए style transfer कराएँ।"],
    commonMistakes:["notes होने के बावजूद शून्य से draft बनवाना।","पहले tone को ही अंतिम मान लेना।","यह न बताना कि क्या संरक्षित रहना चाहिए।"],
    promptExamples:[{prompt:"इसे professor को भेजे जाने वाले email के रूप में rewrite कीजिए: सम्मानजनक, सीधे, बिना अनावश्यक बातों के।",why:"बहुत स्पष्ट transformation।"},{prompt:"तीन versions दीजिए: formal, concise, persuasive।",why:"तुलनात्मक चयन आसान होता है।"},{prompt:"कौन-सी पंक्तियाँ generic लगती हैं और क्यों?",why:"line-level diagnosis।"},{prompt:"तथ्य और संरचना वही रखें। सिर्फ़ tone बदलिए।",why:"revision का दायरा नियंत्रित रहता है।"}],
    beforeAfter:{before:"इस email को बेहतर बनाओ।",after:"इसे program director के लिए rewrite कीजिए। tone सम्मानजनक और सीधे हो। jargon हटाइए। 150 शब्दों के भीतर रखिए। action items बनाए रखें।",improvement:"audience, tone, anti-patterns, लंबाई और preserve करने वाली चीज़ें सभी स्पष्ट हैं।"},
    visual:"writing" },
  { id:"files-data", level:"मुख्य", number:"06", title:"फाइलें, PDFs, spreadsheets और data", ico:"table2", color:"#0891b2",
    summary:"ChatGPT files देख सकता है, documents summarize कर सकता है, data पर code चला सकता है और charts बना सकता है। मुख्य नियम यह है: पहले describe करें, फिर analyze करें, फिर conclude करें।",
    whyItMatters:"व्याख्या से पहले data inspection करने से सबसे आम गलतियाँ पकड़ी जाती हैं।",
    beginnerMoves:["पहले पूछें कि file में क्या है, फिर उसका अर्थ क्या है।","सबसे पहले field audit माँगें।","PDFs के लिए structure, argument और evidence को अलग-अलग देखें।"],
    advancedMoves:["assumptions का audit trail माँगें।","निष्कर्ष निकालने से पहले extracted tables को restate कराएँ।","बड़े datasets के लिए code execution का उपयोग करें।"],
    commonMistakes:["सीधे 'key insights' पूछ लेना।","chart labels को verify किए बिना मान लेना।","यह मान लेना कि PDF parsing हमेशा सही होगी।"],
    promptExamples:[{prompt:"बताइए: fields क्या हैं, date range क्या है, missing values कहाँ हैं, और कौन-से analysis options संभव हैं।",why:"analysis से पहले audit।"},{prompt:"आलोचना से पहले मुख्य argument निकालिए।",why:"निर्णय से पहले समझ।"},{prompt:"इस chart के लिए आपने कौन-कौन सी assumptions लीं, सब लिखिए।",why:"audit trail बनता है।"},{prompt:"इसे साफ़ करने के लिए Python लिखिए, चलाइए, और परिणाम दिखाइए।",why:"reproducible analysis।"}],
    beforeAfter:{before:"इस spreadsheet से key insights बताओ?",after:"पहले audit कीजिए: columns, types, date range, missing values। उपयोगिता के आधार पर तीन analysis options सुझाइए। मेरी मंज़ूरी से पहले कोई analysis न चलाइए।",improvement:"इसमें inspection, विकल्प और approval gate तीनों शामिल हैं।"},
    visual:"data" },
  { id:"search-research", level:"मुख्य", number:"07", title:"Search, Deep Research और citations", ico:"search", color:"#4f46e5",
    summary:"वर्तमान उत्तरों के लिए Search का उपयोग करें। बहु-चरणीय रिपोर्टों के लिए Deep Research का। जो भी चीज़ current, regulated या तेज़ी से बदलने वाली हो, उसे static memory पर नहीं छोड़ना चाहिए।",
    whyItMatters:"Search के बिना ChatGPT एक जमे हुए snapshot से उत्तर देता है।",
    beginnerMoves:["जो भी बदल चुका हो सकता है, उसके लिए Search करें।","जाँचें कि cited sources वास्तव में उसी दावे का समर्थन करते हैं।","उच्च जोखिम वाले मामलों में primary sources को प्राथमिकता दें।"],
    advancedMoves:["कहें: 'पुष्ट तथ्य और आपकी inference को अलग-अलग दिखाइए।'","source type, region और date horizon स्पष्ट करें।","Deep Research को स्पष्ट scope के साथ शुरू करें।"],
    commonMistakes:["current events के लिए model memory पर निर्भर रहना।","'sourced' दावों को खोले बिना मान लेना।","तेज़ factual question के लिए Deep Research चला देना।"],
    promptExamples:[{prompt:"Search कीजिए। सिर्फ़ primary sources।",why:"live retrieval, quality constraints के साथ।"},{prompt:"तथ्यों और inference को अलग करें। दोनों को label करें।",why:"ज्ञान की स्थिति स्पष्ट होती है।"},{prompt:"इसमें क्या चीज़ छह महीनों में पुरानी पड़ सकती है?",why:"time-sensitivity दिखती है।"},{prompt:"Deep Research: [विषय]। Scope: [क्षेत्र, तिथियाँ]।",why:"काम स्पष्ट रूप से परिभाषित होता है।"}],
    beforeAfter:{before:"AI regulation पर latest क्या है?",after:"Search कीजिए: EU और US में AI regulation, पिछले 30 दिनों के भीतर। सिर्फ़ primary sources। enacted और proposed को अलग-अलग दिखाइए।",improvement:"scope, time range, source quality और categorization सब स्पष्ट हैं।"},
    visual:"research" },
  { id:"multimodal", level:"मुख्य", number:"08", title:"Voice, images और multimodal workflows", ico:"imagePlus", color:"#c026d3",
    summary:"Voice, image understanding, generation और editing अब सामान्य क्षमताएँ हैं। कुंजी specificity है: अस्पष्ट visual request से generic परिणाम आते हैं।",
    whyItMatters:"multimodal उपयोग ChatGPT को visual analysis tool, image studio और hands-free brainstorming partner में बदल देता है।",
    beginnerMoves:["uploaded image के साथ ठीक-ठीक बताइए कि क्या करना है।","जब speed, polish से अधिक महत्वपूर्ण हो तो voice का उपयोग करें।","image generation में subject, framing, mood और style बताइए।"],
    advancedMoves:["modes को chain करें: analyze, explain, फिर notes बनवाएँ।","design review के लिए image critique कराएँ।","scoped edit करें: region चुनें, बदलाव बताइए।"],
    commonMistakes:["बिना किसी निर्देश के image अपलोड कर देना।","अस्पष्ट description से photorealism की उम्मीद करना।","यह भूल जाना कि voice भी text की तरह context रखता है।"],
    promptExamples:[{prompt:"इस menu से items निकालिए और category के अनुसार व्यवस्थित कीजिए।",why:"specific extraction।"},{prompt:"इस chart को एक non-technical executive को 120 शब्दों में समझाइए।",why:"सीमाओं सहित analysis।"},{prompt:"Generate कीजिए: vertical 9:16, cinematic, golden-hour lighting।",why:"photography-style specification।"},{prompt:"background को white studio से बदलें। subject वही रखें।",why:"scoped editing।"}],
    beforeAfter:{before:"मेरे लिए एक cool image बनाओ।",after:"16:9 अनुपात में: टोक्यो की आधुनिक coffee shop, dusk के समय। architectural photography, shallow depth of field, warm mood, wooden counter, espresso machine, शहर की रोशनी। कोई व्यक्ति न हो।",improvement:"ratio, subject, style, mood, elements और exclusions सभी स्पष्ट हैं।"},
    visual:"multimodal" },
  { id:"study-collab", level:"उन्नत", number:"09", title:"Study, Record, Groups, Links और Skills", ico:"layoutGrid", color:"#0d9488",
    summary:"ये features सीखने, बोले गए content को capture करने, सहयोग करने, साझा करने और workflows को formalize करने के लिए हैं।",
    whyItMatters:"सीखना, केवल उत्तर प्राप्त करने से अलग है। सहयोग, अकेले prompting से अलग है।",
    beginnerMoves:["Study Mode का उपयोग सीखने के लिए करें, सिर्फ़ उत्तर पाने के लिए नहीं।","meetings और lectures के लिए Record का उपयोग करें।","स्वच्छ सहयोग के लिए Shared Links और Group Chats का उपयोग करें।"],
    advancedMoves:["recorded summaries को project source files में बदलें।","बार-बार होने वाले कामों के लिए Skills बनाएँ।","साझा context के लिए Group Chats और Projects को साथ में उपयोग करें।"],
    commonMistakes:["पढ़ाई के लिए सामान्य chat का उपयोग करना, जिससे वास्तविक learning कम होती है।","यह भूल जाना कि Record मौजूद है।","Shared Links की जगह screenshots भेजना।"],
    promptExamples:[{prompt:"मुझे जवाब मत बताइए। मुझे quiz कीजिए।",why:"pedagogical approach।"},{prompt:"इस recording से action items और follow-up draft निकालिए।",why:"एक input से कई outputs निकलते हैं।"},{prompt:"इस workflow को एक Skill में बदल दीजिए।",why:"प्रक्रिया औपचारिक रूप लेती है।"}],
    beforeAfter:{before:"photosynthesis समझाओ।",after:"मैं biology exam की तैयारी कर रहा हूँ। मुझे सीधा मत समझाइए। basic से advanced तक सवाल पूछिए। गलती होने पर छोटे explanation के साथ सुधारिए।",improvement:"सीधा उत्तर guided learning में बदल जाता है।"},
    visual:"collab" },
  { id:"personalization", level:"उन्नत", number:"10", title:"Memory, instructions, personality और temp chat", ico:"database", color:"#d97706",
    summary:"Memory संदर्भ सहेजती है। Instructions नियम तय करते हैं। Personality शैली बदलती है। Temporary Chat एक clean room है। ये एक-दूसरे के विकल्प नहीं हैं।",
    whyItMatters:"गलत personalization, मदद करने से अधिक परिणामों को बिगाड़ सकता है।",
    beginnerMoves:["Memory में व्यापक और स्थायी पसंदें रखें।","Instructions में global writing rules रखें।","Temporary Chat का उपयोग शून्य carryover के लिए करें।"],
    advancedMoves:["Personality केवल texture है, instructions का विकल्प नहीं।","global settings से अधिक project-specific instructions उपयोगी होते हैं।","समय-समय पर memory audit करें।"],
    commonMistakes:["हर चीज़ memory में डाल देना, instructions में नहीं।","पुरानी memory जमा होती जाना।","style की जगह capability बदलने के लिए personality का उपयोग करना।"],
    promptExamples:[{prompt:"आपको मेरे बारे में क्या याद है?",why:"memory audit होता है।"},{prompt:"formal tone वाली preference भूल जाइए।",why:"targeted cleanup।"},{prompt:"blank slate mode। कोई stored preference लागू न करें।",why:"clean-room interaction।"}],
    beforeAfter:{before:"preferences memory में हैं, फिर भी output inconsistent है।",after:"व्यवहार के नियम Instructions में रखें। तथ्य Memory में रखें। domain-specific नियम project instructions में रखें।",improvement:"हर चीज़ सही layer में चली जाती है।"},
    visual:"memory" },
  { id:"projects", level:"उन्नत", number:"11", title:"Projects को अपना operating system बनाइए", ico:"folderOpen", color:"#16a34a",
    summary:"Projects, ChatGPT को context-aware workbench में बदल देते हैं। अच्छी तरह configured project, किसी एक chat interaction से कहीं अधिक शक्तिशाली होता है।",
    whyItMatters:"कई सत्रों वाले काम के लिए Projects सबसे अधिक leverage देने वाला organizational tool हैं।",
    beginnerMoves:["हर workstream के लिए एक project बनाइए। नाम स्पष्ट रखें।","सिर्फ़ relevant files अपलोड करें।","project instructions ज़रूर लिखें।"],
    advancedMoves:["conversation summaries को source files की तरह जोड़ें।","साप्ताहिक काम के लिए नए chats नहीं, उसी project में लौटें।","व्यक्तिगत productivity के लिए meta-project बनाएँ।"],
    commonMistakes:["बहुत ज़्यादा छोटे-छोटे projects बना लेना।","सब कुछ अपलोड कर देना और context को bloated बना देना।","project instructions न लिखना।"],
    promptExamples:[{prompt:"मेरे semester के लिए ideal project structure सुझाइए।",why:"workspace पहले तैयार होता है।"},{prompt:"पिछले काम की शैली के अनुरूप एक memo draft कीजिए।",why:"संचित context का लाभ मिलता है।"},{prompt:"पिछली पाँच बातचीतों के मुख्य decisions summarize कीजिए।",why:"living summary तैयार होती है।"}],
    beforeAfter:{before:"files हर जगह बिखरी हैं, कुछ भी ट्रैक नहीं हो रहा।",after:"हर domain के लिए एक project बनाइए। references जोड़िए। instructions दीजिए। उसी में वापस लौटिए। समय-समय पर summary बनाइए।",improvement:"बिखरी हुई बातचीतें संरचित प्रणाली में बदल जाती हैं।"},
    visual:"project" },
  { id:"gpts", level:"उन्नत", number:"12", title:"GPT कब बनाना चाहिए, और कब नहीं", ico:"bot", color:"#44403c",
    summary:"GPT तब उपयोगी होता है जब कोई workflow बार-बार दोहराया जाता हो, उसके निर्देश स्थिर हों और reuse से लाभ मिले। लेकिन अधिकांश लोग बहुत जल्दी GPT बना देते हैं।",
    whyItMatters:"बहुत जल्दी GPT बनाने से अधपका workflow जम जाता है। सही समय पर बना GPT, सिद्ध प्रक्रिया को one-click tool में बदल देता है।",
    beginnerMoves:["पहले prompts सहेजिए: वही prototype है।","तीन बार दोहराने के बाद ही formalize कीजिए।","उद्देश्य संकीर्ण रखें। एक GPT, एक काम।"],
    advancedMoves:["चार स्तर सोचें: role, instructions, knowledge, tools।","explicit failure rules लिखें।","adversarial testing करें।"],
    commonMistakes:["ऐसी चीज़ के लिए GPT बनाना जो बस एक बार करनी हो।","बहुत व्यापक GPT: 'सब कुछ कर दो।'","knowledge files न जोड़ना।"],
    promptExamples:[{prompt:"हमारे workflow को GPT blueprint में बदलिए।",why:"अनुभव से प्रणाली बनती है।"},{prompt:"Instructions, input/output schema और failure rules दीजिए।",why:"पूर्ण specification मिलती है।"},{prompt:"इस GPT को कौन-कौन से edge cases संभालने चाहिए?",why:"resilience testing।"}],
    beforeAfter:{before:"मेरे सारे emails के लिए एक GPT बना दो।",after:"professors को reply देने के लिए GPT बनाइए। tone सम्मानजनक और सीधे हो। 150 शब्दों के भीतर। context पहले पूछे। पुष्टि के बिना उत्तर न दे। style guide upload की जाए।",improvement:"scope छोटा है, safety rules हैं, और reference material भी है।"},
    visual:"gpt" },
  { id:"canvas", level:"उन्नत", number:"13", title:"Writing और code revision के लिए Canvas", ico:"panelsTopLeft", color:"#334155",
    summary:"Canvas, chat के साथ दिखाई देने वाला working surface है। document-जैसे काम के लिए, जहाँ सूक्ष्म editing चाहिए, यह linear conversation से बेहतर है।",
    whyItMatters:"लंबे artifacts, chat में बिखर जाते हैं। Canvas में दस्तावेज़ ही केंद्र बन जाता है।",
    beginnerMoves:["लंबे artifacts के लिए Canvas का उपयोग करें।","हर उद्देश्य के लिए अलग file रखें।","अस्पष्ट rewrite नहीं, targeted edit करें।"],
    advancedMoves:["रणनीति के लिए chat, execution के लिए canvas।","पहले architecture, फिर छोटे diffs।","तुलना के लिए version history का उपयोग करें।"],
    commonMistakes:["लंबे दस्तावेज़ों के लिए chat का उपयोग करना।","एक paragraph सुधारने के लिए पूरा rewrite कर देना।","debugging के लिए code canvas का उपयोग न करना।"],
    promptExamples:[{prompt:"इसे writing canvas में खोलिए। सिर्फ़ introduction rewrite कीजिए।",why:"scoped editing।"},{prompt:"logic errors ढूँढिए। सिर्फ़ उन्हीं lines को patch कीजिए।",why:"targeted code fix।"},{prompt:"Section 3 को Section 2 से पहले ले आइए, और 4 व 5 को merge कीजिए।",why:"structural reorganization।"}],
    beforeAfter:{before:"मेरा essay rewrite करो। [2000 शब्द chat में]",after:"इसे canvas में खोलिए। अभी कुछ बदलिए मत। पहले strong और weak sections annotate कीजिए। उसके बाद मैं edit निर्देश दूँगा।",improvement:"modification से पहले inspection हो जाता है।"},
    visual:"canvas" },
  { id:"tasks-apps-agent", level:"विशेषज्ञ", number:"14", title:"Tasks, Apps, Pulse और Agent", ico:"workflow", color:"#16a34a",
    summary:"यह operational layer है। Tasks बाद में चलते हैं। Apps डेटा लाते हैं। Pulse असमकालिक शोध करता है। Agent स्वायत्त बहु-चरणीय काम करता है।",
    whyItMatters:"अधिकांश उपयोगकर्ता सिर्फ़ real-time Q&A तक सीमित रहते हैं। यह layer ChatGPT को आपके लिए काम करने वाली प्रणाली में बदल देती है।",
    beginnerMoves:["Tasks: reminders, briefings, recurring summaries।","Apps: जब जानकारी Drive, Slack या email में हो।","Agent: ऐसे multi-step workflows जिनमें सामान्यतः 15+ मिनट लगते हों।"],
    advancedMoves:["Agent prompts को job brief की तरह लिखें, stop points के साथ।","Pulse का उपयोग proactive updates के लिए करें।","Tasks और Projects को मिलाकर weekly auto-summaries बनाइए।"],
    commonMistakes:["यह न जानना कि Agent मौजूद है।","बिना stopping rules के vague agent instructions देना।","Tasks को सिर्फ़ reminders तक सीमित रखना।"],
    promptExamples:[{prompt:"हर सुबह 8 बजे [विषय] पर top 3 points वाला brief भेजने के लिए task बनाइए।",why:"proactive briefing।"},{prompt:"connected और public sources दोनों से competitive analysis कीजिए।",why:"internal और external data साथ आते हैं।"},{prompt:"Agent workflow चलाइए। submission से पहले pause कीजिए।",why:"autonomy के साथ checkpoint मिलता है।"}],
    beforeAfter:{before:"पाँच websites देखो और pricing compare करो।",after:"Agent चलाइए: पाँच competitors की sites पर जाएँ, pricing निकालें, table बनाएँ। login की ज़रूरत हो तो pause करें। outdated pricing को flag करें।",improvement:"काम delegated है, साथ में scope और error handling भी तय है।"},
    visual:"agent" },
  { id:"model-choice", level:"विशेषज्ञ", number:"15", title:"Model choice और mode selection", ico:"compass", color:"#65a30d",
    summary:"अलग-अलग modes, speed, reasoning depth और tool support के बीच trade-off करते हैं। सही काम के लिए सही model power चुनें।",
    whyItMatters:"हर काम के लिए सबसे शक्तिशाली mode इस्तेमाल करना समय बर्बाद करता है। कभी mode escalate न करना गहराई खो देता है।",
    beginnerMoves:["रोज़मर्रा के काम के लिए Auto।","जटिल logic या synthesis के लिए ऊपर वाले mode पर जाएँ।","सबसे शक्तिशाली mode हमेशा सबसे अच्छा नहीं होता।"],
    advancedMoves:["drafting के लिए fast mode, critical review के लिए deep mode।","reasoning modes में tool limitations पर नज़र रखें।","हल्के mode से शुरू करें, ज़रूरत पड़ने पर बीच में escalate करें।"],
    commonMistakes:["हर काम के लिए सबसे शक्तिशाली mode चुनना।","समस्या mode की हो, फिर भी model को दोष देना।","plan tier access की जाँच न करना।"],
    promptExamples:[{prompt:"पहले त्वरित उत्तर दीजिए, फिर दूसरी pass में गहराई से जाइए।",why:"पहले speed, फिर depth।"},{prompt:"यह complex logic है। step by step extended thinking के साथ कीजिए।",why:"गहन reasoning स्पष्ट रूप से माँगी जाती है।"},{prompt:"इस काम के लिए fast drafting बेहतर है या careful reasoning?",why:"मॉडल mode चुनने में भी मदद कर सकता है।"}],
    beforeAfter:{before:"हमेशा सबसे advanced model ही उपयोग करो।",after:"त्वरित कामों के लिए Auto। logic-heavy कामों के लिए reasoning mode। brainstorming के लिए तेज़ mode।",improvement:"model power को काम के प्रकार से जोड़ा गया है।"},
    visual:"models" },
  { id:"privacy-risk", level:"विशेषज्ञ", number:"16", title:"Privacy, data controls और risk", ico:"shield", color:"#e11d48",
    summary:"जितनी अधिक capability, उतनी अधिक boundaries चाहिए। sensitive data अपलोड करने में अनुशासन चाहिए। high-stakes output पर human review आवश्यक है।",
    whyItMatters:"सीमाओं के बिना capability, data exposure या over-reliance की ओर ले जा सकती है।",
    beginnerMoves:["संवेदनशील सामग्री यूँ ही अपलोड न करें।","अपलोड से पहले identifiers हटा दें।","सबसे साफ़ privacy mode के लिए Temporary Chat का उपयोग करें।"],
    advancedMoves:["upload policy को traffic-light system की तरह परिभाषित करें: red, yellow, green।","high-stakes कार्रवाई से पहले expert review लें।","समय-समय पर data audit करें।"],
    commonMistakes:["जब sample काफी हो, तब भी पूरा database अपलोड कर देना।","यह मान लेना कि Temporary Chat का मतलब कुछ भी process नहीं होता।","regulated domains में AI output को अंतिम निर्णय मान लेना।"],
    promptExamples:[{prompt:"किन हिस्सों की human expert verification ज़रूरी है?",why:"सीमाएँ स्पष्ट होती हैं।"},{prompt:"पूरा upload करने से पहले redact करने में मदद कीजिए।",why:"सुरक्षित तैयारी होती है।"},{prompt:"यहाँ कौन-सी चीज़ personally identifiable है? उसे हटा दीजिए।",why:"PII detection।"}],
    beforeAfter:{before:"पूरी client list अपलोड कर रहा हूँ, trends analyze करो।",after:"पहले names, emails और phone numbers हटाइए। companies को anonymize कीजिए। फिर segment के अनुसार revenue analyze कीजिए।",improvement:"पहचान हटती है, पर analytical value बनी रहती है।"},
    visual:"privacy" },
];

/* ─────────────────────────────────────────────
   SVG सेक्शन विज़ुअल्स
   ───────────────────────────────────────────── */
function SectionVisual({ type }) {
  const s = "fill-none stroke-current";
  const cls = "h-36 w-full";
  const col = C.greenDeep;
  const tx = (x, y, label, opts = {}) => <text x={x} y={y} textAnchor="middle" fill={col} style={{ fontSize: opts.size || 10, fontWeight: opts.bold ? 600 : 400, opacity: opts.dim ? 0.4 : 1 }}>{label}</text>;
  const V = {
    mental: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}><rect x="24" y="12" width="120" height="44" rx="12" className={s} strokeWidth="2"/><rect x="216" y="12" width="120" height="44" rx="12" className={s} strokeWidth="2"/><rect x="120" y="110" width="120" height="44" rx="12" className={s} strokeWidth="2"/><path d="M144 34h72" className={s} strokeWidth="1.5"/><path d="M84 56l60 54M276 56l-60 54" className={s} strokeWidth="1.5"/>{tx(84,39,"आपका लक्ष्य",{bold:true})}{tx(276,39,"AI ड्राफ्ट",{bold:true})}{tx(180,137,"आपका निर्णय",{bold:true})}{tx(180,84,"जाँचें, तय करें, आगे बढ़ें",{dim:true,size:9})}</svg>,
    layers: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}>{[["40","8","280","24","सामान्य चैट"],["54","38","252","24","Projects + Canvas"],["68","68","224","24","Memory + Instructions"],["82","98","196","24","GPTs + Study + Skills"],["96","128","168","24","Tasks + Apps + Agent"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(180,Number(y)+16,l,{bold:true,size:9})}</g>)}{tx(336,22,"सरल",{dim:true,size:8})}{tx(336,146,"शक्तिशाली",{dim:true,size:8})}</svg>,
    prompt: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}>{[["18","8","लक्ष्य"],["126","8","संदर्भ"],["234","8","नियम"],["18","92","प्रारूप"],["126","92","गुणवत्ता"],["234","92","सत्यापन"]].map(([x,y,l])=><g key={l}><rect x={x} y={y} width="102" height="50" rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+51,Number(y)+30,l,{bold:true,size:11})}</g>)}</svg>,
    workflow: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["30","फ्रेम"],["100","ड्राफ्ट"],["170","आलोचना"],["240","संशोधन"],["310","तैयार"]].map(([x,l],i)=><g key={l}><circle cx={x} cy="60" r="22" className={s} strokeWidth="2"/>{tx(Number(x),64,l,{bold:true,size:9})}{i<4&&<path d={`M${Number(x)+22} 60h26`} className={s} strokeWidth="1.5"/>}</g>)}{tx(170,112,"हर pass में अधिक स्पष्टता आती है",{dim:true,size:9})}</svg>,
    writing: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><rect x="134" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><rect x="248" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><path d="M112 59h22M226 59h22" className={s} strokeWidth="1.5"/>{tx(66,38,"स्रोत",{bold:true})}{tx(180,38,"रूपांतरण",{bold:true})}{tx(294,38,"आउटपुट",{bold:true})}</svg>,
    data: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="10" width="116" height="96" rx="10" className={s} strokeWidth="2"/><path d="M20 36h116M48 10v96M76 10v96M104 10v96M20 62h116M20 88h116" className={s} strokeWidth="1"/><rect x="186" y="18" width="24" height="70" rx="6" className={s} strokeWidth="2"/><rect x="220" y="40" width="24" height="48" rx="6" className={s} strokeWidth="2"/><rect x="254" y="28" width="24" height="60" rx="6" className={s} strokeWidth="2"/><rect x="288" y="48" width="24" height="40" rx="6" className={s} strokeWidth="2"/><path d="M182 100h136" className={s} strokeWidth="1.5"/>{tx(78,126,"1. जाँचें",{dim:true,size:9})}{tx(252,126,"2. निष्कर्ष",{dim:true,size:9})}</svg>,
    research: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><circle cx="66" cy="58" r="32" className={s} strokeWidth="2"/><path d="M90 82l22 22" className={s} strokeWidth="2"/><rect x="170" y="10" width="144" height="28" rx="8" className={s} strokeWidth="2"/><rect x="170" y="50" width="144" height="28" rx="8" className={s} strokeWidth="2"/><rect x="170" y="90" width="144" height="28" rx="8" className={s} strokeWidth="2"/>{tx(242,29,"प्राथमिक",{bold:true})}{tx(242,69,"द्वितीयक",{bold:true})}{tx(242,109,"अनुमान",{bold:true})}<circle cx="326" cy="24" r="4" fill="#10a37f" stroke="none"/><circle cx="326" cy="64" r="4" fill="#F59E0B" stroke="none"/><circle cx="326" cy="104" r="4" fill="#E11D48" stroke="none" opacity="0.5"/></svg>,
    multimodal: <svg viewBox="0 0 360 130" className={cls} style={{ color: col }}>{[["36","पाठ"],["120","छवि"],["204","आवाज़"],["288","संपादन"]].map(([x,l])=><g key={l}><rect x={x} y="20" width="52" height="52" rx="12" className={s} strokeWidth="2"/>{tx(Number(x)+26,50,l,{bold:true,size:9})}</g>)}<path d="M88 46h32M172 46h32M256 46h32" className={s} strokeWidth="1.5"/>{tx(180,102,"modes को साथ में जोड़िए",{dim:true,size:9})}</svg>,
    collab: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["18","24","64","42","Record"],["100","6","120","42","Study"],["100","78","120","42","Group"],["238","24","80","42","Share"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+26,l,{bold:true,size:10})}</g>)}<path d="M82 45h18M220 27h18M220 99h18" className={s} strokeWidth="1.5"/></svg>,
    memory: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["14","10","74","40","Memory"],["100","10","120","40","Instructions"],["232","10","108","40","Personality"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+25,l,{bold:true,size:10})}</g>)}<rect x="60" y="88" width="240" height="40" rx="12" className={s} strokeWidth="2"/>{tx(180,113,"सुसंगत आउटपुट",{bold:true})}<path d="M51 50l38 38M160 50v38M286 50l-38 38" className={s} strokeWidth="1.5"/></svg>,
    project: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="28" y="4" width="304" height="132" rx="16" className={s} strokeWidth="2"/><rect x="46" y="28" width="72" height="88" rx="8" className={s} strokeWidth="2"/><rect x="130" y="28" width="72" height="88" rx="8" className={s} strokeWidth="2"/><rect x="214" y="28" width="100" height="40" rx="8" className={s} strokeWidth="2"/><rect x="214" y="76" width="100" height="40" rx="8" className={s} strokeWidth="2"/>{tx(82,76,"Chats",{bold:true})}{tx(166,76,"Files",{bold:true})}{tx(264,52,"स्रोत",{bold:true,size:9})}{tx(264,100,"नियम",{bold:true,size:9})}</svg>,
    gpt: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["16","48","78","42","भूमिका"],["116","4","96","42","ज्ञान"],["116","94","96","42","टूल्स"],["234","48","110","42","नियम"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+26,l,{bold:true,size:10})}</g>)}<path d="M94 69h22M212 25h22M212 115h22" className={s} strokeWidth="1.5"/><path d="M164 46v48" className={s} strokeWidth="1.5"/></svg>,
    canvas: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="4" width="320" height="132" rx="14" className={s} strokeWidth="2"/><path d="M20 32h320" className={s} strokeWidth="1.5"/><path d="M132 32v104M248 32v104" className={s} strokeWidth="1.2"/>{tx(76,22,"रूपरेखा",{bold:true,size:10})}{tx(190,22,"ड्राफ्ट",{bold:true,size:10})}{tx(290,22,"संपादन",{bold:true,size:10})}</svg>,
    agent: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["10","48","60","40","लक्ष्य"],["90","6","64","40","ब्राउज़"],["90","94","64","40","फाइलें"],["174","6","64","40","ऐप्स"],["174","94","64","40","कोड"],["258","48","80","40","पूर्ण"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="9" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+24,l,{bold:true,size:9})}</g>)}<path d="M70 68h20M122 46v48M154 26h20M154 114h20M238 26l20 40M238 114l20-40" className={s} strokeWidth="1.5"/></svg>,
    models: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["20","48","72","40","Auto"],["116","4","72","40","Fast"],["116","96","72","40","Deep"],["268","48","72","40","Pro"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+25,l,{bold:true,size:10})}</g>)}<path d="M92 68h24M188 24h80M188 116h80" className={s} strokeWidth="1.5"/><path d="M152 44v52" className={s} strokeWidth="1.5"/></svg>,
    privacy: <svg viewBox="0 0 360 150" className={cls} style={{ color: col }}><path d="M180 8l88 32v44c0 34-26 62-88 80-62-18-88-46-88-80V40l88-32z" className={s} strokeWidth="2"/><path d="M150 82l18 18 40-42" className={s} strokeWidth="2.2"/>{tx(180,142,"क्षमता के साथ सीमाएँ भी चाहिए",{dim:true,size:9})}</svg>,
  };
  return V[type] || null;
}

/* ─────────────────────────────────────────────
   उप-घटक
   ───────────────────────────────────────────── */
function FeatureCard({ title, ico, color, description, when }) {
  return (
    <div className="rounded-2xl border bg-white p-5 transition-shadow duration-200 hover:shadow-md" style={{ borderColor: C.border }}>
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: color + "14" }}><Ico name={ico} className="h-4 w-4" style={{ color }} /></div>
        <span className="ff-display text-[15px] font-semibold" style={{ color: C.ink }}>{title}</span>
      </div>
      <p className="text-[13px] leading-relaxed" style={{ color: C.inkLight }}>{description}</p>
      {when && <div className="mt-3 rounded-xl px-3 py-2 text-[12px] leading-relaxed" style={{ backgroundColor: C.cream, color: C.inkLight }}><span className="font-semibold" style={{ color: C.greenDeep }}>कब: </span>{when}</div>}
    </div>
  );
}

function MiniFeature({ title, ico, color, description }) {
  return (
    <div className="rounded-2xl border bg-white p-4 transition-shadow hover:shadow-sm" style={{ borderColor: C.border }}>
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: color + "14" }}><Ico name={ico} className="h-3.5 w-3.5" style={{ color }} /></div>
        <span className="text-[13px] font-semibold" style={{ color: C.ink }}>{title}</span>
      </div>
      <p className="text-[12px] leading-relaxed" style={{ color: C.inkLight }}>{description}</p>
    </div>
  );
}

function BeforeAfterBlock({ data }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: C.border, backgroundColor: C.cream }}>
      <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>पहले बनाम बाद में</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-red-400">कमज़ोर</div>
          <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{data.before}</div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-600">मज़बूत</div>
          <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{data.after}</div>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed" style={{ color: C.greenDeep }}>
        <Ico name="lightbulb" className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span className="font-medium">{data.improvement}</span>
      </div>
    </div>
  );
}

function PromptExample({ prompt, why }) {
  return (
    <div className="rounded-xl border bg-white px-4 py-3" style={{ borderColor: C.borderLight }}>
      <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{prompt}</div>
      <div className="mt-1.5 text-[11px] leading-snug" style={{ color: C.inkMuted }}>{why}</div>
    </div>
  );
}

function GuideSectionCard({ section, isExpanded, onToggle }) {
  return (
    <section id={section.id} className="scroll-mt-28 overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md" style={{ borderColor: C.border }}>
      <button onClick={onToggle} className="flex w-full items-start gap-4 p-5 text-left md:items-center md:p-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: section.color }}><Ico name={section.ico} className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>{section.number} &middot; {section.level.charAt(0).toUpperCase() + section.level.slice(1)}</div>
          <h3 className="ff-display text-[17px] font-semibold leading-snug md:text-[19px]" style={{ color: C.ink }}>{section.title}</h3>
          {!isExpanded && <p className="clamp-2 mt-1 text-[13px] leading-relaxed" style={{ color: C.inkLight }}>{section.summary}</p>}
        </div>
        <Ico name="chevronDown" className={`mt-1 h-5 w-5 shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} style={{ color: C.inkMuted }} />
      </button>
      {isExpanded && (
        <div className="border-t px-5 pb-7 pt-6 md:px-6" style={{ borderColor: C.borderLight }}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <p className="text-[14px] leading-[1.8]" style={{ color: C.ink }}>{section.summary}</p>
              <div className="rounded-xl border p-4" style={{ borderColor: C.borderLight, backgroundColor: C.cream }}>
                <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>यह क्यों महत्वपूर्ण है</div>
                <p className="mt-2 text-[13px] leading-[1.75]" style={{ color: C.ink }}>{section.whyItMatters}</p>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.greenDeep }}>यहाँ से शुरू करें</div>
                <div className="space-y-2.5">{section.beginnerMoves.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.greenMid }} /><span>{m}</span></div>)}</div>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>उन्नत</div>
                <div className="space-y-2.5">{section.advancedMoves.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="arrowRight" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.inkMuted }} /><span>{m}</span></div>)}</div>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.roseAccent }}>सामान्य गलतियाँ</div>
                <div className="space-y-2.5">{section.commonMistakes.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="alertTriangle" className="mt-0.5 h-4 w-4 shrink-0 opacity-60" style={{ color: C.roseAccent }} /><span>{m}</span></div>)}</div>
              </div>
              <BeforeAfterBlock data={section.beforeAfter} />
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl border p-4" style={{ borderColor: C.borderLight, backgroundColor: C.cream }}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>दृश्य मॉडल</div>
                <SectionVisual type={section.visual} />
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Prompt उदाहरण</div>
                <div className="space-y-2.5">{section.promptExamples.map((p, i) => <PromptExample key={i} {...p} />)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────
   मुख्य
   ───────────────────────────────────────────── */
export default function ChatGPTMasterGuide() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [expanded, setExpanded] = useState(new Set(["mental-model"]));
  const toggleSection = useCallback((id) => { setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }, []);
  const expandAll = useCallback(() => setExpanded(new Set(GUIDE_SECTIONS.map(s => s.id))), []);
  const collapseAll = useCallback(() => setExpanded(new Set()), []);

  const filteredSections = useMemo(() => GUIDE_SECTIONS.filter(s => {
    if (level !== "all" && s.level !== level) return false;
    if (!query.trim()) return true;
    return [s.title, s.summary, s.whyItMatters, ...s.beginnerMoves, ...s.advancedMoves, ...s.commonMistakes, ...s.promptExamples.map(p => p.prompt), s.beforeAfter.before, s.beforeAfter.after].join(" ").toLowerCase().includes(query.toLowerCase());
  }), [level, query]);

  const sectionsByLevel = useMemo(() => {
    const g = { "आधार": [], "मुख्य": [], "उन्नत": [], "विशेषज्ञ": [] };
    filteredSections.forEach(s => g[s.level]?.push(s));
    return g;
  }, [filteredSections]);
  const levelLabels = { "आधार": "आधार", "मुख्य": "मुख्य कौशल", "उन्नत": "उन्नत फीचर्स", "विशेषज्ञ": "विशेषज्ञ" };

  return (
    <div className="ff-body min-h-screen" style={{ backgroundColor: C.cream, color: C.ink }}>
      <GlobalStyles />
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">

        {/* HEADER */}
        <header className="overflow-hidden rounded-3xl border" style={{ borderColor: C.borderLight, background: `linear-gradient(135deg, ${C.greenLight} 0%, ${C.cream} 40%, ${C.creamDark} 100%)` }}>
          <div className="grid gap-6 p-6 md:p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-widest" style={{ borderColor: C.borderLight, color: C.greenDeep }}><Ico name="bookOpen" className="h-3.5 w-3.5" /> व्यावहारिक संदर्भ</div>
              <h1 className="ff-display text-3xl font-medium leading-tight tracking-tight md:text-[44px] md:leading-tight" style={{ color: C.ink }}>ChatGPT की संपूर्ण मार्गदर्शिका</h1>
              <p className="mt-4 max-w-lg text-[15px] leading-[1.8]" style={{ color: C.inkLight }}>हर tool क्या करता है, उसे कब उपयोग करना चाहिए, और किस तरह लगातार बेहतर परिणाम लिए जा सकते हैं। पहले रोज़मर्रा के उपयोगकर्ताओं के लिए लिखा गया है, फिर उनके लिए जो गहराई में जाना चाहते हैं।</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Ico name="lightbulb" className="h-3 w-3" style={{ color: C.greenMid }} /> सत्यापित {VERIFIED_DATE}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Ico name="layers" className="h-3 w-3" style={{ color: C.greenMid }} /> 16 सेक्शन &middot; 60+ prompts</span>
              </div>
            </div>
            <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: C.borderLight }}>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>आज का ChatGPT क्या कर सकता है</div>
              <svg viewBox="0 0 420 190" className="w-full" style={{ color: C.greenDeep }}>
                {[["16","4","120","38","जवाब देना","चैट, सर्च"],["150","4","120","38","व्यवस्थित करना","projects, memory"],["284","4","120","38","बनाना","canvas, images"],["16","120","120","38","सीखना","study, record"],["150","120","120","38","साझा करना","groups, links"],["284","120","120","38","निष्पादित करना","tasks, agent"]].map(([x,y,w,h,l,sub])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="9" className="fill-none stroke-current" strokeWidth="1.6"/><text x={Number(x)+Number(w)/2} y={Number(y)+18} textAnchor="middle" fill={C.greenDeep} style={{fontSize:10,fontWeight:600}}>{l}</text><text x={Number(x)+Number(w)/2} y={Number(y)+30} textAnchor="middle" fill={C.greenDeep} style={{fontSize:7,opacity:0.4}}>{sub}</text></g>)}
                <text x="210" y="84" textAnchor="middle" fill={C.greenDeep} style={{fontSize:9,fontWeight:600,opacity:0.25}}>पूरा स्टैक</text>
                {[[136,23,150,23],[270,23,284,23],[76,42,76,120],[210,42,210,120],[344,42,344,120]].map(([x1,y1,x2,y2],i)=><line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.greenDeep} strokeWidth="1" opacity="0.15"/>)}
              </svg>
            </div>
          </div>
        </header>

        {/* SIX PRINCIPLES */}
        <section className="mt-8">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>छह सिद्धांत</div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[{ico:"penTool",t:"स्पष्ट पूछें",d:"लक्ष्य, संदर्भ, सीमाएँ, प्रारूप।"},{ico:"layoutGrid",t:"सही layer चुनें",d:"चैट, project, canvas, search, agent।"},{ico:"shield",t:"जहाँ ज़रूरी हो, सत्यापित करें",d:"current या high-stakes मामलों में Search करें।"},{ico:"refreshCcw",t:"फिर से शुरू नहीं, संशोधन करें",d:"अच्छे परिणाम अक्सर दूसरी pass से आते हैं।"},{ico:"bot",t:"जो काम करता है, उसे प्रणाली में बदलिए",d:"Project, GPT, task या skill।"},{ico:"eye",t:"तेज़ सोच के लिए visuals",d:"तालिकाएँ, diagrams, screenshots।"}].map(({ico,t,d})=>(
              <div key={t} className="flex gap-3 rounded-2xl border bg-white p-4" style={{borderColor:C.border}}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><Ico name={ico} className="h-4 w-4"/></div>
                <div><div className="text-[13px] font-semibold" style={{color:C.ink}}>{t}</div><div className="mt-0.5 text-[12px] leading-relaxed" style={{color:C.inkLight}}>{d}</div></div>
              </div>
            ))}
          </div>
        </section>

        {/* TOOL CHOOSER */}
        <section className="mt-8 overflow-hidden rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>निर्णय तालिका</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>आपको कौन-सा tool उपयोग करना चाहिए?</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border" style={{borderColor:C.borderLight}}>
            <table className="min-w-full text-left text-[13px]">
              <thead><tr style={{backgroundColor:C.cream}}><th className="whitespace-nowrap px-4 py-3 font-semibold" style={{color:C.ink}}>आपका लक्ष्य</th><th className="whitespace-nowrap px-4 py-3 font-semibold" style={{color:C.ink}}>सबसे उपयुक्त tool</th><th className="hidden whitespace-nowrap px-4 py-3 font-semibold sm:table-cell" style={{color:C.ink}}>क्यों</th></tr></thead>
              <tbody>{TOOL_CHOOSER.map((r,i)=><tr key={r.goal} style={{backgroundColor:i%2===0?"#fff":C.cream}}><td className="px-4 py-3 font-medium" style={{color:C.ink}}>{r.goal}</td><td className="whitespace-nowrap px-4 py-3"><span className="inline-flex items-center gap-1.5 font-semibold" style={{color:C.greenDeep}}><Ico name={r.ico} className="h-3.5 w-3.5"/>{r.tool}</span></td><td className="hidden px-4 py-3 sm:table-cell" style={{color:C.inkLight}}>{r.reason}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        {/* PROMPT FORMULA */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Prompt पैटर्न</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>छह ब्लॉक जो किसी भी prompt को बेहतर बनाते हैं</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROMPT_BLOCKS.map((b,i)=><div key={b.label} className="rounded-xl border p-4" style={{borderColor:C.borderLight,backgroundColor:C.cream}}>
              <div className="mb-1.5 flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold text-white" style={{backgroundColor:b.color}}>{i+1}</span><span className="text-[13px] font-semibold" style={{color:C.ink}}>{b.label}</span></div>
              <p className="ff-mono text-[11px] leading-relaxed" style={{color:C.inkLight}}>{b.example}</p>
            </div>)}
          </div>
        </section>

        {/* CORE FEATURES */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Feature स्टैक</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>ChatGPT के मुख्य tools</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{CORE_FEATURES.map(f=><FeatureCard key={f.title} {...f}/>)}</div>
        </section>

        {/* ADDITIONAL */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>अक्सर नज़रअंदाज़ किए जाने वाले</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>वे features जो अधिकतर उपयोगकर्ता छोड़ देते हैं</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{ADDITIONAL_FEATURES.map(f=><MiniFeature key={f.title} {...f}/>)}</div>
        </section>

        {/* NAVIGATOR */}
        <section className="sticky top-0 z-20 mt-8 rounded-2xl border bg-white p-4 shadow-lg md:p-5" style={{borderColor:C.border}}>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative mr-auto">
              <Ico name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{color:C.inkMuted}}/>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="खोजें..." className="w-full rounded-xl border py-2 pl-10 pr-3 text-[13px] outline-none sm:w-48" style={{borderColor:C.border,backgroundColor:C.cream}}/>
            </div>
            {LEVELS.map(l=><button key={l.key} onClick={()=>setLevel(l.key)} className="rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all" style={level===l.key?{backgroundColor:C.greenDeep,color:"#fff"}:{border:`1px solid ${C.border}`,color:C.inkLight}}>{l.label}</button>)}
            <button onClick={expandAll} className="rounded-lg border px-2.5 py-2 text-[11px] font-medium" style={{borderColor:C.border,color:C.inkLight}}>खोलें</button>
            <button onClick={collapseAll} className="rounded-lg border px-2.5 py-2 text-[11px] font-medium" style={{borderColor:C.border,color:C.inkLight}}>समेटें</button>
          </div>
        </section>

        {/* GUIDE SECTIONS */}
        <main className="mt-8 space-y-10">
          {Object.entries(sectionsByLevel).map(([lev, sections]) => {
            if (!sections.length) return null;
            return (<div key={lev}>
              <div className="mb-4 flex items-center gap-3"><div className="h-px flex-1" style={{backgroundColor:C.border}}/><span className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>{levelLabels[lev]}</span><div className="h-px flex-1" style={{backgroundColor:C.border}}/></div>
              <div className="space-y-4">{sections.map(s=><GuideSectionCard key={s.id} section={s} isExpanded={expanded.has(s.id)} onToggle={()=>toggleSection(s.id)}/>)}</div>
            </div>);
          })}
        </main>

        {/* SCOPE + TAKEAWAY */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{borderColor:C.border}}>
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>दायरा</div>
            <h3 className="ff-display mt-2 text-[18px] font-medium" style={{color:C.ink}}>यह क्या कवर करता है</h3>
            <div className="mt-4 space-y-2 text-[13px] leading-relaxed" style={{color:C.inkLight}}>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>यह उपयोगकर्ता-सामने वाले features के बारे में है, enterprise admin के बारे में नहीं।</div>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>उत्पाद trivia से अधिक व्यावहारिक उपयोग पर केंद्रित।</div>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>उपलब्धता plan और platform के अनुसार बदल सकती है।</div>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-200 p-5 shadow-sm" style={{background:`linear-gradient(135deg, ${C.greenLight}, #F0FAF5)`}}>
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.greenDeep}}>सबसे बड़ा अपग्रेड</div>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><Ico name="sparkles" className="h-5 w-5"/></div>
              <div>
                <div className="ff-display text-[16px] font-semibold" style={{color:C.greenDeep}}>यह पूछना बंद करें: "मैं बेहतर prompt कैसे लिखूँ?"</div>
                <p className="mt-2 text-[13px] leading-[1.75] opacity-80" style={{color:C.greenDeep}}>इसके बजाय पूछें: "इस काम के लिए ChatGPT की कौन-सी layer सबसे उपयुक्त है?" यही बदलाव prompt tricks से अधिक परिणाम देता है।</p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-8 overflow-hidden rounded-3xl p-6 text-white shadow-lg md:p-10" style={{background:"linear-gradient(135deg, #0A2A1F, #0D3B2E 40%, #143D30)"}}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-300">अंतिम सार</div>
              <h2 className="ff-display mt-2 text-2xl font-medium tracking-tight md:text-[28px]">महारत कैसी दिखती है</h2>
              <p className="mt-4 max-w-xl text-[14px] leading-[1.85] text-emerald-100" style={{opacity:0.8}}>सही mode चुनिए। काम को साफ़ परिभाषित कीजिए। जहाँ ज़रूरी हो, सत्यापित कीजिए। समझदारी से revise कीजिए। जो सफल हो, उसे पुन: उपयोग योग्य प्रणाली में बदलिए। सबसे अच्छे उपयोगकर्ता वे हैं जो पहले स्पष्ट सोचते हैं और फिर AI का उपयोग करते हैं।</p>
              <p style={{ fontSize: 13, lineHeight: 1.7 }}>
              <br />
              ChatGPT उपयोगकर्ता मार्गदर्शिका
              <br />
              © 2026 EugeneYip.com All Rights Reserved. 
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-[13px] font-semibold">इन बातों को बार-बार जाँचते रहें</div>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] leading-relaxed text-emerald-200" style={{opacity:0.7}}>
                {["क्षमताएँ","मूल्य निर्धारण","रिलीज़ नोट्स","Projects","Memory FAQ","Canvas","Tasks","Apps","Search","Deep Research","Study Mode","Record","Shared Links","Groups","Skills","Agent","Voice","Images FAQ"].map(i=><div key={i} className="flex items-center gap-1.5"><div className="h-1 w-1 shrink-0 rounded-full bg-emerald-400" style={{opacity:0.5}}/>{i}</div>)}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
