import React, { useState } from "react";
import { Scale, Phone, Calendar, Volume2, Shield, Menu, X, BookOpen, Clock } from "lucide-react";
import { LAWYER_PROFILE } from "../data/legalData";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBookClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onBookClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "الرئيسية", icon: Scale },
    { id: "practices", label: "الدوائر القضائية", icon: Shield },
    { id: "consultant", label: "المستشار الذكي (AI)", icon: BookOpen },
    { id: "contracts", label: "صياغة العقود", icon: Scale },
    { id: "evaluator", label: "تقييم القضايا", icon: Shield },
    { id: "tts", label: "القارئ الصوتي (TTS)", icon: Volume2 },
    { id: "about", label: "عن المكتب", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#D4C3A3] text-[#1C1C1C] shadow-sm">
      {/* Top Editorial Banner */}
      <div className="border-b border-[#D4C3A3] text-xs py-2 px-4 sm:px-8 bg-[#F8F5EE] text-[#4A4A4A]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-xs tracking-wider text-[#8C7A5B] font-semibold uppercase">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8C7A5B]"></span>
            <span>القاهرة — محكمة النقض • أمن الدولة العليا • مجلس الدولة • القضاء المدني والتجاري</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a
              href={`tel:${LAWYER_PROFILE.phone}`}
              className="flex items-center gap-1.5 text-[#1C1C1C] hover:text-[#8C7A5B] font-bold transition-colors font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-[#8C7A5B]" />
              <span>الخط المباشر: {LAWYER_PROFILE.phone}</span>
            </a>
            <span className="hidden sm:inline text-[#D4C3A3]">|</span>
            <span className="hidden sm:inline text-[#666]">{LAWYER_PROFILE.workingHours}</span>
          </div>
        </div>
      </div>

      {/* Main Editorial Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <div
            id="brand-logo"
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-4 cursor-pointer group"
          >
            <div className="w-11 h-11 border border-[#8C7A5B] bg-[#1C1C1C] text-white flex items-center justify-center transition-all group-hover:bg-[#8C7A5B]">
              <Scale className="w-6 h-6 text-[#FDFBF7]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#8C7A5B]">
                المحاماة والاستشارات القانونية
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif tracking-tight font-bold text-[#1C1C1C] leading-none mt-0.5">
                محمد عنتر
              </h1>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-6 text-xs tracking-widest font-semibold uppercase">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`pb-1 transition-all flex items-center gap-1.5 relative ${
                    isActive
                      ? "text-[#1C1C1C] font-bold border-b-2 border-[#1C1C1C]"
                      : "text-[#666] hover:text-[#8C7A5B]"
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              id="header-book-btn"
              onClick={onBookClick}
              className="bg-[#1C1C1C] hover:bg-[#333333] text-white px-6 py-2.5 text-xs font-bold tracking-widest uppercase transition-all shadow-sm flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5 text-[#D4C3A3]" />
              <span>حجز استشارة</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex xl:hidden">
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-[#D4C3A3] text-[#1C1C1C] hover:bg-[#F8F5EE]"
              aria-label="قائمة التنقل"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#F8F5EE] border-b border-[#D4C3A3] px-6 pt-3 pb-6 space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-xs tracking-wider uppercase font-semibold text-right flex items-center justify-between border-b border-[#E5D9C3] ${
                  isActive
                    ? "bg-[#1C1C1C] text-white"
                    : "text-[#1C1C1C] hover:bg-[#FDFBF7]"
                }`}
              >
                <span>{item.label}</span>
                <Icon className={`w-4 h-4 ${isActive ? "text-[#D4C3A3]" : "text-[#8C7A5B]"}`} />
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => {
                onBookClick();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 bg-[#1C1C1C] hover:bg-[#333] text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#D4C3A3]" />
              <span>حجز موعد استشارة مع الأستاذ محمد عنتر</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
