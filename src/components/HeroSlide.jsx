export const HeroSlide = ({ slide, isActive }) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
        isActive ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden={!isActive}
    >
      <img
        src={slide.image}
        alt={slide.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
        <div
          className={`transition-all duration-1000 ease-out ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 drop-shadow-lg">
            {slide.title}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8 drop-shadow-md">
            {slide.description}
          </p>
          <a href={slide.link} className="bg-[#D4AF37] text-[#0A0A0A] font-bold py-3 px-10 rounded-md text-lg hover:bg-[#B8860B] transition-all duration-300 transform hover:scale-105 shadow-lg">
            {slide.cta}
          </a>
        </div>
      </div>
    </div>
  );
};