import { motion } from "framer-motion";
import FAQSection from "../sections/FAQSection";
import AboutPreviewSection from "../sections/AboutPreviewSection";
import GallerySection from "../sections/GallerySection";
import HeroSection from "../sections/HeroSection";
import OffersSection from "../sections/OffersSection";
import ReviewsSection from "../sections/ReviewsSection";
import SignatureDishesSection from "../sections/SignatureDishesSection";
import WhyChooseSection from "../sections/WhyChooseSection";

export default function HomePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <HeroSection />
      <OffersSection />
      <AboutPreviewSection />
      <WhyChooseSection />
      <SignatureDishesSection />
      <ReviewsSection />
      <GallerySection />
      <FAQSection />
    </motion.div>
  );
}
