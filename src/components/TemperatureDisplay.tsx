import React from "react";

interface TemperatureDisplayProps {
  temperature: number;
  unit: "C" | "F" | "K";
}

const convertTemperature = (temp: number, unit: "C" | "F" | "K") => {
  if (unit === "C") return Math.round(temp);
  if (unit === "F") return Math.round(temp * 9 / 5 + 32);
  if (unit === "K") return Math.round(temp + 273.15);
  return temp;
};

export default function TemperatureDisplay({ temperature, unit }: TemperatureDisplayProps) {
  return (
    <span>
      {convertTemperature(temperature, unit)}°{unit}
    </span>
  );
}