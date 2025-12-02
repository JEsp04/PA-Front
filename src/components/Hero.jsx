import { useState, useEffect, useCallback, useRef } from 'react';
import { HeroSlide } from './HeroSlide';
import { CarouselControls } from './CarouselControls';

const slidesData = [
  {
    image: "https://disfragancias.com/cdn/shop/files/perfume-sarabes-movil.png?v=1709903660&width=750",
    title: 'Descubre tu Esencia',
    description: 'Explora fragancias que capturan la esencia de la naturaleza y la sofisticación.',
    cta: 'Ver Novedades',
    link: '/novedades',
  },
  {
    image: "https://disfragancias.com/cdn/shop/files/28-jun-mobile.webp?v=1751382737&width=750",
    title: 'Elegancia Masculina',
    description: 'Aromas audaces y refinados diseñados para el hombre moderno.',
    cta: 'Colección Hombre',
    link: '/hombre',
  },
  {
    image: "https://plus.unsplash.com/premium_photo-1679106770086-f4355693be1b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    title: 'Aura Femenina',
    description: 'Fragancias florales y exóticas que celebran la feminidad en todas sus formas.',
    cta: 'Colección Mujer',
    link: '/mujer',
  },
];

const SLIDE_DURATION = 7000; // 7 segundos

export const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slidesData.length);
  }, []);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slidesData.length) % slidesData.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const startTimer = () => {
      setProgress(0);
      clearInterval(progressRef.current);
      clearTimeout(timerRef.current);

      progressRef.current = setInterval(() => {
        setProgress(p => p + (100 / (SLIDE_DURATION / 100)));
      }, 100);

      timerRef.current = setTimeout(goToNext, SLIDE_DURATION);
    };

    startTimer();

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(progressRef.current);
    };
  }, [currentIndex, goToNext]);

  return (
    <section className="relative h-120 md:h-180 w-full overflow-hidden">
      {slidesData.map((slide, index) => (
        <HeroSlide key={index} slide={slide} isActive={index === currentIndex} />
      ))}
      <CarouselControls slides={slidesData} currentIndex={currentIndex} onPrev={goToPrev} onNext={goToNext} onDotClick={goToSlide} progress={progress} />
    </section>
  );
};