import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { storage } from '../server/storage.js';
import { translationService } from '../server/services/translation.js';
import { translateRequestSchema } from '../shared/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

// Get translations for a song
app.get("/api/songs/:id/translations", async (req, res) => {
  try {
    const translations = await storage.getTranslationsForSong(req.params.id);
    res.json(translations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch translations" });
  }
});

// Translate a song
app.post("/api/songs/:id/translate", async (req, res) => {
  try {
    const songId = req.params.id;
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

    res.json(translation);
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ message: "Failed to translate song" });
  }
});

// Serve static files from dist/public
app.use(express.static(path.join(__dirname, '../dist/public')));

// Catch all handler for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/public/index.html'));
});

export default app;