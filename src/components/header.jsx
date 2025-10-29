import { useState, useEffect } from 'react';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';

const announcementMessages = [
  "Envío gratis en compras superiores a $200.000",
  "Nuevas fragancias de invierno ya disponibles",
  "Suscríbete y obtén un 10% de descuento en tu primera compra",
];

export const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % announcementMessages.length);
        setIsFading(false);
      }, 500); // Duración de la transición de opacidad
    }, 5000); // Cambia el mensaje cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Barra de Anuncios con carrusel */}
      <div className="bg-[#0A0A0A] text-[#F5F5F5] px-4 py-2 text-center text-sm font-medium h-9 flex items-center justify-center overflow-hidden">
        <p className={`transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>
          {announcementMessages[currentMessageIndex]}
        </p>
      </div>

      {/* Header Principal */}
      <div className="bg-[#F5F5F5] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0">
            <a href="/" className="text-2xl font-serif text-[#0A0A0A]">El Zar</a>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex md:items-center">
            <ul className="flex space-x-8">
              <li><a href="#" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Marcas</a></li>
              <li><a href="#" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Novedades</a></li>
              <li><a href="#" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Mujer</a></li>
              <li><a href="#" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Hombre</a></li>
              <li><a href="#" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Colecciones</a></li>
              <li><a href="#" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Sobre Nosotros</a></li>
              <li><a href="#" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Ofertas</a></li>
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                setIsMenuOpen(false); // Cierra el menú si la búsqueda se abre
              }}
              className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200"
              aria-label="Toggle search"
            >
              <span className="sr-only">Search</span>
              <FiSearch className="w-5 h-5" />
            </button>

            <a href="#" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">
              <span className="sr-only">Account</span>
              <FiUser className="w-5 h-5" />
            </a>

            <a href="#" className="relative text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">
              <span className="sr-only">Cart</span>
              <FiShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 text-xs text-white bg-[#D4AF37] rounded-full px-1.5">0</span>
            </a>

            {/* Botón de Menú para móviles */}
            <div className="md:hidden">
              <button
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                  setIsSearchOpen(false); // Cierra la búsqueda si el menú se abre
                }}
                className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Panel de Búsqueda con transición */}
      <div
        className={`absolute left-0 right-0 bg-[#F5F5F5] shadow-md transition-all duration-550 ease-in-out ${
          isSearchOpen ? 'top-[calc(2.25rem+4rem)] opacity-100' : '-top-full opacity-0'
        }`}
      >
        <div className="max-w-3xl mx-auto p-4">
          <input
            type="search"
            placeholder="Buscar fragancias..."
            className="w-full px-4 py-2 border border-[#C0C0C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8860B] bg-white"
          />
        </div>
      </div>

      {/* Menú desplegable para móviles */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#F5F5F5]">
          <ul className="flex flex-col items-center space-y-4 py-4 border-t border-[#E5E7EB]">
            <li><a href="#" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Marcas</a></li>
            <li><a href="#" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Novedades</a></li>
            <li><a href="#" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Mujer</a></li>
            <li><a href="#" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Hombre</a></li>
            <li><a href="#" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Colecciones</a></li>
            <li><a href="#" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Sobre Nosotros</a></li>
            <li><a href="#" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Ofertas</a></li>
          </ul>
        </div>
      )}
    </header>
  );
};
export default Header;