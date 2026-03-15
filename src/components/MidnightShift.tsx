import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface MidnightShiftProps {
  children: React.ReactNode;
}

const MidnightShift = ({ children }: MidnightShiftProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Shift accent color from warm white/neutral tones to deep red
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0, 0.06, 0.1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 0.15, 0.4]);
  const borderOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.1, 0.15, 0.25]);

  return (
    <div ref={ref} className="relative">
      {/* Red ambient glow overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: useTransform(
            bgOpacity,
            (v) => `radial-gradient(ellipse 80% 60% at 50% 50%, hsl(355 83% 41% / ${v}), transparent)`
          ),
        }}
      />

      {/* Top edge glow line */}
      <motion.div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px z-10"
        style={{
          opacity: glowOpacity,
          background: "linear-gradient(90deg, transparent, hsl(355 83% 41% / 0.6), transparent)",
          boxShadow: "0 0 20px hsl(355 83% 41% / 0.3)",
        }}
      />

      {/* Bottom edge glow line */}
      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px z-10"
        style={{
          opacity: borderOpacity,
          background: "linear-gradient(90deg, transparent, hsl(355 83% 41% / 0.4), transparent)",
        }}
      />

      <div className="relative z-[1]">{children}</div>
    </div>
  );
};

export default MidnightShift;
