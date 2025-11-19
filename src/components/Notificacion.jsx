import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";

export default function Notification() {
  const notification = useAuthStore((s) => s.notification);
  const setNotification = useAuthStore((s) => s.setNotification);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="fixed top-6 right-6 z-9999"
        >
          <div className="bg-white/70 backdrop-blur-lg border border-gray-200 shadow-xl rounded-2xl px-6 py-4 max-w-xs flex items-start gap-3">
            
            <div className="text-pink-600 text-xl">✨</div>

            <p className="text-gray-800 font-medium leading-tight">
              {notification}
            </p>

            <button
              className="text-gray-500 hover:text-gray-700 ml-2"
              onClick={() => setNotification(null)}
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
