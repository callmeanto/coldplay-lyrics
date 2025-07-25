import { Type } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface TextSizeControlProps {
  textSize: number;
  onTextSizeChange: (size: number) => void;
}

export default function TextSizeControl({ textSize, onTextSizeChange }: TextSizeControlProps) {
  const sizes = ["Pequeño", "Mediano", "Grande", "Muy Grande"];

  const handleSizeChange = (value: number[]) => {
    onTextSizeChange(value[0]);
  };

  return (
    <div className="bg-surface-dark rounded-xl p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-300">Tamaño de Texto</span>
        <span className="text-xs text-gray-400">{sizes[textSize - 1]}</span>
      </div>
      <div className="flex items-center space-x-4">
        <Type className="text-gray-400 text-sm h-4 w-4" />
        <Slider
          value={[textSize]}
          onValueChange={handleSizeChange}
          min={1}
          max={4}
          step={1}
          className="flex-1"
        />
        <Type className="text-gray-400 text-lg h-5 w-5" />
      </div>
    </div>
  );
}
