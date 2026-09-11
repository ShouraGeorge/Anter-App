import React, { useState } from "react";
import { Scale, Award, Shield, CheckCircle2, Volume2, UserCheck, PhoneCall } from "lucide-react";
import { LAWYER_PROFILE } from "../data/legalData";
import { requestTTS, LegalAudioPlayer } from "../utils/audioUtils";

interface FirmAboutProps {
  onBookClick: () => void;
  onOpenConsultant: () => void;
}

export const FirmAboutAndCredentials: React.FC<FirmAboutProps> = ({ onBookClick, onOpenConsultant }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const handlePlayOath = async () => {
    if (isPlayingAudio) {
      LegalAudioPlayer.stop();
      setIsPlayingAudio(false);
      return;
    }

    try {
      setIsLoadingAudio(true);
      const oathText = `كلمة الأستاذ محمد عنتر للموكلين: إن رسالة المحاماة هي حراسة العدالة وسيادة القانون. نلتزم ببذل غاية الجهد والعناية واليقظة القانونية أمام محكمة النقض ومحاكم أمن الدولة العليا ومجلس الدولة والقضاء المدني، وصياغة العقود وتأسيس الشركات لضمان حقوقكم وبناء مراكز قانونية حصينة.`;
      const url = await requestTTS(oathText, "Kore");
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

  return (
    <section id="about-firm-section" className="py-16 bg-[#FDFBF7] text-[#1C1C1C] border-b border-[#D4C3A3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs tracking-[0.25em] uppercase font-bold text-[#8C7A5B] block">
            السيرة المهنية والقيد القضائي
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1C1C]">
            الأستاذ محمد عنتر
          </h2>
          <p className="text-xs sm:text-sm text-[#555]">
            {LAWYER_PROFILE.title}
          </p>
        </div>

        {/* Profile Card & Credo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Lawyer Bio & Highlights (7 cols) */}
          <div className="lg:col-span-7 p-8 bg-white border border-[#D4C3A3] shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-[#D4C3A3]">
                <div className="w-14 h-14 border border-[#8C7A5B] bg-[#FDFBF7] flex items-center justify-center text-[#8C7A5B]">
                  <Scale className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[#1C1C1C]">
                    الأستاذ محمد عنتر
                  </h3>
                  <p className="text-xs text-[#8C7A5B] font-semibold">
                    المحامي بالنقض والدستورية ومحاكم أمن الدولة العليا ومجلس الدولة
                  </p>
                </div>
              </div>

              <blockquote className="p-5 bg-[#FDFBF7] border border-[#E5D9C3] text-xs sm:text-sm text-[#333] font-serif italic leading-relaxed">
                "{LAWYER_PROFILE.credo}"
              </blockquote>

              <p className="text-xs sm:text-sm text-[#555] leading-relaxed font-serif">
                يتمتع الأستاذ محمد عنتر بخبرة قضائية ممتدة في مباشرة الطعون الجنائية والمدنية المعقدة أمام محكمة النقض، والترافع في قضايا الجنايات الكبرى وأمن الدولة العليا، وإلغاء القرارات الإدارية بمجلس الدولة، إلى جانب قيادة فريق متخصص في تأسيس الشركات المساهمة والمحدودة وصياغة العقود التجارية الدولية والمحلية.
              </p>

              {/* Memberships & Admissions List */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C] flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#8C7A5B]" />
                  <span>القيود والاعتمادات القضائية الرسمية:</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#333]">
                  {LAWYER_PROFILE.memberships.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2.5 bg-[#FDFBF7] border border-[#D4C3A3]">
                      <CheckCircle2 className="w-4 h-4 text-[#8C7A5B] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Audio Voice Oath Button */}
            <div className="pt-4 border-t border-[#D4C3A3] flex flex-wrap items-center justify-between gap-3">
              <button
                id="play-lawyer-oath-btn"
                onClick={handlePlayOath}
                disabled={isLoadingAudio}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-bold border flex items-center gap-2 transition-all ${
                  isPlayingAudio
                    ? "bg-[#8C7A5B] text-white border-[#8C7A5B] animate-pulse"
                    : "bg-[#FDFBF7] hover:bg-[#F8F5EE] border-[#D4C3A3] text-[#1C1C1C]"
                }`}
              >
                <Volume2 className="w-4 h-4 text-[#8C7A5B]" />
                <span>
                  {isLoadingAudio
                    ? "جاري تجهيز الصوت..."
                    : isPlayingAudio
                    ? "إيقاف الكلمة الصوتية"
                    : "استمع لكلمة الأستاذ محمد عنتر (TTS)"}
                </span>
              </button>

              <button
                onClick={onBookClick}
                className="px-6 py-2.5 bg-[#1C1C1C] hover:bg-[#333] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
              >
                حجز موعد مقابلة شخصية بالمكتب
              </button>
            </div>
          </div>

          {/* Office Pillars & Principles (5 cols) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="p-8 bg-white border border-[#D4C3A3] shadow-sm space-y-5">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#1C1C1C] flex items-center gap-2 pb-3 border-b border-[#D4C3A3]">
                <Shield className="w-4 h-4 text-[#8C7A5B]" />
                <span>ركائز العمل بمكتب الأستاذ محمد عنتر</span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-1">
                  <div className="font-bold text-[#1C1C1C] flex items-center gap-2">
                    <span className="font-serif italic text-xs text-[#8C7A5B]">01.</span>
                    <span>الصرامة في المواعيد الإجرائية</span>
                  </div>
                  <p className="text-[#555] text-xs leading-relaxed pr-6">
                    متابعة صارمة لمواعيد الطعن بالنقض (60 يوماً)، مواعيد دعاوى الإلغاء، والتظلمات الوجوبية لضمان عدم سقوط الحقوق شكلياً.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-[#1C1C1C] flex items-center gap-2">
                    <span className="font-serif italic text-xs text-[#8C7A5B]">02.</span>
                    <span>بناء الدفوع المعززة بأحكام النقض</span>
                  </div>
                  <p className="text-[#555] text-xs leading-relaxed pr-6">
                    إسناد كل دفع لمواد القانون وأحدث مبادئ الهيئة العامة للمواد الجنائية والمدنية بمحكمة النقض.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-[#1C1C1C] flex items-center gap-2">
                    <span className="font-serif italic text-xs text-[#8C7A5B]">03.</span>
                    <span>هندسة العقود والوقاية من النزاعات</span>
                  </div>
                  <p className="text-[#555] text-xs leading-relaxed pr-6">
                    صياغة العقود الاستثمارية والتجارية لتكون بمثابة درع قانوني يمنع النزاع قبل وقوعه.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-[#1C1C1C] flex items-center gap-2">
                    <span className="font-serif italic text-xs text-[#8C7A5B]">04.</span>
                    <span>الشفافية والمتابعة المستمرة للموكل</span>
                  </div>
                  <p className="text-[#555] text-xs leading-relaxed pr-6">
                    إحاطة الموكل بتقرير دوري عن سير الجلسات وتقارير الخبراء ومذكرات الرد أولاً بأول.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Contact Banner */}
            <div className="p-6 bg-white border border-[#D4C3A3] shadow-sm flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-[#1C1C1C]">تحتاج تدخلاً قانونياً عاجلاً؟</div>
                <div className="text-[11px] text-[#666]">فريق المحامين بالمكتب متاح لتقديم المشورة</div>
              </div>
              <button
                onClick={onOpenConsultant}
                className="px-4 py-2 bg-[#1C1C1C] text-white text-xs font-bold uppercase tracking-wider shrink-0 hover:bg-[#333] transition-colors"
              >
                المستشار الذكي الآن
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
