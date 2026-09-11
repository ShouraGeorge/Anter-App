import React, { useState, useRef } from "react";
import { Volume2, Play, Square, Download, Sparkles, AlertCircle, RefreshCw, Mic, FileText, Check } from "lucide-react";
import { requestTTS, LegalAudioPlayer } from "../utils/audioUtils";

export const AudioTTSStudio: React.FC = () => {
  const [text, setText] = useState<string>(
    "تعتبر محكمة النقض هي قمة الهرم القضائي في جمهورية مصر العربية، ومهمتها الأساسية هي مراقبة صحة تطبيق القانون وتفسيره في الأحكام الصادرة من محاكم الموضوع ومحاكم الجنايات، ورصد أي قصور في التسبيب أو إخلال بحق الدفاع."
  );
  const [selectedVoice, setSelectedVoice] = useState<string>("Kore");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const voiceOptions = [
    { id: "Kore", name: "Kore (صوت رصين ومتزن - موصى به للمرافعات)", gender: "نبرة متزنة" },
    { id: "Zephyr", name: "Zephyr (صوت عميق وحاسم - موصى به للعقود والقرارات)", gender: "نبرة رسمية" },
    { id: "Charon", name: "Charon (صوت جهوري وقوي - موصى به للدفوع الجنائية)", gender: "نبرة قوية" },
    { id: "Puck", name: "Puck (صوت واضح وسلس - موصى به للاستشارات العامة)", gender: "نبرة واضحة" },
    { id: "Fenrir", name: "Fenrir (صوت فصيح ووقور)", gender: "نبرة وقورة" },
  ];

  const legalPresets = [
    {
      title: "قاعدة النقض في القصور في التسبيب",
      text: "من المقرر في قضاء محكمة النقض أن الحكم يجب أن يشتمل على الأسباب التي بني عليها وإلا كان باطلاً، والمراد بالتسبيب المعتبر قانوناً هو إيراد الأدلة التي استندت إليها المحكمة وبيان مؤداها بطريق وافٍ يوضح وجه استدلالها بها على النتيجة التي انتهت إليها."
    },
    {
      title: "دفع بطلان القبض والتفتيش",
      text: "ندفع ببطلان إجراءات القبض والتفتيش لانتفاء حالة التلبس بالجريمة وانعدام إذن النيابة العامة، وما تلا ذلك من إجراءات لكون ما بني على باطل فهو باطل وفقاً لنص المادتين ثلاثين وأربعين من قانون الإجراءات الجنائية."
    },
    {
      title: "بند التحكيم والشرط الجزائي في العقود",
      text: "اتفق الطرفان على أن أي نزاع ينشأ عن تفسير أو تنفيذ هذا العقد يحال حصراً إلى التحكيم التجاري، وفي حال إخلال أي طرف بالتزاماته يلتزم بأداء تعويض اتفاقي غير خاضع لرقابة القضاء بقيمة مائة ألف جنيه مصري كشرط جزائي ملزم."
    },
    {
      title: "ميثاق الأمانة والسرية المهنية",
      text: "يلتزم مكتب الأستاذ محمد عنتر للمحاماة بالحفاظ التام على أسرار الموكلين ووثائقهم وحماية مراكزهم القانونية بأقصى درجات اليقظة والنزاهة والمسؤولية الأخلاقية أمام الله والعدالة."
    }
  ];

  const handleGenerateAndPlay = async () => {
    if (!text.trim()) {
      setErrorMessage("يرجى كتابة أو اختيار نص لتحويله إلى صوت");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const url = await requestTTS(text, selectedVoice);
      setAudioUrl(url);
      setIsLoading(false);
      setIsPlaying(true);

      const audio = LegalAudioPlayer.play(url, () => {
        setIsPlaying(false);
      });
      audioElementRef.current = audio;
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
      setIsPlaying(false);
      setErrorMessage(err.message || "حدث خطأ أثناء تحويل النص إلى صوت بواسطة الذكاء الاصطناعي");
    }
  };

  const handleStopAudio = () => {
    LegalAudioPlayer.stop();
    setIsPlaying(false);
  };

  const handleDownloadAudio = () => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `antar-law-audio-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="tts-studio-section" className="py-14 bg-[#FDFBF7] text-[#1C1C1C] border-b border-[#D4C3A3] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs tracking-[0.25em] uppercase font-bold text-[#8C7A5B] block">
            النظام الصوتي الذكي (Gemini 3.1 Flash TTS)
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1C1C]">
            قارئ النصوص والمرافعات القانونية الفصيح
          </h2>
          <p className="text-xs sm:text-sm text-[#555] leading-relaxed">
            تحويل الاستشارات القانونية، بنود العقود، مذكرات الطعن بالنقض، أو أي نصوص إلى صوت فصيح فائق النقاء بنموذج <code className="text-[#8C7A5B] font-mono text-xs bg-[#F8F5EE] border border-[#D4C3A3] px-1.5 py-0.5 font-bold">gemini-3.1-flash-tts-preview</code>.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#8C7A5B] flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>نصوص ومبادئ قانونية نموذجية للقراءة:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {legalPresets.map((preset, idx) => (
              <button
                key={idx}
                id={`tts-preset-btn-${idx}`}
                onClick={() => {
                  setText(preset.text);
                  setAudioUrl(null);
                  handleStopAudio();
                }}
                className="p-3 text-right bg-white hover:bg-[#F8F5EE] border border-[#D4C3A3] hover:border-[#8C7A5B] text-xs text-[#1C1C1C] transition-all space-y-1 shadow-sm"
              >
                <div className="font-bold text-[#8C7A5B] truncate">{preset.title}</div>
                <div className="text-[#666] line-clamp-2 text-[11px] font-serif">{preset.text}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main TTS Form & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Text Input Column (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-6 bg-white border border-[#D4C3A3] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#D4C3A3]">
                <label className="text-xs uppercase tracking-wider font-bold text-[#1C1C1C] flex items-center gap-2">
                  <Mic className="w-4 h-4 text-[#8C7A5B]" />
                  <span>النص القانوني المراد تحويله لصوت فصيح:</span>
                </label>
                <div className="flex items-center gap-2 text-xs text-[#666]">
                  <button
                    onClick={handleCopyText}
                    className="px-2.5 py-1 bg-[#FDFBF7] hover:bg-[#F8F5EE] border border-[#D4C3A3] flex items-center gap-1 text-xs text-[#1C1C1C]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5" />}
                    <span>{copied ? "تم النسخ" : "نسخ النص"}</span>
                  </button>
                  <span className="font-mono">{text.length} حرف</span>
                </div>
              </div>

              <textarea
                id="tts-input-textarea"
                rows={7}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setAudioUrl(null);
                }}
                placeholder="اكتب أو الصق نص الاستشارة أو مادة القانون أو بند العقد هنا..."
                className="w-full p-4 bg-[#FDFBF7] border border-[#D4C3A3] focus:border-[#8C7A5B] text-[#1C1C1C] text-xs sm:text-sm leading-relaxed resize-none transition-all font-serif"
              />

              {errorMessage && (
                <div className="p-3 bg-[#F8F5EE] border border-rose-400 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {!isPlaying ? (
                  <button
                    id="tts-generate-play-btn"
                    onClick={handleGenerateAndPlay}
                    disabled={isLoading || !text.trim()}
                    className="flex-1 min-w-[200px] py-3 px-6 bg-[#1C1C1C] hover:bg-[#333] text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#D4C3A3]" />
                        <span>جاري المعالجة وتوليد الصوت (Gemini)...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current text-[#D4C3A3]" />
                        <span>توليد وتشغيل الصوت الذكي</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    id="tts-stop-btn"
                    onClick={handleStopAudio}
                    className="flex-1 min-w-[200px] py-3 px-6 bg-[#8C7A5B] hover:bg-[#786749] text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 animate-pulse shadow-sm"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>إيقاف التشغيل الصوتي</span>
                  </button>
                )}

                {audioUrl && (
                  <button
                    id="tts-download-btn"
                    onClick={handleDownloadAudio}
                    className="py-3 px-4 bg-[#FDFBF7] hover:bg-[#F8F5EE] border border-[#D4C3A3] text-[#1C1C1C] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                    title="تحميل الملف الصوتي (WAV)"
                  >
                    <Download className="w-4 h-4 text-[#8C7A5B]" />
                    <span className="hidden sm:inline">تحميل WAV</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Settings & Voice Selection Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 bg-white border border-[#D4C3A3] shadow-sm space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#1C1C1C] flex items-center gap-2 pb-2 border-b border-[#D4C3A3]">
                <Volume2 className="w-4 h-4 text-[#8C7A5B]" />
                <span>اختيار النبرة والصوت الذكي:</span>
              </h3>

              <div className="space-y-2">
                {voiceOptions.map((voice) => (
                  <label
                    key={voice.id}
                    id={`voice-option-${voice.id}`}
                    className={`block p-3 border cursor-pointer transition-all ${
                      selectedVoice === voice.id
                        ? "bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-sm"
                        : "bg-[#FDFBF7] border-[#D4C3A3] hover:border-[#8C7A5B] text-[#1C1C1C]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="voiceName"
                          value={voice.id}
                          checked={selectedVoice === voice.id}
                          onChange={() => {
                            setSelectedVoice(voice.id);
                            setAudioUrl(null);
                          }}
                          className="text-[#8C7A5B] focus:ring-[#8C7A5B]"
                        />
                        <span className="text-xs font-bold">{voice.name}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Status & Player Widget */}
              <div className="pt-3 border-t border-[#D4C3A3] space-y-3">
                <div className="flex items-center justify-between text-xs text-[#666]">
                  <span>حالة الصوت:</span>
                  <span className={`font-semibold ${isPlaying ? "text-[#8C7A5B]" : "text-[#666]"}`}>
                    {isLoading
                      ? "جاري المعالجة في السيرفر..."
                      : isPlaying
                      ? "قيد الاستماع الآن 🔊"
                      : audioUrl
                      ? "الصوت جاهز للتشغيل"
                      : "في انتظار بدء التوليد"}
                  </span>
                </div>

                {/* Animated Audio Waveform when playing */}
                {isPlaying && (
                  <div className="flex items-center justify-center gap-1.5 py-3 bg-[#FDFBF7] border border-[#D4C3A3]">
                    {[40, 70, 90, 60, 30, 80, 100, 45, 75, 55, 95, 40].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-[#8C7A5B] animate-bounce"
                        style={{
                          height: `${Math.max(10, h * 0.25)}px`,
                          animationDelay: `${(i % 5) * 0.15}s`,
                          animationDuration: "0.8s",
                        }}
                      />
                    ))}
                  </div>
                )}

                <div className="text-[11px] text-[#888] leading-normal font-serif">
                  * يتم إنتاج النبرات الصوتية عبر محرك <strong className="text-[#1C1C1C]">gemini-3.1-flash-tts-preview</strong> بتردد 24,000 هرتز لضمان سلامة مخارج الحروف الفصحى والمصطلحات القانونية المعقدة.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
