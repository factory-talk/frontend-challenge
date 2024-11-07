import '@testing-library/jest-dom';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

Object.defineProperty(global.navigator, 'geolocation', {
    writable: true,
    value: {
      getCurrentPosition: jest.fn().mockImplementation((success, error) =>
        success({
          coords: {
            latitude: 13.7563, // กำหนด latitude ที่ต้องการ mock
            longitude: 100.5018, // กำหนด longitude ที่ต้องการ mock
          },
        })
      ),
      watchPosition: jest.fn(),
    },
  });


(useRouter as jest.Mock).mockReturnValue({
  push: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
});