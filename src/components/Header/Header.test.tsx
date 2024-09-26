import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header Component', () => {
  test('renders the correct fist part of the title', () => {
    render(<Header />);
    const title = screen.getByText(/D²/i);
    expect(title).toBeInTheDocument();
  });
  test('renders the correct second part of the title', () => {
    render(<Header />);
    const title = screen.getByText(/Weather Watch/i);
    expect(title).toBeInTheDocument();
  });
});
