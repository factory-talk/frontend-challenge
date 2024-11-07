import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Details from "src/app/details/[city]/page";
import { useRouter, useParams } from "next/navigation";

// Mock useRouter และ useParams
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock global.fetch
global.fetch = jest.fn().mockImplementation((url) => {
    if (url.includes("openweathermap.org/data/2.5/weather")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          name: "Bangkok",
          main: { temp: 30, temp_min: 28, temp_max: 32 },
          weather: [{ description: "clear sky", icon: "01d" }],
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
    if (url.includes("mapbox.com/geocoding/v5/mapbox.places")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          features: [
            {
              properties: { short_code: "TH" },
              place_name: "Thailand",
            },
          ],
        }),
      });
    }
    return Promise.reject(new Error("Unknown API endpoint"));
  });

describe("Details Page", () => {
  const mockPush = jest.fn();
  const mockBack = jest.fn();

  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ city: "Bangkok" });
    (useRouter as jest.Mock).mockReturnValue({ back: mockBack, push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });



  it("แสดงข้อมูลพยากรณ์ทุก 3 ชั่วโมง", async () => {
    render(<Details />);
  
    await waitFor(() => {
      // ค้นหาองค์ประกอบพยากรณ์ด้วย data-testid
      const forecastItems = screen.getAllByTestId("forecast-item");
      expect(forecastItems.length).toBeGreaterThanOrEqual(8); // ตรวจสอบว่ามีข้อมูลพยากรณ์อย่างน้อย 8 รายการ
    });
  });



  
  it("แสดงปุ่ม back และทำงานเมื่อถูกคลิก", async () => {
    render(<Details />);

    await waitFor(() => {
      const backButton = screen.getByText("← Back");
      fireEvent.click(backButton);
      expect(mockBack).toHaveBeenCalled();
    });
  });
});
