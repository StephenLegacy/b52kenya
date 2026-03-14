import { motion } from "framer-motion";
import aboutImage from "@/assets/about-image.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-label text-xs text-primary mb-4">About Us</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 leading-tight">
            A Destination for Great Food, Drinks
            <span className="font-display text-4xl md:text-6xl block mt-1">
              & Atmosphere
            </span>
          </h2>
          <div className="divider-red mb-8" />
          <p className="text-muted-foreground leading-relaxed mb-6">
            At B52 Bistro, every visit is designed to be an experience. From carefully crafted dishes and signature cocktails to the energy of Nairobi's nightlife, our space brings people together to dine, celebrate, and create memorable moments.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Whether you're meeting friends for drinks, enjoying dinner, or starting an unforgettable night out, B52 Bistro offers the perfect setting.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src={aboutImage}
              alt="B52 Bistro ambience"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-primary" />
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
