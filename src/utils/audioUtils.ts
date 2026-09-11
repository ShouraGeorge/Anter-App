// Audio utility for requesting TTS from /api/tts and managing Web Audio / HTML5 audio playback

export async function requestTTS(text: string, voiceName: string = "Kore"): Promise<string> {
  const response = await fetch("/api/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      voiceName,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || "تعذر تحويل النص إلى صوت");
  }

  const data = await response.json();
  return data.audioUrl;
}

export class LegalAudioPlayer {
  private static currentAudio: HTMLAudioElement | null = null;
  private static onEndCallback: (() => void) | null = null;

  public static play(audioUrl: string, onEnd?: () => void): HTMLAudioElement {
    this.stop();

    const audio = new Audio(audioUrl);
    this.currentAudio = audio;
    this.onEndCallback = onEnd || null;

    audio.onended = () => {
      if (this.onEndCallback) {
        this.onEndCallback();
      }
      this.currentAudio = null;
    };

    audio.onerror = (e) => {
      console.error("Audio playback error:", e);
      if (this.onEndCallback) {
        this.onEndCallback();
      }
      this.currentAudio = null;
    };

    audio.play().catch((err) => {
      console.warn("Audio play prevented:", err);
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    });

    return audio;
  }

  public static stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (this.onEndCallback) {
      this.onEndCallback();
      this.onEndCallback = null;
    }
  }

  public static isPlaying(): boolean {
    return !!this.currentAudio && !this.currentAudio.paused;
  }
}
