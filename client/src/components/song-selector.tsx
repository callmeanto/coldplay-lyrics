import { useState } from "react";
import { Search, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type Song } from "@shared/schema";

interface SongSelectorProps {
  songs: Song[];
  selectedSong: Song | null;
  onSelectSong: (song: Song) => void;
  isLoading: boolean;
}

export default function SongSelector({ songs, selectedSong, onSelectSong, isLoading }: SongSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.album?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="bg-surface-dark rounded-xl p-4 border border-gray-700">
        <h2 className="text-sm font-medium text-gray-300 mb-3">Seleccionar Canción</h2>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-800 rounded-lg p-3 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-dark rounded-xl p-4 border border-gray-700">
      <h2 className="text-sm font-medium text-gray-300 mb-3">Seleccionar Canción</h2>
      
      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Buscar canciones de Coldplay..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-music-green text-lg pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      </div>

      <div className="space-y-2">
        {filteredSongs.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            No se encontraron canciones
          </div>
        ) : (
          filteredSongs.map(song => (
            <Button
              key={song.id}
              variant="ghost"
              className={`w-full text-left bg-gray-800 hover:bg-gray-700 rounded-lg p-3 transition-colors border ${
                selectedSong?.id === song.id 
                  ? 'border-music-green bg-gray-700' 
                  : 'border-transparent hover:border-music-green'
              }`}
              onClick={() => onSelectSong(song)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{song.title}</div>
                  <div className="text-sm text-gray-400">
                    {formatDuration(song.duration || 0)} • {song.year}
                  </div>
                </div>
                <Play className="text-music-green h-4 w-4" />
              </div>
            </Button>
          ))
        )}
      </div>
    </div>
  );
}
