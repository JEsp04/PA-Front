import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // Importa useLocation
import { Header } from './components/header'
import { Home } from './pages/Home.jsx'
import { Footer } from './components/Footer'; // Importa el nuevo componente Footer
import { AboutUs } from './pages/AboutUs'; // Importa tu nueva página
import { Offers } from './pages/Offers'; // Importa tu nueva página de Ofertas
import { SearchResults } from './pages/SearchResults'; // Importa la página de resultados de búsqueda
import { Cart } from './pages/Cart'; // Importa la nueva página del carrito
import ProductDetails from './pages/ProductDetails';

function AppContent() { // Creamos un componente interno para usar useLocation
  const location = useLocation();

  // Define las rutas donde el Header NO debe aparecer
  const noHeaderPaths = []; // Ejemplo: ['/login', '/registro']

  // Define las rutas donde el Footer NO debe aparecer
  const noFooterPaths = []; // Ejemplo: ['/login', '/registro']

  // Verifica si la ruta actual está en la lista de exclusión para el header y footer
  const shouldShowHeader = !noHeaderPaths.includes(location.pathname);
  const shouldShowFooter = !noFooterPaths.includes(location.pathname);

  return (
    <div className='min-h-screen bg-white flex flex-col'>
      {shouldShowHeader && <Header />} {/* Renderiza el Header condicionalmente */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre-nosotros" element={<AboutUs />} />
          <Route path="/ofertas" element={<Offers />} /> {/* Nueva ruta para Ofertas */}
          <Route path="/productos/:productoId" element={<ProductDetails />} /> {/* Alias para enlaces que usan /product/... */}
          <Route path="/search" element={<SearchResults />} /> {/* Nueva ruta para la búsqueda */}
          <Route path="/carrito" element={<Cart />} /> {/* Nueva ruta para el carrito */}
        </Routes>
      </main>
      {shouldShowFooter && <Footer />} {/* Renderiza el Footer condicionalmente */}
    </div>
  );
}

export default function App() {
  return (
    <Router> {/* Envuelve toda la aplicación en BrowserRouter */}
      <AppContent /> {/* Renderiza el nuevo componente AppContent */}
    </Router>
  )
}
