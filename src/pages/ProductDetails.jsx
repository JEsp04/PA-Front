import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";
import { FiShoppingCart, FiPlus, FiMinus } from "react-icons/fi";
import { useCartStore } from "../store/useCartStore";
import useProductStore from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import { RelatedProductCard } from "../components/RelatedProductCard"; // Importamos el nuevo componente
export default function ProductDetails() {
  const { productoId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const addProductToCart = useCartStore((state) => state.addToCart);
  const { user } = useAuthStore();
  const { products, fetchProducts } = useProductStore();

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    if (!product) return;
    // FIX: Aseguramos que el producto tenga la propiedad `precioUnitario`
    // que el carrito espera, además de la propiedad `precio`.
    const productWithUnitPrice = {
      ...product,
      precioUnitario: product.precio,
    };
    addProductToCart(user?.usuarioId, productWithUnitPrice, quantity);

    navigate("/carrito", { state: { productAdded: product.nombre } });
  };

  useEffect(() => {
    // --- FIX: Reiniciar el estado al cambiar de producto ---
    // Esto es crucial para evitar mostrar datos del producto anterior.
    setLoading(true);
    setError(null);
    setProduct(null);
    setQuantity(1);
    // --- Fin del FIX ---

    const loadProduct = async () => {
      // 1. Intenta encontrar el producto en el store global que ya tenemos.
      const productFromStore = products.find(
        (p) => String(p.productoId) === String(productoId)
      );

      if (productFromStore) {
        // Si lo encuentra, lo usa directamente. ¡Es mucho más rápido!
        setProduct(productFromStore);
        setLoading(false);
      } else {
        // 2. Si no lo encuentra, hace la llamada a la API como respaldo.
        try {
          const data = await getProductById(productoId);
          setProduct(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    // Nos aseguramos de que la lista global de productos esté cargada antes de hacer nada.
    // Si no están cargados, el store se encargará de hacerlo.
    if (products.length > 0) {
      loadProduct();
    }
  }, [productoId, products]); // Dependemos de `products` para re-ejecutar.

  if (loading) return <p className="text-center py-8">Cargando producto...</p>;
  if (error)
    return <p className="text-center py-8 text-red-600">Error: {error}</p>;
  if (!product)
    return <p className="text-center py-8">Producto no encontrado</p>;

  // Filtra productos relacionados (misma marca, excluyendo el actual)
  const relatedProducts = products
    .filter(
      (p) => p.marca === product.marca && p.productoId !== product.productoId
    )
    .slice(0, 4); // Muestra hasta 4 productos relacionados

  const precioDisplay = `$${Number(product.precio || 0).toLocaleString(
    "es-CO"
  )}`;
  const imageSrc =
    product?.imagenUrl ??
    product?.imagen ??
    "https://via.placeholder.com/600x600?text=Sin+imagen";

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 gap-x-12 md:grid-cols-2">
          {/* Galería de Imágenes */}
          <div className="flex items-start justify-center">
            <div className="aspect-square w-full max-w-md overflow-hidden rounded-lg border border-gray-200">
              <img
                src={imageSrc}
                alt={product.nombre}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* Detalles del Producto */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
              {product.marca ?? "Marca Desconocida"}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {product.nombre}
            </h1>
            <p className="mt-4 text-3xl tracking-tight text-gray-900">
              {precioDisplay}
            </p>

            <div className="mt-6">
              <h3 className="sr-only">Descripción</h3>
              <div className="space-y-6 text-base text-gray-700">
                <p>
                  {product.descripcion ??
                    "No hay descripción disponible para este producto."}
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center space-x-4">
              {/* Selector de Cantidad */}
              <div className="flex items-center rounded-md border border-gray-300">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-md transition"
                  aria-label="Disminuir cantidad"
                >
                  <FiMinus />
                </button>
                <span className="px-4 py-1.5 text-lg font-medium text-gray-800">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-md transition"
                  aria-label="Aumentar cantidad"
                >
                  <FiPlus />
                </button>
              </div>

              {/* Botón Añadir al Carrito */}
              <button
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center rounded-md border border-transparent bg-[#D4AF37] py-3 px-8 text-base font-bold text-[#0A0A0A] hover:bg-[#B8860B] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 transition-transform transform hover:scale-105"
              >
                <FiShoppingCart className="mr-2 h-5 w-5" />
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Productos Relacionados */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            También te podría interesar
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {relatedProducts.map((relatedProduct) => (
              <RelatedProductCard
                key={relatedProduct.productoId}
                product={relatedProduct}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
