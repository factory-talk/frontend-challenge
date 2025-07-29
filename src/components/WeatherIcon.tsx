'use client';
import React from 'react';
import Image from 'next/image';
import { useWeatherIcon } from '@/hooks/useWeatherIcon';
interface WeatherIconProps {
  iconCode: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  alt?: string;
  showDescription?: boolean;
  preload?: boolean;
  onClick?: () => void;
  theme?: 'dark' | 'light' | 'none' | 'auto';
  timestamp?: number;
  timezone?: string;
}
const WeatherIcon: React.FC<WeatherIconProps> = ({
  iconCode,
  size = 'md',
  className = '',
  alt,
  showDescription = false,
  preload = true,
  onClick,
  theme = 'none',
  timestamp,
  timezone
}) => {
  const isLocalDayTime = (timestamp?: number, timezone?: string): boolean => {
    if (!timestamp || !timezone) {
      return !iconCode.endsWith('n');
    }
    try {
      const date = new Date(timestamp * 1000);
      const localTime = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        hour12: false
      }).format(date);
      const hour = parseInt(localTime);
      return hour >= 6 && hour < 18;
    } catch (error) {
      console.warn('Error determining local time:', error);
      return !iconCode.endsWith('n');
    }
  };
  const getEffectiveIconCode = (): string => {
    if (theme === 'auto') {
      const isDayTime = isLocalDayTime(timestamp, timezone);
      const baseCode = iconCode.substring(0, 2);
      return isDayTime ? `${baseCode}d` : `${baseCode}n`;
    }
    return iconCode;
  };
  const effectiveIconCode = getEffectiveIconCode();
  const { icon, isLoading, error } = useWeatherIcon(effectiveIconCode, { preload });
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };
  const getBackgroundClasses = (state: 'error' | 'loading') => {
    if (theme === 'none') return '';
    switch (state) {
      case 'error':
        return theme === 'light' 
          ? 'bg-red-100 rounded-lg shadow-lg' 
          : 'bg-red-500 rounded-lg shadow-lg';
      case 'loading':
        return theme === 'light' 
          ? 'bg-gray-100 rounded-lg shadow-lg' 
          : 'bg-gray-500 rounded-lg shadow-lg';
      default:
        return '';
    }
  };
  const containerClass = `
    inline-flex flex-col items-center justify-center
    ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
    ${className}
  `;
  if (error) {
    return (
      <div className={containerClass} onClick={onClick}>
        <div className={`${sizeClasses[size]} ${getBackgroundClasses('error')} flex items-center justify-center`}>
          <svg className="w-1/2 h-1/2 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        {showDescription && (
          <span className="text-xs text-red-500 mt-2 text-center font-medium">
            Error loading icon
          </span>
        )}
      </div>
    );
  }
  if (isLoading || !icon) {
    return (
      <div className={containerClass} onClick={onClick}>
        <div className={`${sizeClasses[size]} ${getBackgroundClasses('loading')} flex items-center justify-center`}>
          <svg className="animate-spin h-1/2 w-1/2 text-gray-600 drop-shadow-sm" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        {showDescription && (
          <span className="text-xs text-gray-400 mt-2 text-center font-medium">
            Loading...
          </span>
        )}
      </div>
    );
  }
  return (
    <div className={containerClass} onClick={onClick}>
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <Image
          src={icon.url}
          alt={alt || icon.description}
          className={`${sizeClasses[size]} object-contain drop-shadow-lg`}
          width={48}
          height={48}
          onError={(e) => {
            console.error('Failed to load weather icon:', icon.url);
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      {showDescription && (
        <span className="text-xs text-gray-600 mt-2 text-center capitalize font-medium drop-shadow-sm">
          {icon.description}
        </span>
      )}
    </div>
  );
};
export default WeatherIcon;

