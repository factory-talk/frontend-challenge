/* eslint-disable max-lines */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { AutocompleteSearchBar } from './AutocompleteSearchBar';
import type { TemperatureUnit } from '@/stores/useTemperatureUnitStore';
import type { ExtendedLocationData } from '@/hooks/api/useGetWeatherDataFromLocationSearch';

const mockExtendedLocationData: ExtendedLocationData[] = [
  {
    location: {
      place_id: "322293974185",
      osm_id: "544174673",
      osm_type: "way",
      lat: "40.44674025",
      lon: "-79.9446837",
      boundingbox: [
        "40.4464078",
        "40.4470515",
        "-79.9449946",
        "-79.944411"
      ],
      class: "amenity",
      type: "studio",
      display_name: "WQED, 4802, Fifth Avenue, Shadyside, Pittsburgh, Allegheny County, Pennsylvania, 15213, USA",
      display_place: "WQED",
      display_address: "4802, Fifth Avenue, Shadyside, Pittsburgh, Allegheny County, Pennsylvania, 15213, USA",
      address: {
        name: "WQED",
        city: "Pittsburgh",
        county: "Allegheny County",
        state: "Pennsylvania",
        postcode: "15213",
        country: "United States of America",
        country_code: "us"
      }
    },
    weather: {
      coord: {
        lon: -79.9447,
        lat: 40.4467
      },
      weather: [
        {
          id: 500,
          main: "Rain",
          description: "light rain",
          icon: "10d"
        }
      ],
      base: "stations",
      main: {
        temp: 68.09,
        feels_like: 68.92,
        temp_min: 66.4,
        temp_max: 69.96,
        pressure: 1017,
        humidity: 92,
        sea_level: 1017,
        grnd_level: 983
      },
      visibility: 10000,
      wind: {
        speed: 1.01,
        deg: 76,
        gust: 3
      },
      clouds: {
        all: 100
      },
      dt: 1727362338,
      sys: {
        type: 2,
        id: 2034219,
        country: "US",
        sunrise: 1727349098,
        sunset: 1727392210
      },
      timezone: -14400,
      id: 5180905,
      name: "Bloomfield",
      cod: 200
    }
  },
  {
    location: {
      place_id: "320084047072",
      osm_id: "357337732",
      osm_type: "node",
      lat: "41.0173684",
      lon: "-75.9105845",
      boundingbox: [
        "41.0173184",
        "41.0174184",
        "-75.9106345",
        "-75.9105345"
      ],
      class: "man_made",
      type: "tower",
      display_name: "WQEQ-FM (Freeland), Harding Street, Pardeesville, Luzerne County, Pennsylvania, 18224, USA",
      display_place: "WQEQ-FM (Freeland)",
      display_address: "Harding Street, Pardeesville, Luzerne County, Pennsylvania, 18224, USA",
      address: {
        name: "WQEQ-FM (Freeland)",
        city: "Pardeesville",
        county: "Luzerne County",
        state: "Pennsylvania",
        postcode: "18224",
        country: "United States of America",
        country_code: "us"
      }
    },
    weather: {
      coord: {
        lon: -75.9106,
        lat: 41.0174
      },
      weather: [
        {
          id: 501,
          main: "Rain",
          description: "moderate rain",
          icon: "10d"
        }
      ],
      base: "stations",
      main: {
        temp: 61.57,
        feels_like: 61.84,
        temp_min: 59.99,
        temp_max: 63.18,
        pressure: 1018,
        humidity: 94,
        sea_level: 1018,
        grnd_level: 950
      },
      visibility: 8047,
      wind: {
        speed: 0,
        deg: 0
      },
      clouds: {
        all: 100
      },
      dt: 1727362338,
      sys: {
        type: 2,
        id: 2007622,
        country: "US",
        sunrise: 1727348133,
        sunset: 1727391239
      },
      timezone: -14400,
      id: 5190469,
      name: "Freeland",
      cod: 200
    }
  },
];

const mockUnit: TemperatureUnit = {
  unit: 'kelvin',
  type: 'standard',
  label: 'Kelvin',
  symbol: 'K',
};

const mockOnSearchClickAdd = jest.fn();

const setup = (existingLocations = []) => {
  const setSearch = jest.fn();
  render(
    <AutocompleteSearchBar
      existingLocations={existingLocations}
      extendedLocationData={mockExtendedLocationData}
      search=''
      setSearch={setSearch}
      unit={mockUnit}
      onSearchClickAdd={mockOnSearchClickAdd}
    />
  );
};

describe('AutocompleteSearchBar', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders input field', () => {
    setup();
    const input = screen.getByPlaceholderText(/Enter location.../i);
    expect(input).toBeInTheDocument();
  });

  test('shows popover with location data on input focus', () => {
    setup();
    const input = screen.getByPlaceholderText(/Enter location.../i);
    fireEvent.focus(input);
    expect(screen.getByText(/WQED/i)).toBeInTheDocument(); // Check for WQED in the popover
  });

  test('adds location when selected', () => {
    setup();
    const input = screen.getByPlaceholderText(/Enter location.../i);
    fireEvent.focus(input);

    const firstLocation = screen.getByText(/WQED/i); // Adjust based on mock data
    fireEvent.click(firstLocation);

    expect(mockOnSearchClickAdd).toHaveBeenCalledWith(mockExtendedLocationData[0]);
    expect(mockOnSearchClickAdd).toHaveBeenCalledTimes(1);
  });

  // test('shows notification if location is already added', async () => {
  //   setup([{ id: '1', display_place: 'WQED' }] as never); // Adjust the existing location accordingly
  //   const input = screen.getByPlaceholderText(/Enter location.../i);
  //   fireEvent.focus(input);

  //   const firstLocation = screen.getByText(/WQED/i); // Adjust based on mock data
  //   fireEvent.click(firstLocation);

  //   expect(screen.getByText(/Location already added!/i)).toBeInTheDocument();

  //   // Wait for notification to disappear
  //   await waitFor(() => {
  //     expect(screen.queryByText(/Location already added!/i)).not.toBeInTheDocument();
  //   });
  // });

  // test('shows message when no location found', () => {
  //   setup([]); // Call setup with an empty array for existing locations
  //   const input = screen.getByPlaceholderText(/Enter location.../i);
  //   fireEvent.focus(input);
  //   expect(screen.getByText(/No location found/i)).toBeInTheDocument();
  // });
});
