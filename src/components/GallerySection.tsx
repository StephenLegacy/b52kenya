import { useState } from "react";
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

// Layout pattern: full, half-half, full, half-half
const getLayout = (index: number): "full" | "half" => {
  const cycle = index % 3;
  return cycle === 0 ? "full" : "half";
};

// Subtle continuous floating animation variants
const floatVariants = {
  animate: (i: number) => ({
    y: [0, i % 2 === 0 ? -8 : 8, 0],
    x: [0, i % 3 === 0 ? 6 : -6, 0],
    transition: {
      duration: 6 + (i % 3),
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  }),
};

const GallerySection = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);

  // Build rows from images based on layout pattern
  const rows: { type: "full" | "pair"; images: typeof images }[] = [];
  let i = 0;
  while (i < images.length) {
    const layout = getLayout(rows.length);
    if (layout === "full") {
      rows.push({ type: "full", images: [images[i]] });
      i += 1;
    } else {
      if (i + 1 < images.length) {
        rows.push({ type: "pair", images: [images[i], images[i + 1]] });
        i += 2;
      } else {
        rows.push({ type: "full", images: [images[i]] });
        i += 1;
      }
    }
  }

  return (
    <section id="gallery" className="py-24 md:py-32">
      <div className="px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="font-label text-xs text-primary mb-4">Gallery</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
            <span className="font-display text-4xl md:text-6xl">The Ambience</span>
          </h2>
        </motion.div>

        <div className="space-y-4 md:space-y-6">
          {rows.map((row, rowIdx) => {
            if (row.type === "full") {
              const img = row.images[0];
              const globalIdx = images.indexOf(img);
              return (
                <motion.div
                  key={`row-${rowIdx}`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full"
                >
                  <motion.div
                    custom={globalIdx}
                    variants={floatVariants}
                    animate="animate"
                    className="gallery-parallelogram cursor-pointer group relative overflow-hidden"
                    onClick={() => setLightbox(globalIdx)}
                  >
                    <div className="aspect-[21/9] overflow-hidden">
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="font-label text-[10px] text-primary">{img.category}</p>
                      <p className="text-sm text-foreground mt-1">{img.alt}</p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            }

            return (
              <div key={`row-${rowIdx}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {row.images.map((img, colIdx) => {
                  const globalIdx = images.indexOf(img);
                  return (
                    <motion.div
                      key={globalIdx}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.8, delay: colIdx * 0.15, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <motion.div
                        custom={globalIdx}
                        variants={floatVariants}
                        animate="animate"
                        className="gallery-parallelogram cursor-pointer group relative overflow-hidden"
                        onClick={() => setLightbox(globalIdx)}
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={img.src}
                            alt={img.alt}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <p className="font-label text-[10px] text-primary">{img.category}</p>
                          <p className="text-sm text-foreground mt-1">{img.alt}</p>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[70] bg-background/95 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors z-10"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <button
              className="absolute left-4 md:left-8 text-foreground hover:text-primary transition-colors z-10"
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
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              src={images[lightbox].src}
              alt={images[lightbox].alt}
              className="max-h-[85vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-4 md:right-8 text-foreground hover:text-primary transition-colors z-10"
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
