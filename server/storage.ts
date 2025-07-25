import { type Song, type InsertSong, type Translation, type InsertTranslation, type LyricLine } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Songs
  getSong(id: string): Promise<Song | undefined>;
  getAllSongs(): Promise<Song[]>;
  createSong(song: InsertSong): Promise<Song>;
  searchSongs(query: string): Promise<Song[]>;
  
  // Translations
  getTranslation(songId: string, language: string): Promise<Translation | undefined>;
  createTranslation(translation: InsertTranslation): Promise<Translation>;
  getTranslationsForSong(songId: string): Promise<Translation[]>;
}

export class MemStorage implements IStorage {
  private songs: Map<string, Song>;
  private translations: Map<string, Translation>;

  constructor() {
    this.songs = new Map();
    this.translations = new Map();
    this.initializeDefaultSongs();
  }

  private initializeDefaultSongs() {
    const defaultSongs: InsertSong[] = [
      {
        id: "viva-la-vida",
        title: "Viva La Vida",
        artist: "Coldplay",
        album: "Viva la Vida or Death and All His Friends",
        year: 2008,
        duration: 242,
        youtubeId: "dvgZkm1xWPE",
        lyrics: [
          { timestamp: 0, text: "I used to rule the world", duration: 4 },
          { timestamp: 4, text: "Seas would rise when I gave the word", duration: 4 },
          { timestamp: 8, text: "Now in the morning I sleep alone", duration: 4 },
          { timestamp: 12, text: "Sweep the streets I used to own", duration: 4 },
          { timestamp: 20, text: "I used to roll the dice", duration: 4 },
          { timestamp: 24, text: "Feel the fear in my enemy's eyes", duration: 4 },
          { timestamp: 28, text: "Listen as the crowd would sing", duration: 4 },
          { timestamp: 32, text: "Now the old king is dead! Long live the king!", duration: 4 },
          { timestamp: 40, text: "One minute I held the key", duration: 4 },
          { timestamp: 44, text: "Next the walls were closed on me", duration: 4 },
          { timestamp: 48, text: "And I discovered that my castles stand", duration: 4 },
          { timestamp: 52, text: "Upon pillars of salt and pillars of sand", duration: 4 },
          { timestamp: 60, text: "I hear Jerusalem bells are ringing", duration: 4 },
          { timestamp: 64, text: "Roman cavalry choirs are singing", duration: 4 },
          { timestamp: 68, text: "Be my mirror, my sword and shield", duration: 4 },
          { timestamp: 72, text: "My missionaries in a foreign field", duration: 4 },
          { timestamp: 76, text: "For some reason I can't explain", duration: 4 },
          { timestamp: 80, text: "Once you go there was never, never an honest word", duration: 4 },
          { timestamp: 84, text: "And that was when I ruled the world", duration: 4 },
        ]
      },
      {
        id: "fix-you",
        title: "Fix You",
        artist: "Coldplay",
        album: "X&Y",
        year: 2005,
        duration: 294,
        youtubeId: "k4V3Mo61fJM",
        lyrics: [
          { timestamp: 0, text: "When you try your best, but you don't succeed", duration: 4 },
          { timestamp: 4, text: "When you get what you want, but not what you need", duration: 4 },
          { timestamp: 8, text: "When you feel so tired, but you can't sleep", duration: 4 },
          { timestamp: 12, text: "Stuck in reverse", duration: 4 },
          { timestamp: 20, text: "And the tears come streaming down your face", duration: 4 },
          { timestamp: 24, text: "When you lose something you can't replace", duration: 4 },
          { timestamp: 28, text: "When you love someone, but it goes to waste", duration: 4 },
          { timestamp: 32, text: "Could it be worse?", duration: 4 },
          { timestamp: 40, text: "Lights will guide you home", duration: 4 },
          { timestamp: 44, text: "And ignite your bones", duration: 4 },
          { timestamp: 48, text: "And I will try to fix you", duration: 4 },
        ]
      },
      {
        id: "yellow",
        title: "Yellow",
        artist: "Coldplay",
        album: "Parachutes",
        year: 2000,
        duration: 269,
        youtubeId: "yKNxeF4KMsY",
        lyrics: [
          { timestamp: 0, text: "Look at the stars", duration: 4 },
          { timestamp: 4, text: "Look how they shine for you", duration: 4 },
          { timestamp: 8, text: "And everything you do", duration: 4 },
          { timestamp: 12, text: "Yeah, they were all yellow", duration: 4 },
          { timestamp: 20, text: "I came along", duration: 4 },
          { timestamp: 24, text: "I wrote a song for you", duration: 4 },
          { timestamp: 28, text: "And all the things you do", duration: 4 },
          { timestamp: 32, text: "And it was called Yellow", duration: 4 },
          { timestamp: 40, text: "So then I took my turn", duration: 4 },
          { timestamp: 44, text: "Oh, what a thing to have done", duration: 4 },
          { timestamp: 48, text: "And it was all yellow", duration: 4 },
        ]
      },
      {
        id: "the-scientist",
        title: "The Scientist",
        artist: "Coldplay",
        album: "A Rush of Blood to the Head",
        year: 2002,
        duration: 309,
        youtubeId: "RB-RcX5DS5A",
        lyrics: [
          { timestamp: 0, text: "Come up to meet you, tell you I'm sorry", duration: 4 },
          { timestamp: 4, text: "You don't know how lovely you are", duration: 4 },
          { timestamp: 8, text: "I had to find you, tell you I need you", duration: 4 },
          { timestamp: 12, text: "Tell you I set you apart", duration: 4 },
          { timestamp: 20, text: "Tell me your secrets and ask me your questions", duration: 4 },
          { timestamp: 24, text: "Oh, let's go back to the start", duration: 4 },
          { timestamp: 28, text: "Running in circles, coming up tails", duration: 4 },
          { timestamp: 32, text: "Heads on a science apart", duration: 4 },
          { timestamp: 40, text: "Nobody said it was easy", duration: 4 },
          { timestamp: 44, text: "It's such a shame for us to part", duration: 4 },
          { timestamp: 48, text: "Nobody said it was easy", duration: 4 },
          { timestamp: 52, text: "No one ever said it would be this hard", duration: 4 },
          { timestamp: 56, text: "Oh, take me back to the start", duration: 4 },
        ]
      },
      {
        id: "paradise",
        title: "Paradise",
        artist: "Coldplay",
        album: "Mylo Xyloto",
        year: 2011,
        duration: 278,
        youtubeId: "1G4isv_Fylg",
        lyrics: [
          { timestamp: 0, text: "When she was just a girl", duration: 4 },
          { timestamp: 4, text: "She expected the world", duration: 4 },
          { timestamp: 8, text: "But it flew away from her reach", duration: 4 },
          { timestamp: 12, text: "So she ran away in her sleep", duration: 4 },
          { timestamp: 20, text: "And dreamed of para-para-paradise", duration: 4 },
          { timestamp: 24, text: "Para-para-paradise", duration: 4 },
          { timestamp: 28, text: "Para-para-paradise", duration: 4 },
          { timestamp: 32, text: "Every time she closed her eyes", duration: 4 },
          { timestamp: 40, text: "When she was just a girl", duration: 4 },
          { timestamp: 44, text: "She expected the world", duration: 4 },
          { timestamp: 48, text: "But it flew away from her reach", duration: 4 },
          { timestamp: 52, text: "And the bullets catch in her teeth", duration: 4 },
        ]
      }
    ];

    defaultSongs.forEach(song => {
      this.songs.set(song.id, { 
        ...song, 
        album: song.album || null,
        year: song.year || null,
        duration: song.duration || null,
        youtubeId: song.youtubeId || null,
        translations: {} 
      });
    });
  }

  async getSong(id: string): Promise<Song | undefined> {
    return this.songs.get(id);
  }

  async getAllSongs(): Promise<Song[]> {
    return Array.from(this.songs.values());
  }

  async createSong(song: InsertSong): Promise<Song> {
    const newSong: Song = { 
      ...song, 
      album: song.album || null,
      year: song.year || null,
      duration: song.duration || null,
      translations: {} 
    };
    this.songs.set(song.id, newSong);
    return newSong;
  }

  async searchSongs(query: string): Promise<Song[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.songs.values()).filter(song =>
      song.title.toLowerCase().includes(lowercaseQuery) ||
      song.artist.toLowerCase().includes(lowercaseQuery) ||
      song.album?.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getTranslation(songId: string, language: string): Promise<Translation | undefined> {
    const key = `${songId}-${language}`;
    return this.translations.get(key);
  }

  async createTranslation(translation: InsertTranslation): Promise<Translation> {
    const id = randomUUID();
    const newTranslation: Translation = {
      ...translation,
      id,
      createdAt: new Date(),
    };
    const key = `${translation.songId}-${translation.language}`;
    this.translations.set(key, newTranslation);
    return newTranslation;
  }

  async getTranslationsForSong(songId: string): Promise<Translation[]> {
    return Array.from(this.translations.values()).filter(
      translation => translation.songId === songId
    );
  }
}

export const storage = new MemStorage();
