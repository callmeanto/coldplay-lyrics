import { type LyricLine } from "@shared/schema";

const STORAGE_KEY = "coldplay-translations";

interface OfflineTranslation {
  songId: string;
  language: string;
  lyrics: LyricLine[];
  timestamp: number;
}

interface OfflineStorage {
  translations: OfflineTranslation[];
  lastUpdated: number;
}

function getStorageData(): OfflineStorage {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { translations: [], lastUpdated: Date.now() };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to parse offline storage:", error);
    return { translations: [], lastUpdated: Date.now() };
  }
}

function saveStorageData(data: OfflineStorage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save to offline storage:", error);
  }
}

export function saveOfflineTranslation(
  songId: string,
  language: string,
  lyrics: LyricLine[]
): void {
  const storage = getStorageData();
  
  // Remove existing translation for this song/language
  storage.translations = storage.translations.filter(
    t => !(t.songId === songId && t.language === language)
  );
  
  // Add new translation
  storage.translations.push({
    songId,
    language,
    lyrics,
    timestamp: Date.now(),
  });
  
  storage.lastUpdated = Date.now();
  saveStorageData(storage);
}

export function getOfflineTranslation(
  songId: string,
  language: string
): LyricLine[] | null {
  const storage = getStorageData();
  const translation = storage.translations.find(
    t => t.songId === songId && t.language === language
  );
  
  return translation ? translation.lyrics : null;
}

export function getAllOfflineTranslations(): OfflineTranslation[] {
  const storage = getStorageData();
  return storage.translations;
}

export function clearOfflineStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getOfflineStorageStats(): {
  totalTranslations: number;
  totalSongs: number;
  lastUpdated: Date | null;
} {
  const storage = getStorageData();
  const uniqueSongs = new Set(storage.translations.map(t => t.songId));
  
  return {
    totalTranslations: storage.translations.length,
    totalSongs: uniqueSongs.size,
    lastUpdated: storage.lastUpdated ? new Date(storage.lastUpdated) : null,
  };
}
