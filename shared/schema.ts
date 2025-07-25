import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const songs = pgTable("songs", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  album: text("album"),
  year: integer("year"),
  duration: integer("duration"), // in seconds
  lyrics: jsonb("lyrics").$type<LyricLine[]>().notNull(),
  translations: jsonb("translations").$type<Record<string, LyricLine[]>>().default({}),
});

export const translations = pgTable("translations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  songId: varchar("song_id").notNull().references(() => songs.id),
  language: text("language").notNull(),
  translatedLyrics: jsonb("translated_lyrics").$type<LyricLine[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export interface LyricLine {
  timestamp: number; // in seconds
  text: string;
  duration?: number; // how long this line should be highlighted
}

export const insertSongSchema = createInsertSchema(songs).omit({
  translations: true,
});

export const insertTranslationSchema = createInsertSchema(translations).omit({
  id: true,
  createdAt: true,
});

export const translateRequestSchema = z.object({
  songId: z.string(),
  targetLanguage: z.string().default("es"),
});

export type InsertSong = z.infer<typeof insertSongSchema>;
export type Song = typeof songs.$inferSelect;
export type Translation = typeof translations.$inferSelect;
export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type TranslateRequest = z.infer<typeof translateRequestSchema>;
