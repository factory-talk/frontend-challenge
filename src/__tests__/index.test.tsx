import { render, screen } from '@testing-library/react';
import Index from '../../index';

describe('Home', () => {
  it('renders without errors', () => {
    const { container } = render(<Index />);
    expect(container).toBeDefined();
  });
});