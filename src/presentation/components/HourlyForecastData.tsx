import React from 'react';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import styles from '../styles/HourlyForecastData.module.css';

interface HourlyForecastDataProps {
  forecastData: {
    dateTime: string;
    temp: number;
    icon: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    rainVolumn: number;
    latitude: number;
    longitude: number;
  };
}

const HourlyForecastData: React.FC<HourlyForecastDataProps> = ({ forecastData }) => {
  const router = useRouter();

  const handleClose = () => {
    router.push(`/WeatherPage?latitude=${forecastData.latitude}&longitude=${forecastData.longitude}`);
  };

  return (
    <div className={styles.container}>
      <Button className={styles.closeButton} shape="circle" icon={<CloseOutlined />} onClick={handleClose} />
      <div className={styles.title}>
        <h1>Hourly Conditions</h1>
      </div>
      <div className={styles.forecastDetails}>
        <img
          src={`http://openweathermap.org/img/wn/${forecastData.icon}@4x.png`}
          alt="weather icon"
          className={styles.icon}
        />
        <div className={styles.temp}>{Math.round(forecastData.temp)}°</div>
        <div className={styles.time}>{forecastData.dateTime}</div>
      </div>
      <div className={styles.weatherData}>
        <div className={styles.detailsTable}>
          <h5>Forecast Details</h5>
          <div className={styles.detailsRow}>
            <span className={styles.detailsLabel}>Humidity</span>
            <span className={styles.detailsValue}>{forecastData.humidity}%</span>
          </div>
          <div className={styles.detailsRow}>
            <span className={styles.detailsLabel}>Wind</span>
            <span className={styles.detailsValue}>{forecastData.windSpeed} km/h</span>
          </div>
          <div className={styles.detailsRow}>
            <span className={styles.detailsLabel}>Pressure</span>
            <span className={styles.detailsValue}>{forecastData.pressure} mBar</span>
          </div>
          <div className={styles.detailsRow}>
            <span className={styles.detailsLabel}>Chance of rain</span>
            <span className={styles.detailsValue}>{forecastData.rainVolumn || 0} mm</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HourlyForecastData);
