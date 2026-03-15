import { motion } from "framer-motion";
import uberEatsLogo from "@/assets/uber-eats-logo.png";
import boltFoodLogo from "@/assets/bolt-food-logo.png";
import glovoLogo from "@/assets/glovo-logo.png";

const platforms = [
  {
    name: "Uber Eats",
    logo: uberEatsLogo,
    href: "#", // Replace with your Uber Eats link
    bg: "bg-[#142328]",
  },
  {
    name: "Bolt Food",
    logo: boltFoodLogo,
    href: "#", // Replace with your Bolt Food link
    bg: "bg-[#1a2e1a]",
  },
  {
    name: "Glovo",
    logo: glovoLogo,
    href: "#", // Replace with your Glovo link
    bg: "bg-[#2e2510]",
  },
];

const OrderOnlineSection = () => {
  return (
    <section id="order" className="section-padding">
      <div className="max-w-5xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-label text-xs text-primary mb-4 tracking-[0.2em]"
        >
          Delivery
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold tracking-tighter mb-4"
        >
          Order{" "}
          <span className="font-display text-4xl md:text-6xl">Online</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground max-w-xl mx-auto mb-12"
        >
          Can't make it in? Enjoy B52 Bistro's signature dishes delivered straight to your door.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {platforms.map((platform, i) => (
            <motion.a
              key={platform.name}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i + 0.3 }}
              className={`group relative flex flex-col items-center justify-center gap-4 p-8 rounded-lg border border-border/50 ${platform.bg} transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_30px_hsl(355_83%_41%/0.15)]`}
            >
              <div className="w-20 h-20 flex items-center justify-center rounded-xl overflow-hidden bg-white/10 p-2 transition-transform duration-500 group-hover:scale-110">
                <img
                  src={platform.logo}
                  alt={platform.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-label text-xs text-foreground tracking-wider">
                {platform.name}
              </span>
              <span className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors duration-300">
                Order Now →
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrderOnlineSection;
