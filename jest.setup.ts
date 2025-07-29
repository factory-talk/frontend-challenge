import '@testing-library/jest-dom';
import React from 'react';

// Mock Next.js Image component globally
jest.mock('next/image', () => {
  return function MockImage(props: any) {
    // Use React.createElement to create img element
    return React.createElement('img', {
      src: props.src,
      alt: props.alt,
      width: props.width,
      height: props.height,
      loading: props.priority ? 'eager' : 'lazy',
      role: 'img',
      ...props
    });
  };
});

// Mock environment variables for tests
if (!process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
  process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY = 'test_api_key';
}
