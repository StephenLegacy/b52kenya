import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Gallery", href: "#gallery" },
  { label: "Menu", href: "#menu" },
  { label: "Order Online", href: "#order" },
  { label: "Contact", href: "#contact" },
];

// ── Magnetic button hook ─────────────────────────────────────────────────────
function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18 });
  const springY = useSpring(y, { stiffness: 200, damping: 18 });

  const handleMouseMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return { ref, springX, springY };
}

// ── Nav link with animated underline + char-stagger hover ───────────────────
const NavLink = ({
  label,
  href,
  index,
  onClick,
}: {
  label: string;
  href: string;
  index: number;
  onClick?: () => void;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={href}
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="relative group flex flex-col items-center gap-[3px] py-1 overflow-hidden"
      style={{ textDecoration: "none" }}
    >
      {/* Label with per-character lift on hover */}
      <span className="flex items-center">
        {label.split("").map((char, i) => (
          <motion.span
            key={i}
            animate={{ y: hovered ? -2 : 0 }}
            transition={{
              duration: 0.25,
              delay: hovered ? i * 0.025 : (label.length - i) * 0.015,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-label text-[11px] tracking-[0.12em] uppercase text-muted-foreground group-hover:text-foreground transition-colors duration-300 inline-block"
            style={{ whiteSpace: "pre" }}
          >
            {char}
          </motion.span>
        ))}
      </span>

      {/* Animated underline */}
      <motion.span
        className="absolute bottom-0 left-0 h-[1px] bg-primary"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%" }}
      />
    </motion.a>
  );
};

// ── CTA button with magnetic + shimmer effects ───────────────────────────────
const CTAButton = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const { ref, springX, springY } = useMagnetic(0.25);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative hidden md:flex items-center gap-1.5 overflow-hidden rounded-full border border-primary/60 px-5 py-2 text-[11px] tracking-[0.15em] uppercase text-primary font-medium cursor-pointer"
    >
      {/* Shimmer fill on hover */}
      <motion.span
        className="absolute inset-0 bg-primary"
        initial={{ x: "-110%" }}
        animate={{ x: hovered ? "0%" : "-110%" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        className="relative z-10 transition-colors duration-300"
        animate={{ color: hovered ? "var(--color-primary-foreground, #0a0a0a)" : "var(--primary)" }}
      >
        {children}
      </motion.span>
      <motion.span
        className="relative z-10"
        animate={{
          x: hovered ? 0 : -4,
          opacity: hovered ? 1 : 0,
          color: hovered ? "var(--color-primary-foreground, #0a0a0a)" : "var(--primary)",
        }}
        transition={{ duration: 0.2 }}
      >
        <ArrowUpRight size={12} />
      </motion.span>
    </motion.a>
  );
};

// ── Mobile menu link ─────────────────────────────────────────────────────────
const MobileLink = ({
  label,
  href,
  index,
  onClick,
}: {
  label: string;
  href: string;
  index: number;
  onClick: () => void;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={href}
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: 0.05 + index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative group flex items-center gap-3 py-2"
    >
      {/* Animated index number */}
      <motion.span
        className="text-[10px] tracking-widest text-primary/50 font-mono w-5 text-right"
        animate={{ opacity: hovered ? 1 : 0.4 }}
      >
        0{index + 1}
      </motion.span>

      {/* Vertical divider */}
      <motion.span
        className="w-[1px] h-4 bg-primary/30"
        animate={{ scaleY: hovered ? 1.5 : 1, backgroundColor: hovered ? "var(--primary)" : "color-mix(in srgb, var(--primary) 30%, transparent)" }}
        transition={{ duration: 0.2 }}
      />

      {/* Label */}
      <motion.span
        className="text-3xl font-bold tracking-tighter text-foreground"
        animate={{ x: hovered ? 6 : 0, color: hovered ? "var(--primary)" : "var(--foreground)" }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {label}
      </motion.span>

      {/* Arrow indicator */}
      <motion.span
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -8 }}
        transition={{ duration: 0.2 }}
      >
        <ArrowUpRight size={18} className="text-primary" />
      </motion.span>
    </motion.a>
  );
};

// ── Main Navbar ──────────────────────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sections = navLinks.map((l) => document.querySelector(l.href));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── Desktop / Scrolled Navbar ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-[0_4px_40px_rgba(0,0,0,0.12)]"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-12 lg:px-24 py-4">

          {/* Logo
           * CHANGE 1 — Desktop navbar logo size (increased)
           * ─────────────────────────────────────────────────
           * When scrolled:  was "h-9 md:h-10"  → now "h-14 md:h-16"  (56px / 64px)
           * When at top:    was "h-10 md:h-12"  → now "h-16 md:h-20"  (64px / 80px)
           *
           * Tailwind height reference:
           *   h-9  = 36px  |  h-10 = 40px  |  h-12 = 48px
           *   h-14 = 56px  |  h-16 = 64px  |  h-20 = 80px
           *
           * To make the logo even larger, increase the values further.
           * To make it smaller again, decrease them back toward h-9 / h-10.
           */}
          <motion.a
            href="#"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center"
          >
            <img
              src={logo}
              alt="B52 Bistro"
              className={`object-contain transition-all duration-500 ${
                scrolled
                  ? "h-14 md:h-16"   // ← CHANGED (was: "h-9 md:h-10")
                  : "h-16 md:h-20"   // ← CHANGED (was: "h-10 md:h-12")
              }`}
            />
          </motion.a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link, i) => (
              <div key={link.label} className="relative">
                <NavLink label={link.label} href={link.href} index={i} />
                {/* Active dot */}
                {activeSection === link.href && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTA */}
          <CTAButton href="#contact">Visit Us Tonight</CTAButton>

          {/* Mobile hamburger */}
          <motion.button
            onClick={() => setOpen(true)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-full border border-border/50 text-foreground"
            whileHover={{ scale: 1.08, borderColor: "var(--primary)" }}
            whileTap={{ scale: 0.93 }}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </motion.button>
        </div>

        {/* Progress line — shrinks as you scroll */}
        <motion.div
          className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"
          style={{ width: "100%", opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.nav>

      {/* ── Mobile fullscreen menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] bg-background flex flex-col"
          >
            {/* Decorative gold accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent origin-left"
            />

            {/* Close button row
             * CHANGE 2 — Mobile menu header logo size (increased)
             * ──────────────────────────────────────────────────────
             * was "h-9 object-contain" → now "h-16 object-contain"  (64px)
             *
             * This is the logo shown beside the ✕ close button when
             * the fullscreen mobile menu is open.
             */}
            <div className="flex items-center justify-between px-6 py-5">
              <img
                src={logo}
                alt="B52 Bistro"
                className="h-16 object-contain" // ← CHANGED (was: "h-9 object-contain")
              />
              <motion.button
                onClick={() => setOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-border/50 text-foreground"
                whileHover={{ scale: 1.08, rotate: 90, borderColor: "var(--primary)" }}
                whileTap={{ scale: 0.93 }}
                transition={{ duration: 0.25 }}
                aria-label="Close menu"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Links */}
            <div className="flex flex-col justify-center flex-1 px-8 gap-2">
              {navLinks.map((link, i) => (
                <MobileLink
                  key={link.label}
                  label={link.label}
                  href={link.href}
                  index={i}
                  onClick={() => setOpen(false)}
                />
              ))}

              {/* Mobile CTA */}
              <motion.a
                href="#contact"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 self-start flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-[11px] tracking-[0.18em] uppercase text-primary font-medium hover:bg-primary hover:text-background transition-all duration-300"
              >
                Visit Us Tonight
                <ArrowUpRight size={13} />
              </motion.a>
            </div>

            {/* Bottom handle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="px-8 pb-8 text-[10px] tracking-[0.2em] uppercase text-muted-foreground/40"
            >
              B52 Bistro · Nairobi, Kenya
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;