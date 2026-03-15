import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wine, GlassWater, UtensilsCrossed, Sandwich, FileDown, Eye, X } from "lucide-react";

const menuCards = [
  { icon: Wine, title: "Signature Cocktails", description: "Expertly crafted house specials" },
  { icon: GlassWater, title: "Wines & Spirits", description: "Curated selection from around the world" },
  { icon: UtensilsCrossed, title: "Main Dishes", description: "Bold flavors, artful presentation" },
  { icon: Sandwich, title: "Bites & Platters", description: "Perfect for sharing" },
];

const MenuSection = () => {
  const [pdfOpen, setPdfOpen] = useState(false);

  return (
    <section id="menu" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group surface-glass p-8 text-center transition-all duration-500 hover:border-primary/30 hover:shadow-[inset_0_0_20px_hsl(355_83%_41%/0.1),0_0_30px_hsl(355_83%_41%/0.08)]"
            >
              <div className="relative mx-auto w-16 h-16 flex items-center justify-center mb-5">
                <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/10 transition-all duration-500 scale-75 group-hover:scale-100" />
                <card.icon className="w-8 h-8 text-primary relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1" />
              </div>
              <h3 className="text-base font-bold tracking-tight mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => setPdfOpen(true)}
            className="btn-hero-filled text-xs inline-flex items-center gap-2"
          >
            <Eye size={14} />
            View Full Menu
          </button>
          <a href="#" className="btn-hero text-xs inline-flex items-center gap-2">
            <FileDown size={14} />
            Download Menu
          </a>
        </motion.div>
      </div>

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {pdfOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            onClick={() => setPdfOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl h-[80vh] surface-glass rounded-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-label text-xs text-primary tracking-wider">B52 Bistro Menu</h3>
                <button
                  onClick={() => setPdfOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="w-full h-[calc(100%-60px)] flex items-center justify-center text-muted-foreground">
                <div className="text-center p-8">
                  <FileDown size={48} className="mx-auto mb-4 text-primary/50" />
                  <p className="text-sm mb-2">Menu PDF viewer</p>
                  <p className="text-xs text-muted-foreground mb-6">
                    Add your menu PDF to enable the embedded viewer
                  </p>
                  <a href="#" className="btn-hero text-xs inline-flex items-center gap-2">
                    <FileDown size={14} />
                    Download Menu PDF
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MenuSection;
