import React, { useState } from "react";
import { Sparkles, Scale, Volume2, Send, RefreshCw, Copy, Check, Printer, Bookmark } from "lucide-react";
import { PRACTICE_AREAS, QUICK_LEGAL_PROMPTS } from "../data/legalData";
import { ConsultationMessage } from "../types";
import { requestTTS, LegalAudioPlayer } from "../utils/audioUtils";

interface SmartLegalConsultantProps {
  initialCategory?: string;
  initialPrompt?: string;
}

export const SmartLegalConsultant: React.FC<SmartLegalConsultantProps> = ({
  initialCategory,
  initialPrompt,
}) => {
  const [category, setCategory] = useState<string>(initialCategory || "محكمة النقض والمحكمة الدستورية");
  const [question, setQuestion] = useState<string>(initialPrompt || "");
  const [contextDetails, setContextDetails] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ConsultationMessage[]>([
    {
      id: "welcome-msg",
      sender: "consultant",
      text: `مرحباً بكم في ديوان المستشار القانوني الرقمي لمكتب الأستاذ محمد عنتر للمحاماة والاستشارات القانونية.
يسعدنا تزويدكم بالرأي القانوني المبدئي، التأصيل الفقهي والقضائي، وأهم الدفوع أمام محكمة النقض، محاكم أمن الدولة العليا، مجلس الدولة، القضاء المدني، وتأسيس الشركات وصياغة العقود.
يمكنكم طرح استفساركم أو اختيار أحد الأسئلة الشائعة أدناه.`,
      timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [loadingAudioMsgId, setLoadingAudioMsgId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<string>("Kore");

  const handleSendQuestion = async (overrideText?: string, overrideCategory?: string) => {
    const qText = overrideText || question;
    const cat = overrideCategory || category;

    if (!qText.trim()) return;

    const userMessage: ConsultationMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: qText,
      category: cat,
      timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setContextDetails("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/legal/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: qText,
          category: cat,
          contextDetails: contextDetails.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("فشل في معالجة الاستشارة القانونية");
      }

      const data = await response.json();
      const consultantMessage: ConsultationMessage = {
        id: `consultant-${Date.now()}`,
        sender: "consultant",
        text: data.reply,
        category: cat,
        timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, consultantMessage]);
      setIsLoading(false);
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
      const errorMsg: ConsultationMessage = {
        id: `err-${Date.now()}`,
        sender: "consultant",
        text: "نعتذر، حدث خطأ أثناء إعداد الرأي القانوني. يرجى التحقق من الاتصال وإعادة المحاولة أو التواصل المباشر مع مكتب الأستاذ محمد عنتر.",
        timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handlePlayMessageAudio = async (msg: ConsultationMessage) => {
    if (playingMsgId === msg.id) {
      LegalAudioPlayer.stop();
      setPlayingMsgId(null);
      return;
    }

    try {
      setLoadingAudioMsgId(msg.id);
      const url = await requestTTS(msg.text, selectedVoice);
      setLoadingAudioMsgId(null);
      setPlayingMsgId(msg.id);

      LegalAudioPlayer.play(url, () => {
        setPlayingMsgId(null);
      });
    } catch (err) {
      console.error(err);
      setLoadingAudioMsgId(null);
      setPlayingMsgId(null);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = (text: string, title: string) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <title>استشارة قانونية - مكتب الأستاذ محمد عنتر للمحاماة</title>
          <style>
            body { font-family: 'Amiri', 'Cairo', serif; padding: 40px; color: #1C1C1C; background: #FDFBF7; line-height: 1.9; }
            .header { border-bottom: 2px solid #8C7A5B; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
            h1 { color: #1C1C1C; margin: 0; font-size: 26px; font-family: 'Amiri', serif; }
            .subtitle { color: #8C7A5B; font-size: 13px; margin-top: 5px; text-transform: uppercase; letter-spacing: 2px; }
            .content { white-space: pre-wrap; font-size: 14px; font-family: 'Amiri', serif; }
            .footer { margin-top: 50px; border-top: 1px solid #D4C3A3; padding-top: 20px; font-size: 11px; color: #8C7A5B; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>مكتب الأستاذ محمد عنتر للمحاماة والاستشارات القانونية</h1>
            <div class="subtitle">المحامي بالنقض والدستورية ومحاكم أمن الدولة العليا ومجلس الدولة</div>
            <div style="margin-top: 12px; font-size: 13px; font-weight: bold; color: #1C1C1C;">رأي واستشارة قانونية: ${title}</div>
          </div>
          <div class="content">${text}</div>
          <div class="footer">
            وثيقة رأي قانوني صادرة عن المنظومة الرقمية لمكتب الأستاذ محمد عنتر للمحاماة.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div id="smart-consultant-section" className="py-14 bg-[#FDFBF7] text-[#1C1C1C] border-b border-[#D4C3A3] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Editorial Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs tracking-[0.25em] uppercase font-bold text-[#8C7A5B] block">
            المستشار الذكي ونظام النطق الفصيح (Gemini TTS)
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1C1C]">
            ديوان الاستشارات القانونية والتأصيل القضائي
          </h2>
          <p className="text-xs sm:text-sm text-[#555] leading-relaxed">
            استشارات فورية مؤصلة طبقاً لأحكام محكمة النقض والقوانين المصرية، مع إمكانية الاستماع الصوتي التفاعلي للرأي القانوني.
          </p>
        </div>

        {/* Quick Presets Ribbon */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#8C7A5B] flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5" />
            <span>نماذج استشارات متداولة:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_LEGAL_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                id={`quick-prompt-${idx}`}
                onClick={() => {
                  setCategory(item.category);
                  setQuestion(item.text);
                  handleSendQuestion(item.text, item.category);
                }}
                className="px-3.5 py-1.5 bg-white hover:bg-[#F8F5EE] border border-[#D4C3A3] hover:border-[#8C7A5B] text-xs text-[#1C1C1C] transition-all flex items-center gap-1.5"
              >
                <span className="text-[#8C7A5B] font-bold">[{item.category}]</span>
                <span>{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Consultation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 bg-white border border-[#D4C3A3] shadow-sm space-y-5">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#1C1C1C] flex items-center gap-2 pb-2 border-b border-[#D4C3A3]">
                <Scale className="w-4 h-4 text-[#8C7A5B]" />
                <span>إعدادات ملف الاستشارة</span>
              </h3>

              {/* Category Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#666]">الفرع أو الدائرة القضائية:</label>
                <select
                  id="consult-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-[#FDFBF7] border border-[#D4C3A3] text-xs text-[#1C1C1C] focus:border-[#8C7A5B]"
                >
                  {PRACTICE_AREAS.map((p) => (
                    <option key={p.id} value={p.title}>
                      {p.title}
                    </option>
                  ))}
                  <option value="استشارة قانونية عامة ومتنوعة">استشارة قانونية عامة ومتنوعة</option>
                </select>
              </div>

              {/* Context Details */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#666]">
                  وقائع إضافية أو مستندات مساعدة (اختياري):
                </label>
                <textarea
                  id="consult-context-input"
                  rows={3}
                  value={contextDetails}
                  onChange={(e) => setContextDetails(e.target.value)}
                  placeholder="مثال: رقم القضية، تاريخ الحكم، طبيعة النزاع العقاري أو الشراكة..."
                  className="w-full p-2.5 bg-[#FDFBF7] border border-[#D4C3A3] text-xs text-[#1C1C1C] focus:border-[#8C7A5B] resize-none"
                />
              </div>

              {/* Voice Selector for TTS */}
              <div className="space-y-1.5 pt-3 border-t border-[#D4C3A3]">
                <label className="text-xs font-semibold text-[#666] flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-[#8C7A5B]" />
                  <span>الصوت المفضل للقراءة الفصيحة (TTS):</span>
                </label>
                <select
                  id="consult-voice-select"
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full p-2.5 bg-[#FDFBF7] border border-[#D4C3A3] text-xs text-[#1C1C1C] focus:border-[#8C7A5B]"
                >
                  <option value="Kore">Kore (صوت رصين ومتزن)</option>
                  <option value="Zephyr">Zephyr (صوت رسمي حاسم)</option>
                  <option value="Charon">Charon (صوت قوي ووقور)</option>
                  <option value="Puck">Puck (صوت واضح وسلس)</option>
                  <option value="Fenrir">Fenrir (صوت عميق)</option>
                </select>
              </div>

              <div className="p-3 bg-[#F8F5EE] border border-[#D4C3A3] text-[11px] text-[#666] leading-relaxed">
                ⚖️ <strong>تنويه مهني:</strong> تقدم هذه المنظومة رؤى وتأصيلات قانونية مبدئية استناداً للقوانين المصرية وأحكام محكمة النقض. لدراسة أوراق الدعوى وتوكيل المكتب يرجى حجز موعد رسمي.
              </div>
            </div>
          </div>

          {/* Consultation Chat Messages (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-6 bg-white border border-[#D4C3A3] shadow-sm flex flex-col h-[580px]">
              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 pl-1">
                {messages.map((msg) => {
                  const isUser = msg.sender === "user";
                  return (
                    <div
                      key={msg.id}
                      id={`msg-${msg.id}`}
                      className={`p-4 transition-all border ${
                        isUser
                          ? "bg-[#F8F5EE] border-[#D4C3A3] mr-6 text-[#1C1C1C]"
                          : "bg-[#FFFFFF] border-[#D4C3A3] ml-2 text-[#1C1C1C] shadow-sm"
                      }`}
                    >
                      {/* Message Meta */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5D9C3] text-xs">
                        <div className="flex items-center gap-2 font-bold">
                          {isUser ? (
                            <span className="text-[#8C7A5B] uppercase tracking-wider font-sans text-xs">استفسار الموكل</span>
                          ) : (
                            <span className="text-[#1C1C1C] font-serif font-bold flex items-center gap-1.5">
                              <Scale className="w-3.5 h-3.5 text-[#8C7A5B]" />
                              رأي مكتب الأستاذ محمد عنتر
                            </span>
                          )}
                          {msg.category && (
                            <span className="text-[10px] px-2 py-0.5 border border-[#D4C3A3] bg-[#FDFBF7] text-[#666]">
                              {msg.category}
                            </span>
                          )}
                        </div>
                        <span className="text-[#888] text-[11px] font-mono">{msg.timestamp}</span>
                      </div>

                      {/* Message Body */}
                      <div className="text-sm leading-relaxed whitespace-pre-wrap font-serif text-[#222]">
                        {msg.text}
                      </div>

                      {/* Actions for Consultant Messages */}
                      {!isUser && msg.id !== "welcome-msg" && (
                        <div className="mt-4 pt-3 border-t border-[#E5D9C3] flex flex-wrap items-center justify-between gap-2 text-xs">
                          {/* TTS Audio Button */}
                          <button
                            id={`play-tts-msg-${msg.id}`}
                            onClick={() => handlePlayMessageAudio(msg)}
                            disabled={loadingAudioMsgId === msg.id}
                            className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-bold border flex items-center gap-1.5 transition-all ${
                              playingMsgId === msg.id
                                ? "bg-[#8C7A5B] text-white border-[#8C7A5B] animate-pulse"
                                : "bg-[#FDFBF7] hover:bg-[#F8F5EE] border-[#D4C3A3] text-[#1C1C1C]"
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5 text-[#8C7A5B]" />
                            <span>
                              {loadingAudioMsgId === msg.id
                                ? "جاري تجهيز الصوت..."
                                : playingMsgId === msg.id
                                ? "إيقاف الصوت"
                                : "استمع للرأي بصوت الذكاء الاصطناعي (TTS)"}
                            </span>
                          </button>

                          <div className="flex items-center gap-2 text-[#666]">
                            <button
                              onClick={() => handleCopy(msg.id, msg.text)}
                              className="px-2.5 py-1 bg-[#FDFBF7] hover:bg-[#F8F5EE] border border-[#D4C3A3] flex items-center gap-1 text-xs"
                              title="نسخ الرأي القانوني"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              <span>{copiedId === msg.id ? "تم النسخ" : "نسخ"}</span>
                            </button>

                            <button
                              onClick={() => handlePrint(msg.text, msg.category || "استشارة قانونية")}
                              className="px-2.5 py-1 bg-[#FDFBF7] hover:bg-[#F8F5EE] border border-[#D4C3A3] flex items-center gap-1 text-xs text-[#1C1C1C]"
                              title="طباعة تقرير الرأي القانوني"
                            >
                              <Printer className="w-3.5 h-3.5 text-[#8C7A5B]" />
                              <span>طباعة</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="p-4 bg-[#F8F5EE] border border-[#8C7A5B] flex items-center gap-3 text-xs font-bold text-[#8C7A5B] animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#8C7A5B]" />
                    <span>جاري بحث الأسانيد القانونية وصياغة الرأي القضائي...</span>
                  </div>
                )}
              </div>

              {/* Question Input Form */}
              <div className="mt-4 pt-3 border-t border-[#D4C3A3]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendQuestion();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    id="consult-main-input"
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="اكتب استفسارك القانوني بالتفصيل هنا..."
                    className="flex-1 p-3 bg-[#FDFBF7] border border-[#D4C3A3] text-xs sm:text-sm text-[#1C1C1C] focus:border-[#8C7A5B]"
                    disabled={isLoading}
                  />
                  <button
                    id="consult-send-btn"
                    type="submit"
                    disabled={isLoading || !question.trim()}
                    className="px-5 py-3 bg-[#1C1C1C] hover:bg-[#333] text-white font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 -rotate-90 text-[#D4C3A3]" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
