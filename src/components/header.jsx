import { useState, useEffect } from 'react';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom'; // 1. Importa Link y useNavigate
import useProductStore from '../store/useProductStore';
import {useCartStore} from '../store/useCartStore';
import { useAuthStore } from "../store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";


const announcementMessages = [
  "Envío gratis en compras superiores a $200.000",
  "Nuevas fragancias de invierno ya disponibles",
  "Suscríbete y obtén un 10% de descuento en tu primera compra",
];

// Componente para un item de la lista de sugerencias
const SuggestionItem = ({ product, onClick }) => (
  <li onClick={onClick}>
    <Link to={`/productos/${product.productoId || product.productid || product.productoid}`} className="flex items-center p-2 hover:bg-gray-100 rounded-md" key={product._id || product.id}>
      <img src={product.imagenUrl} alt={product.nombre} className="w-12 h-12 object-cover rounded-md mr-4" />
      <div className="grow">
        <p className="font-semibold text-sm text-gray-800">{product.nombre}</p>
        <p className="text-xs text-gray-500">{product.marca}</p>
      </div>
      <p className="text-sm font-bold text-[#B8860B]">${product.precio.toLocaleString('es-CO')}</p>
    </Link>
  </li>
);

export const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { products, fetchProducts } = useProductStore();
  const totalItemsInCart = useCartStore((state) => state.getTotalItems());
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Cargar productos para la búsqueda
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products, fetchProducts]);

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

  // Actualizar sugerencias de búsqueda en tiempo real
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filteredSuggestions = products.filter(product =>
        product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.marca.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5); // Mostrar hasta 5 sugerencias
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, products]);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      closeAndClearSearch();
    }
  };

  const handleSuggestionClick = () => {
    closeAndClearSearch();
  };

  const closeAndClearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setIsSearchOpen(false);
  };

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
            <Link to="/" className="text-2xl font-serif text-[#0A0A0A]">El Zar</Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex md:items-center">
            <ul className="flex space-x-8">
              <li><Link to="/marcas" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Marcas</Link></li>
              <li><Link to="/novedades" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Novedades</Link></li>
              <li><Link to="/mujer" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Mujer</Link></li>
              <li><Link to="/hombre" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Hombre</Link></li>
              <li><Link to="/colecciones" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Colecciones</Link></li>
              <li><Link to="/sobre-nosotros" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Sobre Nosotros</Link></li>
              <li><Link to="/ofertas" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Ofertas</Link></li>
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

            <div className="relative">
  <button
    onClick={() => setUserMenuOpen(!userMenuOpen)}
    className="text-[#6E6E6E] hover:text-[#D4AF37]"
  >
    <FiUser className="w-5 h-5" />
  </button>

  <AnimatePresence>
    {userMenuOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute right-0 mt-3 bg-white shadow-xl rounded-xl p-4 w-56 border border-gray-100"
      >
        {!isAuthenticated ? (
          // Si NO está logueado → botón de iniciar sesión
          <Link
            to="/Autenticacion"
            className="block text-center text-gray-700 hover:text-black font-semibold"
            onClick={() => setUserMenuOpen(false)}
          >
            Iniciar sesión
          </Link>
        ) : (
          <>
            <p className="font-semibold text-gray-800">{user.nombre}</p>
            <p className="text-sm text-gray-500">{user.email}</p>

            <div className="h-px bg-gray-200 my-3" />

            <Link
              to="/perfil"
              className="block text-gray-700 hover:text-black mb-2"
            >
              Mi perfil
            </Link>

            <Link
              to="/pedidos"
              className="block text-gray-700 hover:text-black mb-2"
            >
              Mis pedidos
            </Link>

            <button
              onClick={() => {
                logout();
                setUserMenuOpen(false);
              }}
              className="block w-full text-left text-red-500 hover:text-red-700 font-semibold"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </motion.div>
    )}
  </AnimatePresence>
</div>


            <Link to="/carrito" className="relative text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">
              <span className="sr-only">Cart</span>
              <FiShoppingCart className="w-5 h-5" />
              {totalItemsInCart > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-xs font-bold text-[#0A0A0A]">{totalItemsInCart}</span>
              )}
            </Link>

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-b-lg shadow-lg z-10">
              <ul className="p-2">
                {suggestions.map(product => <SuggestionItem key={product._id || product.id} product={product} onClick={handleSuggestionClick} />)}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Menú desplegable para móviles */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#F5F5F5]">
          <ul className="flex flex-col items-center space-y-4 py-4 border-t border-[#E5E7EB]">
            <li><Link to="/marcas" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Marcas</Link></li>
            <li><Link to="/novedades" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Novedades</Link></li>
            <li><Link to="/mujer" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Mujer</Link></li>
            <li><Link to="/hombre" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Hombre</Link></li>
            <li><Link to="/colecciones" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Colecciones</Link></li>
            <li><Link to="/sobre-nosotros" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Sobre Nosotros</Link></li>
            <li><Link to="/ofertas" className="text-[#6E6E6E] hover:text-[#D4AF37] transition-colors duration-200">Ofertas</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
};
export default Header;