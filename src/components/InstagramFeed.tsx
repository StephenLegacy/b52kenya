import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

import galleryFood1 from "@/assets/gallery-food1.jpg";
import galleryCocktail from "@/assets/gallery-cocktail.jpg";
import galleryAtmosphere from "@/assets/gallery-atmosphere.jpg";
import galleryNightlife from "@/assets/gallery-nightlife.jpg";
import galleryInterior from "@/assets/gallery-interior.jpg";
import galleryDrinks from "@/assets/gallery-drinks.jpg";

const posts = [
  { src: galleryFood1, alt: "Signature dish" },
  { src: galleryCocktail, alt: "Cocktail craft" },
  { src: galleryAtmosphere, alt: "Friday vibes" },
  { src: galleryNightlife, alt: "DJ night" },
  { src: galleryInterior, alt: "Our space" },
  { src: galleryDrinks, alt: "Signature drinks" },
];

const InstagramFeed = () => {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="font-label text-xs text-primary mb-4">Follow Us</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
            <span className="font-display text-4xl md:text-6xl">@b52bistro</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            Follow our journey on Instagram for the latest moments, events, and vibes.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {posts.map((post, i) => (
            <motion.a
              key={i}
              href="https://instagram.com/b52bistro"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative aspect-square overflow-hidden cursor-pointer"
            >
              <img
                src={post.src}
                alt={post.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-all duration-500 flex items-center justify-center">
                <Instagram
                  size={28}
                  className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100"
                />
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10"
        >
          <a
            href="https://instagram.com/b52bistro"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hero text-xs inline-flex items-center gap-2"
          >
            <Instagram size={14} />
            Follow on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramFeed;
