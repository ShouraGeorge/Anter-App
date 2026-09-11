import express from "express";
import path from "path";
import { GoogleGenAI, Modality } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Convert 24kHz 16-bit mono PCM into standard playable WAV format
function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);

  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // 1 = PCM
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);

  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

// In-memory bookings storage
interface BookingRecord {
  id: string;
  clientName: string;
  phone: string;
  email?: string;
  caseType: string;
  consultationType: "office" | "phone" | "urgent_video";
  preferredDate: string;
  preferredTime: string;
  notes: string;
  createdAt: string;
  status: "pending" | "confirmed" | "completed";
}

const bookingsStore: BookingRecord[] = [
  {
    id: "ANTAR-2026-881",
    clientName: "م. أحمد عبد الرحمن",
    phone: "01001234567",
    email: "ahmed.abdelrahman@example.com",
    caseType: "تأسيس شركة مساهمة مصرية وعقود شراكة",
    consultationType: "office",
    preferredDate: "2026-08-22",
    preferredTime: "05:00 م",
    notes: "طلب استشارة لتأسيس شركة استيراد وتصدير مع مستثمرين أجانب وصياغة ميثاق المساهمين.",
    createdAt: new Date().toISOString(),
    status: "confirmed",
  },
  {
    id: "ANTAR-2026-882",
    clientName: "د. طارق محمود الشناوي",
    phone: "01129876543",
    caseType: "طعن بالنقض في حكم تجاري استئنافي",
    consultationType: "urgent_video",
    preferredDate: "2026-08-20",
    preferredTime: "07:30 م",
    notes: "ميعاد إيداع أسباب الطعن بالنقض ينتهي خلال 15 يوماً، مطلوب دراسة صحيفة الطعن والقصور في التسبيب.",
    createdAt: new Date().toISOString(),
    status: "pending",
  }
];

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    office: "مكتب الأستاذ محمد عنتر للمحاماة والاستشارات القانونية",
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// 1. Text-To-Speech (TTS) Endpoint using gemini-3.1-flash-tts-preview
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voiceName = "Kore" } = req.body;
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "النص المطلوب تحويله إلى صوت غير صالح" });
    }

    const ai = getGeminiClient();
    
    // Clean text for speech prompt: concise, clean, removing complex Markdown headers
    const sanitizedText = text
      .replace(/[*#_`>]/g, "")
      .replace(/\n+/g, " ")
      .slice(0, 1500); // Limit to reasonable speaking chunk

    const promptText = `اقرأ النص القانوني التالي بنبرة رصينة، واضحة، فصيحة، وموثوقة بصوت محامٍ ومستشار قانوني محترف:\n${sanitizedText}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: promptText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceName || "Kore", // Options: Kore, Zephyr, Puck, Charon, Fenrir
            },
          },
        },
      },
    });

    const base64Pcm = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Pcm) {
      return res.status(500).json({ error: "لم يتم استلام بيانات صوتية من النموذج" });
    }

    const pcmBuffer = Buffer.from(base64Pcm, "base64");
    const wavBuffer = pcmToWav(pcmBuffer, 24000, 1, 16);
    const base64Wav = wavBuffer.toString("base64");

    res.json({
      audioUrl: `data:audio/wav;base64,${base64Wav}`,
      mimeType: "audio/wav",
      sampleRate: 24000,
    });
  } catch (error: any) {
    console.error("Error in TTS endpoint:", error);
    res.status(500).json({
      error: "فشل في تحويل النص إلى صوت",
      details: error?.message || "حدث خطأ أثناء معالجة الطلب",
    });
  }
});

// 2. Legal Consultation AI Endpoint
app.post("/api/legal/consult", async (req, res) => {
  try {
    const { question, category, contextDetails } = req.body;
    if (!question) {
      return res.status(400).json({ error: "يرجى كتابة السؤال أو الاستشارة القانونية المطلوبة" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `أنت المساعد القانوني والذكي لمكتب الأستاذ محمد عنتر للمحاماة والاستشارات القانونية، وهو من كبار ممارسي القانون والمحامين المقيدين أمام محكمة النقض والدستورية ومحاكم أمن الدولة العليا ومجلس الدولة والقضاء الإداري والمدني والمتخصصين في تأسيس الشركات وصياغة العقود.
مهمتك: تقديم استشارة قانونية تأصيلية دقيقة ومهنية وفقاً للقانون المصري والأنظمة العربية المقارنة ذات الصلة.
التخصصات الرئيسية للمكتب:
1. محكمة النقض (طعون النقض الجنائية والمدنية، أحكام النقض الحديثة، بطلان الأحكام، القصور في التسبيب والفساد في الاستدلال، مواعيد الطعن 60 يوماً).
2. محاكم أمن الدولة العليا طوارئ ومحاكم الجنايات (الدفوع الجوهرية، إجراءات القبض والتفتيش وبطلانها، التماس إعادة النظر، استئناف الجنايات).
3. مجلس الدولة والقضاء الإداري (المحكمة الإدارية العليا، محكمة القضاء الإداري، دعاوى الإلغاء، التعويض عن القرارات الإدارية، شق مستعجل ووقف التنفيذ).
4. القضاء المدني والتجاري والملكية العقارية (النزاعات العقارية، دعاوى صحة ونفاذ، الفسخ والتعويض، قضايا الشيكات، الإفلاس والمنازعات المصرفية).
5. تأسيس الشركات والكيانات التجارية (قانون الشركات 159 لسنة 1981، قانون الاستثمار 72 لسنة 2017، الشركات ذات المسؤولية المحدودة LLC، شركات المساهمة، شركات الشخص الواحد، تعديلات السجل التجاري).
6. صياغة وتدقيق العقود والاتفاقيات الدولية والمحلية (عقود التوريد، المقاولات، الشراكات التجارية، الامتياز التجاري Franchise، اتفاقيات عدم الإفشاء NDA، بنود التحكيم وقوة الشروط الجزائية).

هيكل الإجابة المطلوب:
1. الخلاصة والرأي القانوني المباشر.
2. التأصيل القانوني والمواد القانونية المنطبقة.
3. مبادئ وأحكام محكمة النقض أو الإدارية العليا ذات الصلة.
4. الدفوع والإجراءات العملية الموصى باتخاذها والمواعيد الحتمية.
5. نصيحة مكتب الأستاذ محمد عنتر لحماية الموقف القانوني.

قدم الإجابة بلغة قانونية رصينة وواضحة ومنسقة بنقاط وعناوين بارزة.`;

    const prompt = `التصنيف القضائي: ${category || "عام"}
${contextDetails ? `تفاصيل وظروف النزاع: ${contextDetails}\n` : ""}
الاستفسار القانوني للموكل:
${question}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    const reply = response.text || "عذراً، لم نتمكن من صياغة الرأي القانوني حالياً. يرجى المحاولة لاحقاً.";

    res.json({
      reply,
      category,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error in Legal Consult:", error);
    res.status(500).json({
      error: "فشل في توليد الاستشارة القانونية",
      details: error?.message || "حدث خطأ غير متوقع",
    });
  }
});

// 3. Contract Generator & Drafter Endpoint
app.post("/api/legal/draft-contract", async (req, res) => {
  try {
    const {
      contractType,
      partyFirst,
      partySecond,
      subject,
      financialTerms,
      duration,
      specialClauses,
      jurisdiction,
    } = req.body;

    const ai = getGeminiClient();

    const systemInstruction = `أنت خبير صياغة العقود والاتفاقيات بمكتب الأستاذ محمد عنتر للمحاماة والاستشارات القانونية.
مهمتك: صياغة عقد قانوني محكم، متكامل الأركان، غير قابل للثغرات، متوافق مع أحكام القانون المدني والتجاري المصري والأنظمة العربية المعمول بها.
يجب أن يحتوي العقد على:
- التسمية الدقيقة للعقد وتاريخ ومكان التحرير.
- ديباجة / تمهيد وافٍ يعتبر جزءاً لا يتجزأ من العقد.
- البنود التفصيلية (الأهلية والصفة، موضوع العقد، القيمة المالية وآلية السداد، الالتزامات المتبادلة، الشروط الجزائية والتعويض الاتفاقي، السرية وحماية الحقوق، القوة القاهرة، الفسخ والإنهاء، الاختصاص القضائي أو بند التحكيم، عدد النسخ والتوقيعات).
- الصياغة بلغة قانونية فصحى دقيقة ومحكمة بدون غموض.`;

    const prompt = `قم بصياغة عقد احترافي بالبيانات التالية:
نوع العقد: ${contractType || "عقد اتفاق وشراكة"}
الطرف الأول: ${partyFirst || "الطرف الأول المذكور بالبيانات"}
الطرف الثاني: ${partySecond || "الطرف الثاني المذكور بالبيانات"}
موضوع العقد والغرض منه: ${subject || "اتفاق تجاري وقانوني ملزم"}
الشروط المالية والبدل المالي: ${financialTerms || "حسب المتفق عليه والدفعات المحددة"}
المدة الزمنية وسريان العقد: ${duration || "سنة قابلة للتجديد"}
شروط وبنود إضافية خاصة مطلوبة: ${specialClauses || "بند سرية المعلومات وشرط جزائي ملزم"}
المحكمة المختصة أو هيئة التحكيم: ${jurisdiction || "محاكم القاهرة المختصة بحسب الاختصاص النوعي والقيمي"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    res.json({
      contractText: response.text,
      contractType,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error in draft-contract endpoint:", error);
    res.status(500).json({
      error: "فشل في صياغة العقد",
      details: error?.message || "حدث خطأ غير متوقع",
    });
  }
});

// 4. Case Evaluation & Document Risk Analysis Endpoint
app.post("/api/legal/analyze-case", async (req, res) => {
  try {
    const { caseFacts, courtType, claims } = req.body;
    if (!caseFacts) {
      return res.status(400).json({ error: "يرجى تزويدنا بوقائع القضية أو نص المستند للتحليل" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `أنت رئيس قسم الدراسات والأبحاث القانونية بمكتب الأستاذ محمد عنتر للمحاماة (محامٍ بالنقض والدستورية ومحاكم أمن الدولة العليا ومجلس الدولة).
مهمتك: إجراء فحص جنائي أو مدني أو إداري متعمق لوقائع القضية ومستنداتها وتقديم تقرير تقييم قانوني شامل يشتمل على:
1. ملخص الوقائع ومكامن النزاع الجوهرية.
2. الثغرات ونقاط الضعف والمخاطر المحتملة (Risk Matrix).
3. أقوى الدفوع الشكلية والإجرائية والدفوع الموضوعية المتاحة.
4. تقييم فرص النجاح ونسبة الترجيح القانوني أمام المحكمة المختصة.
5. خطة العمل الإجرائية والوثائق الإلزامية المطلوب تجهيزها.`;

    const prompt = `الجهة القضائية المستهدفة: ${courtType || "محكمة النقض / القضاء المختص"}
الطلبات أو الدعوى: ${claims || "دراسة قانونية وتقييم للموقف"}
وقائع النزاع والمستندات:
${caseFacts}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    res.json({
      analysis: response.text,
      courtType,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error in analyze-case endpoint:", error);
    res.status(500).json({
      error: "فشل في تحليل الموقف القانوني",
      details: error?.message || "حدث خطأ غير متوقع",
    });
  }
});

// 5. Booking API Endpoints
app.get("/api/bookings", (_req, res) => {
  res.json({ bookings: bookingsStore });
});

app.post("/api/bookings", (req, res) => {
  try {
    const { clientName, phone, email, caseType, consultationType, preferredDate, preferredTime, notes } = req.body;
    if (!clientName || !phone || !caseType) {
      return res.status(400).json({ error: "يرجى استكمال البيانات الإلزامية: الاسم، رقم الهاتف، ونوع القضية" });
    }

    const newBooking: BookingRecord = {
      id: `ANTAR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      clientName,
      phone,
      email,
      caseType,
      consultationType: consultationType || "office",
      preferredDate: preferredDate || new Date().toISOString().split("T")[0],
      preferredTime: preferredTime || "06:00 م",
      notes: notes || "",
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    bookingsStore.unshift(newBooking);

    res.json({
      success: true,
      booking: newBooking,
      message: "تم تسجيل طلب حجز الاستشارة بنجاح. سيتواصل معكم فريق السكرتارية التنفيذية لتأكيد الموعد.",
    });
  } catch (error: any) {
    res.status(500).json({ error: "فشل في حفظ الحجز", details: error?.message });
  }
});

// Vite middleware for dev / static for prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`⚖️ Law Firm Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
