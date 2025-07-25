import { useMemo } from "react";
import { type LyricLine } from "@shared/schema";

export function useLyricsSync(lyrics: LyricLine[], currentTime: number) {
  const currentLineIndex = useMemo(() => {
    if (!lyrics.length) return -1;
    
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= lyrics[i].timestamp) {
        return i;
      }
    }
    return -1;
  }, [lyrics, currentTime]);

  const getLineStatus = (index: number, currentIndex: number) => {
    if (index === currentIndex) return 'current';
    if (index === currentIndex + 1) return 'next';
    if (index < currentIndex) return 'past';
    return 'future';
  };

  const getCurrentLine = () => {
    return currentLineIndex >= 0 ? lyrics[currentLineIndex] : null;
  };

  const getNextLine = () => {
    const nextIndex = currentLineIndex + 1;
    return nextIndex < lyrics.length ? lyrics[nextIndex] : null;
  };

  return {
    currentLineIndex,
    getLineStatus,
    getCurrentLine,
    getNextLine,
  };
}
