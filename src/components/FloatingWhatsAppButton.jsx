import { siteConfig } from "../config/site";

function WhatsAppLogo() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M16.02 4C9.38 4 4 9.35 4 15.95c0 2.1.55 4.15 1.6 5.95L4 28l6.28-1.58A12.08 12.08 0 0 0 16.02 28C22.65 28 28 22.65 28 16.05 28 9.42 22.65 4 16.02 4Zm0 21.9c-1.82 0-3.6-.5-5.15-1.45l-.37-.22-3.72.94.98-3.6-.24-.38a9.8 9.8 0 0 1-1.5-5.24c0-5.43 4.48-9.86 10-9.86 5.5 0 9.97 4.47 9.97 9.96 0 5.43-4.47 9.85-9.97 9.85Zm5.47-7.37c-.3-.15-1.78-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48a8.97 8.97 0 0 1-1.66-2.05c-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.62-.93-2.22-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.48 0 1.47 1.08 2.9 1.23 3.1.15.2 2.13 3.23 5.16 4.52.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.72 2.03-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35Z"
      />
    </svg>
  );
}

export default function FloatingWhatsAppButton() {
  return (
    <a
      href={siteConfig.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="focus-ring group fixed bottom-6 left-5 z-50 inline-flex h-14 items-center gap-3 rounded-full border border-[#25D366]/40 bg-[#25D366] px-4 text-white shadow-[0_18px_55px_rgba(37,211,102,0.34)] transition hover:-translate-y-1 hover:bg-[#1ebe5d] hover:shadow-[0_22px_70px_rgba(37,211,102,0.46)]"
      aria-label="Chat with Robot Cafe on WhatsApp"
      title="Chat with Robot Cafe on WhatsApp"
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#25D366]">
        <WhatsAppLogo />
      </span>
      <span className="hidden pr-1 text-sm font-black uppercase tracking-[0.12em] sm:block">WhatsApp</span>
    </a>
  );
}
