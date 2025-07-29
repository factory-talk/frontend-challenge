import { WeatherIconService, WeatherCondition, WeatherIconCode } from '../service/weatherIconService';

describe('WeatherIconService - Enhanced Features', () => {
  test('should get icon by condition name', () => {
    const clearSkyIcon = WeatherIconService.getIconByCondition(WeatherCondition.CLEAR_SKY);
    
    expect(clearSkyIcon).toBeDefined();
    expect(clearSkyIcon?.condition).toBe(WeatherCondition.CLEAR_SKY);
    expect(clearSkyIcon?.id).toBe('01d'); // Default to day icon
  });

  test('should get rain icon by condition', () => {
    const rainIcon = WeatherIconService.getIconByCondition(WeatherCondition.RAIN);
    
    expect(rainIcon).toBeDefined();
    expect(rainIcon?.condition).toBe(WeatherCondition.RAIN);
    expect(rainIcon?.id).toBe('10d'); // Rain day icon
  });

  test('should return all available conditions', () => {
    const conditions = WeatherIconService.getAllConditions();
    
    expect(conditions).toContain(WeatherCondition.CLEAR_SKY);
    expect(conditions).toContain(WeatherCondition.RAIN);
    expect(conditions).toContain(WeatherCondition.SNOW);
    expect(conditions).toContain(WeatherCondition.THUNDERSTORM);
    expect(conditions.length).toBeGreaterThan(0);
  });

  test('should return all available icon codes', () => {
    const iconCodes = WeatherIconService.getAllIconCodes();
    
    expect(iconCodes).toContain(WeatherIconCode.CLEAR_SKY_DAY);
    expect(iconCodes).toContain(WeatherIconCode.RAIN_DAY);
    expect(iconCodes).toContain(WeatherIconCode.SNOW_DAY);
    expect(iconCodes.length).toBeGreaterThan(0);
  });

  test('should get condition by icon code', () => {
    const condition = WeatherIconService.getConditionByCode('01d');
    expect(condition).toBe(WeatherCondition.CLEAR_SKY);

    const rainCondition = WeatherIconService.getConditionByCode('10d');
    expect(rainCondition).toBe(WeatherCondition.RAIN);
  });

  test('should return null for invalid icon code', () => {
    const condition = WeatherIconService.getConditionByCode('99x');
    expect(condition).toBeNull();
  });

  test('should return all weather icons with complete information', () => {
    const allIcons = WeatherIconService.getAllIcons();
    
    expect(allIcons.length).toBeGreaterThan(0);
    
    // Check that each icon has required properties
    allIcons.forEach(icon => {
      expect(icon.dayIcon).toBeDefined();
      expect(icon.nightIcon).toBeDefined();
      expect(icon.description).toBeDefined();
      expect(icon.condition).toBeDefined();
    });
  });

  test('should work with both friendly names and icon codes', () => {
    // Test using friendly condition name
    const iconByCondition = WeatherIconService.getIconByCondition(WeatherCondition.CLEAR_SKY);
    
    // Test using icon code
    const iconByCode = WeatherIconService.getIconByCode('01d');
    
    // Both should refer to the same weather condition
    expect(iconByCondition?.condition).toBe(iconByCode?.condition);
    expect(iconByCondition?.id).toBe(iconByCode?.id);
  });
});
