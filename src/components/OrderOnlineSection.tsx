import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Bike, MessageCircle, MapPin } from "lucide-react";
import uberEatsLogo from "@/assets/uber-eats-logo.png";
import boltFoodLogo from "@/assets/bolt-food-logo.png";
import glovoLogo from "@/assets/glovo-logo.png";

// Define the interface to fix the TypeScript error
interface Platform {
  name: string;
  logo: string | React.ReactNode;
  href: string;
  bg: string;
  accent: string;
}

const platforms: Platform[] = [
  { 
    name: "Uber Eats", 
    logo: uberEatsLogo, 
    href: "https://www.order.store/store/b52-bistro/i9kb2WT0Tz61zRNExIxOmQ", 
    bg: "bg-[#142328]", 
    accent: "group-hover:shadow-[#06C167]/20" 
  },
  // { 
  //   name: "Bolt Food", 
  //   logo: boltFoodLogo, 
  //   href: "#", 
  //   bg: "bg-[#1a2e1a]", 
  //   accent: "group-hover:shadow-[#34D186]/20" 
  // },
  // { 
  //   name: "Glovo", 
  //   logo: glovoLogo, 
  //   href: "#", 
  //   bg: "bg-[#2e2510]", 
  //   accent: "group-hover:shadow-[#FFC244]/20" 
  // },
  { 
    name: "WhatsApp", 
    logo: <MessageCircle className="w-6 h-6 text-[#25D366]" />, 
    href: "https://wa.me/254715000010?text=Hello%20B52%20Bistro,%20I%20would%20like%20to%20place%20a%20custom%20food%20order.",
    bg: "bg-[#075e54]/10", 
    accent: "group-hover:shadow-[#25D366]/20" 
  },
];

const OrderOnlineSection = () => {
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <section id="order" className="relative py-12 md:py-16 overflow-hidden">
      {/* Parallax Background */}
      <motion.div style={{ y: yParallax }} className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full" />
      </motion.div>

      <div className="max-w-6xl mx-auto text-center px-6 relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="font-label text-[10px] text-primary mb-3 tracking-[0.3em] uppercase font-bold"
        >
          Fast & Reliable
        </motion.p>

        <motion.h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
          Order <span className="font-display text-primary italic">Online</span>
        </motion.h2>

        <motion.p className="text-muted-foreground max-w-xl mx-auto mb-12 text-sm md:text-base">
          Can't make it in? Enjoy B52 Bistro's signature dishes delivered straight to your door.
        </motion.p>

        {/* Platform Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20">
          {platforms.map((platform, i) => (
            <motion.a
              key={platform.name}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group relative flex flex-col items-center justify-center p-8 rounded-2xl border border-white/5 ${platform.bg} ${platform.accent} transition-all duration-500`}
            >
              <div className="w-14 h-14 mb-4 flex items-center justify-center rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 group-hover:scale-110 transition-transform">
                {/* Fixed Conditional Logic for TypeScript */}
                {typeof platform.logo === "string" ? (
                  <img 
                    src={platform.logo} 
                    alt={platform.name} 
                    className="w-8 h-8 object-contain" 
                  />
                ) : (
                  platform.logo
                )}
              </div>
              <span className="font-label text-[10px] text-foreground tracking-widest uppercase mb-1">{platform.name}</span>
              <span className="text-[9px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-all uppercase">Order →</span>
            </motion.a>
          ))}
        </div>

        {/* THE DELIVERY PATH ANIMATION */}
        <div className="relative max-w-4xl mx-auto h-24 flex items-center justify-center mt-10">
          {/* Static Road Path */}
          <svg className="absolute w-full h-full overflow-visible opacity-10">
            <path
              d="M 0,40 Q 200,10 400,40 T 800,40"
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          </svg>

          {/* Animated Progress Path */}
          <svg className="absolute w-full h-full overflow-visible">
            <motion.path
              d="M 0,40 Q 200,10 400,40 T 800,40"
              fill="none"
              stroke="url(#riderGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <defs>
              <linearGradient id="riderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="100%" stopColor="hsl(var(--primary))" />
              </linearGradient>
            </defs>
          </svg>

          {/* The Rider following the Path */}
          <motion.div
            style={{ offsetPath: "path('M 0,40 Q 200,10 400,40 T 800,40')" }}
            animate={{ offsetDistance: ["0%", "100%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 flex flex-col items-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/40 blur-lg rounded-full animate-pulse" />
              <Bike size={32} className="text-primary relative z-10" />
            </div>
            <div className="bg-primary/10 backdrop-blur-md px-3 py-1 rounded-full border border-primary/20 mt-2">
              <span className="text-[9px] font-bold text-primary whitespace-nowrap uppercase tracking-tighter">
                B52 Swift Delivery
              </span>
            </div>
          </motion.div>

          {/* Destination Marker */}
          <div className="absolute right-0 top-[20%] text-primary/40">
            <MapPin size={24} className="animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderOnlineSection;