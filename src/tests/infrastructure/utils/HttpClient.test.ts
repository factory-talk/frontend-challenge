import { HttpClient } from '@infrastructure/utils/HttpClient';
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

  it('should make a GET request and log it', async () => {
    const mockResponse = { data: 'test data' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const response = await httpClient.get('/test', { q: 'query' });
    
    expect(fetch).toHaveBeenCalledWith('https://api.example.suchawadee.com/test?q=query');
    expect(Logger.log).toHaveBeenCalledWith('Making GET request to: https://api.example.suchawadee.com/test?q=query');
    expect(response).toEqual(mockResponse);
  });

  it('should handle GET request errors and log them', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(httpClient.get('/test')).rejects.toThrow('HTTP error! status: 500');
    expect(Logger.logError).toHaveBeenCalledWith('Failed to fetch from https://api.example.suchawadee.com/test: HTTP error! status: 500', expect.any(Error));
  });

  it('should make a POST request and log it', async () => {
    const mockResponse = { data: 'posted' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const body = { key: 'value' };
    const response = await httpClient.post('/test', body);

    expect(fetch).toHaveBeenCalledWith('https://api.example.suchawadee.com/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    expect(Logger.log).toHaveBeenCalledWith('Making POST request to: https://api.example.suchawadee.com/test with body: {"key":"value"}');
    expect(response).toEqual(mockResponse);
  });

  it('should handle POST request errors and log them', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const body = { key: 'value' };
    await expect(httpClient.post('/test', body)).rejects.toThrow('HTTP error! status: 500');
    expect(Logger.logError).toHaveBeenCalledWith('Failed to fetch from https://api.example.suchawadee.com/test: HTTP error! status: 500', expect.any(Error));
  });

  it('should make a PUT request and log it', async () => {
    const mockResponse = { data: 'updated' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const body = { key: 'value' };
    const response = await httpClient.put('/test', body);

    expect(fetch).toHaveBeenCalledWith('https://api.example.suchawadee.com/test', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    expect(Logger.log).toHaveBeenCalledWith('Making PUT request to: https://api.example.suchawadee.com/test with body: {"key":"value"}');
    expect(response).toEqual(mockResponse);
  });

  it('should handle DELETE request and log it', async () => {
    const mockResponse = { success: true };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const response = await httpClient.delete('/test');

    expect(fetch).toHaveBeenCalledWith('https://api.example.suchawadee.com/test', { method: 'DELETE' });
    expect(Logger.log).toHaveBeenCalledWith('Making DELETE request to: https://api.example.suchawadee.com/test');
    expect(response).toEqual(mockResponse);
  });

  it('should handle DELETE request errors and log them', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(httpClient.delete('/test')).rejects.toThrow('HTTP error! status: 404');
    expect(Logger.logError).toHaveBeenCalledWith('Failed to fetch from https://api.example.suchawadee.com/test: HTTP error! status: 404', expect.any(Error));
  });
});
