import React, { useState } from "react";
import { FileText, Sparkles, Volume2, Copy, Check, Printer, Scale, ShieldCheck, RefreshCw } from "lucide-react";
import { CONTRACT_TEMPLATES } from "../data/legalData";
import { ContractTemplate } from "../types";
import { requestTTS, LegalAudioPlayer } from "../utils/audioUtils";

export const ContractDraftingStudio: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate>(CONTRACT_TEMPLATES[0]);
  const [contractType, setContractType] = useState<string>(CONTRACT_TEMPLATES[0].name);
  const [partyFirst, setPartyFirst] = useState<string>("شركة المروة للاستثمار العقاري والتجاري (ش.م.م) - يمثلها رئيس مجلس الإدارة");
  const [partySecond, setPartySecond] = useState<string>("السيد / أحمد محمود الشريف - المستثمر / الشريك الثاني");
  const [subject, setSubject] = useState<string>("شراكة تجارية لتطوير مشروع تجاري وإداري وتوزيع الأرباح التشغيلية وحصص الإدارة");
  const [financialTerms, setFinancialTerms] = useState<string>("رأس مال استثماري قدره 2,000,000 جنيه مصري مناصفة بنسبة 50% لكل طرف");
  const [duration, setDuration] = useState<string>(CONTRACT_TEMPLATES[0].defaultDuration);
  const [jurisdiction, setJurisdiction] = useState<string>(CONTRACT_TEMPLATES[0].defaultJurisdiction);
  const [specialClauses, setSpecialClauses] = useState<string>(
    "شرط جزائي ملزم بقيمة 500,000 جنيه مصري عند الإخلال ببنود الإدارة، وبند سرية مطلقة، وحظر منافسة لمدة عامين."
  );

  const [generatedContract, setGeneratedContract] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);

  const handleSelectTemplate = (template: ContractTemplate) => {
    setSelectedTemplate(template);
    setContractType(template.name);
    setDuration(template.defaultDuration);
    setJurisdiction(template.defaultJurisdiction);
    setSpecialClauses(template.suggestedClauses.join("، بالإضافة إلى "));
  };

  const handleGenerateContract = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/legal/draft-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractType,
          partyFirst,
          partySecond,
          subject,
          financialTerms,
          duration,
          specialClauses,
          jurisdiction,
        }),
      });

      if (!response.ok) {
        throw new Error("فشل في صياغة العقد");
      }

      const data = await response.json();
      setGeneratedContract(data.contractText);
      setIsLoading(false);
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
      alert("حدث خطأ أثناء صياغة العقد. يرجى إعادة المحاولة.");
    }
  };

  const handlePlayContractTTS = async () => {
    if (!generatedContract) return;

    if (isPlayingAudio) {
      LegalAudioPlayer.stop();
      setIsPlayingAudio(false);
      return;
    }

    try {
      setIsLoadingAudio(true);
      const snippet = generatedContract.slice(0, 1400);
      const url = await requestTTS(`ملخص وبنود ${contractType} الصادرة من مكتب الأستاذ محمد عنتر للمحاماة:\n${snippet}`, "Zephyr");
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
    if (!generatedContract) return;
    navigator.clipboard.writeText(generatedContract);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    if (!generatedContract) return;
    const printWin = window.open("", "_blank");
    if (!printWin) return;
    printWin.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <title>${contractType} - مكتب الأستاذ محمد عنتر للمحاماة</title>
          <style>
            body { font-family: 'Amiri', 'Cairo', serif; padding: 40px; color: #1C1C1C; background: #FDFBF7; line-height: 2; font-size: 14px; }
            .header { border-bottom: 2px solid #8C7A5B; padding-bottom: 15px; margin-bottom: 25px; text-align: center; }
            .title { color: #1C1C1C; font-size: 22px; font-weight: bold; font-family: 'Amiri', serif; }
            .subtitle { color: #8C7A5B; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; }
            .content { white-space: pre-wrap; text-align: justify; font-family: 'Amiri', serif; }
            .signatures { margin-top: 60px; display: flex; justify-content: space-between; padding: 0 40px; }
            .signature-box { text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">مكتب الأستاذ محمد عنتر للمحاماة والاستشارات القانونية</div>
            <div class="subtitle">محامٍ بالنقض والدستورية ومحاكم أمن الدولة العليا ومجلس الدولة</div>
            <div style="margin-top: 10px; font-weight: bold; font-size: 16px;">${contractType}</div>
          </div>
          <div class="content">${generatedContract}</div>
          <div class="signatures">
            <div class="signature-box">
              <strong>توقيع الطرف الأول</strong><br><br>
              ................................
            </div>
            <div class="signature-box">
              <strong>توقيع الطرف الثاني</strong><br><br>
              ................................
            </div>
          </div>
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.print();
  };

  return (
    <section id="contract-studio-section" className="py-14 bg-[#FDFBF7] text-[#1C1C1C] border-b border-[#D4C3A3] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs tracking-[0.25em] uppercase font-bold text-[#8C7A5B] block">
            الصياغة والتحصين القانوني المحترف
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1C1C]">
            منصة صياغة وتوليد العقود والاتفاقيات القانونية
          </h2>
          <p className="text-xs sm:text-sm text-[#555]">
            صياغة عقود محكمة وشاملة لكافة الأركان وبنود التحكيم والشرعية القانونية التي تحصن أطراف العقد من أي نزاعات أو ثغرات قضائية.
          </p>
        </div>

        {/* Template Selector Ribbon */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#8C7A5B] flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" />
            <span>نماذج العقود المعتمدة:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {CONTRACT_TEMPLATES.map((tmpl, idx) => {
              const isSelected = selectedTemplate.id === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  id={`tmpl-btn-${tmpl.id}`}
                  onClick={() => handleSelectTemplate(tmpl)}
                  className={`p-3.5 text-right transition-all border flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-sm"
                      : "bg-white border-[#D4C3A3] hover:border-[#8C7A5B] text-[#1C1C1C]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-xs">{tmpl.name}</span>
                    <span className={`text-xs font-serif italic ${isSelected ? "text-[#8C7A5B]" : "text-[#D4C3A3]"}`}>
                      0{idx + 1}
                    </span>
                  </div>
                  <div className={`text-[11px] line-clamp-2 ${isSelected ? "text-[#D4C3A3]" : "text-[#666]"}`}>
                    {tmpl.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Drafting Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Input Parameters (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 bg-white border border-[#D4C3A3] shadow-sm space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#1C1C1C] flex items-center gap-2 pb-2 border-b border-[#D4C3A3]">
                <FileText className="w-4 h-4 text-[#8C7A5B]" />
                <span>بيانات وبنود العقد المخصص</span>
              </h3>

              {/* Contract Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#666]">مسمى ونوع العقد:</label>
                <input
                  id="contract-type-input"
                  type="text"
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value)}
                  className="w-full p-2.5 bg-[#FDFBF7] border border-[#D4C3A3] text-xs text-[#1C1C1C] focus:border-[#8C7A5B]"
                />
              </div>

              {/* Party 1 */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#666]">بيانات الطرف الأول (الاسم والصفة):</label>
                <input
                  id="party-first-input"
                  type="text"
                  value={partyFirst}
                  onChange={(e) => setPartyFirst(e.target.value)}
                  className="w-full p-2.5 bg-[#FDFBF7] border border-[#D4C3A3] text-xs text-[#1C1C1C] focus:border-[#8C7A5B]"
                />
              </div>

              {/* Party 2 */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#666]">بيانات الطرف الثاني (الاسم والصفة):</label>
                <input
                  id="party-second-input"
                  type="text"
                  value={partySecond}
                  onChange={(e) => setPartySecond(e.target.value)}
                  className="w-full p-2.5 bg-[#FDFBF7] border border-[#D4C3A3] text-xs text-[#1C1C1C] focus:border-[#8C7A5B]"
                />
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#666]">موضوع العقد والغرض الجوهري:</label>
                <textarea
                  id="contract-subject-input"
                  rows={2}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 bg-[#FDFBF7] border border-[#D4C3A3] text-xs text-[#1C1C1C] focus:border-[#8C7A5B] resize-none"
                />
              </div>

              {/* Financial Terms */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#666]">القيمة المالية، البدلات، وجداول السداد:</label>
                <input
                  id="financial-terms-input"
                  type="text"
                  value={financialTerms}
                  onChange={(e) => setFinancialTerms(e.target.value)}
                  className="w-full p-2.5 bg-[#FDFBF7] border border-[#D4C3A3] text-xs text-[#1C1C1C] focus:border-[#8C7A5B]"
                />
              </div>

              {/* Special Clauses & Penalties */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#666]">الشروط الجزائية وبنود التحكيم والحماية:</label>
                <textarea
                  id="special-clauses-input"
                  rows={3}
                  value={specialClauses}
                  onChange={(e) => setSpecialClauses(e.target.value)}
                  className="w-full p-2.5 bg-[#FDFBF7] border border-[#D4C3A3] text-xs text-[#1C1C1C] focus:border-[#8C7A5B] resize-none"
                />
              </div>

              {/* Jurisdiction */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#666]">المحكمة المختصة أو التحكيم:</label>
                <input
                  id="jurisdiction-input"
                  type="text"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="w-full p-2.5 bg-[#FDFBF7] border border-[#D4C3A3] text-xs text-[#1C1C1C] focus:border-[#8C7A5B]"
                />
              </div>

              {/* Generate Button */}
              <button
                id="generate-contract-btn"
                onClick={handleGenerateContract}
                disabled={isLoading}
                className="w-full py-3 bg-[#1C1C1C] hover:bg-[#333] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#D4C3A3]" />
                    <span>جاري تحرير وصياغة العقد قانونياً...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#D4C3A3]" />
                    <span>توليد وصياغة العقد بالذكاء الاصطناعي</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Contract Display & Actions (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 bg-white border border-[#D4C3A3] shadow-sm flex flex-col h-[700px]">
              {/* Output Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D4C3A3]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#8C7A5B]" />
                  <span className="font-serif font-bold text-[#1C1C1C] text-sm">
                    {generatedContract ? contractType : "مسودة وثيقة العقد"}
                  </span>
                </div>

                {generatedContract && (
                  <div className="flex items-center gap-2">
                    {/* TTS Audio Readout */}
                    <button
                      id="contract-tts-btn"
                      onClick={handlePlayContractTTS}
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
                          : "قراءة بنود العقد (TTS)"}
                      </span>
                    </button>

                    <button
                      id="contract-copy-btn"
                      onClick={handleCopy}
                      className="px-2.5 py-1 bg-[#FDFBF7] hover:bg-[#F8F5EE] border border-[#D4C3A3] text-xs text-[#1C1C1C] flex items-center gap-1"
                      title="نسخ العقد"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">{copied ? "تم النسخ" : "نسخ"}</span>
                    </button>

                    <button
                      id="contract-print-btn"
                      onClick={handlePrint}
                      className="px-2.5 py-1 bg-[#FDFBF7] hover:bg-[#F8F5EE] border border-[#D4C3A3] text-xs text-[#1C1C1C] flex items-center gap-1"
                      title="طباعة العقد"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#8C7A5B]" />
                      <span className="hidden sm:inline">طباعة</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Contract Text Body */}
              <div className="flex-1 overflow-y-auto mt-4 p-6 bg-[#FDFBF7] border border-[#E5D9C3] text-[#1C1C1C] text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-serif">
                {generatedContract ? (
                  generatedContract
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-[#888] space-y-3">
                    <FileText className="w-12 h-12 text-[#D4C3A3]" />
                    <p className="text-xs sm:text-sm">
                      قم بتحديد بيانات الأطراف والشروط واضغط على{" "}
                      <strong className="text-[#1C1C1C]">توليد وصياغة العقد</strong> لإنشاء وثيقة قانونية محكمة وغير قابلة للطعن.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Note */}
              <div className="mt-3 text-[11px] text-[#888] text-center">
                * يتم تدقيق الصياغة وفقاً لأحكام القانون المدني وقانون التجارة المصري، ومراجعة أركان صحة العقود وخلوها من البطلان.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
