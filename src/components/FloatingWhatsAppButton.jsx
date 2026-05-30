import { MessageCircle } from "lucide-react";
import { siteConfig } from "../config/site";

export default function FloatingWhatsAppButton() {
  return (
    <a
      href={siteConfig.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="focus-ring fixed bottom-6 left-5 z-50 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/10 text-white shadow-gold backdrop-blur transition hover:-translate-y-1 hover:border-robot-gold"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
    </a>
  );
}
