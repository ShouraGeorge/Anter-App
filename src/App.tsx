import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { PracticeAreas } from "./components/PracticeAreas";
import { SmartLegalConsultant } from "./components/SmartLegalConsultant";
import { ContractDraftingStudio } from "./components/ContractDraftingStudio";
import { CaseEvaluator } from "./components/CaseEvaluator";
import { AudioTTSStudio } from "./components/AudioTTSStudio";
import { BookingSection } from "./components/BookingSection";
import { FirmAboutAndCredentials } from "./components/FirmAboutAndCredentials";
import { Footer } from "./components/Footer";
import { LAWYER_PROFILE } from "./data/legalData";
import { MessageCircle, Phone } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [consultCategory, setConsultCategory] = useState<string | undefined>();
  const [consultPrompt, setConsultPrompt] = useState<string | undefined>();

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const handleConsultField = (fieldName: string, promptText: string) => {
    setConsultCategory(fieldName);
    setConsultPrompt(promptText);
    setActiveTab("consultant");
  };

  const handleBookClick = () => {
    setActiveTab("booking");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1C1C] flex flex-col font-['Cairo',sans-serif] selection:bg-[#8C7A5B] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onBookClick={handleBookClick}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === "home" && (
          <div className="space-y-0">
            <Hero
              onExplorePractices={() => setActiveTab("practices")}
              onOpenConsultant={() => setActiveTab("consultant")}
              onOpenContracts={() => setActiveTab("contracts")}
              onBookClick={handleBookClick}
            />
            <PracticeAreas
              onConsultField={handleConsultField}
              onBookClick={handleBookClick}
            />
            <SmartLegalConsultant
              initialCategory="محكمة النقض والمحكمة الدستورية"
            />
            <ContractDraftingStudio />
            <AudioTTSStudio />
            <FirmAboutAndCredentials
              onBookClick={handleBookClick}
              onOpenConsultant={() => setActiveTab("consultant")}
            />
            <BookingSection />
          </div>
        )}

        {activeTab === "practices" && (
          <PracticeAreas
            onConsultField={handleConsultField}
            onBookClick={handleBookClick}
          />
        )}

        {activeTab === "consultant" && (
          <SmartLegalConsultant
            initialCategory={consultCategory}
            initialPrompt={consultPrompt}
          />
        )}

        {activeTab === "contracts" && <ContractDraftingStudio />}

        {activeTab === "evaluator" && <CaseEvaluator />}

        {activeTab === "tts" && <AudioTTSStudio />}

        {activeTab === "about" && (
          <FirmAboutAndCredentials
            onBookClick={handleBookClick}
            onOpenConsultant={() => setActiveTab("consultant")}
          />
        )}

        {activeTab === "booking" && <BookingSection />}
      </main>

      {/* Floating Action Buttons for quick emergency contact and WhatsApp */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
        {/* WhatsApp direct chat */}
        <a
          id="floating-whatsapp-btn"
          href={`https://wa.me/${LAWYER_PROFILE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
            "السلام عليكم، أود حجز استشارة قانونية عاجلة مع مكتب الأستاذ محمد عنتر للمحاماة."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-[#1C1C1C] border border-[#8C7A5B] hover:bg-[#333] text-[#D4C3A3] hover:text-white shadow-lg flex items-center justify-center transition-all hover:scale-105 group"
          title="تواصل مباشر عبر واتساب"
        >
          <MessageCircle className="w-5 h-5 text-emerald-400" />
          <span className="absolute left-14 bg-[#1C1C1C] text-[#FDFBF7] text-xs px-2.5 py-1 border border-[#D4C3A3] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md font-sans">
            واتساب مكتب الأستاذ محمد عنتر
          </span>
        </a>

        {/* Quick Phone Call */}
        <a
          id="floating-call-btn"
          href={`tel:${LAWYER_PROFILE.phone}`}
          className="w-12 h-12 rounded-full bg-[#8C7A5B] hover:bg-[#786749] text-white shadow-lg flex items-center justify-center transition-all hover:scale-105 group"
          title="اتصال هاتفي مباشر"
        >
          <Phone className="w-5 h-5" />
          <span className="absolute left-14 bg-[#1C1C1C] text-[#FDFBF7] text-xs px-2.5 py-1 border border-[#D4C3A3] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md font-sans">
            اتصال بالخط الساخن
          </span>
        </a>
      </div>

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />
    </div>
  );
}
