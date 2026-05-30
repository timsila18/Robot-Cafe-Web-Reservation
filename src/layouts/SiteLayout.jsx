import Footer from "../components/Footer";
import HeaderTopBar from "../components/HeaderTopBar";
import MainNavbar from "../components/MainNavbar";
import FloatingCartButton from "../components/FloatingCartButton";
import FloatingWhatsAppButton from "../components/FloatingWhatsAppButton";
import { useEffect, useState } from "react";

export default function SiteLayout({ children }) {
  const [theme, setTheme] = useState(() => {
    const requestedTheme = new URLSearchParams(window.location.search).get("theme");
    if (requestedTheme === "light" || requestedTheme === "dark") return requestedTheme;
    return localStorage.getItem("robotCafeTheme") || "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("robotCafeTheme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  return (
    <div className="min-h-screen bg-premium-radial transition-colors duration-500 light:bg-[#f6f9fc]">
      <HeaderTopBar theme={theme} onToggleTheme={toggleTheme} />
      <MainNavbar theme={theme} onToggleTheme={toggleTheme} />
      <main>{children}</main>
      <Footer />
      <FloatingCartButton />
      <FloatingWhatsAppButton />
    </div>
  );
}
