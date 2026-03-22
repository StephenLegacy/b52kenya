import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MapPin, Phone, Clock, Instagram, ExternalLink } from "lucide-react";
import { useRef, useState } from "react";

/* ─────────────────────────────────────────────
   Tilt card – follows cursor on hover
   ───────────────────────────────────────────── */
const TiltCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Single info row
   ───────────────────────────────────────────── */
const InfoRow = ({
  icon: Icon,
  label,
  children,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  delay?: number;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-start gap-5 p-5 rounded-2xl cursor-default transition-colors duration-300"
      style={{
        background: hovered
          ? "rgba(var(--primary-rgb, 212 163 101) / 0.06)"
          : "transparent",
      }}
    >
      {/* animated icon container */}
      <motion.div
        animate={hovered ? { scale: 1.15, rotate: -8 } : { scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="relative flex-shrink-0 mt-0.5"
      >
        {/* glow ring */}
        <motion.span
          animate={hovered ? { opacity: 1, scale: 1.6 } : { opacity: 0, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 rounded-full bg-primary/20 blur-md"
        />
        <Icon className="relative w-5 h-5 text-primary" />
      </motion.div>

      <div>
        <p className="font-label text-[10px] uppercase tracking-widest text-primary/70 mb-1">
          {label}
        </p>
        {children}
      </div>

      {/* hover underline accent */}
      <motion.span
        animate={hovered ? { scaleX: 1 } : { scaleX: 0 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-primary/60 via-primary to-primary/60 origin-left"
      />
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────── */
const ContactSection = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* subtle ambient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="font-label text-xs text-primary mb-4 tracking-widest uppercase">
            Find Us
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
            <span className="font-display text-4xl md:text-6xl">Visit Us Tonight</span>
          </h2>
          {/* decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 mx-auto h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        </motion.div>

        {/* ── Grid ── */}
        <div className="grid md:grid-cols-2 gap-10 items-stretch">

          {/* ── Left: info ── */}
          <TiltCard className="flex flex-col justify-center space-y-1">
            <InfoRow icon={MapPin} label="Address" delay={0}>
              <a
                href="https://maps.app.goo.gl/b52bistro"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-start gap-1.5 text-muted-foreground hover:text-primary transition-colors leading-snug"
              >
                <span>
                  Piedmont Plaza, 671 Ngong Road
                  <br />
                  Nairobi, Kenya
                </span>
                <ExternalLink className="w-3.5 h-3.5 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </a>
            </InfoRow>

            <InfoRow icon={Phone} label="Phone" delay={0.08}>
              <a
                href="tel:+254715000010"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                +254 715 000 010
              </a>
            </InfoRow>

            <InfoRow icon={Clock} label="Opening Hours" delay={0.16}>
              <div className="text-muted-foreground text-sm space-y-1">
                <p>Daily · 08:00 AM – 03:00 AM</p>
              </div>
            </InfoRow>

            <InfoRow icon={Instagram} label="Follow Us" delay={0.24}>
              <a
                href="https://instagram.com/b52_bistro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                @b52_bistro
              </a>
            </InfoRow>

            {/* pulsing "open now" badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-6 ml-5 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 w-fit"
            >
              {/* pulsing dot */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-xs font-label text-primary tracking-wider uppercase">
                Open Now
              </span>
            </motion.div>
          </TiltCard>

          {/* ── Right: map ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-[380px] md:min-h-[460px] rounded-2xl overflow-hidden"
            style={{
              /* colorful thin border using brand primary gradient + accent */
              padding: "2px",
              background:
                "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.4) 40%, hsl(var(--primary) / 0.8) 70%, hsl(var(--primary)) 100%)",
              boxShadow:
                "0 0 0 1px hsl(var(--primary) / 0.15), 0 20px 60px -12px hsl(var(--primary) / 0.25)",
            }}
          >
            {/* animated gradient border shimmer */}
            <motion.div
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              aria-hidden
              className="absolute inset-0 z-10 rounded-2xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, transparent 30%, hsl(var(--primary) / 0.35) 50%, transparent 70%)",
                backgroundSize: "200% 200%",
              }}
            />

            {/* inner container */}
            <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-background">
              {/* skeleton loader */}
              {!mapLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background z-20">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    className="w-10 h-10 rounded-full border-2 border-primary/40 border-t-primary"
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  <p className="text-xs text-muted-foreground font-label tracking-wider">
                    Loading map…
                  </p>
                </div>
              )}

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8168836060954!2d36.77892037496538!3d-1.2920927987080872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1b3e1005bf59%3A0x9cdb24faf38f22c6!2sB52%20Bistro!5e0!3m2!1sen!2ske!4v1774165331888!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: "invert(90%) hue-rotate(180deg) saturate(0.9)",
                  display: "block",
                  minHeight: "380px",
                  opacity: mapLoaded ? 1 : 0,
                  transition: "opacity 0.6s ease",
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="B52 Bistro location"
                onLoad={() => setMapLoaded(true)}
              />

              {/* bottom gradient overlay for depth */}
              <div
                aria-hidden
                className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-10"
                style={{
                  background:
                    "linear-gradient(to top, hsl(var(--background) / 0.6), transparent)",
                }}
              />

              {/* floating pin label */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={mapLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm border border-primary/30 bg-background/70"
              >
                <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="text-xs font-label text-foreground/80 tracking-wide">
                  B52 Bistro · Ngong Rd
                </span>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;