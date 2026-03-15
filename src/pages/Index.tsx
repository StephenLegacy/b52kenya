import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import GallerySection from "@/components/GallerySection";
import MenuSection from "@/components/MenuSection";
import OrderOnlineSection from "@/components/OrderOnlineSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import MidnightShift from "@/components/MidnightShift";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <MidnightShift>
        <GallerySection />
        <MenuSection />
        <OrderOnlineSection />
        <ContactSection />
      </MidnightShift>
      <Footer />
    </div>
  );
};

export default Index;
