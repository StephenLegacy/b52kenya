import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MotionProps } from "framer-motion";
import {
  Wine, GlassWater, UtensilsCrossed, Sandwich,
  FileDown, Eye, X, ChevronLeft, ChevronRight,
  BookOpen, ArrowLeft,
} from "lucide-react";

// ─── Asset Imports ────────────────────────────────────────────────────────────
import menuPdf      from "../assets/B52 Bistro Food Menu 3.pdf";
import drinkMenuPdf from "../assets/B52 Bistro Drinks Menu.pdf";

// ─── Google Drive Download URLs ───────────────────────────────────────────────
const FOOD_DOWNLOAD_URL   = "https://drive.google.com/uc?export=download&id=1gBZ8HkWsj46gi4BQdoDeYG9KFHO24l4x";
const DRINKS_DOWNLOAD_URL = "https://drive.google.com/uc?export=download&id=17ZdbC0i2mPf_yWcn7ceEZf5TnZjdtymR";

// How many pages in the drinks PDF
const DRINKS_TOTAL_PAGES = 10; // <-- UPDATE THIS if the PDF changes!

// ─── Card Data ────────────────────────────────────────────────────────────────
const foodCards = [
  { icon: UtensilsCrossed, title: "Main Dishes",      description: "Bold flavours, artful presentation" },
  { icon: Sandwich,        title: "Bites & Platters", description: "Perfect for sharing"                },
];
const drinkCards = [
  { icon: Wine,       title: "Signature Cocktails", description: "Expertly crafted house specials"        },
  { icon: GlassWater, title: "Wines & Spirits",     description: "Curated selection from around the world" },
];

// ─── Fade-up helper ───────────────────────────────────────────────────────────
const fadeUp = (delay = 0): Pick<MotionProps,"initial"|"whileInView"|"viewport"|"transition"> => ({
  initial:     { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0  },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.6, delay, ease: "easeOut" },
});

// ═══════════════════════════════════════════════════════════════════
// SHARED MODAL SHELL
// Full-screen on mobile, centred sheet on desktop.
// Always has a visible top bar with title + close button.
// ═══════════════════════════════════════════════════════════════════
interface ModalShellProps {
  title: string;
  icon?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  downloadUrl?: string;
}
const ModalShell = ({ title, icon, onClose, children, maxWidth = "max-w-5xl", downloadUrl }: ModalShellProps) => {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      // full-screen backdrop — clicks outside content close it
      className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md flex flex-col md:items-center md:justify-center"
      onClick={onClose}
    >
      {/* ── content card ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        // On mobile: full viewport height. On md+: sheet with max dimensions.
        className={`
          relative flex flex-col w-full h-full
          md:h-auto md:${maxWidth} md:max-h-[92vh] md:rounded-2xl
          bg-[#111] border-t border-white/10 md:border md:border-white/10
          overflow-hidden shadow-2xl
        `}
        onClick={e => e.stopPropagation()}
      >
        {/* ── TOP BAR — always sticky, always visible ── */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-black/40 shrink-0 z-20">
          {/* Back / close — large tap target on mobile */}
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/5 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-200">
              <ArrowLeft size={14} />
            </span>
            <span className="text-xs font-label tracking-wider uppercase hidden sm:block">Back</span>
          </button>

          {/* Title */}
          <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            {icon && <span className="text-primary">{icon}</span>}
            <span className="font-label text-[10px] text-primary tracking-[0.22em] uppercase whitespace-nowrap">
              {title}
            </span>
          </div>

          {/* Download shortcut */}
          {downloadUrl && (
            <a
              href={downloadUrl}
              target="_blank" rel="noopener noreferrer"
              aria-label="Download PDF"
              className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/5 hover:bg-primary/20 hover:border-primary/40 transition-all duration-200 text-white/60 hover:text-primary"
            >
              <FileDown size={14} />
            </a>
          )}
        </div>

        {/* ── scrollable body ── */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// FOOD MENU MODAL  — simple single iframe, FitH
// ═══════════════════════════════════════════════════════════════════
const FoodMenuModal = ({ onClose }: { onClose: () => void }) => (
  <ModalShell
    title="B52 Bistro — Food Menu"
    icon={<UtensilsCrossed size={12} />}
    onClose={onClose}
    maxWidth="max-w-6xl"
    downloadUrl={FOOD_DOWNLOAD_URL}
  >
    <iframe
      src={`${menuPdf}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
      className="w-full h-full border-none block"
      title="B52 Bistro Food Menu"
      loading="lazy"
      style={{ minHeight: "100%" }}
    />
  </ModalShell>
);

// ═══════════════════════════════════════════════════════════════════
// DRINKS FLIPBOOK
// Strategy: one iframe at a time — show/hide via opacity + pointer-events.
// CSS page-flip animation on navigation.
// Mobile: single page, swipe-to-navigate.
// Desktop: two-page spread with book-spine.
// ═══════════════════════════════════════════════════════════════════

type FlipDir = "next" | "prev" | null;

const buildSrc = (base: string, page: number) =>
  `${base}#page=${page}&toolbar=0&navpanes=0&scrollbar=0&view=FitV&zoom=100`;

/** One iframe panel (left or right page) */
const PageIframe = ({
  src, page, visible, flipDir, side,
}: {
  src: string; page: number; visible: boolean;
  flipDir: FlipDir; side: "left" | "right" | "single";
}) => {
  const animKey = `${page}-${flipDir}`;
  return (
    <div
      key={animKey}
      className={`
        absolute inset-0 overflow-hidden bg-[#1a1a1a]
        transition-opacity duration-100
        ${visible ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}
        ${side === "left"   ? "rounded-l-xl" : ""}
        ${side === "right"  ? "rounded-r-xl" : ""}
        ${side === "single" ? "rounded-xl"   : ""}
      `}
      style={{
        animation: visible && flipDir
          ? `${flipDir === "next"
              ? (side === "left" ? "flipInL" : "flipInR")
              : (side === "left" ? "flipInR" : "flipInL")
            } 0.3s cubic-bezier(0.22,1,0.36,1) forwards`
          : undefined,
      }}
    >
      <iframe
        src={buildSrc(src, page)}
        title={`Page ${page}`}
        scrolling="no"
        loading="eager"
        style={{
          position: "absolute",
          top: "-16px", left: "-16px",
          width: "calc(100% + 32px)",
          height: "calc(100% + 32px)",
          border: "none",
          pointerEvents: "none",
        }}
      />
      {/* glass layer blocks iframe pointer events so our touch handlers work */}
      <div className="absolute inset-0 z-10" />
      {/* page number */}
      <span className={`
        absolute bottom-2.5 text-[9px] text-white/25 font-label tracking-widest z-20 select-none
        ${side === "right" ? "right-3" : "left-3"}
      `}>
        {page}
      </span>
    </div>
  );
};

const FlipBook = ({ src, totalPages, resetKey }: { src: string; totalPages: number; resetKey: number }) => {
  const [page, setPage]         = useState(1);   // always the LEFT/SINGLE page
  const [flipDir, setFlipDir]   = useState<FlipDir>(null);
  const [animating, setAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchX = useRef(0);

  // Reset on re-open
  useEffect(() => { setPage(1); setFlipDir(null); }, [resetKey]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const pps      = isMobile ? 1 : 2;   // pages per spread
  const maxPage  = isMobile ? totalPages : Math.floor((totalPages - 1) / 2) * 2 + 1;
  const rightPage = page + 1;
  const showRight = !isMobile && rightPage <= totalPages;
  const spreadIdx = isMobile ? page - 1 : Math.floor((page - 1) / 2);
  const totalSpreads = isMobile ? totalPages : Math.ceil(totalPages / 2);

  const go = useCallback((dir: 1 | -1) => {
    if (animating) return;
    const next = page + dir * pps;
    if (next < 1 || next > maxPage) return;
    setFlipDir(dir === 1 ? "next" : "prev");
    setAnimating(true);
    setPage(next);
    setTimeout(() => { setFlipDir(null); setAnimating(false); }, 320);
  }, [animating, page, pps, maxPage]);

  const goToSpread = (idx: number) => {
    if (animating) return;
    const target = isMobile ? idx + 1 : idx * 2 + 1;
    if (target === page) return;
    setFlipDir(target > page ? "next" : "prev");
    setAnimating(true);
    setPage(target);
    setTimeout(() => { setFlipDir(null); setAnimating(false); }, 320);
  };

  // Swipe
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    const diff = touchX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 44) go(diff > 0 ? 1 : -1);
  };

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go(1);
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   go(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go]);

  return (
    <>
      <style>{`
        @keyframes flipInR {
          from { transform: perspective(900px) rotateY(-35deg) translateX(-12px); opacity:0.15; }
          to   { transform: perspective(900px) rotateY(0)      translateX(0);     opacity:1;    }
        }
        @keyframes flipInL {
          from { transform: perspective(900px) rotateY(35deg)  translateX(12px); opacity:0.15; }
          to   { transform: perspective(900px) rotateY(0)      translateX(0);    opacity:1;    }
        }
      `}</style>

      <div
        className="flex flex-col items-center h-full gap-0 select-none overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* ── swipe hint (mobile only, fades after first interaction) ── */}
        {isMobile && page === 1 && (
          <motion.p
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="text-[10px] text-white/40 font-label tracking-widest uppercase py-2 shrink-0"
          >
            ← Swipe to flip →
          </motion.p>
        )}

        {/* ── book spread ── */}
        <div
          className="relative flex flex-1 min-h-0 w-full items-center justify-center px-3 md:px-6 py-2"
        >
          <div
            className="relative flex gap-0 shadow-2xl"
            style={{
              width:  isMobile ? "min(92vw, 380px)" : "min(82vw, 900px)",
              height: isMobile ? "min(65vh, 520px)"  : "min(68vh, 580px)",
            }}
          >
            {/* LEFT / SINGLE */}
            <div className="relative flex-1 h-full">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <PageIframe
                  key={p}
                  src={src}
                  page={p}
                  visible={p === page}
                  flipDir={p === page ? flipDir : null}
                  side={isMobile ? "single" : "left"}
                />
              ))}
            </div>

            {/* SPINE */}
            {showRight && (
              <div className="w-[3px] h-full shrink-0 z-20 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
            )}

            {/* RIGHT */}
            {!isMobile && (
              <div className="relative flex-1 h-full">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <PageIframe
                    key={p}
                    src={src}
                    page={p}
                    visible={p === rightPage}
                    flipDir={p === rightPage ? flipDir : null}
                    side="right"
                  />
                ))}
              </div>
            )}

            {/* edge vignettes */}
            <div className="absolute inset-y-0 left-0  w-5 bg-gradient-to-r from-black/50 to-transparent pointer-events-none rounded-l-xl z-30" />
            <div className="absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-black/50 to-transparent pointer-events-none rounded-r-xl z-30" />

            {/* ── prev / next tap zones (large, invisible) ── */}
            <button
              aria-label="Previous page"
              onClick={() => go(-1)}
              disabled={page === 1 || animating}
              className="absolute left-0 inset-y-0 w-1/4 z-40 cursor-pointer disabled:cursor-default"
            />
            <button
              aria-label="Next page"
              onClick={() => go(1)}
              disabled={page >= maxPage || animating}
              className="absolute right-0 inset-y-0 w-1/4 z-40 cursor-pointer disabled:cursor-default"
            />
          </div>
        </div>

        {/* ── bottom nav bar ── */}
        <div className="flex items-center justify-between w-full px-4 pb-4 pt-1 shrink-0 gap-3">

          {/* prev button */}
          <button
            onClick={() => go(-1)}
            disabled={page === 1 || animating}
            aria-label="Previous"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-white/10 bg-white/5
                       hover:bg-primary/20 hover:border-primary/40 transition-all duration-200
                       disabled:opacity-20 disabled:cursor-not-allowed shrink-0"
          >
            <ChevronLeft size={15} />
          </button>

          {/* dot pagination */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[60vw] py-1 scrollbar-none">
            {Array.from({ length: totalSpreads }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToSpread(i)}
                aria-label={`Go to page ${isMobile ? i + 1 : i * 2 + 1}`}
                className={`shrink-0 rounded-full transition-all duration-200 ${
                  spreadIdx === i
                    ? "w-5 h-1.5 bg-primary"
                    : "w-1.5 h-1.5 bg-white/20 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* next button */}
          <button
            onClick={() => go(1)}
            disabled={page >= maxPage || animating}
            aria-label="Next"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-white/10 bg-white/5
                       hover:bg-primary/20 hover:border-primary/40 transition-all duration-200
                       disabled:opacity-20 disabled:cursor-not-allowed shrink-0"
          >
            <ChevronRight size={15} />
          </button>
        </div>

        {/* page counter */}
        <p className="pb-3 text-[9px] text-white/25 font-label tracking-widest uppercase shrink-0">
          {isMobile
            ? `Page ${page} of ${totalPages}`
            : `${page}${showRight ? ` – ${rightPage}` : ""} / ${totalPages}`}
        </p>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════
// DRINKS MENU MODAL
// ═══════════════════════════════════════════════════════════════════
const DrinksMenuModal = ({ onClose, resetKey }: { onClose: () => void; resetKey: number }) => (
  <ModalShell
    title="B52 Bistro — Drinks Menu"
    icon={<Wine size={12} />}
    onClose={onClose}
    maxWidth="max-w-5xl"
    downloadUrl={DRINKS_DOWNLOAD_URL}
  >
    <FlipBook src={drinkMenuPdf} totalPages={DRINKS_TOTAL_PAGES} resetKey={resetKey} />
  </ModalShell>
);

// ═══════════════════════════════════════════════════════════════════
// MENU CARD
// ═══════════════════════════════════════════════════════════════════
const MenuCard = ({ icon: Icon, title, description, delay }: {
  icon: React.ElementType; title: string; description: string; delay: number;
}) => (
  <motion.div
    {...fadeUp(delay)}
    className="group surface-glass p-6 text-center transition-all duration-500
               hover:border-primary/30 hover:shadow-[inset_0_0_20px_hsl(355_83%_41%/0.08),0_0_25px_hsl(355_83%_41%/0.06)]"
  >
    <div className="relative mx-auto w-12 h-12 flex items-center justify-center mb-4">
      <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/10
                      transition-all duration-500 scale-75 group-hover:scale-100" />
      <Icon className="w-6 h-6 text-primary relative z-10 transition-transform duration-500
                        group-hover:scale-110 group-hover:-translate-y-0.5" />
    </div>
    <h3 className="text-sm font-bold tracking-tight mb-1">{title}</h3>
    <p className="text-xs text-muted-foreground">{description}</p>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════
const MenuSection = () => {
  const [foodOpen,        setFoodOpen]        = useState(false);
  const [drinksOpen,      setDrinksOpen]      = useState(false);
  const [drinksOpenCount, setDrinksOpenCount] = useState(0);

  const openDrinks = () => { setDrinksOpenCount(c => c + 1); setDrinksOpen(true); };

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = (foodOpen || drinksOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [foodOpen, drinksOpen]);

  return (
    <section id="menu" className="section-padding">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <motion.div {...fadeUp()} className="text-center mb-16">
          <p className="font-label text-xs text-primary mb-4 uppercase tracking-[0.2em]">Our Menu</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tighter">
            Explore the Menu
          </h2>
        </motion.div>

        {/* Two columns */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* ── FOOD ── */}
          <motion.div {...fadeUp(0.05)} className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <p className="font-label text-[10px] text-muted-foreground tracking-[0.22em] uppercase">Food</p>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {foodCards.map((c, i) => (
                <MenuCard key={c.title} {...c} delay={0.1 + i * 0.07} />
              ))}
            </div>

            <div className="flex gap-3 justify-center pt-1">
              <motion.button
                onClick={() => setFoodOpen(true)}
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.16 }}
                className="btn-hero-filled text-xs inline-flex items-center gap-2 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Eye size={13} className="relative z-10" />
                <span className="relative z-10">View Menu</span>
              </motion.button>
              <motion.a
                href={FOOD_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.16 }}
                className="btn-hero text-xs inline-flex items-center gap-2 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-primary/8 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <FileDown size={13} className="relative z-10 group-hover:translate-y-0.5 transition-transform" />
                <span className="relative z-10">Download</span>
              </motion.a>
            </div>
          </motion.div>

          {/* ── DRINKS ── */}
          <motion.div {...fadeUp(0.12)} className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <p className="font-label text-[10px] text-muted-foreground tracking-[0.22em] uppercase">Drinks</p>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {drinkCards.map((c, i) => (
                <MenuCard key={c.title} {...c} delay={0.16 + i * 0.07} />
              ))}
            </div>

            <div className="flex gap-3 justify-center pt-1">
              <motion.button
                onClick={openDrinks}
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.16 }}
                className="btn-hero-filled text-xs inline-flex items-center gap-2 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <BookOpen size={13} className="relative z-10" />
                <span className="relative z-10">View Menu</span>
              </motion.button>
              <motion.a
                href={DRINKS_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.16 }}
                className="btn-hero text-xs inline-flex items-center gap-2 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-primary/8 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <FileDown size={13} className="relative z-10 group-hover:translate-y-0.5 transition-transform" />
                <span className="relative z-10">Download</span>
              </motion.a>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {foodOpen   && <FoodMenuModal   key="food"   onClose={() => setFoodOpen(false)} />}
        {drinksOpen && <DrinksMenuModal key="drinks" onClose={() => setDrinksOpen(false)} resetKey={drinksOpenCount} />}
      </AnimatePresence>
    </section>
  );
};

export default MenuSection;