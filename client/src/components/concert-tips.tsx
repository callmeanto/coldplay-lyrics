import { Lightbulb, Battery, Download, Sun, Heart } from "lucide-react";

export default function ConcertTips() {
  const tips = [
    {
      icon: Download,
      text: "Estudia las letras con anticipación para conocer las canciones"
    },
    {
      icon: Battery,
      text: "Practica cantando en español para el gran día"
    },
    {
      icon: Sun,
      text: "Repite las canciones más populares como 'Viva La Vida'"
    },
    {
      icon: Heart,
      text: "¡Sorprende a tu familia cantando en el concierto!"
    }
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-600">
      <h3 className="text-sm font-medium text-accent-gold mb-3 flex items-center">
        <Lightbulb className="mr-2 h-4 w-4" />
        Consejos para Estudiar
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
