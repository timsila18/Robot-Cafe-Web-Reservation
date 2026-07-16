import MenuCard from "../components/MenuCard";
import PremiumButton from "../components/PremiumButton";
import SectionHeading from "../components/SectionHeading";
import { useMenuContent } from "../hooks/useMenuContent";

export default function SignatureDishesSection() {
  const { items } = useMenuContent();
  const signatureItems = items.filter((item) => item.signature || item.featured).slice(0, 5);

  return (
    <section id="menu" className="luxury-surface border-y border-white/10 bg-robot-navy/72 px-5 py-24 lg:px-6 light:border-slate-200 light:bg-slate-50">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="section-kicker mb-5">Signature dishes</span>
            <SectionHeading
              align="left"
              title="Chef-led favorites, future-ready service."
              subtitle="Premium menu highlights with categories, prices, and a direct path to order online."
            />
          </div>
          <PremiumButton as="a" href="/menu" variant="gold">
            View Full Menu
          </PremiumButton>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {signatureItems.map((item, index) => (
            <MenuCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
