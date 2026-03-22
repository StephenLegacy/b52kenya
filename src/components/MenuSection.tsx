/**
 * MenuSection.tsx
 *
 * WHY THIS APPROACH:
 * ─────────────────
 * Browsers (especially mobile Safari/Chrome) block <iframe> rendering of
 * local PDF assets — they either pop open a download dialog, navigate away,
 * or show a blank screen with no way back.
 *
 * This component uses PDF.js to render every PDF page as a <canvas> element
 * entirely inside the React tree. No iframes, no navigation, no popups.
 * Works on every modern browser including iOS Safari.
 *
 * SETUP (one-time):
 * ─────────────────
 * 1. npm install pdfjs-dist
 * 2. Copy the worker to /public:
 *      cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/pdf.worker.min.mjs
 *    OR with Vite add to vite.config.ts:
 *      import { viteStaticCopy } from 'vite-plugin-static-copy'
 *      plugins: [viteStaticCopy({ targets: [{ src: 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs', dest: '' }] })]
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MotionProps } from "framer-motion";
import * as pdfjsLib from "pdfjs-dist";
import {
  Wine, GlassWater, UtensilsCrossed, Sandwich,
  FileDown, Eye, BookOpen, ArrowLeft,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
} from "lucide-react";

// ── PDF.js worker ─────────────────────────────────────────────────────────────
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// ── Asset imports ─────────────────────────────────────────────────────────────
import menuPdf      from "../assets/B52 Bistro Food Menu 3.pdf";
import drinkMenuPdf from "../assets/B52 Bistro Drinks Menu.pdf";

// ── Download URLs ─────────────────────────────────────────────────────────────
const FOOD_DOWNLOAD_URL   = "https://drive.google.com/uc?export=download&id=1gBZ8HkWsj46gi4BQdoDeYG9KFHO24l4x";
const DRINKS_DOWNLOAD_URL = "https://drive.google.com/uc?export=download&id=17ZdbC0i2mPf_yWcn7ceEZf5TnZjdtymR";

// ── Card data ─────────────────────────────────────────────────────────────────
const foodCards = [
  { icon: UtensilsCrossed, title: "Main Dishes",      description: "Bold flavours, artful presentation"    },
  { icon: Sandwich,        title: "Bites & Platters", description: "Perfect for sharing"                   },
];
const drinkCards = [
  { icon: Wine,       title: "Signature Cocktails", description: "Expertly crafted house specials"         },
  { icon: GlassWater, title: "Wines & Spirits",     description: "Curated selection from around the world" },
];

// ── Framer fade-up helper ─────────────────────────────────────────────────────
const fadeUp = (delay = 0): Pick<MotionProps,"initial"|"whileInView"|"viewport"|"transition"> => ({
  initial:     { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0  },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.6, delay, ease: "easeOut" },
});

// ═══════════════════════════════════════════════════════════════════════════════
// PDF PAGE CANVAS — renders one page via PDF.js onto a <canvas>
// ═══════════════════════════════════════════════════════════════════════════════
interface PdfPageProps {
  pdfDoc: pdfjsLib.PDFDocumentProxy;
  pageNum: number;
  scale: number;
}

const PdfPage = ({ pdfDoc, pageNum, scale }: PdfPageProps) => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const renderTask = useRef<pdfjsLib.RenderTask | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const page     = await pdfDoc.getPage(pageNum);
        if (cancelled) return;
        const viewport = page.getViewport({ scale });
        const canvas   = canvasRef.current;
        if (!canvas) return;
        const ctx      = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width  = viewport.width;
        canvas.height = viewport.height;

        renderTask.current?.cancel();
        renderTask.current = page.render({ canvasContext: ctx, canvas, viewport });
        await renderTask.current.promise;
      } catch { /* cancelled */ }
    })();

    return () => { cancelled = true; renderTask.current?.cancel(); };
  }, [pdfDoc, pageNum, scale]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "auto" }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PDF VIEWER — loads the doc, handles page nav, zoom, swipe, keyboard
// ═══════════════════════════════════════════════════════════════════════════════
interface PdfViewerProps {
  src: string;
  resetKey: number;
  twoPage?: boolean;
}

const PdfViewer = ({ src, resetKey, twoPage = false }: PdfViewerProps) => {
  const [pdfDoc,     setPdfDoc]     = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [page,       setPage]       = useState(1);
  const [scale,      setScale]      = useState(1.4);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [isMobile,   setIsMobile]   = useState(false);
  const [flipDir,    setFlipDir]    = useState<"next"|"prev"|null>(null);
  const [animating,  setAnimating]  = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchX    = useRef(0);
  const touchY    = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Load PDF document
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPage(1);

    (async () => {
      try {
        const doc = await pdfjsLib.getDocument(src).promise;
        if (cancelled) return;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setLoading(false);
      } catch {
        if (!cancelled) {
          setError("Could not load PDF. Please use the download button instead.");
          setLoading(false);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [src]);

  // Reset to page 1 on re-open
  useEffect(() => {
    setPage(1);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [resetKey]);

  const pps       = !isMobile && twoPage ? 2 : 1;
  const maxPage   = pps === 2 ? Math.max(1, (Math.ceil(totalPages / 2) * 2 - 1)) : totalPages;
  const rightPage = page + 1;
  const showRight = pps === 2 && rightPage <= totalPages;
  const spreadIdx = pps === 2 ? Math.floor((page - 1) / 2) : page - 1;
  const totalSpreads = pps === 2 ? Math.ceil(totalPages / 2) : totalPages;

  const go = useCallback((dir: 1 | -1) => {
    if (animating || !pdfDoc) return;
    const next = page + dir * pps;
    if (next < 1 || next > maxPage) return;
    setFlipDir(dir === 1 ? "next" : "prev");
    setAnimating(true);
    setPage(next);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => { setFlipDir(null); setAnimating(false); }, 340);
  }, [animating, page, pps, maxPage, pdfDoc]);

  // Keyboard navigation
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go(1);
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   go(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [go]);

  // Touch swipe — only horizontal swipes trigger page turns
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
    touchY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = touchX.current - e.changedTouches[0].clientX;
    const dy = Math.abs(touchY.current - e.changedTouches[0].clientY);
    // Only treat as swipe if horizontal movement dominates
    if (Math.abs(dx) > 50 && Math.abs(dx) > dy * 1.5) go(dx > 0 ? 1 : -1);
  };

  const jumpToSpread = (idx: number) => {
    if (animating || !pdfDoc) return;
    const target = pps === 2 ? idx * 2 + 1 : idx + 1;
    if (target === page) return;
    setFlipDir(target > page ? "next" : "prev");
    setAnimating(true);
    setPage(target);
    scrollRef.current?.scrollTo({ top: 0 });
    setTimeout(() => { setFlipDir(null); setAnimating(false); }, 340);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-white/40">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 rounded-full border-2 border-white/10 border-t-primary"
      />
      <p className="text-[10px] font-label tracking-widest uppercase">Loading menu…</p>
    </div>
  );

  if (error || !pdfDoc) return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
      <p className="text-white/50 text-sm leading-relaxed">{error}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Zoom bar ── */}
      <div
        className="flex items-center justify-center gap-3 py-2 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <button
          onClick={() => setScale(s => Math.max(0.5, +(s - 0.2).toFixed(1)))}
          aria-label="Zoom out"
          className="flex items-center justify-center w-9 h-9 rounded-full text-white/50 hover:text-primary active:scale-95 transition-all duration-150"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <ZoomOut size={15} />
        </button>
        <span className="text-[10px] font-label text-white/25 w-10 text-center select-none">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => setScale(s => Math.min(3.5, +(s + 0.2).toFixed(1)))}
          aria-label="Zoom in"
          className="flex items-center justify-center w-9 h-9 rounded-full text-white/50 hover:text-primary active:scale-95 transition-all duration-150"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <ZoomIn size={15} />
        </button>
      </div>

      {/* ── Scrollable canvas area ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
      >
        {isMobile && page === 1 && (
          <p className="text-center text-[10px] text-white/20 font-label tracking-widest uppercase pt-3 pb-1 pointer-events-none">
            ← swipe to flip →
          </p>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{
              opacity: 0,
              x: flipDir === "next" ? 36 : flipDir === "prev" ? -36 : 0,
            }}
            animate={{ opacity: 1, x: 0 }}
            exit={{
              opacity: 0,
              x: flipDir === "next" ? -36 : 36,
            }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center gap-0 px-3 py-3"
          >
            {/* Left / Single page */}
            <div
              className={`bg-white overflow-hidden ${showRight ? "rounded-l-sm w-1/2 max-w-[420px]" : "rounded-sm w-full max-w-[500px]"}`}
              style={{
                boxShadow: showRight
                  ? "4px 0 24px rgba(0,0,0,0.55), 0 8px 32px rgba(0,0,0,0.4)"
                  : "0 8px 40px rgba(0,0,0,0.55)",
              }}
            >
              <PdfPage pdfDoc={pdfDoc} pageNum={page} scale={scale} />
            </div>

            {/* Spine */}
            {showRight && (
              <div
                className="w-[3px] shrink-0 self-stretch"
                style={{
                  background: "linear-gradient(to right, rgba(0,0,0,0.45), rgba(0,0,0,0.1), rgba(255,255,255,0.04))",
                  boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                }}
              />
            )}

            {/* Right page */}
            {showRight && (
              <div
                className="bg-white overflow-hidden rounded-r-sm w-1/2 max-w-[420px]"
                style={{ boxShadow: "-4px 0 24px rgba(0,0,0,0.55), 0 8px 32px rgba(0,0,0,0.4)" }}
              >
                <PdfPage pdfDoc={pdfDoc} pageNum={rightPage} scale={scale} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom nav — py-4 gives comfortable tap targets; safe-area handled by modal shell ── */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-4 shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.5)" }}
      >
        <button
          onClick={() => go(-1)}
          disabled={page === 1 || animating}
          aria-label="Previous"
          className="flex items-center justify-center w-11 h-11 rounded-full border border-white/10 bg-white/5
                     hover:bg-primary/20 hover:border-primary/40 active:scale-95 transition-all duration-200
                     disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Dot indicators */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto py-1 flex-1 justify-center"
          style={{ scrollbarWidth: "none" }}
        >
          {Array.from({ length: totalSpreads }).map((_, i) => (
            <button
              key={i}
              onClick={() => jumpToSpread(i)}
              aria-label={`Go to spread ${i + 1}`}
              className={`shrink-0 rounded-full transition-all duration-200 ${
                spreadIdx === i
                  ? "w-5 h-1.5 bg-primary"
                  : "w-1.5 h-1.5 bg-white/20 hover:bg-white/50"
              }`}
              style={spreadIdx === i ? { boxShadow: "0 0 8px hsl(var(--primary)/0.5)" } : {}}
            />
          ))}
        </div>

        <button
          onClick={() => go(1)}
          disabled={page >= maxPage || animating}
          aria-label="Next"
          className="flex items-center justify-center w-11 h-11 rounded-full border border-white/10 bg-white/5
                     hover:bg-primary/20 hover:border-primary/40 active:scale-95 transition-all duration-200
                     disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Page counter */}
      <p className="text-center pb-2.5 text-[9px] text-white/20 font-label tracking-widest uppercase shrink-0">
        {showRight
          ? `Pages ${page} – ${rightPage} of ${totalPages}`
          : `Page ${page} of ${totalPages}`}
      </p>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MODAL SHELL
// ═══════════════════════════════════════════════════════════════════════════════
interface ModalShellProps {
  title: string;
  icon?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  downloadUrl?: string;
}

const ModalShell = ({ title, icon, onClose, children, maxWidth = "max-w-5xl", downloadUrl }: ModalShellProps) => {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      /* z-[80] is ABOVE the navbar (z-50). On mobile the modal is truly full-screen
         but we push the inner card down by the navbar height so the top bar is never
         hidden behind the nav pill. On desktop it centres as a floating sheet. */
      className="fixed inset-0 z-[80] flex flex-col md:items-center md:justify-center"
      style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(20px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 44 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 44 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`
          relative flex flex-col w-full
          md:h-auto md:${maxWidth} md:max-h-[96vh] md:rounded-2xl
          overflow-hidden
          [padding-top:72px] md:[padding-top:0px]
          [padding-bottom:env(safe-area-inset-bottom,16px)] md:[padding-bottom:0px]
        `}
        style={{
          /* Mobile: top offset clears the floating navbar (~72px nav + breathing room).
             Bottom padding respects iOS Safari home bar via env(safe-area-inset-bottom).
             On md+, height/padding are reset by the className rules. */
          height: "100dvh",
          background: "#111",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between gap-3 px-4 py-3 shrink-0 z-20 relative"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.6)" }}
        >
          {/* Back button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex items-center gap-2 group"
          >
            <span
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <ArrowLeft size={15} className="text-white/60 group-hover:text-primary transition-colors" />
            </span>
            <span className="text-[11px] font-label tracking-wider uppercase text-white/35 group-hover:text-white/60 transition-colors hidden sm:block">
              Back
            </span>
          </button>

          {/* Centred title */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
            {icon && <span style={{ color: "hsl(var(--primary))" }}>{icon}</span>}
            <span
              className="font-label text-[10px] tracking-[0.22em] uppercase whitespace-nowrap"
              style={{ color: "hsl(var(--primary))" }}
            >
              {title}
            </span>
          </div>

          {/* Download */}
          {downloadUrl && (
            <a
              href={downloadUrl}
              target="_blank" rel="noopener noreferrer"
              aria-label="Download PDF"
              className="flex items-center justify-center w-9 h-9 rounded-full text-white/40 hover:text-primary transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <FileDown size={14} />
            </a>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MODALS
// ═══════════════════════════════════════════════════════════════════════════════
const FoodMenuModal = ({ onClose, resetKey }: { onClose: () => void; resetKey: number }) => (
  <ModalShell
    title="B52 Bistro — Food Menu"
    icon={<UtensilsCrossed size={12} />}
    onClose={onClose}
    maxWidth="max-w-4xl"
    downloadUrl={FOOD_DOWNLOAD_URL}
  >
    <PdfViewer src={menuPdf} resetKey={resetKey} twoPage={false} />
  </ModalShell>
);

const DrinksMenuModal = ({ onClose, resetKey }: { onClose: () => void; resetKey: number }) => (
  <ModalShell
    title="B52 Bistro — Drinks Menu"
    icon={<Wine size={12} />}
    onClose={onClose}
    maxWidth="max-w-7xl"
    downloadUrl={DRINKS_DOWNLOAD_URL}
  >
    <PdfViewer src={drinkMenuPdf} resetKey={resetKey} twoPage={true} />
  </ModalShell>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MENU CARD
// ═══════════════════════════════════════════════════════════════════════════════
const MenuCard = ({ icon: Icon, title, description, delay }: {
  icon: React.ElementType; title: string; description: string; delay: number;
}) => (
  <motion.div
    {...fadeUp(delay)}
    className="group surface-glass p-6 text-center transition-all duration-500
               hover:border-primary/30 hover:shadow-[inset_0_0_20px_hsl(355_83%_41%/0.08),0_0_25px_hsl(355_83%_41%/0.06)]"
  >
    <div className="relative mx-auto w-12 h-12 flex items-center justify-center mb-4">
      <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/10 transition-all duration-500 scale-75 group-hover:scale-100" />
      <Icon className="w-6 h-6 text-primary relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-0.5" />
    </div>
    <h3 className="text-sm font-bold tracking-tight mb-1">{title}</h3>
    <p className="text-xs text-muted-foreground">{description}</p>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SECTION
// ═══════════════════════════════════════════════════════════════════════════════
const MenuSection = () => {
  const [foodOpen,        setFoodOpen]        = useState(false);
  const [drinksOpen,      setDrinksOpen]      = useState(false);
  const [foodOpenCount,   setFoodOpenCount]   = useState(0);
  const [drinksOpenCount, setDrinksOpenCount] = useState(0);

  const openFood   = () => { setFoodOpenCount(c => c + 1);   setFoodOpen(true);   };
  const openDrinks = () => { setDrinksOpenCount(c => c + 1); setDrinksOpen(true); };

  useEffect(() => {
    document.body.style.overflow = (foodOpen || drinksOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [foodOpen, drinksOpen]);

  return (
    <section id="menu" className="section-padding">
      <div className="max-w-7xl mx-auto">

        <motion.div {...fadeUp()} className="text-center mb-16">
          <p className="font-label text-xs text-primary mb-4 uppercase tracking-[0.2em]">Our Menu</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tighter">
            Explore the Menu
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* FOOD */}
          <motion.div {...fadeUp(0.05)} className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <p className="font-label text-[10px] text-muted-foreground tracking-[0.22em] uppercase">Food</p>
              <div className="flex-1 h-px bg-white/8" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {foodCards.map((c, i) => <MenuCard key={c.title} {...c} delay={0.1 + i * 0.07} />)}
            </div>
            <div className="flex gap-3 justify-center pt-1">
              <motion.button
                onClick={openFood}
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                className="btn-hero-filled text-xs inline-flex items-center gap-2 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Eye size={13} className="relative z-10" />
                <span className="relative z-10">View Menu</span>
              </motion.button>
              <motion.a
                href={FOOD_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                className="btn-hero text-xs inline-flex items-center gap-2 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-primary/8 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <FileDown size={13} className="relative z-10 group-hover:translate-y-0.5 transition-transform" />
                <span className="relative z-10">Download</span>
              </motion.a>
            </div>
          </motion.div>

          {/* DRINKS */}
          <motion.div {...fadeUp(0.12)} className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <p className="font-label text-[10px] text-muted-foreground tracking-[0.22em] uppercase">Drinks</p>
              <div className="flex-1 h-px bg-white/8" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {drinkCards.map((c, i) => <MenuCard key={c.title} {...c} delay={0.16 + i * 0.07} />)}
            </div>
            <div className="flex gap-3 justify-center pt-1">
              <motion.button
                onClick={openDrinks}
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                className="btn-hero-filled text-xs inline-flex items-center gap-2 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <BookOpen size={13} className="relative z-10" />
                <span className="relative z-10">View Menu</span>
              </motion.button>
              <motion.a
                href={DRINKS_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
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

      <AnimatePresence>
        {foodOpen   && <FoodMenuModal   key="food"   onClose={() => setFoodOpen(false)}   resetKey={foodOpenCount}   />}
        {drinksOpen && <DrinksMenuModal key="drinks" onClose={() => setDrinksOpen(false)} resetKey={drinksOpenCount} />}
      </AnimatePresence>
    </section>
  );
};

export default MenuSection;