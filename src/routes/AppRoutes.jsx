import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import AboutPage from "../pages/AboutPage";
import AccountPage from "../pages/AccountPage";
import ContactPage from "../pages/ContactPage";
import GalleryPage from "../pages/GalleryPage";
import HomePage from "../pages/HomePage";
import MenuPage from "../pages/MenuPage";
import NotFoundPage from "../pages/NotFoundPage";
import OffersPage from "../pages/OffersPage";
import ReservationsPage from "../pages/ReservationsPage";
import ReviewsPage from "../pages/ReviewsPage";
import FAQPage from "../pages/FAQPage";
import ReservationConfirmationPage from "../pages/ReservationConfirmationPage";
import ReservationStatusPage from "../pages/ReservationStatusPage";
import ReservationModifyPage from "../pages/ReservationModifyPage";
import ReservationCancelPage from "../pages/ReservationCancelPage";

export default function AppRoutes() {
  const location = useLocation();

  return (
    <SiteLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/reservations/confirmation" element={<ReservationConfirmationPage />} />
          <Route path="/reservations/status" element={<ReservationStatusPage />} />
          <Route path="/reservations/modify" element={<ReservationModifyPage />} />
          <Route path="/reservations/cancel" element={<ReservationCancelPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/my-account" element={<AccountPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </SiteLayout>
  );
}
