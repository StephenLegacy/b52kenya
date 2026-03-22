import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "About",        href: "#about"      },
  { label: "Experience",   href: "#experience" },
  { label: "Gallery",      href: "#gallery"    },
  { label: "Menu",         href: "#menu"       },
  { label: "Order Online", href: "#order"      },
  { label: "Contact",      href: "#contact"    },
];

// ── Scroll progress ──────────────────────────────────────────────────────────
const useScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return scrollYProgress;
};

// ── Magnetic hook ────────────────────────────────────────────────────────────
function useMagnetic(strength = 0.3) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 20 });
  const sy = useSpring(y, { stiffness: 220, damping: 20 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      x.set((e.clientX - r.left - r.width / 2) * strength);
      y.set((e.clientY - r.top - r.height / 2) * strength);
    };
    const leave = () => { x.set(0); y.set(0); };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [strength]);

  return { ref, sx, sy };
}

// ── Desktop nav link — glass pill on hover ────────────────────────────────────
const NavLink = ({ label, href, index, isActive, onClick }: {
  label: string; href: string; index: number; isActive: boolean; onClick?: () => void;
}) => {
  const [hov, setHov] = useState(false);

  return (
    <motion.a
      href={href}
      onClick={onClick}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08 + index * 0.055, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{ textDecoration: "none" }}
    >
      {/* glass pill bg */}
      <motion.span
        className="absolute inset-0 rounded-full"
        animate={{
          background: hov
            ? "rgba(255,255,255,0.08)"
            : isActive
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0)",
          boxShadow: hov
            ? "inset 0 0 0 1px rgba(255,255,255,0.12), 0 4px 16px rgba(0,0,0,0.15)"
            : "none",
          backdropFilter: hov ? "blur(12px)" : "none",
        }}
        transition={{ duration: 0.25 }}
      />

      {/* label */}
      <span
        className="relative z-10 font-label text-[11px] tracking-[0.1em] uppercase transition-colors duration-300"
        style={{ color: isActive || hov ? "var(--primary)" : "rgba(255,255,255,0.55)" }}
      >
        {label}
      </span>

      {/* active dot */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            layoutId="nav-dot"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="relative z-10 w-1 h-1 rounded-full bg-primary"
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          />
        )}
      </AnimatePresence>
    </motion.a>
  );
};

// ── CTA button ───────────────────────────────────────────────────────────────
const CTAButton = ({ href, children, onClick }: {
  href: string; children: React.ReactNode; onClick?: () => void;
}) => {
  const { ref, sx, sy } = useMagnetic(0.22);
  const [hov, setHov] = useState(false);

  return (
    <motion.a
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={href}
      onClick={onClick}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.55 }}
      className="relative hidden md:flex items-center gap-1.5 overflow-hidden rounded-full px-5 py-2 cursor-pointer"
      style={{
        background: hov
          ? "var(--primary)"
          : "rgba(255,255,255,0.06)",
        border: "1px solid",
        borderColor: hov ? "var(--primary)" : "rgba(255,255,255,0.14)",
        x: sx,
        y: sy,
        backdropFilter: "blur(20px)",
        boxShadow: hov
          ? "0 0 28px hsl(var(--primary) / 0.35), inset 0 1px 0 rgba(255,255,255,0.15)"
          : "inset 0 1px 0 rgba(255,255,255,0.08)",
        transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <span
        className="text-[11px] tracking-[0.14em] uppercase font-medium transition-colors duration-300"
        style={{ color: hov ? "#0a0a0a" : "rgba(255,255,255,0.8)" }}
      >
        {children}
      </span>
      <motion.span
        animate={{ x: hov ? 0 : -6, opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.18 }}
        style={{ color: hov ? "#0a0a0a" : "var(--primary)" }}
      >
        <ArrowUpRight size={12} />
      </motion.span>
    </motion.a>
  );
};

// ── Mobile link — the big numbered list ─────────────────────────────────────
const MobileLink = ({ label, href, index, onClick, isActive }: {
  label: string; href: string; index: number; onClick: () => void; isActive: boolean;
}) => {
  const [hov, setHov] = useState(false);
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.a
      href={href}
      onClick={onClick}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -28, transition: { duration: 0.2 } }}
      transition={{ delay: 0.06 + index * 0.065, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex items-center gap-0 py-3 overflow-hidden"
      style={{ textDecoration: "none" }}
    >
      {/* glass hover track */}
      <motion.span
        className="absolute inset-0 rounded-2xl"
        animate={{
          background: hov || isActive
            ? "rgba(255,255,255,0.04)"
            : "transparent",
          boxShadow: hov || isActive
            ? "inset 0 0 0 1px rgba(255,255,255,0.08)"
            : "none",
        }}
        transition={{ duration: 0.22 }}
        style={{ margin: "0 -12px" }}
      />

      {/*
        ── NUMBER — the star of mobile ──
        Large, bold, primary-coloured with a glow.
        Shifts slightly on hover, scales on active.
      */}
      <motion.div
        className="relative flex-shrink-0 w-16 flex items-baseline justify-end pr-4"
        animate={{
          x: hov ? 2 : 0,
        }}
        transition={{ duration: 0.22 }}
      >
        {/* glow bloom behind number */}
        <motion.span
          className="absolute inset-0 rounded-full blur-xl"
          animate={{
            background: hov || isActive
              ? "hsl(var(--primary) / 0.25)"
              : "transparent",
            scale: hov ? 1.3 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        <motion.span
          className="relative font-mono font-black tracking-tighter leading-none select-none"
          animate={{
            color: hov || isActive
              ? "hsl(var(--primary))"
              : "rgba(255,255,255,0.12)",
            scale: hov ? 1.04 : 1,
            textShadow: hov || isActive
              ? "0 0 28px hsl(var(--primary) / 0.6)"
              : "none",
          }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontSize: "clamp(2rem, 8vw, 3rem)" }}
        >
          {num}
        </motion.span>
      </motion.div>

      {/* thin vertical rule */}
      <motion.span
        className="flex-shrink-0 w-[1.5px] self-stretch rounded-full mr-5"
        animate={{
          background: hov || isActive
            ? "linear-gradient(to bottom, transparent, hsl(var(--primary)), transparent)"
            : "linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)",
          scaleY: hov ? 1 : 0.6,
        }}
        transition={{ duration: 0.25 }}
      />

      {/* label + arrow */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <motion.span
          className="font-bold tracking-tight leading-none truncate"
          animate={{
            x: hov ? 5 : 0,
            color: hov || isActive
              ? "#ffffff"
              : "rgba(255,255,255,0.65)",
          }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontSize: "clamp(1.4rem, 6vw, 2.2rem)" }}
        >
          {label}
        </motion.span>

        <motion.span
          animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : -10 }}
          transition={{ duration: 0.2 }}
          className="text-primary flex-shrink-0"
        >
          <ArrowUpRight size={20} strokeWidth={2} />
        </motion.span>
      </div>

      {/* active pill badge */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6, x: 8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="flex-shrink-0 mr-3 px-2 py-0.5 rounded-full text-[9px] font-label tracking-widest uppercase"
            style={{
              background: "hsl(var(--primary) / 0.15)",
              color: "hsl(var(--primary))",
              border: "1px solid hsl(var(--primary) / 0.3)",
            }}
          >
            Now
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
};

// ── Hamburger icon — morphs to X ────────────────────────────────────────────
const HamburgerIcon = ({ open }: { open: boolean }) => (
  <div className="w-5 h-4 flex flex-col justify-between">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="block h-[1.5px] rounded-full bg-current origin-center"
        animate={
          open
            ? i === 1
              ? { opacity: 0, scaleX: 0 }
              : i === 0
              ? { rotate: 45, y: 7.5 }
              : { rotate: -45, y: -7.5 }
            : { rotate: 0, y: 0, opacity: 1, scaleX: 1 }
        }
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      />
    ))}
  </div>
);

// ── Main Navbar ───────────────────────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled]       = useState(false);
  const [open, setOpen]               = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const scrollProgress                = useScrollProgress();
  const progressWidth                 = useTransform(scrollProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const sections = navLinks.map(l => document.querySelector(l.href)).filter(Boolean);
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(`#${e.target.id}`); }),
      { threshold: 0.35 }
    );
    sections.forEach(s => s && obs.observe(s));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const h = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  return (
    <>
      {/* ── Desktop / Top bar ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        {/* Apple-style frosted glass pill on scroll */}
        <motion.div
          animate={scrolled ? {
            margin: "10px 16px 0",
            borderRadius: "999px",
            background: "rgba(12,12,12,0.72)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(255,255,255,0.03)",
            backdropFilter: "blur(28px) saturate(1.4)",
          } : {
            margin: "0px 0px 0",
            borderRadius: "0px",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)",
            boxShadow: "none",
            backdropFilter: "blur(0px)",
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ border: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent" }}
        >
          <div className="flex items-center justify-between px-5 md:px-8 lg:px-10 py-3">

            {/* Logo */}
            <motion.a
              href="#"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center"
            >
              <img
                src={logo}
                alt="B52 Bistro"
                className={`object-contain transition-all duration-500 ${
                  scrolled ? "h-14 md:h-16" : "h-16 md:h-20"
                }`}
              />
            </motion.a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, i) => (
                <NavLink
                  key={link.label}
                  label={link.label}
                  href={link.href}
                  index={i}
                  isActive={activeSection === link.href}
                />
              ))}
            </div>

            {/* Desktop CTA */}
            <CTAButton href="#contact">Visit Us Tonight</CTAButton>

            {/* Mobile hamburger — glass pill */}
            <motion.button
              onClick={() => setOpen(o => !o)}
              className="md:hidden relative flex items-center justify-center w-10 h-10 rounded-full text-white"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(16px)",
              }}
              whileHover={{
                background: "rgba(255,255,255,0.14)",
                borderColor: "hsl(var(--primary) / 0.5)",
                scale: 1.06,
              }}
              whileTap={{ scale: 0.93 }}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <HamburgerIcon open={open} />
            </motion.button>
          </div>
        </motion.div>

        {/* Scroll progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[1.5px] rounded-full"
          style={{
            width: progressWidth,
            background: "linear-gradient(to right, hsl(var(--primary) / 0.4), hsl(var(--primary)), hsl(var(--primary) / 0.6))",
            opacity: scrolled ? 1 : 0,
            boxShadow: "0 0 8px hsl(var(--primary) / 0.5)",
          }}
        />
      </motion.nav>

      {/* ── Mobile fullscreen menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60]"
            style={{
              background: "rgba(6,6,6,0.92)",
              backdropFilter: "blur(40px) saturate(1.5)",
            }}
          >
            {/* Frosted glass inner surface */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% -10%, hsl(var(--primary) / 0.06) 0%, transparent 70%)",
              }}
            />

            {/* Top accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-0 left-0 right-0 h-[1px] origin-left"
              style={{
                background: "linear-gradient(to right, transparent, hsl(var(--primary)), transparent)",
                boxShadow: "0 0 12px hsl(var(--primary) / 0.4)",
              }}
            />

            {/* Header row */}
            <div className="flex items-center justify-between px-6 pt-5 pb-2">
              <motion.img
                src={logo}
                alt="B52 Bistro"
                className="h-14 object-contain"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12, duration: 0.4 }}
              />

              <motion.button
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-10 h-10 rounded-full text-white"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                }}
                whileHover={{
                  background: "hsl(var(--primary) / 0.15)",
                  borderColor: "hsl(var(--primary) / 0.4)",
                  rotate: 90,
                  scale: 1.06,
                }}
                whileTap={{ scale: 0.92 }}
                aria-label="Close menu"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.14 }}
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col justify-center flex-1 px-4 pt-2 pb-4 gap-0">
              {navLinks.map((link, i) => (
                <MobileLink
                  key={link.label}
                  label={link.label}
                  href={link.href}
                  index={i}
                  isActive={activeSection === link.href}
                  onClick={() => setOpen(false)}
                />
              ))}
            </nav>

            {/* CTA row */}
            <motion.div
              className="px-6 pb-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.45 }}
            >
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-[12px] tracking-[0.15em] uppercase font-medium transition-all duration-300 active:scale-[0.98]"
                style={{
                  background: "hsl(var(--primary))",
                  color: "#0a0a0a",
                  boxShadow: "0 0 32px hsl(var(--primary) / 0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                Visit Us Tonight
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </a>
            </motion.div>

            {/* Footer text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="px-6 pb-8 flex items-center justify-between"
            >
              <span className="text-[10px] tracking-[0.2em] uppercase text-white/20 font-label">
                B52 Bistro · Nairobi
              </span>
              <span className="text-[10px] tracking-[0.15em] uppercase text-white/15 font-label">
                Est. 2026
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;