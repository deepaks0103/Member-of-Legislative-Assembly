import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const images = [
  "/header-banner01.png",
  "/header-banner02.png",
  "/header-banner03.png",
];

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const goPrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="flex flex-col items-center w-full overflow-hidden">
      <div
        className="relative overflow-hidden bg-orange-50 w-screen max-w-screen min-w-screen h-auto aspect-[16/9] sm:aspect-[18/9] md:h-[82vh]"
        style={{ marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }}
      >
        {/* Background Image Setup */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {images.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === activeIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover object-center min-w-full"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3 px-4 sm:px-8">
        <button
          type="button"
          onClick={goPrev}
          className="rounded-full bg-primary text-white p-3 shadow-sm hover:bg-primary/90 cursor-pointer"
          aria-label={t('prev_slide', 'Previous slide')}
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === activeIndex ? 'w-8 bg-primary' : 'w-2.5 bg-primary/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          className="rounded-full bg-primary text-white p-3 shadow-sm hover:bg-primary/90 cursor-pointer"
          aria-label={t('next_slide', 'Next slide')}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Hero;
