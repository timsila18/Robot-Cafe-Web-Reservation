import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import AboutPage from "../pages/AboutPage";
import AccountPage from "../pages/AccountPage";
import AdminHomePage from "../pages/AdminHomePage";
import AdminMenuPage from "../pages/AdminMenuPage";
import AdminReservationsPage from "../pages/AdminReservationsPage";
import AdminSurveysPage from "../pages/AdminSurveysPage";
import AdminUsersPage from "../pages/AdminUsersPage";
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
import SurveyPage from "../pages/SurveyPage";

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
          <Route path="/staff-login" element={<AccountPage />} />
          <Route path="/account" element={<Navigate to="/staff-login" replace />} />
          <Route path="/my-account" element={<Navigate to="/staff-login" replace />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/admin" element={<AdminHomePage />} />
          <Route path="/admin/login" element={<Navigate to="/staff-login" replace />} />
          <Route path="/admin/menu" element={<AdminMenuPage />} />
          <Route path="/admin/reservations" element={<AdminReservationsPage />} />
          <Route path="/admin/surveys" element={<AdminSurveysPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </SiteLayout>
  );
}
