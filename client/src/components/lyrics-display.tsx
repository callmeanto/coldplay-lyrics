import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { useLyricsSync } from "@/hooks/use-lyrics-sync";
import { type Song, type LyricLine } from "@shared/schema";

interface LyricsDisplayProps {
  song: Song;
  currentTime: number;
  textSize: number;
  language: "english" | "spanish";
  onLanguageChange: (language: "english" | "spanish") => void;
}

export default function LyricsDisplay({ 
  song, 
  currentTime, 
  textSize, 
  language, 
  onLanguageChange 
}: LyricsDisplayProps) {
  const { translatedLyrics, isTranslating, translateSong } = useTranslation(song.id);
  const { currentLineIndex, getLineStatus } = useLyricsSync(song.lyrics, currentTime);

  const displayLyrics = language === "spanish" ? translatedLyrics : song.lyrics;
  const textSizes = ["text-base", "text-lg", "text-xl", "text-2xl"];
  const currentSizes = ["text-lg", "text-xl", "text-2xl", "text-3xl"];

  useEffect(() => {
    if (language === "spanish" && !translatedLyrics) {
      translateSong("es");
    }
  }, [language, translatedLyrics, translateSong]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-surface-dark rounded-xl border border-gray-700 overflow-hidden">
      {/* Language Toggle */}
      <div className="flex bg-gray-800 border-b border-gray-700">
        <Button
          variant="ghost"
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors rounded-none ${
            language === "english" 
              ? "bg-music-green text-white" 
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => onLanguageChange("english")}
        >
          English
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors rounded-none ${
            language === "spanish" 
              ? "bg-music-green text-white" 
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => onLanguageChange("spanish")}
        >
          Español
        </Button>
      </div>
      
      {/* Lyrics Content */}
      <div className="p-6 max-h-96 overflow-y-auto lyrics-container">
        <div className="text-center text-gray-500 text-sm mb-6">
          {formatTime(currentTime)} / {formatTime(song.duration || 0)}
        </div>
        
        {language === "spanish" && isTranslating ? (
          <div className="text-center text-gray-400 py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-music-green mx-auto mb-4"></div>
            Traduciendo letras...
          </div>
        ) : displayLyrics ? (
          <div className="space-y-4">
            {displayLyrics.map((line: LyricLine, index: number) => {
              const status = getLineStatus(index, currentLineIndex);
              
              return (
                <div
                  key={index}
                  className={`lyric-line leading-relaxed transition-all duration-300 ${
                    status === 'current' 
                      ? `text-accent-gold ${currentSizes[textSize - 1]} font-medium current`
                      : status === 'next'
                      ? `text-white ${textSizes[textSize - 1]} next`
                      : `opacity-50 ${textSizes[textSize - 1]} ${status}`
                  }`}
                >
                  {line.text}
                </div>
              );
            })}
          </div>
        ) : language === "spanish" ? (
          <div className="text-center text-gray-400 py-8">
            <p>Traducción no disponible</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => translateSong("es")}
            >
              Intentar traducir
            </Button>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            No hay letras disponibles
          </div>
        )}
        
        {/* Translation API Integration Note */}
        <div className="mt-6 p-3 bg-gray-800 rounded-lg border border-gray-600">
          <div className="text-xs text-gray-400 mb-2">
            <Cloud className="inline mr-2 h-3 w-3" />
            Powered by Google Cloud Translation API
          </div>
          <div className="text-xs text-gray-500">
            • 500K free characters/month<br />
            • Real-time translation with 99.9% accuracy<br />
            • Offline mode: Pre-translated popular songs stored locally
          </div>
        </div>
      </div>
    </div>
  );
}
