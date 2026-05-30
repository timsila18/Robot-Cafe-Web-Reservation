import { CalendarDays, Filter, Megaphone } from "lucide-react";
import { useMemo, useState } from "react";
import PremiumButton from "../components/PremiumButton";
import SectionHeading from "../components/SectionHeading";
import { getActivePromotions, getPromotionCategories, getPromotions } from "../services/contentService";

function PromotionCard({ promotion, index }) {
  return (
    <article className="glass-panel premium-ring overflow-hidden rounded-3xl transition hover:-translate-y-2" style={{ transitionDelay: `${index * 30}ms` }}>
      <div className="relative aspect-[16/10] overflow-hidden bg-robot-navy">
        <img src={promotion.image} alt={promotion.title} loading="lazy" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
        <span className="absolute right-4 top-4 rounded-full bg-robot-blue px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white">
          {promotion.badge || promotion.category}
        </span>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm font-bold text-robot-gold">
          <CalendarDays className="h-4 w-4" />
          <span>{promotion.expiresLabel}</span>
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold text-white">{promotion.title}</h3>
        <p className="mt-3 leading-7 text-robot-muted">{promotion.description}</p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-robot-muted">
            {promotion.category}
          </span>
          <PremiumButton as="a" href={promotion.cta?.href || "/offers"} variant="secondary" className="px-4 py-2 text-xs">
            {promotion.cta?.label || "View Offer"}
          </PremiumButton>
        </div>
      </div>
    </article>
  );
}

export default function OffersPage() {
  const [category, setCategory] = useState("All");
  const promotions = getPromotions();
  const activePromotions = getActivePromotions();
  const categories = getPromotionCategories();
  const filteredPromotions = useMemo(
    () => promotions.filter((promotion) => promotion.active !== false && (promotion.isCurrent || promotion.isUpcoming) && (category === "All" || promotion.category === category)),
    [category, promotions]
  );

  return (
    <main>
      <section className="border-b border-white/10 bg-robot-night px-5 py-20 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <SectionHeading
              align="left"
              title="Offers"
              subtitle="Active promotions, seasonal campaigns, events, and holiday offers are managed from structured content files and ready for Cloudinary banners."
            />
            <div className="glass-panel rounded-3xl p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-robot-blue/15 text-robot-blue">
                  <Megaphone />
                </span>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-robot-muted">Active now</p>
                  <p className="font-display text-3xl font-bold text-white">{activePromotions.length} promotions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-3 overflow-x-auto pb-2">
            <Filter className="h-5 w-5 shrink-0 text-robot-blue" />
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`focus-ring shrink-0 rounded-full border px-5 py-3 text-sm font-bold capitalize transition ${
                  category === item ? "border-robot-blue bg-robot-blue text-white" : "border-white/10 bg-white/5 text-robot-muted hover:text-white"
                }`}
              >
                {item.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-robot-navy/72 px-5 py-20 lg:px-6 light:bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPromotions.map((promotion, index) => (
              <PromotionCard key={promotion.id} promotion={promotion} index={index} />
            ))}
          </div>

          {!filteredPromotions.length ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-lg font-bold text-white">No promotions in this category yet.</p>
              <p className="mt-2 text-robot-muted">Staff can add a new campaign in the promotions content file.</p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
