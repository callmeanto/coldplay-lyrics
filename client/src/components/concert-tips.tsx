import { Lightbulb, Battery, Download, Sun, Heart } from "lucide-react";

export default function ConcertTips() {
  const tips = [
    {
      icon: Battery,
      text: "Activa el modo ahorro de batería antes del concierto"
    },
    {
      icon: Download,
      text: "Descarga las traducciones antes de llegar al venue"
    },
    {
      icon: Sun,
      text: "Ajusta el brillo al mínimo para no molestar a otros"
    },
    {
      icon: Heart,
      text: "Esta app sincroniza con la música en vivo - no reproduce audio"
    },
    {
      icon: Heart,
      text: "¡Disfruta este momento especial con tu mamá!"
    }
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-600">
      <h3 className="text-sm font-medium text-accent-gold mb-3 flex items-center">
        <Lightbulb className="mr-2 h-4 w-4" />
        Consejos para el Concierto
      </h3>
      <ul className="space-y-2 text-xs text-gray-300">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start space-x-2">
            <tip.icon className="text-music-green mt-0.5 flex-shrink-0 h-3 w-3" />
            <span>{tip.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
