import React, { useState } from "react";
import { Calendar, Clock, Phone, User, FileText, CheckCircle2, Shield, MapPin, Building, Send, PhoneCall } from "lucide-react";
import { LAWYER_PROFILE, PRACTICE_AREAS } from "../data/legalData";
import { BookingData } from "../types";

export const BookingSection: React.FC = () => {
  const [formData, setFormData] = useState<BookingData>({
    clientName: "",
    phone: "",
    email: "",
    caseType: "محكمة النقض والمحكمة الدستورية",
    consultationType: "office",
    preferredDate: "",
    preferredTime: "06:00 م",
    notes: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.phone.trim()) {
      setErrorMessage("يرجى إدخال الاسم الكريم ورقم الهاتف للتواصل");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("فشل في تأكيد الحجز");
      }

      const data = await response.json();
      setConfirmedBooking(data.booking);
      setIsLoading(false);
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
      setErrorMessage(err.message || "حدث خطأ أثناء حفظ طلب الحجز. يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <section id="booking-section" className="py-16 bg-[#FDFBF7] text-[#1C1C1C] border-b border-[#D4C3A3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs tracking-[0.25em] uppercase font-bold text-[#8C7A5B] block">
            المواعيد والتوكيل القضائي الرسمي
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1C1C]">
            حجز استشارة قانونية ودراسة ملف القضية
          </h2>
          <p className="text-xs sm:text-sm text-[#555]">
            حدد موعداً مباشراً مع الأستاذ محمد عنتر (حضورياً بمقر المكتب في القاهرة أو استشارة عاجلة عن بعد) لدراسة المستندات والطعون القضائية.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Booking Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {confirmedBooking ? (
              <div className="p-8 bg-white border border-[#8C7A5B] shadow-sm space-y-6 text-center animate-fade-in">
                <div className="w-14 h-14 border border-[#8C7A5B] bg-[#FDFBF7] flex items-center justify-center text-[#8C7A5B] mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-[#1C1C1C]">
                    تم تسجيل طلب الاستشارة بنجاح
                  </h3>
                  <p className="text-xs sm:text-sm text-[#555]">
                    الرقم المرجعي للحجز: <strong className="text-[#1C1C1C] font-mono text-sm px-2 py-0.5 bg-[#FDFBF7] border border-[#D4C3A3]">{confirmedBooking.id}</strong>
                  </p>
                </div>

                <div className="p-5 bg-[#FDFBF7] border border-[#D4C3A3] text-right text-xs sm:text-sm space-y-3">
                  <div className="flex justify-between border-b border-[#E5D9C3] pb-2">
                    <span className="text-[#666]">اسم الموكل:</span>
                    <span className="font-bold text-[#1C1C1C]">{confirmedBooking.clientName}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E5D9C3] pb-2">
                    <span className="text-[#666]">رقم الهاتف:</span>
                    <span className="font-mono text-[#8C7A5B] font-bold">{confirmedBooking.phone}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E5D9C3] pb-2">
                    <span className="text-[#666]">التخصص / نوع القضية:</span>
                    <span className="text-[#1C1C1C]">{confirmedBooking.caseType}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E5D9C3] pb-2">
                    <span className="text-[#666]">نوع الاستشارة:</span>
                    <span className="text-[#8C7A5B] font-semibold">
                      {confirmedBooking.consultationType === "office"
                        ? "حضورية بمقر المكتب بالقاهرة"
                        : confirmedBooking.consultationType === "urgent_video"
                        ? "استشارة مرئية عاجلة (Video Call)"
                        : "استشارة هاتفية مباشرة"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666]">الموعد المقترح:</span>
                    <span className="text-[#1C1C1C]">{confirmedBooking.preferredDate || "أقرب موعد متاح"} ({confirmedBooking.preferredTime})</span>
                  </div>
                </div>

                <p className="text-xs text-[#666] leading-relaxed">
                  سيقوم المستشار الإداري بالتواصل معكم هاتفياً لتأكيد التفاصيل وتجهيز حافظة المستندات المطلوبة.
                </p>

                <button
                  id="book-another-btn"
                  onClick={() => setConfirmedBooking(null)}
                  className="px-6 py-2.5 bg-[#1C1C1C] hover:bg-[#333] text-white font-bold text-xs uppercase tracking-wider transition-all"
                >
                  حجز موعد أو استشارة أخرى
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmitBooking}
                className="p-8 bg-white border border-[#D4C3A3] shadow-sm space-y-5"
              >
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#1C1C1C] flex items-center gap-2 pb-3 border-b border-[#D4C3A3]">
                  <Calendar className="w-4 h-4 text-[#8C7A5B]" />
                  <span>بيانات حجز الاستشارة</span>
                </h3>

                {errorMessage && (
                  <div className="p-3 bg-[#F8F5EE] border border-rose-400 text-rose-700 text-xs">
                    {errorMessage}
                  </div>
                )}

                {/* Consultation Type Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#666]">نوع الاستشارة المطلوبة:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: "office", label: "حضورية بمقر المكتب", desc: "القاهرة - وسط البلد" },
                      { id: "phone", label: "استشارة هاتفية", desc: "اتصال مباشر مع المستشار" },
                      { id: "urgent_video", label: "مرئية عاجلة (Zoom/Meet)", desc: "لدراسة المستندات العاجلة" },
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        id={`consult-type-${type.id}`}
                        onClick={() => setFormData({ ...formData, consultationType: type.id as any })}
                        className={`p-3 border text-right transition-all ${
                          formData.consultationType === type.id
                            ? "bg-[#1C1C1C] text-white border-[#1C1C1C]"
                            : "bg-[#FDFBF7] border-[#D4C3A3] text-[#1C1C1C] hover:border-[#8C7A5B]"
                        }`}
                      >
                        <div className="text-xs font-bold">{type.label}</div>
                        <div className={`text-[10px] mt-0.5 ${formData.consultationType === type.id ? "text-[#D4C3A3]" : "text-[#666]"}`}>
                          {type.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Client Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#666] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#8C7A5B]" />
                      <span>الاسم الكامل الكريم:</span>
                    </label>
                    <input
                      id="booking-name-input"
                      type="text"
                      required
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      placeholder="مثال: أ. محمد أحمد الشناوي"
                      className="w-full p-2.5 bg-[#FDFBF7] border border-[#D4C3A3] text-xs text-[#1C1C1C] focus:border-[#8C7A5B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#666] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#8C7A5B]" />
                      <span>رقم الهاتف (واتساب / اتصال):</span>
                    </label>
                    <input
                      id="booking-phone-input"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="010XXXXXXXX"
                      className="w-full p-2.5 bg-[#FDFBF7] border border-[#D4C3A3] text-xs text-[#1C1C1C] focus:border-[#8C7A5B] font-mono"
                    />
                  </div>
                </div>

                {/* Case Type */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#666]">الفرع القضائي أو نوع القضية:</label>
                  <select
                    id="booking-case-type-select"
                    value={formData.caseType}
                    onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                    className="w-full p-2.5 bg-[#FDFBF7] border border-[#D4C3A3] text-xs text-[#1C1C1C] focus:border-[#8C7A5B]"
                  >
                    {PRACTICE_AREAS.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                    <option value="استشارة تجارية واستثمارية">استشارة تجارية واستثمارية</option>
                    <option value="قضايا أخرى مستعجلة">قضايا أخرى مستعجلة</option>
                  </select>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#666] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#8C7A5B]" />
                      <span>التاريخ المفضل:</span>
                    </label>
                    <input
                      id="booking-date-input"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full p-2.5 bg-[#FDFBF7] border border-[#D4C3A3] text-xs text-[#1C1C1C] focus:border-[#8C7A5B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#666] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#8C7A5B]" />
                      <span>الفترة الزمنية المفضلة:</span>
                    </label>
                    <select
                      id="booking-time-select"
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full p-2.5 bg-[#FDFBF7] border border-[#D4C3A3] text-xs text-[#1C1C1C] focus:border-[#8C7A5B]"
                    >
                      <option value="02:00 م - 04:00 م">فترة الظهيرة (02:00 م - 04:00 م)</option>
                      <option value="05:00 م - 07:00 م">الفترة المسائية الأولى (05:00 م - 07:00 م)</option>
                      <option value="07:30 م - 09:30 م">الفترة المسائية الثانية (07:30 م - 09:30 م)</option>
                    </select>
                  </div>
                </div>

                {/* Notes & Summary */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#666] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#8C7A5B]" />
                    <span>موجز عن النزاع أو المستندات المتاحة:</span>
                  </label>
                  <textarea
                    id="booking-notes-textarea"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="بيان موجز لموضوع القضية، رقم الحكم، أو شروط العقد المطلوب صياغته..."
                    className="w-full p-2.5 bg-[#FDFBF7] border border-[#D4C3A3] text-xs text-[#1C1C1C] focus:border-[#8C7A5B] resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  id="booking-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#1C1C1C] hover:bg-[#333] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 -rotate-90 text-[#D4C3A3]" />
                  <span>{isLoading ? "جاري تسجيل الحجز..." : "تأكيد طلب موعد الاستشارة الرسمية"}</span>
                </button>
              </form>
            )}
          </div>

          {/* Office Info & Hotline Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 bg-white border border-[#D4C3A3] shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[#D4C3A3]">
                <div className="w-12 h-12 border border-[#8C7A5B] bg-[#FDFBF7] flex items-center justify-center text-[#8C7A5B]">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-[#1C1C1C] text-base">
                    مكتب الأستاذ محمد عنتر للمحاماة
                  </h4>
                  <p className="text-xs text-[#8C7A5B] font-semibold">وسط البلد - القاهرة - جمهورية مصر العربية</p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[#333]">
                <div className="flex items-start gap-3 p-3.5 bg-[#FDFBF7] border border-[#D4C3A3]">
                  <MapPin className="w-4 h-4 text-[#8C7A5B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#1C1C1C] block text-xs uppercase font-bold tracking-wider">عنوان المقر الرئيسي:</strong>
                    <span className="text-xs text-[#555]">{LAWYER_PROFILE.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#FDFBF7] border border-[#D4C3A3]">
                  <PhoneCall className="w-4 h-4 text-[#8C7A5B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#1C1C1C] block text-xs uppercase font-bold tracking-wider">الخط الساخن والمباشر:</strong>
                    <a href={`tel:${LAWYER_PROFILE.phone}`} className="text-[#8C7A5B] font-bold hover:underline font-mono text-sm">
                      {LAWYER_PROFILE.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#FDFBF7] border border-[#D4C3A3]">
                  <Clock className="w-4 h-4 text-[#8C7A5B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#1C1C1C] block text-xs uppercase font-bold tracking-wider">مواعيد استقبال الموكلين:</strong>
                    <span className="text-xs text-[#555]">{LAWYER_PROFILE.workingHours}</span>
                  </div>
                </div>
              </div>

              {/* Ethics Pledge */}
              <div className="p-4 bg-[#F8F5EE] border border-[#D4C3A3] text-xs text-[#444] leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-[#1C1C1C] mb-1">
                  <Shield className="w-4 h-4 text-[#8C7A5B]" />
                  <span>ميثاق السرية المهنية وحماية الموكل</span>
                </div>
                كافة البيانات والمستندات المرفقة تحظى بالسرية المهنية المطلقة المنصوص عليها بقانون المحاماة، وتخضع لإشراف ومتابعة المستشار محمد عنتر شخصياً.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
