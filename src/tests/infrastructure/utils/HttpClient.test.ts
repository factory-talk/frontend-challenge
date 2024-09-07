import { HttpClient, APIError } from '@infrastructure/utils/HttpClient';
import { Logger } from '@infrastructure/utils/Logger';

jest.mock('@infrastructure/utils/Logger', () => ({
    Logger: {
      log: jest.fn(),
      logError: jest.fn(),
    }
}));

global.fetch = jest.fn();

describe('HttpClient', () => {
  const baseUrl = 'https://api.example.suchawadee.com';
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient(baseUrl);
    (global.fetch as jest.Mock).mockClear();
    (Logger.log as jest.Mock).mockClear();
    (Logger.logError as jest.Mock).mockClear();
  });

  it('should handle GET request errors and log them (500)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: async () => 'Internal Server Error',
    });

    await expect(httpClient.get('/test')).rejects.toThrow('HTTP error! status: 500, body: Internal Server Error');
    
    expect(Logger.logError).toHaveBeenCalledWith(
      'API error for https://api.example.suchawadee.com/test: HTTP error! status: 500, body: Internal Server Error',
      expect.any(APIError)
    );
  });

  it('should handle GET request errors and log them (400)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      text: async () => 'Bad Request Error',
    });

    await expect(httpClient.get('/test')).rejects.toThrow('HTTP error! status: 400, body: Bad Request Error');

    expect(Logger.logError).toHaveBeenCalledWith(
      'API error for https://api.example.suchawadee.com/test: HTTP error! status: 400, body: Bad Request Error',
      expect.any(APIError)
    );
  });

  it('should handle POST request errors and log them', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: async () => 'Internal Server Error',
    });

    const body = { key: 'value' };
    await expect(httpClient.post('/test', body)).rejects.toThrow('HTTP error! status: 500, body: Internal Server Error');

    expect(Logger.logError).toHaveBeenCalledWith(
      'API error for https://api.example.suchawadee.com/test: HTTP error! status: 500, body: Internal Server Error',
      expect.any(APIError)
    );
  });

  it('should handle DELETE request errors and log them (404)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: async () => 'Not Found',
    });

    await expect(httpClient.delete('/test')).rejects.toThrow('HTTP error! status: 404, body: Not Found');

    expect(Logger.logError).toHaveBeenCalledWith(
      'API error for https://api.example.suchawadee.com/test: HTTP error! status: 404, body: Not Found',
      expect.any(APIError)
    );
  });

  it('should handle DELETE request errors and log them (400)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      text: async () => 'Bad Request Error',
    });

    await expect(httpClient.delete('/test')).rejects.toThrow('HTTP error! status: 400, body: Bad Request Error');

    expect(Logger.logError).toHaveBeenCalledWith(
      'API error for https://api.example.suchawadee.com/test: HTTP error! status: 400, body: Bad Request Error',
      expect.any(APIError)
    );
  });
});
