import { Instagram } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Gallery", href: "#gallery" },
  { label: "Menu", href: "#menu" },
  { label: "Contact", href: "#contact" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <a href="#" className="text-2xl font-bold tracking-tighter">
              B52<span className="text-primary">.</span>
            </a>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              Located along Ngong Road at Piedmont Plaza, B52 Bistro blends modern cuisine, stylish interiors, and vibrant nightlife into one unforgettable destination.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-label text-xs text-muted-foreground mb-4">Navigation</p>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="font-label text-xs text-muted-foreground mb-4">Contact</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Piedmont Plaza, 671 Ngong Road</p>
              <p>Nairobi, Kenya</p>
              <a href="tel:+254715000010" className="block hover:text-foreground transition-colors">
                +254 715 000 010
              </a>
              <a
                href="https://instagram.com/b52bistro"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-primary transition-colors mt-2"
              >
                <Instagram size={16} />
                @b52bistro
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} B52 Bistro. All rights reserved.
          </p>
          <div className="h-px w-12 bg-primary" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
