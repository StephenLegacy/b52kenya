import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";

const FloatingReservation = () => {
  return (
    <motion.a
      href="https://wa.me/254715000010?text=Hi%2C%20I%27d%20like%20to%20reserve%20a%20table%20at%20B52%20Bistro"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-full shadow-lg transition-all duration-500 hover:shadow-[0_0_40px_hsl(355_83%_41%/0.5)] hover:scale-105 group"
      aria-label="Reserve a Table"
    >
      <CalendarCheck size={18} className="transition-transform duration-300 group-hover:rotate-12" />
      <span className="text-xs font-label tracking-wider hidden sm:inline">Reserve a Table</span>
    </motion.a>
  );
};

export default FloatingReservation;
