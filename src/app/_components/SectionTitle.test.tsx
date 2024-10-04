import React from 'react';
import { render, screen } from '@testing-library/react';
import SectionTitle from './SectionTitle';

describe('SectionTitle Component', () => {
  it('renders the title correctly', () => {
    const title = 'Test Title';
    render(<SectionTitle title={title} />);
    
    const headingElement = screen.getByText(title);
    expect(headingElement).toBeInTheDocument();
  });
});