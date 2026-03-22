import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Instagram } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="font-label text-xs text-primary mb-4">Find Us</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
            <span className="font-display text-4xl md:text-6xl">Visit Us Tonight</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Address</h3>
                <a
                  href="https://maps.app.goo.gl/9oHgW6eNPgnQJowd7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Piedmont Plaza, 671 Ngong Road<br />
                  Nairobi, Kenya
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Phone</h3>
                <a
                  href="tel:+254715000010"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +254 715 000 010
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Opening Hours</h3>
                <div className="text-muted-foreground text-sm space-y-1">
                  <p>Daily : 08:00 AM – 03:00 AM</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Instagram className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Follow Us</h3>
                <a
                  href="https://instagram.com/b52bistro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  @b52_bistro
                </a>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="aspect-square md:aspect-auto md:h-full min-h-[350px] surface-glass overflow-hidden"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8168!2d36.7814!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTcnMzEuNiJTIDM2wrA0NicxNi45IkU!5e0!3m2!1sen!2ske!4v1678000000000"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="B52 Bistro location"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
