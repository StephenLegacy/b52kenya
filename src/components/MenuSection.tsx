import { motion } from "framer-motion";
import { Wine, GlassWater, UtensilsCrossed, Sandwich, FileDown, Eye } from "lucide-react";

const menuCards = [
  { icon: Wine, title: "Signature Cocktails", description: "Expertly crafted house specials" },
  { icon: GlassWater, title: "Wines & Spirits", description: "Curated selection from around the world" },
  { icon: UtensilsCrossed, title: "Main Dishes", description: "Bold flavors, artful presentation" },
  { icon: Sandwich, title: "Bites & Platters", description: "Perfect for sharing" },
];

const MenuSection = () => {
  return (
    <section id="menu" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="font-label text-xs text-primary mb-4">Our Menu</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
            <span className="font-display text-4xl md:text-6xl">Explore the Menu</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {menuCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group surface-glass p-8 text-center transition-all duration-500 hover:border-primary/30"
            >
              <card.icon className="w-8 h-8 text-primary mx-auto mb-4 transition-transform duration-500 group-hover:scale-110" />
              <h3 className="text-base font-bold tracking-tight mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#" className="btn-hero-filled text-xs inline-flex items-center gap-2">
            <Eye size={14} />
            View Full Menu
          </a>
          <a href="#" className="btn-hero text-xs inline-flex items-center gap-2">
            <FileDown size={14} />
            Download Menu
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default MenuSection;
