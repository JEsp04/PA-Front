import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // Importa useLocation
import { Header } from './components/header'
import { Home } from './pages/Home.jsx'
import { Footer } from './components/Footer'; // Importa el nuevo componente Footer
import { AboutUs } from './pages/AboutUs'; // Importa tu nueva página
import { Offers } from './pages/Offers'; // Importa tu nueva página de Ofertas
import { ProductDetails } from './pages/ProductDetails';
import { SearchResults } from './pages/SearchResults'; // Importa la página de resultados de búsqueda

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
          <Route path="/productos/:productId" element={<ProductDetails />} />
          <Route path="/product/:productId" element={<ProductDetails />} /> {/* Alias para enlaces que usan /product/... */}
          <Route path="/search" element={<SearchResults />} /> {/* Nueva ruta para la búsqueda */}
        </Routes>
      </main>
      {shouldShowFooter && <Footer />} {/* Renderiza el Footer condicionalmente */}
    </div>
  );
}

function App() {
  return (
    <Router> {/* Envuelve toda la aplicación en BrowserRouter */}
      <AppContent /> {/* Renderiza el nuevo componente AppContent */}
    </Router>
  )
}

export default App
