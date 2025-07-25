import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Battery, Download, Sun, Heart } from "lucide-react";

export default function ConcertTips() {
  const tips = [
    {
      icon: Download,
      text: "Escucha las canciones mientras lees las letras en español"
    },
    {
      icon: Battery,
      text: "Practica cantando junto con el video de YouTube"
    },
    {
      icon: Sun,
      text: "Repite las canciones favoritas como 'Viva La Vida' y 'Fix You'"
    },
    {
      icon: Heart,
      text: "¡Sorprende a tu familia cantando en el concierto!"
    }
  ];

  return (
    <Card className="bg-surface-dark border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="text-music-green h-5 w-5" />
          <h3 className="text-lg font-semibold text-white">Consejos para el concierto</h3>
        </div>
        
        <div className="space-y-3">
          {tips.map((tip, index) => {
            const IconComponent = tip.icon;
            return (
              <div key={index} className="flex items-start space-x-3 text-gray-300">
                <IconComponent className="h-4 w-4 text-accent-gold mt-1 flex-shrink-0" />
                <p className="text-sm leading-relaxed">{tip.text}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}