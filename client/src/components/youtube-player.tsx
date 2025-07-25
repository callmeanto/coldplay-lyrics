import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  videoId: string;
  onTimeUpdate?: (currentTime: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export default function YouTubePlayer({ 
  videoId, 
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

      // Update time periodically
      const interval = setInterval(() => {
        if (playerRef.current && playerReady) {
          try {
            const currentTime = playerRef.current.getCurrentTime();
            onTimeUpdate?.(Math.floor(currentTime));
          } catch (e) {
            // Player not ready yet
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [apiReady, videoId, playerReady, onTimeUpdate, onPlay, onPause]);

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
        
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Volume2 className="h-4 w-4" />
          <span>Audio de YouTube</span>
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