import { Logger } from '@infrastructure/utils/Logger';

describe('Logger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should log a message with a timestamp', () => {
    Logger.log('Test log message');
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[LOG]: Test log message'));
  });

  it('should log a message with data', () => {
    const data = { key: 'value' };
    Logger.log('Test log message with data', data);
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining(`[LOG]: Test log message with data ${JSON.stringify(data)}`));
  });

  it('should log an API request with parameters', () => {
    const params = { q: 'query' };
    Logger.logAPIRequest('https://api.example.com/test', params);
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining(`[API REQUEST]: https://api.example.com/test with params ${JSON.stringify(params)}`));
  });

  it('should log an API response', () => {
    const response = { data: 'response' };
    Logger.logAPIResponse('https://api.example.com/test', response);
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining(`[API RESPONSE]: https://api.example.com/test responded with ${JSON.stringify(response)}`));
  });

  it('should log an error message with error details', () => {
    const error = new Error('Test error');
    Logger.logError('Test error message', error);
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('[ERROR]: Test error message'), error);
  });
});
