import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export const CarouselControls = ({ slides, currentIndex, onPrev, onNext, onDotClick, progress }) => {
  return (
    <>
      {/* Flechas de Navegación */}
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors"
        aria-label="Diapositiva anterior"
      >
        <FiChevronLeft size={28} />
      </button>
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors"
        aria-label="Siguiente diapositiva"
      >
        <FiChevronRight size={28} />
      </button>

      {/* Indicadores y Barra de Progreso */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-3">
        <div className="flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => onDotClick(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Ir a la diapositiva ${index + 1}`}
            />
          ))}
        </div>
        <div className="w-48 h-0.5 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-[#D4AF37]" style={{ width: `${progress}%`, transition: progress > 0 ? 'width 0.1s linear' : 'none' }} />
        </div>
      </div>
    </>
  );
};