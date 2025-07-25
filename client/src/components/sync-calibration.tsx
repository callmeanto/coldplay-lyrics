import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Settings, Target, Clock } from "lucide-react";

interface SyncCalibrationProps {
  onOffsetChange: (offset: number) => void;
  currentOffset: number;
}

export default function SyncCalibration({ onOffsetChange, currentOffset }: SyncCalibrationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [testOffset, setTestOffset] = useState(currentOffset);
  const [calibrationMode, setCalibrationMode] = useState(false);

  const handleApplyOffset = () => {
    onOffsetChange(testOffset);
    setCalibrationMode(false);
  };

  const presetOffsets = [
    { label: "Rápido", value: -0.5, desc: "Letras aparecen antes" },
    { label: "Normal", value: 0, desc: "Sincronización estándar" },
    { label: "Lento", value: 0.5, desc: "Letras aparecen después" },
  ];

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-gray-400 hover:text-white"
      >
        <Settings className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Card className="bg-surface-dark border-gray-700 mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-white flex items-center space-x-2">
          <Target className="h-4 w-4 text-music-green" />
          <span>Calibración de Sincronización</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Preset buttons */}
        <div className="grid grid-cols-3 gap-2">
          {presetOffsets.map((preset) => (
            <Button
              key={preset.label}
              variant={testOffset === preset.value ? "default" : "outline"}
              size="sm"
              onClick={() => setTestOffset(preset.value)}
              className={`text-xs ${
                testOffset === preset.value 
                  ? "bg-music-green text-white" 
                  : "border-gray-600 text-gray-300"
              }`}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Fine-tuning slider */}
        <div className="space-y-2">
          <label className="text-sm text-gray-300 flex items-center space-x-2">
            <Clock className="h-3 w-3" />
            <span>Ajuste fino: {testOffset > 0 ? '+' : ''}{testOffset.toFixed(1)}s</span>
          </label>
          <Slider
            value={[testOffset]}
            onValueChange={(value) => setTestOffset(value[0])}
            min={-2}
            max={2}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Description */}
        <p className="text-xs text-gray-400">
          {testOffset > 0 
            ? "Las letras aparecerán después del audio"
            : testOffset < 0
            ? "Las letras aparecerán antes del audio"
            : "Sincronización perfecta"
          }
        </p>

        {/* Action buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={handleApplyOffset}
            size="sm"
            className="bg-music-green hover:bg-green-600 text-white flex-1"
          >
            Aplicar
          </Button>
          <Button
            onClick={() => {
              setTestOffset(currentOffset);
              setIsOpen(false);
            }}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300"
          >
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}