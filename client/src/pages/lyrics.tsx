import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Music, Settings } from "lucide-react";
import SongSelector from "@/components/song-selector";
import MediaControls from "@/components/media-controls";
import LyricsDisplay from "@/components/lyrics-display";
import TextSizeControl from "@/components/text-size-control";
import ConnectionStatus from "@/components/connection-status";
import ConcertTips from "@/components/concert-tips";
import { type Song } from "@shared/schema";

export default function LyricsPage() {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [textSize, setTextSize] = useState(3);
  const [showLanguage, setShowLanguage] = useState<"english" | "spanish">("english");

  const { data: songs = [], isLoading } = useQuery<Song[]>({
    queryKey: ["/api/songs"],
  });

  return (
    <div className="min-h-screen bg-concert-dark text-white">
      {/* Header */}
      <header className="bg-surface-dark border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Music className="text-music-green text-xl" />
            <h1 className="text-lg font-medium">Coldplay para Mamá</h1>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors p-2">
            <Settings className="text-lg" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <SongSelector
          songs={songs}
          selectedSong={selectedSong}
          onSelectSong={setSelectedSong}
          isLoading={isLoading}
        />

        {selectedSong && (
          <>
            <MediaControls
              song={selectedSong}
              currentTime={currentTime}
              isPlaying={isPlaying}
              onTimeChange={setCurrentTime}
              onPlayPause={() => setIsPlaying(!isPlaying)}
            />

            <TextSizeControl
              textSize={textSize}
              onTextSizeChange={setTextSize}
            />

            <LyricsDisplay
              song={selectedSong}
              currentTime={currentTime}
              textSize={textSize}
              language={showLanguage}
              onLanguageChange={setShowLanguage}
            />
          </>
        )}

        <ConnectionStatus />
        <ConcertTips />
      </main>

      {/* Footer Navigation */}
      <div className="h-20"></div>
      <footer className="fixed bottom-0 left-0 right-0 bg-surface-dark border-t border-gray-700">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-around items-center">
            <button className="flex flex-col items-center space-y-1 text-music-green">
              <Music className="text-lg" />
              <span className="text-xs">Letras</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors">
              <Music className="text-lg" />
              <span className="text-xs">Canciones</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors">
              <Settings className="text-lg" />
              <span className="text-xs">Ajustes</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
