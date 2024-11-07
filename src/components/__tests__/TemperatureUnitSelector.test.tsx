import { render, screen, fireEvent } from "@testing-library/react";
import TemperatureUnitSelector from "src/components/TemperatureUnitSelector";

describe("TemperatureUnitSelector", () => {
  const mockOnUnitChange = jest.fn();

  beforeEach(() => {
    mockOnUnitChange.mockClear(); // ล้างค่า mock ก่อนการทดสอบแต่ละเคส
  });

  it("แสดงปุ่มสำหรับ Celsius, Fahrenheit และ Kelvin", () => {
    render(<TemperatureUnitSelector selectedUnit="C" onUnitChange={mockOnUnitChange} />);
    expect(screen.getByText("Celsius (°C)")).toBeInTheDocument();
    expect(screen.getByText("Fahrenheit (°F)")).toBeInTheDocument();
    expect(screen.getByText("Kelvin (K)")).toBeInTheDocument();
  });

  it("เรียก onUnitChange เมื่อคลิกที่ปุ่ม Fahrenheit", () => {
    render(<TemperatureUnitSelector selectedUnit="C" onUnitChange={mockOnUnitChange} />);
    fireEvent.click(screen.getByText("Fahrenheit (°F)"));
    expect(mockOnUnitChange).toHaveBeenCalledWith("F");
  });

  it("เรียก onUnitChange เมื่อคลิกที่ปุ่ม Kelvin", () => {
    render(<TemperatureUnitSelector selectedUnit="C" onUnitChange={mockOnUnitChange} />);
    fireEvent.click(screen.getByText("Kelvin (K)"));
    expect(mockOnUnitChange).toHaveBeenCalledWith("K");
  });

  it("เพิ่มคลาสที่ถูกต้องเมื่อเลือก Celsius", () => {
    render(<TemperatureUnitSelector selectedUnit="C" onUnitChange={mockOnUnitChange} />);
    const celsiusButton = screen.getByText("Celsius (°C)");
    expect(celsiusButton).toHaveClass("bg-blue-500 text-white");
  });
});
