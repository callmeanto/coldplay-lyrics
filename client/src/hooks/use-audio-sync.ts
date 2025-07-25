import { useState, useEffect, useRef } from 'react';

interface AudioSyncOptions {
  onBeatDetected?: (intensity: number) => void;
  onTimeUpdate?: (time: number) => void;
  sensitivity?: number;
}

export function useAudioSync(options: AudioSyncOptions = {}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [beatIntensity, setBeatIntensity] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const { onBeatDetected, onTimeUpdate, sensitivity = 0.7 } = options;

  // Initialize audio analysis
  const startAudioAnalysis = async (audioElement?: HTMLAudioElement) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Create analyser for frequency analysis
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      
      analyserRef.current = analyser;
      
      const bufferLength = analyser.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      // If audio element is provided, connect it
      if (audioElement) {
        const source = audioContext.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
      }

      setIsAnalyzing(true);
      analyzeAudio();
    } catch (error) {
      console.log('Audio analysis not available:', error);
    }
  };

  // Analyze audio data for beat detection and sync
  const analyzeAudio = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    
    analyser.getByteFrequencyData(dataArray);

    // Calculate average audio level
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    setAudioLevel(average / 255);

    // Simple beat detection using bass frequencies (0-60Hz roughly)
    const bassEnd = Math.floor(dataArray.length * 0.1);
    const bassSum = dataArray.slice(0, bassEnd).reduce((sum, value) => sum + value, 0);
    const bassAverage = bassSum / bassEnd;
    
    // Detect beats based on sudden increases in bass
    const currentBeat = bassAverage / 255;
    setBeatIntensity(currentBeat);
    
    if (currentBeat > sensitivity && onBeatDetected) {
      onBeatDetected(currentBeat);
    }

    // Continue analysis
    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  };

  // Stop audio analysis
  const stopAudioAnalysis = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setIsAnalyzing(false);
    setAudioLevel(0);
    setBeatIntensity(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudioAnalysis();
    };
  }, []);

  return {
    isAnalyzing,
    audioLevel,
    beatIntensity,
    startAudioAnalysis,
    stopAudioAnalysis,
  };
}