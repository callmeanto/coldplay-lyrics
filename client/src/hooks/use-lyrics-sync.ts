import { useMemo } from "react";
import { type LyricLine } from "@shared/schema";

export function useLyricsSync(lyrics: LyricLine[], currentTime: number) {
  const currentLineIndex = useMemo(() => {
    if (!lyrics.length) return -1;
    
    // Use precise timing with buffer for better sync
    const timeWithBuffer = currentTime + 0.2; // 200ms look-ahead
    
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (timeWithBuffer >= lyrics[i].timestamp) {
        return i;
      }
    }
    return -1;
  }, [lyrics, currentTime]);

  // Calculate progress within current line for smooth transitions
  const currentLineProgress = useMemo(() => {
    if (currentLineIndex === -1 || !lyrics[currentLineIndex]) return 0;
    
    const currentLine = lyrics[currentLineIndex];
    const nextLine = lyrics[currentLineIndex + 1];
    
    if (!nextLine) return 1;
    
    const lineDuration = nextLine.timestamp - currentLine.timestamp;
    const elapsed = currentTime - currentLine.timestamp;
    
    return Math.max(0, Math.min(1, elapsed / lineDuration));
  }, [lyrics, currentTime, currentLineIndex]);

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
    currentLineProgress,
    getLineStatus,
    getCurrentLine,
    getNextLine,
  };
}
