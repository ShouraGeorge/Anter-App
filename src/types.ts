export interface PracticeArea {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  keyCourts: string[];
  mainDefenses: string[];
  procedures: string[];
  badgeColor: string;
}

export interface ConsultationMessage {
  id: string;
  sender: "user" | "consultant";
  text: string;
  category?: string;
  timestamp: string;
  audioUrl?: string;
  isPlaying?: boolean;
  isLoadingAudio?: boolean;
}

export interface ContractTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  defaultDuration: string;
  defaultJurisdiction: string;
  suggestedClauses: string[];
}

export interface BookingData {
  id?: string;
  clientName: string;
  phone: string;
  email: string;
  caseType: string;
  consultationType: "office" | "phone" | "urgent_video";
  preferredDate: string;
  preferredTime: string;
  notes: string;
  createdAt?: string;
  status?: "pending" | "confirmed" | "completed";
}
