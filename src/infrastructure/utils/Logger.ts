import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export class Logger {
  private static getBangkokTimestamp(): string {
    const timeZone = 'Asia/Bangkok';
    const zonedTime = toZonedTime(new Date(), timeZone);
    return `[${format(zonedTime, 'yyyy-MM-dd HH:mm:ss')}]`;
  }

  static log(message: string, data?: any) {
    const timestamp = this.getBangkokTimestamp();
    if (data) {
      console.log(`${timestamp} [LOG]: ${message} ${JSON.stringify(data)}`);
    } else {
      console.log(`${timestamp} [LOG]: ${message}`);
    }
  }

  static logAPIRequest(url: string, params: any) {
    console.log(`${this.getBangkokTimestamp()} [API REQUEST]: ${url} with params ${JSON.stringify(params)}`);
  }

  static logAPIResponse(url: string, response: any) {
    console.log(`${this.getBangkokTimestamp()} [API RESPONSE]: ${url} responded with ${JSON.stringify(response)}`);
  }

  static logError(message: string, error: any) {
    console.error(`${this.getBangkokTimestamp()} [ERROR]: ${message}`, error);
  }
}
