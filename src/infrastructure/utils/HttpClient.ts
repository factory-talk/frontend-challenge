import { Logger } from './Logger';

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get(endpoint: string, params: any = {}): Promise<any> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    const searchParams = new URLSearchParams(params);
    url.search = searchParams.toString();

    Logger.log(`Making GET request to: ${url.toString()}`);
    
    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      this.handleFetchError(error, url.toString());
    }
  }

  async post(endpoint: string, body: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    Logger.log(`Making POST request to: ${url} with body: ${JSON.stringify(body)}`);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      this.handleFetchError(error, url);
    }
  }

  async put(endpoint: string, body: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    Logger.log(`Making PUT request to: ${url} with body: ${JSON.stringify(body)}`);
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      this.handleFetchError(error, url);
    }
  }

  async delete(endpoint: string): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;

    Logger.log(`Making DELETE request to: ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      this.handleFetchError(error, url);
    }
  }

  private handleFetchError(error: unknown, url: string): never {
    if (error instanceof Error) {
      Logger.logError(`Failed to fetch from ${url}: ${error.message}`, error);
      throw error;
    } else {
      Logger.logError(`Failed to fetch from ${url}: An unknown error occurred`, error);
      throw new Error('An unknown error occurred');
    }
  }
}
