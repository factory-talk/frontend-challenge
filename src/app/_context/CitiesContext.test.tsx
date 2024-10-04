import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { CitiesContextProvider, useSelectedCities } from './CitiesContext';

const TestComponent = () => {
  const { selectedCities, addCity, removeCity, getCityById } = useSelectedCities();

  return (
    <div>
      <button onClick={() => addCity({ id: '1', name: 'City1' })}>Add City1</button>
      <button onClick={() => removeCity({ id: '1', name: 'City1' })}>Remove City1</button>
      <div data-testid="cities">{JSON.stringify(selectedCities)}</div>
      <div data-testid="cityById">{JSON.stringify(getCityById('1'))}</div>
    </div>
  );
};

describe('CitiesContext', () => {

	afterEach(() => {
		localStorage.clear();
    jest.clearAllMocks();
	});

  it('should add a city', () => {
    render(
      <CitiesContextProvider>
        <TestComponent />
      </CitiesContextProvider>
    );

    act(() => {
      screen.getByText('Add City1').click();
    });

    expect(screen.getByTestId('cities')).toHaveTextContent('[{"id":"1","name":"City1"}]');
  });

  it('should remove a city', () => {
    render(
      <CitiesContextProvider>
        <TestComponent />
      </CitiesContextProvider>
    );

    act(() => {
      screen.getByText('Add City1').click();
    });

    act(() => {
      screen.getByText('Remove City1').click();
    });

    expect(screen.getByTestId('cities')).toHaveTextContent('[]');
  });

  it('should get a city by id', () => {
    render(
      <CitiesContextProvider>
        <TestComponent />
      </CitiesContextProvider>
    );

    act(() => {
      screen.getByText('Add City1').click();
    });

    expect(screen.getByTestId('cityById')).toHaveTextContent('{"id":"1","name":"City1"}');
  });

  it('should return undefined for a non-existent city id', () => {
    render(
      <CitiesContextProvider>
        <TestComponent />
      </CitiesContextProvider>
    );

    expect(screen.getByTestId('cityById')).toBeEmptyDOMElement();
  });
});