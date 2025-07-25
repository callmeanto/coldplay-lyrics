import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MemStorage } from '../../../server/storage.js';
import { GoogleTranslationService } from '../../../server/services/translation.js';
import { translateRequestSchema } from '../../../shared/schema.js';

const storage = new MemStorage();
const translationService = new GoogleTranslationService();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  const songId = id as string;

  if (req.method === 'GET') {
    try {
      const translations = await storage.getTranslationsForSong(songId);
      return res.json(translations);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch translations" });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = translateRequestSchema.parse({ ...req.body, songId });
      
      // Check if translation already exists
      const existingTranslation = await storage.getTranslation(songId, body.targetLanguage);
      if (existingTranslation) {
        return res.json(existingTranslation);
      }

      // Get the original song
      const song = await storage.getSong(songId);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }

      // Translate the lyrics
      const translatedLyrics = await translationService.translateLyrics(
        song.lyrics, 
        body.targetLanguage
      );

      // Save the translation
      const translation = await storage.createTranslation({
        songId,
        language: body.targetLanguage,
        translatedLyrics
      });

      return res.json(translation);
    } catch (error) {
      console.error("Translation error:", error);
      return res.status(500).json({ message: "Failed to translate song" });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}