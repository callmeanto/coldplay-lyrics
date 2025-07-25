import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudioSync } from "@/hooks/use-audio-sync";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  videoId: string;
  songStartOffset?: number;
  onTimeUpdate?: (currentTime: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export default function YouTubePlayer({ 
  videoId, 
  songStartOffset = 0,
  onTimeUpdate, 
  onPlay, 
  onPause,
  isPlaying,
  onPlayPause 
}: YouTubePlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [apiReady, setApiReady] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  
  // Audio sync for real-time analysis
  const { isAnalyzing, audioLevel, beatIntensity } = useAudioSync({
    onBeatDetected: (intensity) => {
      // Visual feedback for beat detection
      if (intensity > 0.8) {
        document.documentElement.style.setProperty('--beat-intensity', intensity.toString());
      }
    },
    sensitivity: 0.75
  });

  useEffect(() => {
    // Load YouTube API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setApiReady(true);
      };
    } else {
      setApiReady(true);
    }
  }, []);

  useEffect(() => {
    if (apiReady && containerRef.current && !playerRef.current) {
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '200',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            setPlayerReady(true);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              onPlay?.();
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              onPause?.();
            }
          },
        },
      });
    }
  }, [apiReady, videoId, onPlay, onPause]);

  // Separate effect for updating video when videoId changes
  useEffect(() => {
    if (playerRef.current && playerReady && videoId) {
      playerRef.current.loadVideoById(videoId);
    }
  }, [videoId, playerReady]);

  // High-precision time updates for real-time sync
  useEffect(() => {
    if (!playerReady) return;
    
    let animationFrame: number;
    
    const updateTime = () => {
      if (playerRef.current && playerReady) {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          setCurrentVideoTime(currentTime);
          // Use precise timing with millisecond accuracy
          onTimeUpdate?.(currentTime);
          
          // Continue updating at 60fps for smooth sync
          animationFrame = requestAnimationFrame(updateTime);
        } catch (e) {
          // Player not ready yet
        }
      }
    };
    
    // Start the animation loop
    animationFrame = requestAnimationFrame(updateTime);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [playerReady, onTimeUpdate]);

  useEffect(() => {
    if (playerRef.current && playerReady) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying, playerReady]);

  const handlePlayPause = () => {
    if (playerRef.current && playerReady) {
      onPlayPause();
    }
  };

  return (
    <div className="bg-surface-dark rounded-xl p-4 border border-gray-700">
      <div className="mb-4">
        <div 
          ref={containerRef}
          className="w-full rounded-lg overflow-hidden"
          style={{ aspectRatio: '16/9' }}
        />
      </div>
      
      <div className="flex items-center justify-center space-x-4">
        <Button
          className="bg-music-green hover:bg-green-600 text-white rounded-full p-3"
          onClick={handlePlayPause}
          disabled={!playerReady}
        >
          {isPlaying ? (
            <Pause className="text-xl" />
          ) : (
            <Play className="text-xl" />
          )}
        </Button>
        
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4" />
            <span>Audio de YouTube</span>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Audio level visualizer */}
            {playerReady && isPlaying && (
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1 items-end">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-music-green rounded-full transition-all duration-100"
                      style={{
                        height: `${Math.max(2, audioLevel * 16 + Math.random() * 4)}px`
                      }}
                    />
                  ))}
                </div>
                <Radio className="h-3 w-3 text-music-green" />
              </div>
            )}
            
            {/* Sync status */}
            {playerReady && isPlaying && (
              <div className="flex items-center space-x-1">
                {currentVideoTime < songStartOffset ? (
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                    <span className="text-xs">Esperando inicio...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-music-green">
                    <div 
                      className="w-2 h-2 bg-music-green rounded-full transition-all duration-100"
                      style={{
                        opacity: 0.5 + beatIntensity * 0.5,
                        transform: `scale(${1 + beatIntensity * 0.3})`
                      }}
                    />
                    <span className="text-xs">Sincronizado</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {!playerReady && (
        <div className="text-center text-gray-400 text-sm mt-2">
          Cargando reproductor...
        </div>
      )}
    </div>
  );
}