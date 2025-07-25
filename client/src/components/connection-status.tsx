import { useState, useEffect } from "react";
import { Download, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineSongs, setOfflineSongs] = useState(15);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleDownloadMore = () => {
    toast({
      title: "Descarga iniciada",
      description: "Las traducciones se están descargando para uso offline",
    });
  };

  return (
    <div className="bg-surface-dark rounded-xl p-4 border border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
          <span className="text-sm text-gray-300">
            {isOnline ? "Modo Online" : "Modo Offline Listo"}
          </span>
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-gray-500" />
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-music-green hover:text-green-400"
          onClick={handleDownloadMore}
        >
          <Download className="mr-1 h-3 w-3" />
          Descargar Más
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {offlineSongs} canciones disponibles sin conexión
      </p>
    </div>
  );
}
