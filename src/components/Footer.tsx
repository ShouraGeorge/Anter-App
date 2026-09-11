import React from "react";
import { Scale, Phone, MapPin, Mail, Clock, ShieldCheck } from "lucide-react";
import { LAWYER_PROFILE, PRACTICE_AREAS } from "../data/legalData";

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#1C1C1C] text-[#D4C3A3] border-t border-[#8C7A5B] text-xs leading-relaxed">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[#8C7A5B] bg-[#2A2A2A] flex items-center justify-center text-[#8C7A5B]">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-serif font-bold text-[#FDFBF7]">
                  مكتب الأستاذ محمد عنتر
                </h4>
                <p className="text-[11px] text-[#8C7A5B] uppercase tracking-wider">للمحاماة والاستشارات وتأسيس الشركات</p>
              </div>
            </div>
            <p className="text-[#AAA] text-xs leading-relaxed font-serif">
              خبرة عريقة في الدفاع والترافع أمام محكمة النقض، محاكم أمن الدولة العليا، مجلس الدولة، القضاء المدني، وتأسيس الشركات وصياغة العقود باحترافية وتأصيل قانوني دقيق.
            </p>
          </div>

          {/* Col 2: Practice Areas Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#FDFBF7] pb-2 border-b border-[#333]">
              الدوائر والتخصصات القضائية
            </h4>
            <ul className="space-y-2">
              {PRACTICE_AREAS.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => onNavigate("practices")}
                    className="hover:text-[#FDFBF7] transition-colors text-right text-xs"
                  >
                    {p.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Smart Tools & Services */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#FDFBF7] pb-2 border-b border-[#333]">
              الخدمات الرقمية للمكتب
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate("consultant")}
                  className="hover:text-[#FDFBF7] transition-colors text-xs"
                >
                  ديوان المستشار القانوني الذكي (AI)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("contracts")}
                  className="hover:text-[#FDFBF7] transition-colors text-xs"
                >
                  منصة صياغة العقود المخصصة
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("evaluator")}
                  className="hover:text-[#FDFBF7] transition-colors text-xs"
                >
                  مقيّم القضايا والمستندات والدفوع
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("tts")}
                  className="hover:text-[#FDFBF7] transition-colors text-xs"
                >
                  القارئ الصوتي القانوني (Gemini TTS)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("booking")}
                  className="hover:text-[#FDFBF7] transition-colors text-xs"
                >
                  حجز موعد استشارة رسمية
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact and Address */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#FDFBF7] pb-2 border-b border-[#333]">
              المقر وبيانات التواصل
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2 text-[#AAA]">
                <MapPin className="w-4 h-4 text-[#8C7A5B] shrink-0 mt-0.5" />
                <span>{LAWYER_PROFILE.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#8C7A5B] shrink-0" />
                <a href={`tel:${LAWYER_PROFILE.phone}`} className="text-[#FDFBF7] hover:text-[#8C7A5B] font-mono">
                  {LAWYER_PROFILE.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8C7A5B] shrink-0" />
                <a href={`mailto:${LAWYER_PROFILE.email}`} className="text-[#AAA] hover:text-[#FDFBF7]">
                  {LAWYER_PROFILE.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-[#AAA]">
                <Clock className="w-4 h-4 text-[#8C7A5B] shrink-0" />
                <span>{LAWYER_PROFILE.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 border-t border-[#333] flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#777]">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} مكتب الأستاذ محمد عنتر للمحاماة والاستشارات القانونية.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#AAA]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8C7A5B]" />
              السرية المهنية محفوظة طبقاً لقانون المحاماة
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
