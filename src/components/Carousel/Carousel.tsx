'use client';
import React, { useState, useRef, useEffect } from 'react';
import styles from './Carousel.module.css';
interface CarouselProps {
  children: React.ReactNode[];
  itemsPerView?: number;
  showArrows?: boolean;
  showDots?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}
const Carousel: React.FC<CarouselProps> = ({
  children,
  itemsPerView = 3,
  showArrows = true,
  showDots = false,
  autoPlay = false,
  autoPlayInterval = 3000,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [actualItemsPerView, setActualItemsPerView] = useState(itemsPerView);
  const totalItems = children.length;
  const maxIndex = Math.max(0, totalItems - actualItemsPerView);
  useEffect(() => {
    const updateLayout = () => {
      if (carouselRef.current && trackRef.current) {
        const containerWidth = carouselRef.current.offsetWidth;
        const gap = 16;
        const minItemWidth = 120;
        let itemWidth = (containerWidth - (gap * (itemsPerView - 1))) / itemsPerView;
        itemWidth = Math.max(itemWidth, minItemWidth);
        const actualItemsCanFit = Math.floor((containerWidth + gap) / (itemWidth + gap));
        const actualItemsToShow = Math.min(actualItemsCanFit, itemsPerView, totalItems);
        setActualItemsPerView(actualItemsToShow);
        if (actualItemsToShow > 0) {
          itemWidth = (containerWidth - (gap * (actualItemsToShow - 1))) / actualItemsToShow;
        }
        const translateX = currentIndex * (itemWidth + gap);
        trackRef.current.style.transform = `translateX(-${translateX}px)`;
        const items = trackRef.current.children;
        for (let i = 0; i < items.length; i++) {
          const item = items[i] as HTMLElement;
          item.style.width = `${itemWidth}px`;
        }
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [itemsPerView, currentIndex, totalItems]);
  useEffect(() => {
    if (autoPlay && totalItems > actualItemsPerView) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, maxIndex, totalItems, actualItemsPerView]);
  const goToPrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };
  const goToNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };
  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(maxIndex, Math.max(0, index)));
  };
  if (totalItems === 0) return null;
  return (
    <div className={`${styles.carousel} ${className}`}>
      <div className={styles.carouselContainer} ref={carouselRef}>
        <div 
          className={styles.carouselTrack}
          ref={trackRef}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className={styles.carouselItem}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      {showArrows && totalItems > actualItemsPerView && (
        <>
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
            aria-label="Previous"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          <button
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
            aria-label="Next"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </>
      )}
      {showDots && totalItems > actualItemsPerView && (
        <div className={styles.carouselDots}>
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`${styles.carouselDot} ${
                currentIndex === index ? styles.carouselDotActive : ''
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default Carousel;

