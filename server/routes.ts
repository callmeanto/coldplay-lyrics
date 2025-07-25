import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { translationService } from "./services/translation";
import { translateRequestSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all songs
  app.get("/api/songs", async (req, res) => {
    try {
      const songs = await storage.getAllSongs();
      res.json(songs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch songs" });
    }
  });

  // Search songs
  app.get("/api/songs/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const songs = await storage.searchSongs(query);
      res.json(songs);
    } catch (error) {
      res.status(500).json({ message: "Failed to search songs" });
    }
  });

  // Get specific song
  app.get("/api/songs/:id", async (req, res) => {
    try {
      const song = await storage.getSong(req.params.id);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }
      res.json(song);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch song" });
    }
  });

  // Translate song lyrics
  app.post("/api/songs/:id/translate", async (req, res) => {
    try {
      const songId = req.params.id;
      const parseResult = translateRequestSchema.safeParse({
        songId,
        ...req.body,
      });

      if (!parseResult.success) {
        return res.status(400).json({ 
          message: "Invalid request data",
          errors: parseResult.error.errors 
        });
      }

      const { targetLanguage } = parseResult.data;

      // Check if translation already exists
      const existingTranslation = await storage.getTranslation(songId, targetLanguage);
      if (existingTranslation) {
        return res.json(existingTranslation);
      }

      // Get the song
      const song = await storage.getSong(songId);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }

      // Translate lyrics
      const translatedLyrics = await translationService.translateLyrics(
        song.lyrics,
        targetLanguage
      );

      // Save translation
      const translation = await storage.createTranslation({
        songId,
        language: targetLanguage,
        translatedLyrics,
      });

      res.json(translation);
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ 
        message: "Failed to translate song",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get translations for a song
  app.get("/api/songs/:id/translations", async (req, res) => {
    try {
      const translations = await storage.getTranslationsForSong(req.params.id);
      res.json(translations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch translations" });
    }
  });

  // Translate arbitrary text
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLanguage = "es" } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      const translatedText = await translationService.translateText(text, targetLanguage);
      res.json({ translatedText });
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ 
        message: "Failed to translate text",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
