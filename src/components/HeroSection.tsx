import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import heroVideo from "@/assets/hero-video.mp4";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-svh flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={heroBg}
          className="w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-label text-xs text-primary mb-6 tracking-[0.2em]"
        >
          Ngong Road, Nairobi
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-6"
        >
          Where Dining
          <br />
          <span className="font-display text-6xl md:text-8xl lg:text-9xl">
            Meets Nightlife
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Experience elevated dining, signature cocktails, and unforgettable nights at B52 Bistro.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#menu" className="btn-hero-filled text-xs">
            View Menu
          </a>
          <a href="#gallery" className="btn-hero text-xs">
            Explore Gallery
          </a>
          <a href="#contact" className="btn-hero text-xs">
            Visit Us Tonight
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-label text-[10px] text-muted-foreground">Scroll</span>
        <ChevronDown size={16} className="text-primary animate-scroll-bounce" />
      </motion.div> */}
    </section>
  );
};

export default HeroSection;
