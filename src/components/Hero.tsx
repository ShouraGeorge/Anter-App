import React, { useState } from "react";
import { Scale, Shield, Building2, FileText, Landmark, Volume2, Sparkles, ArrowLeft, Award, CheckCircle2 } from "lucide-react";
import { LAWYER_PROFILE } from "../data/legalData";
import { requestTTS, LegalAudioPlayer } from "../utils/audioUtils";

interface HeroProps {
  onExplorePractices: () => void;
  onOpenConsultant: () => void;
  onOpenContracts: () => void;
  onBookClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExplorePractices,
  onOpenConsultant,
  onOpenContracts,
  onBookClick,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const handlePlayFirmIntro = async () => {
    if (isPlayingAudio) {
      LegalAudioPlayer.stop();
      setIsPlayingAudio(false);
      return;
    }

    try {
      setIsLoadingAudio(true);
      const introSpeech = `أهلاً بكم في المنصة الرسمية لمكتب الأستاذ محمد عنتر للمحاماة والاستشارات القانونية، محارب النقض. نتشرف بتقديم خدمات التقاضي الرفيعة أمام محكمة النقض، ومحاكم أمن الدولة العليا، ومجلس الدولة، والقضاء المدني والتجاري، إضافة إلى تأسيس الشركات وصياغة العقود باحترافية بالغة لحماية كافة حقوقكم وأموالكم.`;
      const audioUrl = await requestTTS(introSpeech, "Kore");
      setIsLoadingAudio(false);
      setIsPlayingAudio(true);
      LegalAudioPlayer.play(audioUrl, () => {
        setIsPlayingAudio(false);
      });
    } catch (err) {
      console.error(err);
      setIsLoadingAudio(false);
      setIsPlayingAudio(false);
    }
  };

  const keySpecialties = [
    { num: "01", title: "محكمة النقض والدستورية", icon: Scale, desc: "صياغة صحف ومذكرات النقض الجنائية والمدنية ورصد أوجه القصور في التسبيب والفساد في الاستدلال." },
    { num: "02", title: "أمن الدولة العليا والجنايات", icon: Shield, desc: "الدفاع في قضايا أمن الدولة طوارئ والطعون وبناء الدفوع الدستورية والإجرائية الحصينة." },
    { num: "03", title: "مجلس الدولة والقضاء الإداري", icon: Landmark, desc: "دعاوى الإلغاء، شق مستعجل ووقف التنفيذ، ومنازعات العقود الإدارية والتعويضات." },
    { num: "04", title: "القضاء المدني والتجاري", icon: Award, desc: "حماية الملكيات والنزاعات العقارية الكبرى والتعويضات والصلح الواقي من الإفلاس." },
    { num: "05", title: "تأسيس الشركات والاستثمار", icon: Building2, desc: "تأسيس شركات المساهمة والمحدودة بهيئة الاستثمار (GAFI) وتعديل حصص الشركاء." },
    { num: "06", title: "صياغة وتدقيق العقود", icon: FileText, desc: "عقود محكمة تسد كافة الثغرات وبنود التحكيم الدولي والشروط الجزائية الملزمة." },
  ];

  return (
    <section className="bg-[#FDFBF7] text-[#1C1C1C] border-b border-[#D4C3A3] relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12">
        {/* Editorial Left / Main Hero Block (4 cols in desktop) */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-l border-[#D4C3A3] p-8 sm:p-12 flex flex-col justify-between bg-[#F8F5EE]/60">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase font-bold text-[#8C7A5B] block mb-2">
              محامٍ بالنقض والدستورية
            </span>
            <h2 className="text-5xl sm:text-6xl font-serif font-bold text-[#1C1C1C] leading-[1.1] mb-6">
              محارب<br />
              <span className="text-[#8C7A5B] italic font-serif">النقض</span>
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-[#4A4A4A] max-w-sm">
              نخبة قانونية رصينة متخصصة في الطعون الجنائية والمدنية الكبرى ومحاكم أمن الدولة العليا ومجلس الدولة والشركات بمهنية واقتدار قضائي.
            </p>

            {/* Quick Action Buttons */}
            <div className="mt-8 space-y-3">
              <button
                id="hero-consult-btn"
                onClick={onOpenConsultant}
                className="w-full bg-[#1C1C1C] hover:bg-[#333333] text-white px-5 py-3 text-xs tracking-wider uppercase font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#D4C3A3]" />
                <span>استشارة قانونية ذكية (AI)</span>
              </button>

              <button
                id="hero-tts-intro-btn"
                onClick={handlePlayFirmIntro}
                disabled={isLoadingAudio}
                className={`w-full px-5 py-3 text-xs tracking-wider uppercase font-bold border transition-all flex items-center justify-center gap-2 ${
                  isPlayingAudio
                    ? "bg-[#8C7A5B] text-white border-[#8C7A5B] animate-pulse"
                    : "bg-[#FFFFFF] hover:bg-[#F8F5EE] border-[#D4C3A3] text-[#1C1C1C]"
                }`}
              >
                <Volume2 className="w-4 h-4 text-[#8C7A5B]" />
                <span>
                  {isLoadingAudio
                    ? "جاري تجهيز الصوت..."
                    : isPlayingAudio
                    ? "إيقاف الصوت (TTS)"
                    : "البيان الصوتي للمكتب (TTS)"}
                </span>
              </button>
            </div>
          </div>

          {/* Sequential Editorial Milestones */}
          <div className="mt-12 space-y-4 pt-6 border-t border-[#D4C3A3]">
            <div className="flex items-end justify-between border-b border-[#D4C3A3] pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C]">المحكمة الدستورية العليا</span>
              <span className="text-3xl font-serif italic text-[#8C7A5B]">01</span>
            </div>
            <div className="flex items-end justify-between border-b border-[#D4C3A3] pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C]">محاكم أمن الدولة طوارئ</span>
              <span className="text-3xl font-serif italic text-[#8C7A5B]">02</span>
            </div>
            <div className="flex items-end justify-between border-b border-[#D4C3A3] pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C]">مجلس الدولة والقضاء الإداري</span>
              <span className="text-3xl font-serif italic text-[#8C7A5B]">03</span>
            </div>
          </div>
        </div>

        {/* Editorial Right / Main Content Area (8 cols in desktop) */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div className="p-8 sm:p-12">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <div>
                <h3 className="text-xs uppercase tracking-[0.3em] text-[#8C7A5B] font-bold">
                  الخبرة القانونية المتكاملة
                </h3>
                <h4 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1C1C] mt-1">
                  أركان التقاضي والخدمات القضائية
                </h4>
              </div>
              <button
                onClick={onExplorePractices}
                className="text-xs font-bold uppercase tracking-widest text-[#1C1C1C] hover:text-[#8C7A5B] flex items-center gap-1 transition-colors"
              >
                <span>استعراض كافة الدوائر</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 6 Grid items in classic editorial layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              {keySpecialties.map((spec, idx) => {
                const Icon = spec.icon;
                return (
                  <div
                    key={idx}
                    id={`hero-spec-card-${idx}`}
                    onClick={onExplorePractices}
                    className="p-5 bg-white border border-[#D4C3A3] hover:border-[#8C7A5B] transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-serif italic text-[#D4C3A3] group-hover:text-[#8C7A5B] transition-colors">
                          {spec.num}
                        </span>
                        <div className="w-8 h-8 border border-[#D4C3A3] bg-[#FDFBF7] flex items-center justify-center text-[#8C7A5B]">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-[#1C1C1C] mb-2 group-hover:text-[#8C7A5B] transition-colors">
                        {spec.title}
                      </h4>
                      <p className="text-xs text-[#666] leading-relaxed">
                        {spec.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#F8F5EE] flex items-center justify-between text-[11px] font-bold text-[#8C7A5B]">
                      <span>الدفوع والتأصيل</span>
                      <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Editorial Bottom Charcoal Bar */}
          <div className="mt-auto p-8 sm:p-12 bg-[#1C1C1C] text-white flex flex-wrap justify-between items-center gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#8C7A5B] mb-1 font-bold">
                المقر الرئيسي
              </p>
              <p className="text-sm font-serif text-[#FDFBF7]">
                {LAWYER_PROFILE.address}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#8C7A5B] mb-1 font-bold">
                الخط الساخن للمكتب
              </p>
              <a
                href={`tel:${LAWYER_PROFILE.phone}`}
                className="text-xl sm:text-2xl font-serif font-bold text-white hover:text-[#D4C3A3] transition-colors font-mono"
              >
                {LAWYER_PROFILE.phone}
              </a>
            </div>
            <div>
              <button
                id="hero-docket-book-btn"
                onClick={onBookClick}
                className="border border-[#8C7A5B] bg-[#8C7A5B] hover:bg-[#A08D6D] text-[#1C1C1C] px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all"
              >
                حجز موعد
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
