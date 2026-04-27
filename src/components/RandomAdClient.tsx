import { useState, useEffect, useCallback } from 'react';
import styles from './RandomAdClient.module.css';


interface Ad {
  title: string;
  description: string;
  image: string;
  link: string;
}

interface RandomAdClientProps {
  ads: Ad[];
}

export default function RandomAdClient({ ads }: RandomAdClientProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const showNextAd = useCallback(() => {
    if (ads.length === 0) return;

    setIsVisible(false);

    setTimeout(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
      setIsVisible(true);
    }, 500); // Время анимации затухания
  }, [ads.length]);

  // Автоматическая ротация каждые 5 секунд
  useEffect(() => {
    if (ads.length === 0) return;

    const timer = setInterval(() => {
      showNextAd();
    }, 5000); // Меняем каждые 5 секунд

    return () => clearInterval(timer);
  }, [showNextAd, ads.length]);

  if (ads.length === 0) return null;

  const currentAd = ads[currentAdIndex];

  return (
    <div className={styles['ad-rotator']}>
      <a 
        href={currentAd.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles['ad-card']} ${isVisible ? styles['fade-in'] : styles['fade-out']}`}
      >
        <img src={currentAd.image} alt={currentAd.title} />
        <h3>{currentAd.title}</h3>
        <p>{currentAd.description}</p>
        <div className={styles['ad-counter']}>
          {currentAdIndex + 1} / {ads.length}
        </div>
      </a>
    </div>
  );
}