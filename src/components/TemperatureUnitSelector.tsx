import React from "react";

interface TemperatureUnitSelectorProps {
  selectedUnit: "C" | "F" | "K";
  onUnitChange: (unit: "C" | "F" | "K") => void;
}

export default function TemperatureUnitSelector({ selectedUnit, onUnitChange }: TemperatureUnitSelectorProps) {
  return (
    <div className="flex space-x-4 mb-4">
      <button onClick={() => onUnitChange("C")} className={`p-2 ${selectedUnit === "C" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
        Celsius (°C)
      </button>
      <button onClick={() => onUnitChange("F")} className={`p-2 ${selectedUnit === "F" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
        Fahrenheit (°F)
      </button>
      <button onClick={() => onUnitChange("K")} className={`p-2 ${selectedUnit === "K" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
        Kelvin (K)
      </button>
    </div>
  );
}