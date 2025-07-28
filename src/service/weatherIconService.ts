export enum WeatherCondition {
  CLEAR_SKY = 'clearSky',
  FEW_CLOUDS = 'fewClouds',
  SCATTERED_CLOUDS = 'scatteredClouds',
  BROKEN_CLOUDS = 'brokenClouds',
  SHOWER_RAIN = 'showerRain',
  RAIN = 'rain',
  THUNDERSTORM = 'thunderstorm',
  SNOW = 'snow',
  MIST = 'mist'
}
export enum WeatherIconCode {
  CLEAR_SKY_DAY = '01d',
  CLEAR_SKY_NIGHT = '01n',
  FEW_CLOUDS_DAY = '02d',
  FEW_CLOUDS_NIGHT = '02n',
  SCATTERED_CLOUDS_DAY = '03d',
  SCATTERED_CLOUDS_NIGHT = '03n',
  BROKEN_CLOUDS_DAY = '04d',
  BROKEN_CLOUDS_NIGHT = '04n',
  SHOWER_RAIN_DAY = '09d',
  SHOWER_RAIN_NIGHT = '09n',
  RAIN_DAY = '10d',
  RAIN_NIGHT = '10n',
  THUNDERSTORM_DAY = '11d',
  THUNDERSTORM_NIGHT = '11n',
  SNOW_DAY = '13d',
  SNOW_NIGHT = '13n',
  MIST_DAY = '50d',
  MIST_NIGHT = '50n'
}
export interface WeatherIcon {
  id: string;
  description: string;
  isDayIcon: boolean;
  url: string;
  condition: WeatherCondition;
}
export interface WeatherIconInfo {
  dayIcon: string;
  nightIcon: string;
  description: string;
  condition: WeatherCondition;
}
export class WeatherIconService {
  private static readonly BASE_URL = 'https://openweathermap.org/img/wn';
  private static readonly ICON_SIZE = '@2x.png';
  private static readonly ICON_MAP: Record<string, WeatherIconInfo> = {
    '01': { dayIcon: '01d', nightIcon: '01n', description: 'clear sky', condition: WeatherCondition.CLEAR_SKY },
    '02': { dayIcon: '02d', nightIcon: '02n', description: 'few clouds', condition: WeatherCondition.FEW_CLOUDS },
    '03': { dayIcon: '03d', nightIcon: '03n', description: 'scattered clouds', condition: WeatherCondition.SCATTERED_CLOUDS },
    '04': { dayIcon: '04d', nightIcon: '04n', description: 'broken clouds', condition: WeatherCondition.BROKEN_CLOUDS },
    '09': { dayIcon: '09d', nightIcon: '09n', description: 'shower rain', condition: WeatherCondition.SHOWER_RAIN },
    '10': { dayIcon: '10d', nightIcon: '10n', description: 'rain', condition: WeatherCondition.RAIN },
    '11': { dayIcon: '11d', nightIcon: '11n', description: 'thunderstorm', condition: WeatherCondition.THUNDERSTORM },
    '13': { dayIcon: '13d', nightIcon: '13n', description: 'snow', condition: WeatherCondition.SNOW },
    '50': { dayIcon: '50d', nightIcon: '50n', description: 'mist', condition: WeatherCondition.MIST }
  };
  private static readonly CONDITION_MAP: Record<WeatherCondition, string> = {
    [WeatherCondition.CLEAR_SKY]: '01',
    [WeatherCondition.FEW_CLOUDS]: '02',
    [WeatherCondition.SCATTERED_CLOUDS]: '03',
    [WeatherCondition.BROKEN_CLOUDS]: '04',
    [WeatherCondition.SHOWER_RAIN]: '09',
    [WeatherCondition.RAIN]: '10',
    [WeatherCondition.THUNDERSTORM]: '11',
    [WeatherCondition.SNOW]: '13',
    [WeatherCondition.MIST]: '50'
  };
  static getIconUrl(iconCode: string): string {
    return `${this.BASE_URL}/${iconCode}${this.ICON_SIZE}`;
  }
  static getWeatherIcon(weatherId: string, isDay: boolean = true): WeatherIcon | null {
    const iconInfo = this.ICON_MAP[weatherId];
    if (!iconInfo) {
      console.warn(`Unknown weather ID: ${weatherId}`);
      return null;
    }
    const iconCode = isDay ? iconInfo.dayIcon : iconInfo.nightIcon;
    return {
      id: iconCode,
      description: iconInfo.description,
      isDayIcon: isDay,
      url: this.getIconUrl(iconCode),
      condition: iconInfo.condition
    };
  }
  static getIconByCondition(condition: WeatherCondition | string, isDay: boolean = true): WeatherIcon | null {
    const conditionKey = typeof condition === 'string' ? condition as WeatherCondition : condition;
    const weatherId = this.CONDITION_MAP[conditionKey];
    if (!weatherId) {
      console.warn(`Unknown weather condition: ${condition}`);
      return null;
    }
    return this.getWeatherIcon(weatherId, isDay);
  }
  static getIconByCode(iconCode: string): WeatherIcon | null {
    if (!iconCode || iconCode.length < 3) {
      console.warn(`Invalid icon code: ${iconCode}`);
      return null;
    }
    const weatherId = iconCode.substring(0, 2);
    const isDay = iconCode.endsWith('d');
    return this.getWeatherIcon(weatherId, isDay);
  }
  static preloadIcon(iconCode: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load icon: ${iconCode}`));
      img.src = this.getIconUrl(iconCode);
    });
  }
  static async preloadIcons(iconCodes: string[]): Promise<void> {
    try {
      await Promise.all(iconCodes.map(code => this.preloadIcon(code)));
      console.log(`Successfully preloaded ${iconCodes.length} weather icons`);
    } catch (error) {
      console.error('Failed to preload some weather icons:', error);
    }
  }
  static getAllConditions(): WeatherCondition[] {
    return Object.values(WeatherCondition);
  }
  static getAllIconCodes(): WeatherIconCode[] {
    return Object.values(WeatherIconCode);
  }
  static getConditionByCode(iconCode: string): WeatherCondition | null {
    const icon = this.getIconByCode(iconCode);
    return icon?.condition || null;
  }
  static getAllIcons(): WeatherIconInfo[] {
    return Object.values(this.ICON_MAP);
  }
  static getDescription(iconCode: string): string {
    const icon = this.getIconByCode(iconCode);
    return icon?.description || 'Unknown weather condition';
  }
  static isDayIcon(iconCode: string): boolean {
    return iconCode.endsWith('d');
  }
  static isNightIcon(iconCode: string): boolean {
    return iconCode.endsWith('n');
  }
  static getOppositeTimeIcon(iconCode: string): string | null {
    if (!iconCode || iconCode.length < 3) {
      return null;
    }
    const weatherId = iconCode.substring(0, 2);
    const isCurrentlyDay = this.isDayIcon(iconCode);
    const iconInfo = this.ICON_MAP[weatherId];
    if (!iconInfo) {
      return null;
    }
    return isCurrentlyDay ? iconInfo.nightIcon : iconInfo.dayIcon;
  }
  static async preloadCommonIcons(): Promise<void> {
    const commonIcons = [
      '01d', '01n',
      '02d', '02n',
      '03d', '03n',
      '04d', '04n',
      '10d', '10n',
    ];
    await this.preloadIcons(commonIcons);
  }
}

