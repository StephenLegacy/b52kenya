import { motion } from "framer-motion";
import { Wine, UtensilsCrossed, Sparkles, PartyPopper } from "lucide-react";

const experiences = [
  {
    icon: Wine,
    title: "Signature Cocktails",
    description: "Handcrafted drinks mixed by skilled bartenders, designed to elevate your night.",
  },
  {
    icon: UtensilsCrossed,
    title: "Modern Dining",
    description: "A carefully curated menu offering bold flavors and beautifully presented dishes.",
  },
  {
    icon: Sparkles,
    title: "Vibrant Atmosphere",
    description: "Stylish interiors, music, and lighting that create the perfect social energy.",
  },
  {
    icon: PartyPopper,
    title: "Perfect for Every Occasion",
    description: "From casual dinners to celebrations and late-night gatherings.",
  },
];

const ExperienceSection = () => {
  return (
    <section id="experience" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="font-label text-xs text-primary mb-4">The Experience</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
            <span className="font-display text-4xl md:text-6xl">What Awaits You</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group surface-glass p-8 transition-all duration-500 hover:border-primary/30"
              style={{ boxShadow: "none" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "inset 0 0 10px hsl(355 83% 41% / 0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <exp.icon className="w-8 h-8 text-primary mb-6 transition-transform duration-500 group-hover:-translate-y-1" />
              <h3 className="text-lg font-bold tracking-tight mb-3">{exp.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
