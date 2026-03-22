import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import galleryEntrance from "@/assets/gallery-entrance.jpeg";
import galleryInterior from "@/assets/gallery-interior.jpeg";
import galleryFood1 from "@/assets/gallery-food1.jpeg";
import galleryFood2 from "@/assets/gallery-food2.jpeg";
import galleryCocktail from "@/assets/gallery-cocktail.jpeg";
import galleryDrinks from "@/assets/gallery-drinks.jpg";
import galleryAtmosphere from "@/assets/gallery-atmosphere.jpg";
import galleryNightlife from "@/assets/gallery-nightlife.jpg";

const images = [
  { src: galleryEntrance,   alt: "B52 Entrance at night",      category: "First Impression" },
  { src: galleryInterior,   alt: "Fine selection",            category: "First Impression" },
  { src: galleryFood1,      alt: "Signature dish",             category: "Dining"           },
  { src: galleryFood2,      alt: "Chef's selection",           category: "Dining"           },
  { src: galleryCocktail,   alt: "Cocktail preparation",       category: "Cocktails"        },
  { src: galleryDrinks,     alt: "Signature drinks",           category: "Cocktails"        },
  // { src: galleryAtmosphere, alt: "Guests enjoying the lounge", category: "Atmosphere"       },
  // { src: galleryNightlife,  alt: "DJ night energy",            category: "Nightlife"        },
];

// ─── HORIZONTAL PARALLELOGRAM ─────────────────────────────────────────────
//
//  A true parallelogram has TWO straight horizontal edges (top & bottom)
//  and TWO diagonal edges (left & right sides).
//
//  The shape leans to the RIGHT:
//
//     top-left(S,0%) ─────────────────── top-right(100%,0%)
//          ╲                                   ╲
//           ╲                                   ╲
//     bot-left(0%,100%) ─────────────── bot-right(100-S,100%)
//
//  S = skew offset as percentage of the element HEIGHT.
//  Since clip-path % is relative to element dimensions,
//  we use a fixed px offset instead so the angle stays consistent
//  regardless of whether the tile is wide or narrow.
//  We express it in percent-of-width terms; 6% gives a clean ~10° lean.

const S = 6; // skew % of width

// Full-width tile: leans right
const clipFull  = `polygon(${S}% 0%, 100% 0%, ${100 - S}% 100%, 0% 100%)`;

// Left tile of a pair: same rightward lean
const clipLeft  = `polygon(${S}% 0%, 100% 0%, ${100 - S}% 100%, 0% 100%)`;

// Right tile of a pair: MIRRORED — leans LEFT so the two tiles
// point at each other and create a ╱╲ chevron seam in the centre
const clipRight = `polygon(0% 0%, ${100 - S}% 0%, 100% 100%, ${S}% 100%)`;

// ─── Float keyframes ──────────────────────────────────────────────────────
const floats = [
  { y: [0, -7, 0], x: [0,  4, 0], dur: 7.0 },
  { y: [0,  6, 0], x: [0, -5, 0], dur: 8.2 },
  { y: [0, -5, 0], x: [0, -4, 0], dur: 6.5 },
  { y: [0,  7, 0], x: [0,  5, 0], dur: 9.0 },
];

// ─── Row builder ─────────────────────────────────────────────────────────
function buildRows(imgs: typeof images) {
  type Row = { type: "full" | "pair"; items: { img: typeof images[0]; idx: number }[] };
  const rows: Row[] = [];
  let i = 0, rowNum = 0;
  while (i < imgs.length) {
    if (rowNum % 2 === 0) {
      rows.push({ type: "full", items: [{ img: imgs[i], idx: i }] });
      i++;
    } else {
      const items: Row["items"] = [{ img: imgs[i], idx: i }];
      if (i + 1 < imgs.length) items.push({ img: imgs[i + 1], idx: i + 1 });
      rows.push({ type: "pair", items });
      i += items.length;
    }
    rowNum++;
  }
  return rows;
}

// ─── Tile ─────────────────────────────────────────────────────────────────
const Tile = ({
  img,
  imgIdx,
  clip,
  aspect,
  fi,
  delay,
  onOpen,
}: {
  img: typeof images[0];
  imgIdx: number;
  clip: string;
  aspect: string;
  fi: number;
  delay: number;
  onOpen: (i: number) => void;
}) => {
  const kf = floats[fi % 4];
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      animate={{
        y: kf.y, x: kf.x,
        transition: { duration: kf.dur, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" },
      }}
      className="relative cursor-pointer group w-full"
      style={{ clipPath: clip }}
      onClick={() => onOpen(imgIdx)}
    >
      <div className={`${aspect} overflow-hidden w-full`}>
        <img
          src={img.src}
          alt={img.alt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          style={{ transform: "scale(1.1)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-primary mb-1">{img.category}</p>
          <p className="text-sm text-white/90 font-light">{img.alt}</p>
        </div>
        <div className="absolute inset-0 ring-inset ring-1 ring-primary/0 group-hover:ring-primary/40 transition-all duration-500" />
      </div>
    </motion.div>
  );
};

// ─── Gallery ──────────────────────────────────────────────────────────────
const GallerySection = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const rows = buildRows(images);
  let fc = 0;

  return (
    <section id="gallery" className="py-24 md:py-32 overflow-hidden">
      <div className="px-6 md:px-12 lg:px-24">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="font-label text-xs text-primary mb-4 tracking-[0.25em] uppercase">Gallery</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tighter">Why Not Expect These...</h2>
        </motion.div>

        <div className="flex flex-col gap-3 md:gap-4">
          {rows.map((row, rowIdx) => {

            if (row.type === "full") {
              const { img, idx } = row.items[0];
              return (
                <Tile
                  key={`row-${rowIdx}`}
                  img={img} imgIdx={idx}
                  clip={clipFull}
                  aspect="aspect-[21/8]"
                  fi={fc++} delay={0.05}
                  onOpen={setLightbox}
                />
              );
            }

            // Pair row: left tile leans right, right tile leans left → ╱╲ chevron
            // No gap between them — the diagonal seams are designed to meet at centre
            return (
              <div key={`row-${rowIdx}`} className="grid grid-cols-2" style={{ gap: 0 }}>
                {row.items.map((item, colIdx) => {
                  const fi = fc++;
                  const kf = floats[fi % 4];
                  const clip = colIdx === 0 ? clipLeft : clipRight;
                  return (
                    <motion.div
                      key={item.idx}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.85, delay: colIdx * 0.13, ease: [0.22, 1, 0.36, 1] }}
                      animate={{
                        y: kf.y, x: kf.x,
                        transition: { duration: kf.dur, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" },
                      }}
                      className="relative cursor-pointer group w-full"
                      style={{ clipPath: clip }}
                      onClick={() => setLightbox(item.idx)}
                    >
                      <div className="aspect-[4/3] overflow-hidden w-full">
                        <img
                          src={item.img.src}
                          alt={item.img.alt}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          style={{ transform: "scale(1.1)" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-primary mb-1">{item.img.category}</p>
                          <p className="text-sm text-white/90 font-light">{item.img.alt}</p>
                        </div>
                        <div className="absolute inset-0 ring-inset ring-1 ring-primary/0 group-hover:ring-primary/40 transition-all duration-500" />
                      </div>
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
            key="lb"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-md flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white hover:border-primary hover:text-primary transition-colors z-10"
              onClick={() => setLightbox(null)} aria-label="Close"
            ><X size={18} /></button>

            <button
              className="absolute left-4 md:left-8 w-11 h-11 flex items-center justify-center rounded-full border border-white/20 text-white hover:border-primary hover:text-primary transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); setLightbox((p) => (p! > 0 ? p! - 1 : images.length - 1)); }}
              aria-label="Previous"
            ><ChevronLeft size={22} /></button>

            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              src={images[lightbox].src} alt={images[lightbox].alt}
              className="max-h-[85vh] max-w-[88vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="absolute bottom-14 left-1/2 -translate-x-1/2 text-center pointer-events-none"
            >
              <p className="text-[9px] tracking-[0.3em] uppercase text-primary font-mono mb-1">{images[lightbox].category}</p>
              <p className="text-sm text-white/70">{images[lightbox].alt}</p>
            </motion.div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === lightbox ? "bg-primary scale-125" : "bg-white/30 hover:bg-white/60"}`}
                />
              ))}
            </div>

            <button
              className="absolute right-4 md:right-8 w-11 h-11 flex items-center justify-center rounded-full border border-white/20 text-white hover:border-primary hover:text-primary transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); setLightbox((p) => (p! < images.length - 1 ? p! + 1 : 0)); }}
              aria-label="Next"
            ><ChevronRight size={22} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;