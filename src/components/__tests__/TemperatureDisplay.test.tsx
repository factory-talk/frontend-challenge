import { render, screen } from "@testing-library/react";
import TemperatureDisplay from "src/components/TemperatureDisplay";

describe("TemperatureDisplay", () => {
  it("แสดงค่าอุณหภูมิเป็นเซลเซียส (C)", () => {
    render(<TemperatureDisplay temperature={25} unit="C" />);
    expect(screen.getByText("25°C")).toBeInTheDocument();
  });

  it("แสดงค่าอุณหภูมิเป็นฟาเรนไฮต์ (F)", () => {
    render(<TemperatureDisplay temperature={25} unit="F" />);
    expect(screen.getByText("77°F")).toBeInTheDocument();
  });

  it("แสดงค่าอุณหภูมิเป็นเคลวิน (K)", () => {
    render(<TemperatureDisplay temperature={25} unit="K" />);
    expect(screen.getByText("298°K")).toBeInTheDocument();
  });
});
