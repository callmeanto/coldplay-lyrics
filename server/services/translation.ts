import { type LyricLine } from "@shared/schema";

export interface TranslationService {
  translateLyrics(lyrics: LyricLine[], targetLanguage: string): Promise<LyricLine[]>;
  translateText(text: string, targetLanguage: string): Promise<string>;
}

export class GoogleTranslationService implements TranslationService {
  private apiKey: string;
  private endpoint = "https://translation.googleapis.com/language/translate/v2";

  constructor() {
    this.apiKey = process.env.GOOGLE_TRANSLATE_API_KEY || process.env.GOOGLE_API_KEY || "";
    if (!this.apiKey) {
      console.warn("Google Translate API key not found. Translation features will be limited.");
    }
  }

  async translateLyrics(lyrics: LyricLine[], targetLanguage: string): Promise<LyricLine[]> {
    if (!this.apiKey) {
      throw new Error("Google Translate API key not configured");
    }

    try {
      const texts = lyrics.map(line => line.text);
      const translatedTexts = await this.batchTranslate(texts, targetLanguage);
      
      return lyrics.map((line, index) => ({
        ...line,
        text: translatedTexts[index] || line.text,
      }));
    } catch (error) {
      console.error("Translation failed:", error);
      throw new Error("Failed to translate lyrics");
    }
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error("Google Translate API key not configured");
    }

    try {
      const response = await fetch(`${this.endpoint}?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          source: "en",
          format: "text",
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error("Translation failed:", error);
      throw new Error("Failed to translate text");
    }
  }

  private async batchTranslate(texts: string[], targetLanguage: string): Promise<string[]> {
    const response = await fetch(`${this.endpoint}?key=${this.apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: texts,
        target: targetLanguage,
        source: "en",
        format: "text",
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data.translations.map((t: any) => t.translatedText);
  }
}

export const translationService = new GoogleTranslationService();
