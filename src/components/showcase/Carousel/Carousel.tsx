import React, { useState, useEffect } from "react";
import classes from "./Carousel.module.css";

interface CarouselItem {
  id: string;
  image: string;
  title?: string;
  description?: string;
  badge?: string;
  link?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  variant?: "full" | "compact";
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = true,
  interval = 5000,
  showDots = true,
  showArrows = true,
  variant = "full",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const currentItem = items[currentIndex];

  return (
    <div className={`${classes.carousel} ${classes[variant]}`}>
      {/* Main Slide */}
      <div className={classes.slide}>
        <img
          src={currentItem.image}
          alt={currentItem.title || `Slide ${currentIndex + 1}`}
          className={classes.image}
        />

        {currentItem.badge && (
          <div className={classes.badge}>{currentItem.badge}</div>
        )}

        {variant === "full" && currentItem.title && (
          <div className={classes.overlay}>
            <h2 className={classes.slideTitle}>{currentItem.title}</h2>
            {currentItem.description && (
              <p className={classes.slideDescription}>
                {currentItem.description}
              </p>
            )}
            {currentItem.link && (
              <a href={currentItem.link} className={classes.slideButton}>
                Смотреть →
              </a>
            )}
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <button
            className={classes.navButton + " " + classes.prev}
            onClick={goToPrevious}
            aria-label="Предыдущий слайд"
          >
            ‹
          </button>
          <button
            className={classes.navButton + " " + classes.next}
            onClick={goToNext}
            aria-label="Следующий слайд"
          >
            ›
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && (
        <div className={classes.dots}>
          {items.map((_, index) => (
            <button
              key={index}
              className={`${classes.dot} ${
                index === currentIndex ? classes.active : ""
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
