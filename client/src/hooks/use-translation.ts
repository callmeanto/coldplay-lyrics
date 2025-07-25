import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type LyricLine } from "@shared/schema";
import { getOfflineTranslation, saveOfflineTranslation } from "@/lib/offline-storage";

export function useTranslation(songId: string) {
  const [translatedLyrics, setTranslatedLyrics] = useState<LyricLine[] | null>(null);
  const queryClient = useQueryClient();

  // Try to get cached translation first
  const { data: cachedTranslation } = useQuery({
    queryKey: [`/api/songs/${songId}/translations`],
    enabled: !!songId,
  });

  const translateMutation = useMutation({
    mutationFn: async (targetLanguage: string) => {
      // First try offline storage
      const offlineTranslation = getOfflineTranslation(songId, targetLanguage);
      if (offlineTranslation) {
        return { translatedLyrics: offlineTranslation };
      }

      // Then try API
      const response = await apiRequest("POST", `/api/songs/${songId}/translate`, {
        targetLanguage,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setTranslatedLyrics(data.translatedLyrics);
      // Save to offline storage
      saveOfflineTranslation(songId, "es", data.translatedLyrics);
      // Invalidate cache
      queryClient.invalidateQueries({ 
        queryKey: [`/api/songs/${songId}/translations`] 
      });
    },
    onError: (error) => {
      console.error("Translation failed:", error);
      // Try to fall back to offline storage
      const offlineTranslation = getOfflineTranslation(songId, "es");
      if (offlineTranslation) {
        setTranslatedLyrics(offlineTranslation);
      }
    },
  });

  const translateSong = useCallback((targetLanguage: string) => {
    translateMutation.mutate(targetLanguage);
  }, [translateMutation]);

  // Check if we have Spanish translation in cache
  const spanishTranslation = Array.isArray(cachedTranslation) 
    ? cachedTranslation.find((t: any) => t.language === "es")
    : null;

  if (spanishTranslation && !translatedLyrics) {
    setTranslatedLyrics(spanishTranslation.translatedLyrics);
  }

  return {
    translatedLyrics,
    isTranslating: translateMutation.isPending,
    translateSong,
    error: translateMutation.error,
  };
}
