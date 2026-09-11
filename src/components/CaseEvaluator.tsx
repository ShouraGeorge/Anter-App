import React, { useState } from "react";
import { ShieldAlert, Sparkles, Volume2, Copy, Check, Printer, Scale, RefreshCw, FileSearch } from "lucide-react";
import { requestTTS, LegalAudioPlayer } from "../utils/audioUtils";

export const CaseEvaluator: React.FC = () => {
  const [courtType, setCourtType] = useState<string>("محكمة النقض (طعن جنائي / مدني)");
  const [claims, setClaims] = useState<string>("إلغاء الحكم المطعون فيه وبراءة المتهم أو نقض الحكم والإحالة لدائرة أخرى");
  const [caseFacts, setCaseFacts] = useState<string>(
    "صدر حكم من محكمة الجنايات بالحبس 3 سنوات، استناداً لمحضر تحريات من ضابط المباحث دون شاهد رؤية، مع وجود تناقض صريح بين شهادة الضابط وتقرير الطب الشرعي، كما تمسك الدفاع بجلسة المحاكمة ببطلان إذن النيابة لعدم جدية التحريات ولكن الحكم المطعون فيه أغفل الرد على هذا الدفع الجوهري إطلاقاً."
  );

  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);

  const handleEvaluate = async () => {
    if (!caseFacts.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/legal/analyze-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courtType,
          claims,
          caseFacts,
        }),
      });

      if (!response.ok) {
        throw new Error("فشل في تحليل الموقف القانوني");
      }

      const data = await response.json();
      setAnalysisResult(data.analysis);
      setIsLoading(false);
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
      alert("حدث خطأ أثناء فحص ملف القضية. يرجى المحاولة مرة أخرى.");
    }
  };

  const handlePlayTTS = async () => {
    if (!analysisResult) return;

    if (isPlayingAudio) {
      LegalAudioPlayer.stop();
      setIsPlayingAudio(false);
      return;
    }

    try {
      setIsLoadingAudio(true);
      const snippet = analysisResult.slice(0, 1400);
      const url = await requestTTS(`تقرير التقييم القضائي الصادر من مكتب الأستاذ محمد عنتر للمحاماة:\n${snippet}`, "Charon");
      setIsLoadingAudio(false);
      setIsPlayingAudio(true);

      LegalAudioPlayer.play(url, () => {
        setIsPlayingAudio(false);
      });
    } catch (err) {
      console.error(err);
      setIsLoadingAudio(false);
      setIsPlayingAudio(false);
    }
  };

  const handleCopy = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    if (!analysisResult) return;
    const printWin = window.open("", "_blank");
    if (!printWin) return;
    printWin.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <title>تقرير تقييم موقف قانوني - مكتب الأستاذ محمد عنتر</title>
          <style>
            body { font-family: 'Amiri', 'Cairo', serif; padding: 40px; color: #1C1C1C; background: #FDFBF7; line-height: 1.9; font-size: 14px; }
            .header { border-bottom: 2px solid #8C7A5B; padding-bottom: 15px; margin-bottom: 25px; text-align: center; }
            .title { color: #1C1C1C; font-size: 22px; font-weight: bold; font-family: 'Amiri', serif; }
            .subtitle { color: #8C7A5B; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; }
            .content { white-space: pre-wrap; font-family: 'Amiri', serif; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">مكتب الأستاذ محمد عنتر للمحاماة والاستشارات القانونية</div>
            <div class="subtitle">محامٍ بالنقض والدستورية ومحاكم أمن الدولة العليا ومجلس الدولة</div>
            <div style="margin-top: 10px; font-weight: bold;">تقرير دراسة وتقييم الموقف القانوني والدفوع القضائية</div>
          </div>
          <div class="content">${analysisResult}</div>
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.print();
  };

  return (
    <section id="case-evaluator-section" className="py-14 bg-[#FDFBF7] text-[#1C1C1C] border-b border-[#D4C3A3] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs tracking-[0.25em] uppercase font-bold text-[#8C7A5B] block">
            الفحص القضائي المتقدم والدراسات التأصيلية
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1C1C]">
            مقيّم القضايا والمستندات والدفوع الجوهرية
          </h2>
          <p className="text-xs sm:text-sm text-[#555]">
            تحليل دقيق لوقائع النزاع، رصد أوجه القصور والبطلان، تقييم فرص النجاح أمام محكمة النقض أو محاكم الجنايات ومجلس الدولة، وتحديد الدفوع الفاصلة.
          </p>
        </div>

        {/* Evaluation Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Input Parameters (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 bg-white border border-[#D4C3A3] shadow-sm space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#1C1C1C] flex items-center gap-2 pb-2 border-b border-[#D4C3A3]">
                <Scale className="w-4 h-4 text-[#8C7A5B]" />
                <span>بيانات الدعوى والموقف القانوني</span>
              </h3>

              {/* Court Type */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#666]">الجهة أو المحكمة المختصة بنظر النزاع:</label>
                <select
                  id="eval-court-select"
                  value={courtType}
                  onChange={(e) => setCourtType(e.target.value)}
                  className="w-full p-2.5 bg-[#FDFBF7] border border-[#D4C3A3] text-xs text-[#1C1C1C] focus:border-[#8C7A5B]"
                >
                  <option value="محكمة النقض (طعن جنائي / مدني)">محكمة النقض (طعن جنائي / مدني)</option>
                  <option value="محاكم أمن الدولة العليا طوارئ والجنايات">محاكم أمن الدولة العليا طوارئ والجنايات</option>
                  <option value="مجلس الدولة والقضاء الإداري (دعاوى الإلغاء)">مجلس الدولة والقضاء الإداري (دعاوى الإلغاء)</option>
                  <option value="المحاكم المدنية والتجارية والاقتصادية">المحاكم المدنية والتجارية والاقتصادية</option>
                  <option value="تأسيس الشركات والنزاعات الاستثمارية">تأسيس الشركات والنزاعات الاستثمارية</option>
                  <option value="التحكيم التجاري الدولي والمحلي">التحكيم التجاري الدولي والمحلي</option>
                </select>
              </div>

              {/* Claims */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#666]">الطلبات القضائية المراد تحقيقها:</label>
                <input
                  id="eval-claims-input"
                  type="text"
                  value={claims}
                  onChange={(e) => setClaims(e.target.value)}
                  className="w-full p-2.5 bg-[#FDFBF7] border border-[#D4C3A3] text-xs text-[#1C1C1C] focus:border-[#8C7A5B]"
                />
              </div>

              {/* Facts & Document text */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#666]">
                  وقائع القضية، منطوق الحكم، أو نصوص المستندات محل الفحص:
                </label>
                <textarea
                  id="eval-facts-textarea"
                  rows={8}
                  value={caseFacts}
                  onChange={(e) => setCaseFacts(e.target.value)}
                  placeholder="الصق ملخص القضية أو أسباب الحكم أو بنود العقد محل النزاع..."
                  className="w-full p-3 bg-[#FDFBF7] border border-[#D4C3A3] text-xs text-[#1C1C1C] focus:border-[#8C7A5B] resize-none leading-relaxed"
                />
              </div>

              {/* Evaluate Button */}
              <button
                id="run-evaluation-btn"
                onClick={handleEvaluate}
                disabled={isLoading || !caseFacts.trim()}
                className="w-full py-3 bg-[#1C1C1C] hover:bg-[#333] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#D4C3A3]" />
                    <span>جاري فحص المستندات وتأصيل الدفوع...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#D4C3A3]" />
                    <span>إجراء التقييم القضائي والفحص الشامل</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis Report Output (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 bg-white border border-[#D4C3A3] shadow-sm flex flex-col h-[650px]">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D4C3A3]">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#8C7A5B]" />
                  <span className="font-serif font-bold text-[#1C1C1C] text-sm">تقرير الفحص القانوني والدفوع</span>
                </div>

                {analysisResult && (
                  <div className="flex items-center gap-2">
                    <button
                      id="eval-tts-btn"
                      onClick={handlePlayTTS}
                      disabled={isLoadingAudio}
                      className={`px-3 py-1.5 border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        isPlayingAudio
                          ? "bg-[#8C7A5B] text-white border-[#8C7A5B] animate-pulse"
                          : "bg-[#FDFBF7] hover:bg-[#F8F5EE] border-[#D4C3A3] text-[#1C1C1C]"
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#8C7A5B]" />
                      <span>
                        {isLoadingAudio
                          ? "جاري تجهيز الصوت..."
                          : isPlayingAudio
                          ? "إيقاف الصوت"
                          : "استمع للتقرير (TTS)"}
                      </span>
                    </button>

                    <button
                      id="eval-copy-btn"
                      onClick={handleCopy}
                      className="px-2.5 py-1 bg-[#FDFBF7] hover:bg-[#F8F5EE] border border-[#D4C3A3] text-xs text-[#1C1C1C] flex items-center gap-1"
                      title="نسخ التقرير"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">{copied ? "تم النسخ" : "نسخ"}</span>
                    </button>

                    <button
                      id="eval-print-btn"
                      onClick={handlePrint}
                      className="px-2.5 py-1 bg-[#FDFBF7] hover:bg-[#F8F5EE] border border-[#D4C3A3] text-xs text-[#1C1C1C] flex items-center gap-1"
                      title="طباعة التقرير"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#8C7A5B]" />
                      <span className="hidden sm:inline">طباعة</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Report Body */}
              <div className="flex-1 overflow-y-auto mt-4 p-6 bg-[#FDFBF7] border border-[#E5D9C3] text-[#1C1C1C] text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-serif">
                {analysisResult ? (
                  analysisResult
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-[#888] space-y-3">
                    <FileSearch className="w-12 h-12 text-[#D4C3A3]" />
                    <p className="text-xs sm:text-sm">
                      أدخل وقائع النزاع وتفاصيل الحكم للبدء في استخراج مصفوفة المخاطر، الدفوع الجوهرية، ومبادئ النقض المنطبقة.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
