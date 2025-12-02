import { Hero } from "../components/Hero";
import { ProductList } from "../components/productList";
import { motion } from "framer-motion";

export const Home = () => {
  return (
    <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0A0A0A] text-white">
      <Hero />

      {/* Sección de Título para la Colección */}
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
            Nuestra Colección
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
            Descubre fragancias que definen momentos y crean recuerdos
            inolvidables.
          </p>
        </motion.div>

        {/* La lista de productos ahora se renderiza dentro de la sección */}
        <ProductList />
      </div>
    </div>
  );
};
