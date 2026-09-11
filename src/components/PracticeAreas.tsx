import React, { useState } from "react";
import { PRACTICE_AREAS } from "../data/legalData";
import { PracticeArea } from "../types";
import { Scale, ShieldAlert, Landmark, Briefcase, Building2, FileCheck, CheckCircle2, Volume2, Sparkles, ArrowLeft, PhoneCall } from "lucide-react";
import { requestTTS, LegalAudioPlayer } from "../utils/audioUtils";

interface PracticeAreasProps {
  onConsultField: (fieldName: string, promptText: string) => void;
  onBookClick: () => void;
}

export const PracticeAreas: React.FC<PracticeAreasProps> = ({ onConsultField, onBookClick }) => {
  const [selectedArea, setSelectedArea] = useState<string>(PRACTICE_AREAS[0].id);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);

  const iconMap: Record<string, React.ElementType> = {
    Scale,
    ShieldAlert,
    Landmark,
    Briefcase,
    Building2,
    FileCheck,
  };

  const handlePlayAreaTTS = async (area: PracticeArea) => {
    if (playingAudioId === area.id) {
      LegalAudioPlayer.stop();
      setPlayingAudioId(null);
      return;
    }

    try {
      setLoadingAudioId(area.id);
      const textToSpeak = `نبذة عن خدمات ${area.title} بمكتب الأستاذ محمد عنتر للمحاماة: ${area.shortDesc} ${area.fullDesc}`;
      const url = await requestTTS(textToSpeak, "Kore");
      setLoadingAudioId(null);
      setPlayingAudioId(area.id);
      LegalAudioPlayer.play(url, () => {
        setPlayingAudioId(null);
      });
    } catch (err) {
      console.error(err);
      setLoadingAudioId(null);
      setPlayingAudioId(null);
    }
  };

  const currentArea = PRACTICE_AREAS.find((a) => a.id === selectedArea) || PRACTICE_AREAS[0];
  const CurrentIcon = iconMap[currentArea.iconName] || Scale;

  return (
    <section id="practice-areas-section" className="py-16 bg-[#FDFBF7] text-[#1C1C1C] border-b border-[#D4C3A3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs tracking-[0.25em] uppercase font-bold text-[#8C7A5B] block">
            المنظومة القضائية والخدمات التخصصية
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1C1C]">
            مجالات الترافع والدوائر القضائية
          </h2>
          <p className="text-xs sm:text-sm text-[#555] leading-relaxed">
            خبرة راسخة في تولي أعقد القضايا أمام المحاكم العليا، وبناء الدفوع الدستورية والإجرائية، وصياغة العقود وتأسيس الكيانات الاستثمارية.
          </p>
        </div>

        {/* Practice Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PRACTICE_AREAS.map((area, idx) => {
            const Icon = iconMap[area.iconName] || Scale;
            const isSelected = selectedArea === area.id;
            return (
              <button
                key={area.id}
                id={`practice-tab-${area.id}`}
                onClick={() => setSelectedArea(area.id)}
                className={`p-4 text-right transition-all flex flex-col justify-between border ${
                  isSelected
                    ? "bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-sm"
                    : "bg-white border-[#D4C3A3] text-[#1C1C1C] hover:border-[#8C7A5B]"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className={`text-lg font-serif italic ${isSelected ? "text-[#8C7A5B]" : "text-[#D4C3A3]"}`}>
                    0{idx + 1}
                  </span>
                  <Icon className={`w-4 h-4 ${isSelected ? "text-[#8C7A5B]" : "text-[#666]"}`} />
                </div>
                <div>
                  <h3 className={`text-xs font-bold line-clamp-2 ${isSelected ? "text-white" : "text-[#1C1C1C]"}`}>
                    {area.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Practice Detail View (Editorial White Card) */}
        <div className="p-8 sm:p-10 bg-white border border-[#D4C3A3] shadow-sm space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-[#D4C3A3]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 border border-[#8C7A5B] bg-[#FDFBF7] flex items-center justify-center text-[#8C7A5B] shrink-0">
                <CurrentIcon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1C1C]">
                  {currentArea.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8C7A5B] font-semibold mt-1">
                  {currentArea.shortDesc}
                </p>
              </div>
            </div>

            {/* Audio TTS Button & Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                id={`play-area-tts-${currentArea.id}`}
                onClick={() => handlePlayAreaTTS(currentArea)}
                disabled={loadingAudioId === currentArea.id}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-bold border transition-all flex items-center gap-2 ${
                  playingAudioId === currentArea.id
                    ? "bg-[#8C7A5B] text-white border-[#8C7A5B] animate-pulse"
                    : "bg-[#FDFBF7] hover:bg-[#F8F5EE] border-[#D4C3A3] text-[#1C1C1C]"
                }`}
              >
                <Volume2 className="w-4 h-4 text-[#8C7A5B]" />
                <span>
                  {loadingAudioId === currentArea.id
                    ? "جاري تجهيز الصوت..."
                    : playingAudioId === currentArea.id
                    ? "إيقاف القراءة"
                    : "استمع للشرح (TTS)"}
                </span>
              </button>

              <button
                id={`consult-area-btn-${currentArea.id}`}
                onClick={() =>
                  onConsultField(
                    currentArea.title,
                    `أود استشارة قانونية متخصصة في شأن ${currentArea.title}. ما هي أهم الإجراءات والضمانات القانونية لحماية موقفي؟`
                  )
                }
                className="px-5 py-2 bg-[#1C1C1C] hover:bg-[#333] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4C3A3]" />
                <span>استشارة ذكية فورية</span>
              </button>
            </div>
          </div>

          {/* Full Description in Editorial Typography */}
          <div className="text-[#333] text-sm leading-relaxed bg-[#FDFBF7] p-6 border border-[#E5D9C3] font-serif">
            {currentArea.fullDesc}
          </div>

          {/* 3 Columns: Courts, Defenses, Procedures */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Key Courts */}
            <div className="p-6 bg-[#FDFBF7] border border-[#D4C3A3] space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C] flex items-center gap-2 pb-2 border-b border-[#D4C3A3]">
                <Landmark className="w-4 h-4 text-[#8C7A5B]" />
                <span>المحاكم والجهات المختصة</span>
              </h4>
              <ul className="space-y-2.5">
                {currentArea.keyCourts.map((court, i) => (
                  <li key={i} className="text-xs text-[#444] flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-[#8C7A5B] mt-1.5 shrink-0" />
                    <span>{court}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Main Defenses */}
            <div className="p-6 bg-[#FDFBF7] border border-[#D4C3A3] space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C] flex items-center gap-2 pb-2 border-b border-[#D4C3A3]">
                <ShieldAlert className="w-4 h-4 text-[#8C7A5B]" />
                <span>أبرز الدفوع والأسس القانونية</span>
              </h4>
              <ul className="space-y-2.5">
                {currentArea.mainDefenses.map((defense, i) => (
                  <li key={i} className="text-xs text-[#444] flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#8C7A5B] mt-0.5 shrink-0" />
                    <span>{defense}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Procedures & Workflows */}
            <div className="p-6 bg-[#FDFBF7] border border-[#D4C3A3] space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C] flex items-center gap-2 pb-2 border-b border-[#D4C3A3]">
                <FileCheck className="w-4 h-4 text-[#8C7A5B]" />
                <span>خطة العمل والإجراءات التنفيذية</span>
              </h4>
              <ul className="space-y-2.5">
                {currentArea.procedures.map((proc, i) => (
                  <li key={i} className="text-xs text-[#444] flex items-start gap-2">
                    <span className="font-serif italic text-xs font-bold text-[#8C7A5B] shrink-0">
                      0{i + 1}.
                    </span>
                    <span>{proc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Direct CTA */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#D4C3A3] text-xs">
            <div className="text-[#666]">
              هل تواجه نزاعاً أو طعناً متعلقاً بـ <strong className="text-[#1C1C1C]">{currentArea.title}</strong>؟
            </div>
            <button
              onClick={onBookClick}
              className="px-6 py-2.5 bg-[#1C1C1C] hover:bg-[#333] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#D4C3A3]" />
              <span>تحديد موعد مع الأستاذ محمد عنتر لدراسة ملف القضية</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
