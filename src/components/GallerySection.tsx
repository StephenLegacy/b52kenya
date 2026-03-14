import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import galleryEntrance from "@/assets/gallery-entrance.jpg";
import galleryInterior from "@/assets/gallery-interior.jpg";
import galleryFood1 from "@/assets/gallery-food1.jpg";
import galleryFood2 from "@/assets/gallery-food2.jpg";
import galleryCocktail from "@/assets/gallery-cocktail.jpg";
import galleryDrinks from "@/assets/gallery-drinks.jpg";
import galleryAtmosphere from "@/assets/gallery-atmosphere.jpg";
import galleryNightlife from "@/assets/gallery-nightlife.jpg";

const images = [
  { src: galleryEntrance, alt: "B52 Entrance at night", category: "First Impression" },
  { src: galleryInterior, alt: "Lounge interior", category: "First Impression" },
  { src: galleryFood1, alt: "Signature dish", category: "Dining" },
  { src: galleryFood2, alt: "Chef's selection", category: "Dining" },
  { src: galleryCocktail, alt: "Cocktail preparation", category: "Cocktails" },
  { src: galleryDrinks, alt: "Signature drinks", category: "Cocktails" },
  { src: galleryAtmosphere, alt: "Guests enjoying the lounge", category: "Atmosphere" },
  { src: galleryNightlife, alt: "DJ night energy", category: "Nightlife" },
];

const GallerySection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.6;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section id="gallery" className="py-24 md:py-32">
      <div className="px-6 md:px-12 lg:px-24 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-end justify-between"
        >
          <div>
            <p className="font-label text-xs text-primary mb-4">Gallery</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
              <span className="font-display text-4xl md:text-6xl">The Ambience</span>
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Horizontal scroll gallery */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pl-6 md:pl-12 lg:pl-24 pr-6 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            className={`flex-shrink-0 snap-start cursor-pointer group relative overflow-hidden ${
              i % 3 === 0 ? "w-[80vw] md:w-[40vw]" : "w-[70vw] md:w-[30vw]"
            }`}
            onClick={() => setLightbox(i)}
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <p className="font-label text-[10px] text-primary">{img.category}</p>
              <p className="text-sm text-foreground mt-1">{img.alt}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-background/95 flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <button
              className="absolute left-4 md:left-8 text-foreground hover:text-primary transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((p) => (p! > 0 ? p! - 1 : images.length - 1));
              }}
              aria-label="Previous"
            >
              <ChevronLeft size={32} />
            </button>
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={images[lightbox].src}
              alt={images[lightbox].alt}
              className="max-h-[85vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-4 md:right-8 text-foreground hover:text-primary transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((p) => (p! < images.length - 1 ? p! + 1 : 0));
              }}
              aria-label="Next"
            >
              <ChevronRight size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
