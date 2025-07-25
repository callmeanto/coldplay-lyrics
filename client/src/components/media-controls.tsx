import { useEffect, useRef } from "react";
import { SkipBack, SkipForward, Play, Pause, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { type Song } from "@shared/schema";

interface MediaControlsProps {
  song: Song;
  currentTime: number;
  isPlaying: boolean;
  onTimeChange: (time: number) => void;
  onPlayPause: () => void;
}

export default function MediaControls({ 
  song, 
  currentTime, 
  isPlaying, 
  onTimeChange, 
  onPlayPause 
}: MediaControlsProps) {
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        onTimeChange((prev: number) => {
          const newTime = prev + 1;
          return newTime >= (song.duration || 0) ? 0 : newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, song.duration, onTimeChange]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / (song.duration || 1)) * 100;

  const handleProgressChange = (value: number[]) => {
    const newTime = Math.floor((value[0] / 100) * (song.duration || 0));
    onTimeChange(newTime);
  };

  const handleSyncAdjustment = (adjustment: number) => {
    const newTime = Math.max(0, Math.min(song.duration || 0, currentTime + adjustment));
    onTimeChange(newTime);
  };

  const jumpToSection = (direction: 'forward' | 'backward') => {
    const jumpAmount = 10; // seconds
    const newTime = direction === 'forward' 
      ? Math.min(song.duration || 0, currentTime + jumpAmount)
      : Math.max(0, currentTime - jumpAmount);
    onTimeChange(newTime);
  };

  return (
    <div className="bg-surface-dark rounded-xl p-6 border border-gray-700">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-white mb-1">{song.title}</h3>
        <p className="text-sm text-gray-400">{song.artist}</p>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <Slider
          value={[progressPercentage]}
          onValueChange={handleProgressChange}
          max={100}
          step={1}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(song.duration || 0)}</span>
        </div>
      </div>
      
      {/* Control Buttons */}
      <div className="flex items-center justify-center space-x-8">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white transition-colors p-2"
          onClick={() => jumpToSection('backward')}
        >
          <SkipBack className="text-2xl" />
        </Button>
        
        <Button
          className="bg-music-green hover:bg-green-600 text-white rounded-full p-4 transition-colors"
          onClick={onPlayPause}
        >
          {isPlaying ? (
            <Pause className="text-2xl" />
          ) : (
            <Play className="text-2xl" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white transition-colors p-2"
          onClick={() => jumpToSection('forward')}
        >
          <SkipForward className="text-2xl" />
        </Button>
      </div>
      
      {/* Manual Sync Controls */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 text-center mb-3">Sincronización Manual</p>
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="secondary"
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            onClick={() => handleSyncAdjustment(-2)}
          >
            <Minus className="mr-2 h-3 w-3" />
            Atrasar
          </Button>
          <Button
            variant="secondary"
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            onClick={() => handleSyncAdjustment(2)}
          >
            <Plus className="mr-2 h-3 w-3" />
            Adelantar
          </Button>
        </div>
      </div>
    </div>
  );
}
