import { Logger } from './Logger';

export class APIError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse(response: Response): Promise<any> {
    if (!response.ok) {
      const errorBody = await response.text();
      throw new APIError(response.status, `HTTP error! status: ${response.status}, body: ${errorBody}`);
    }
    return await response.json();
  }

  private handleFetchError(error: unknown, url: string): never {
    if (error instanceof APIError) {
      Logger.logError(`API error for ${url}: ${error.message}`, error);
      throw error;
    } else if (error instanceof Error) {
      Logger.logError(`Failed to fetch from ${url}: ${error.message}`, error);
      throw new APIError(500, `An unexpected error occurred: ${error.message}`);
    } else {
      Logger.logError(`Failed to fetch from ${url}: An unknown error occurred`, error);
      throw new APIError(500, 'An unknown error occurred');
    }
  }

  async get(endpoint: string, params: any = {}): Promise<any> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    const searchParams = new URLSearchParams(params);
    url.search = searchParams.toString();

    Logger.log(`Making GET request to: ${url.toString()}`);

    try {
      const response = await fetch(url.toString());
      return await this.handleResponse(response);
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
      return await this.handleResponse(response);
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
      return await this.handleResponse(response);
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
      return await this.handleResponse(response);
    } catch (error) {
      this.handleFetchError(error, url);
    }
  }
}