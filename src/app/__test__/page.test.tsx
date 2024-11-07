import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Home from "src/app/page";
import { useRouter } from "next/navigation";
import  TemperatureDisplay  from "src/components/TemperatureDisplay";
import  TemperatureUnitSelector  from "src/components/TemperatureUnitSelector";
import { FaTrash } from "react-icons/fa";

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock global.fetch สำหรับการใช้งานหลัก
global.fetch = jest.fn().mockImplementation((url) => {
  if (url.includes("openweathermap.org/data/2.5/weather")) {
    return Promise.resolve({
      ok: true,
      json: async () => ({
        name: "Bangkok",
        main: { temp: 30, temp_min: 28, temp_max: 32 },
        weather: [{ description: "clear sky", icon: "01d" }],
        timezone: 25200, // GMT+7
        wind: { speed: 3 },
        pressure: 1012,
        humidity: 65,
      }),
    });
  }
  if (url.includes("openweathermap.org/data/2.5/forecast")) {
    return Promise.resolve({
      ok: true,
      json: async () => ({
        list: Array(8).fill({
          dt: Date.now() / 1000,
          main: { temp: 30 },
          weather: [{ icon: "01d" }],
          pop: 0.2,
        }),
      }),
    });
  }
  return Promise.reject(new Error("Unknown API endpoint"));
});

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("แสดงเมืองปัจจุบัน อุณหภูมิ และเวลา", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Bangkok")).toBeInTheDocument();
      expect(screen.getByText(/30/)).toBeInTheDocument();
    });

    const weatherIcon = screen.getByAltText("Weather Icon");
    expect(weatherIcon).toBeInTheDocument();
    expect(weatherIcon).toHaveAttribute("src", expect.stringContaining("01d"));
    expect(screen.getByText(/AM|PM/)).toBeInTheDocument();
  });



  it("สามารถเปลี่ยนหน่วยอุณหภูมิได้", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/30/)).toBeInTheDocument();
    });

    const celsiusButton = screen.getByText("Celsius (°C)");
    const fahrenheitButton = screen.getByText("Fahrenheit (°F)");

    fireEvent.click(fahrenheitButton);

    await waitFor(() => {
      expect(screen.getByText(/86/)).toBeInTheDocument(); // แสดงค่าเป็นฟาเรนไฮต์
    });

    fireEvent.click(celsiusButton);

    await waitFor(() => {
      expect(screen.getByText(/30/)).toBeInTheDocument(); // กลับไปแสดงเป็นเซลเซียส
    });
  });



  it("สามารถลบเมืองจาก favorite ได้", async () => {
    localStorage.setItem("favoriteCities", JSON.stringify(["Bangkok"]));
    render(<Home />);

    const deleteButton = screen.getByText("❌");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText("Bangkok")).not.toBeInTheDocument();
    });
  });

  it("สามารถลบเมืองทั้งหมดจาก favorite ได้", async () => {
    localStorage.setItem("favoriteCities", JSON.stringify(["Bangkok", "Tokyo"]));
    render(<Home />);

    const deleteAllButton = screen.getByText("Delete all");
    fireEvent.click(deleteAllButton);

    await waitFor(() => {
      expect(screen.queryByText("Bangkok")).not.toBeInTheDocument();
      expect(screen.queryByText("Tokyo")).not.toBeInTheDocument();
    });
  });
});
