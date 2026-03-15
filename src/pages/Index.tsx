import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import GallerySection from "@/components/GallerySection";
import MenuSection from "@/components/MenuSection";
import OrderOnlineSection from "@/components/OrderOnlineSection";
import ContactSection from "@/components/ContactSection";
import InstagramFeed from "@/components/InstagramFeed";
import Footer from "@/components/Footer";
import MidnightShift from "@/components/MidnightShift";
import FloatingReservation from "@/components/FloatingReservation";

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
        <InstagramFeed />
        <ContactSection />
      </MidnightShift>
      <Footer />
      <FloatingReservation />
    </div>
  );
};

export default Index;
