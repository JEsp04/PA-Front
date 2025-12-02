import { FiShoppingCart } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";

export const ProductCard = ({ product }) => {
  const addToCart = useCartStore((s) => s.addToCart);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  // id robusto: acepta productoId, productId, id o _id
  const id =
    product?.productoId ??
    product?.productId ??
    product?.id ??
    product?._id ??
    null;

  const imageSrc =
    product?.imagenUrl ??
    product?.imagen ??
    product?.image ??
    product?.imagen_url ??
    (Array.isArray(product?.fotos) && product.fotos[0]?.url) ??
    null;

  const nombre =
    product?.nombre ??
    product?.title ??
    product?.name ??
    "Nombre no disponible";
  const marca = product?.marca ?? product?.brand ?? "Marca desconocida";
  const precioRaw = product?.precio ?? product?.price ?? 0;
  const precio = Number(precioRaw) || 0;
  const precioDisplay = `$${precio.toLocaleString("es-CO")}`;

  const placeholder = "https://via.placeholder.com/400x400?text=Sin+imagen";

  const cardContent = (
    <motion.div
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-black/20 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-black/30"
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Efecto de brillo en hover */}
      <div className="absolute -top-1/2 left-0 w-full h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 group-hover:animate-[shine_1.5s_ease-out]" />

      <div className="relative aspect-square overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/20 to-transparent" />
        <motion.img
          src={imageSrc ?? placeholder}
          alt={nombre}
          className="relative z-0 h-full w-full object-cover object-center"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>
      <div className="relative z-10 flex flex-1 flex-col p-4">
        <p className="text-xs uppercase tracking-wider text-gray-400">
          {marca}
        </p>
        <h3 className="mt-1 flex-1 text-base font-medium text-gray-50">
          <span aria-hidden="true" className="absolute inset-0" />
          {nombre}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-semibold text-white">{precioDisplay}</p>
        </div>
      </div>
      <motion.button
        onClick={(e) => {
          e.preventDefault();
          if (!user) return navigate("/Autenticacion/Login");
          // FIX: Aseguramos que el producto tenga la propiedad `precioUnitario`
          // que el carrito espera, además de la propiedad `precio`.
          const productWithUnitPrice = {
            ...product,
            precioUnitario: product.precio,
          };
          addToCart(user.usuarioId, productWithUnitPrice, 1);
        }}
        className="absolute bottom-4 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37] text-[#0A0A0A]"
        aria-label="Añadir al carrito"
        type="button"
        initial={{ opacity: 0, scale: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
      >
        <FiShoppingCart className="h-5 w-5" />
      </motion.button>
    </motion.div>
  );

  if (id) {
    return (
      <Link to={`/productos/${id}`} className="block">
        {cardContent}
      </Link>
    );
  }

  return <div className="block">{cardContent}</div>;
};

export default ProductCard;
