import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MotionProps } from "framer-motion";
import {
  Wine, GlassWater, UtensilsCrossed, Sandwich,
  FileDown, Eye, X, ChevronLeft, ChevronRight,
} from "lucide-react";

// ─── Asset Imports ────────────────────────────────────────────────────────────
import menuPdf      from "../assets/B52 Bistro Food Menu 3.pdf";
import drinkMenuPdf from "../assets/B52 Bistro Drinks Menu.pdf"; // <-- add your drinks PDF here

// ─── Google Drive Download URLs ───────────────────────────────────────────────
const FOOD_DOWNLOAD_URL   = "https://drive.google.com/uc?export=download&id=YOUR_FOOD_FILE_ID";
const DRINKS_DOWNLOAD_URL = "https://drive.google.com/uc?export=download&id=YOUR_DRINKS_FILE_ID";

// ─── Card Data ────────────────────────────────────────────────────────────────
const foodCards = [
  { icon: UtensilsCrossed, title: "Main Dishes",     description: "Bold flavors, artful presentation" },
  { icon: Sandwich,        title: "Bites & Platters", description: "Perfect for sharing"               },
];

const drinkCards = [
  { icon: Wine,       title: "Signature Cocktails", description: "Expertly crafted house specials"       },
  { icon: GlassWater, title: "Wines & Spirits",     description: "Curated selection from around the world" },
];

// ─── Subtle stagger helper ────────────────────────────────────────────────────
// We return an explicit MotionProps shape so TypeScript is fully satisfied
// when the object is spread onto <motion.div {...fadeUp()} />.
// Using the "cubicBezier()" string form avoids the number[] → Easing conflict.
const fadeUp = (delay = 0): Pick<MotionProps, "initial" | "whileInView" | "viewport" | "transition"> => ({
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0  },
  viewport:    { once: true, margin: "-60px" as const },
  transition:  { duration: 0.65, delay, ease: "easeOut" },
});

// ═════════════════════════════════════════════════════════════════════════════
// FOOD MENU MODAL  (landscape iframe, #view=FitH)
// ═════════════════════════════════════════════════════════════════════════════
const FoodMenuModal = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[70] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
    onClick={onClose}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1,    y: 0  }}
      exit={{    opacity: 0, scale: 0.96, y: 16 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
      /* wide landscape container */
      className="relative w-full max-w-6xl surface-glass rounded-xl overflow-hidden flex flex-col"
      style={{ height: "min(90vh, 720px)" }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/20 shrink-0">
        <span className="font-label text-[10px] text-primary tracking-[0.25em] uppercase">
          B52 Bistro — Food Menu
        </span>
        <button onClick={onClose} className="p-1.5 hover:bg-white/8 rounded-full transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* landscape PDF viewer — FitH keeps it wide */}
      <div className="flex-1 bg-[#2b2b2b]">
        <iframe
          src={`${menuPdf}#view=FitH&toolbar=0&navpanes=0`}
          className="w-full h-full border-none"
          title="B52 Bistro Food Menu"
          loading="lazy"
        />
      </div>
    </motion.div>
  </motion.div>
);

// ═════════════════════════════════════════════════════════════════════════════
// DRINKS MENU — pre-load every page as a hidden iframe, flip = CSS only
// Strategy: mount ALL page iframes at once (display:none) so the browser
// pre-loads them. On flip we simply show the right one + run a CSS animation.
// Zero canvas sizing math, zero blank pages, instant navigation.
// ═════════════════════════════════════════════════════════════════════════════

// Set this to your drinks menu's actual page count
const DRINKS_TOTAL_PAGES = 12;

// FitV fits the page to the iframe height — no next-page bleed.
// zoom=100 is a fallback for browsers that ignore FitV.
const pageUrl = (src: string, page: number) =>
  `${src}#page=${page}&toolbar=0&navpanes=0&scrollbar=0&view=FitV&zoom=100&pagemode=none`;

// ─── Pre-loaded page grid (all iframes in DOM, only active ones visible) ─────
interface PagePanelProps {
  src: string;
  pageNum: number;
  totalPages: number;
  active: boolean;
  side: "left" | "right" | "single";
  animating: boolean;
  direction: number;
}

const PagePanel = ({ src, pageNum, active, side, animating, direction }: PagePanelProps) => {
  const roundedClass =
    side === "left"   ? "rounded-l-lg" :
    side === "right"  ? "rounded-r-lg" : "rounded-lg";

  const animClass = (() => {
    if (!animating || !active) return "";
    return direction > 0 ? "animate-flip-in-right" : "animate-flip-in-left";
  })();

  return (
    <div
      className={`
        absolute inset-0
        bg-[#141414] ${roundedClass}
        overflow-hidden border border-white/5 shadow-2xl
        transition-opacity duration-100
        ${active ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}
        ${animClass}
      `}
    >
      {/*
        Oversize the iframe by 40px on all sides and centre it.
        The parent's overflow-hidden clips every scrollbar edge completely.
        pointerEvents:none means the PDF viewer's internal scroll is unreachable.
      */}
      <iframe
        src={pageUrl(src, pageNum)}
        title={`Drinks menu page ${pageNum}`}
        loading="eager"
        scrolling="no"
        style={{
          position: "absolute",
          top: "-20px", left: "-20px",
          width: "calc(100% + 40px)",
          height: "calc(100% + 40px)",
          border: "none",
          pointerEvents: "none",
        }}
      />

      {/* Full-cover glass — blocks any accidental iframe interaction */}
      <div className="absolute inset-0 z-10" style={{ pointerEvents: active ? "auto" : "none" }} />

      <span className={`
        absolute bottom-2 text-[9px] text-white/20 font-label tracking-widest
        pointer-events-none select-none z-20
        ${side === "right" ? "right-2.5" : "left-2.5"}
      `}>
        {pageNum}
      </span>
    </div>
  );
};

// ─── FlipBook ────────────────────────────────────────────────────────────────
// FlipBook resets to page 1 whenever `resetKey` changes (i.e. modal re-opens)
const FlipBook = ({ src, totalPages, resetKey }: { src: string; totalPages: number; resetKey: number }) => {
  const [spread,    setSpread]    = useState(0);
  const [prevSpread,setPrevSpread]= useState(-1);
  const [direction, setDirection] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [isMobile,  setIsMobile]  = useState(false);

  // Always start at page 1 when modal opens
  useEffect(() => { setSpread(0); setAnimating(false); }, [resetKey]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const pps       = isMobile ? 1 : 2;
  const maxSpread = Math.max(0, Math.floor((totalPages - 1) / pps) * pps);
  const spreadCount = Math.ceil(totalPages / pps);

  const go = (dir: number) => {
    if (animating) return;
    const next = spread + dir * pps;
    if (next < 0 || next > maxSpread) return;
    setDirection(dir);
    setPrevSpread(spread);
    setAnimating(true);
    setSpread(next);
    setTimeout(() => { setAnimating(false); setPrevSpread(-1); }, 420);
  };

  const touchStartX = useRef(0);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (Math.abs(e.deltaY) < 30 && Math.abs(e.deltaX) < 30) return;
    go(e.deltaY > 0 || e.deltaX > 0 ? 1 : -1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) go(diff > 0 ? 1 : -1);
  };

  const leftPage  = spread + 1;
  const rightPage = spread + 2;

  return (
    <>
      {/* keyframe injection — done once in the DOM */}
      <style>{`
        @keyframes flipInRight {
          from { transform: perspective(1200px) rotateY(55deg) translateX(8px); opacity: 0.2; }
          to   { transform: perspective(1200px) rotateY(0deg)  translateX(0);   opacity: 1;   }
        }
        @keyframes flipInLeft {
          from { transform: perspective(1200px) rotateY(-55deg) translateX(-8px); opacity: 0.2; }
          to   { transform: perspective(1200px) rotateY(0deg)   translateX(0);    opacity: 1;   }
        }
        .animate-flip-in-right { animation: flipInRight 0.28s cubic-bezier(0.22,1,0.36,1) forwards; transform-origin: left center; }
        .animate-flip-in-left  { animation: flipInLeft  0.28s cubic-bezier(0.22,1,0.36,1) forwards; transform-origin: right center; }
      `}</style>

      <div className="flex flex-col items-center justify-center h-full gap-3 px-2 py-3 select-none overflow-hidden">

        {/* ── book spread ── */}
        <div
          className="relative flex gap-0 shrink-0"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            width:  isMobile ? "min(88vw,340px)"  : "min(80vw,860px)",
            height: isMobile ? "min(72vh,500px)"  : "min(74vh,580px)",
          }}
        >
          {/* LEFT / SINGLE slot — ALL pages stack here, active prop shows the right one */}
          <div className="relative flex-1 h-full">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <PagePanel
                key={p}
                src={src}
                pageNum={p}
                totalPages={totalPages}
                active={p === leftPage}
                side={isMobile ? "single" : "left"}
                animating={animating && p === leftPage}
                direction={direction}
              />
            ))}
          </div>

          {/* spine */}
          {!isMobile && rightPage <= totalPages && (
            <div className="w-[2px] h-full bg-gradient-to-b from-black/70 via-white/5 to-black/70 shrink-0 z-20" />
          )}

          {/* RIGHT slot — ALL pages stack here, active prop shows the right one */}
          {!isMobile && (
            <div className="relative flex-1 h-full">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <PagePanel
                  key={p}
                  src={src}
                  pageNum={p}
                  totalPages={totalPages}
                  active={p === rightPage}
                  side="right"
                  animating={animating && p === rightPage}
                  direction={direction}
                />
              ))}
            </div>
          )}

          {/* depth vignette */}
          <div className="absolute inset-y-0 left-0  w-6 bg-gradient-to-r from-black/40 to-transparent pointer-events-none rounded-l-lg z-30" />
          <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/40 to-transparent pointer-events-none rounded-r-lg z-30" />
        </div>

        {/* ── nav ── */}
        <div className="flex items-center gap-5 shrink-0">
          <button onClick={() => go(-1)} disabled={spread === 0 || animating}
            className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/40 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed">
            <ChevronLeft size={15} />
          </button>

          <div className="flex gap-1.5">
            {Array.from({ length: spreadCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (animating) return;
                  const target = i * pps;
                  setDirection(target > spread ? 1 : -1);
                  setPrevSpread(spread);
                  setAnimating(true);
                  setSpread(target);
                  setTimeout(() => { setAnimating(false); setPrevSpread(-1); }, 420);
                }}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  Math.floor(spread / pps) === i ? "w-5 bg-primary" : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <button onClick={() => go(1)} disabled={spread >= maxSpread || animating}
            className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/40 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed">
            <ChevronRight size={15} />
          </button>
        </div>

        <p className="text-[9px] text-white/20 font-label tracking-widest uppercase shrink-0">
          {isMobile
            ? `Page ${leftPage} of ${totalPages}`
            : `Pages ${leftPage}${rightPage <= totalPages ? ` – ${rightPage}` : ""} of ${totalPages}`}
        </p>
      </div>
    </>
  );
};

const DrinksMenuModal = ({ onClose, resetKey }: { onClose: () => void; resetKey: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[70] bg-background/97 backdrop-blur-md flex items-center justify-center p-3 md:p-6"
    onClick={onClose}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1,    y: 0  }}
      exit={{    opacity: 0, scale: 0.94, y: 20 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
      className="relative w-full max-w-5xl surface-glass rounded-xl overflow-hidden flex flex-col"
      style={{ height: "min(94vh, 780px)" }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/25 shrink-0">
        <div className="flex items-center gap-2.5">
          <Wine size={13} className="text-primary" />
          <span className="font-label text-[10px] text-primary tracking-[0.25em] uppercase">
            B52 Bistro — Drinks Menu
          </span>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-white/8 rounded-full transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* flip book */}
      <div className="flex-1 overflow-hidden">
        <FlipBook src={drinkMenuPdf} totalPages={DRINKS_TOTAL_PAGES} resetKey={resetKey} />
      </div>
    </motion.div>
  </motion.div>
);

// ═════════════════════════════════════════════════════════════════════════════
// MAIN SECTION
// ═════════════════════════════════════════════════════════════════════════════
const MenuSection = () => {
  const [foodOpen,       setFoodOpen]       = useState(false);
  const [drinksOpen,     setDrinksOpen]     = useState(false);
  const [drinksOpenCount,setDrinksOpenCount]= useState(0);

  const openDrinks = () => { setDrinksOpenCount(c => c + 1); setDrinksOpen(true); };

  // lock scroll when any modal is open
  useEffect(() => {
    document.body.style.overflow = foodOpen || drinksOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [foodOpen, drinksOpen]);

  return (
    <section id="menu" className="section-padding">
      <div className="max-w-7xl mx-auto">

        {/* ── heading ── */}
        <motion.div {...fadeUp()} className="text-center mb-16">
          <p className="font-label text-xs text-primary mb-4 uppercase tracking-[0.2em]">Our Menu</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tighter">
            Explore the Menu
          </h2>
        </motion.div>

        {/* ── two menu columns ── */}
        <div className="grid md:grid-cols-2 gap-10 mb-0">

          {/* FOOD */}
          <motion.div {...fadeUp(0.05)} className="flex flex-col gap-5">
            <p className="font-label text-[10px] text-muted-foreground tracking-[0.22em] uppercase">Food</p>

            <div className="grid sm:grid-cols-2 gap-4">
              {foodCards.map((card, i) => (
                <motion.div
                  key={card.title}
                  {...fadeUp(0.1 + i * 0.08)}
                  className="group surface-glass p-6 text-center transition-all duration-500
                             hover:border-primary/30 hover:shadow-[inset_0_0_20px_hsl(355_83%_41%/0.08),0_0_25px_hsl(355_83%_41%/0.06)]"
                >
                  <div className="relative mx-auto w-12 h-12 flex items-center justify-center mb-4">
                    <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/10
                                    transition-all duration-500 scale-75 group-hover:scale-100" />
                    <card.icon className="w-6 h-6 text-primary relative z-10 transition-transform duration-500
                                          group-hover:scale-110 group-hover:-translate-y-0.5" />
                  </div>
                  <h3 className="text-sm font-bold tracking-tight mb-1">{card.title}</h3>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3 pt-1 justify-center">
              <motion.button
                onClick={() => setFoodOpen(true)}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="btn-hero-filled text-xs inline-flex items-center gap-2 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <Eye size={13} className="relative z-10 transition-transform duration-300 group-hover:scale-110" />
                <span className="relative z-10">View Menu</span>
              </motion.button>
              <motion.a
                href={FOOD_DOWNLOAD_URL}
                target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="btn-hero text-xs inline-flex items-center gap-2 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-primary/8 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <FileDown size={13} className="relative z-10 transition-transform duration-300 group-hover:translate-y-0.5" />
                <span className="relative z-10">Download</span>
              </motion.a>
            </div>
          </motion.div>

          {/* DRINKS */}
          <motion.div {...fadeUp(0.12)} className="flex flex-col gap-5">
            <p className="font-label text-[10px] text-muted-foreground tracking-[0.22em] uppercase">Drinks</p>

            <div className="grid sm:grid-cols-2 gap-4">
              {drinkCards.map((card, i) => (
                <motion.div
                  key={card.title}
                  {...fadeUp(0.16 + i * 0.08)}
                  className="group surface-glass p-6 text-center transition-all duration-500
                             hover:border-primary/30 hover:shadow-[inset_0_0_20px_hsl(355_83%_41%/0.08),0_0_25px_hsl(355_83%_41%/0.06)]"
                >
                  <div className="relative mx-auto w-12 h-12 flex items-center justify-center mb-4">
                    <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/10
                                    transition-all duration-500 scale-75 group-hover:scale-100" />
                    <card.icon className="w-6 h-6 text-primary relative z-10 transition-transform duration-500
                                          group-hover:scale-110 group-hover:-translate-y-0.5" />
                  </div>
                  <h3 className="text-sm font-bold tracking-tight mb-1">{card.title}</h3>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3 pt-1 justify-center">
              <motion.button
                onClick={() => openDrinks()}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="btn-hero-filled text-xs inline-flex items-center gap-2 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <Eye size={13} className="relative z-10 transition-transform duration-300 group-hover:scale-110" />
                <span className="relative z-10">View Menu</span>
              </motion.button>
              <motion.a
                href={DRINKS_DOWNLOAD_URL}
                target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="btn-hero text-xs inline-flex items-center gap-2 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-primary/8 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <FileDown size={13} className="relative z-10 transition-transform duration-300 group-hover:translate-y-0.5" />
                <span className="relative z-10">Download</span>
              </motion.a>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── modals ── */}
      <AnimatePresence>
        {foodOpen   && <FoodMenuModal   onClose={() => setFoodOpen(false)}   />}
        {drinksOpen && <DrinksMenuModal onClose={() => setDrinksOpen(false)} resetKey={drinksOpenCount} />}
      </AnimatePresence>
    </section>
  );
};

export default MenuSection;