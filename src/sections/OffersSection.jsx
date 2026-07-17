import OfferCard from "../components/OfferCard";
import SectionHeading from "../components/SectionHeading";
import { useMenuContent } from "../hooks/useMenuContent";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const preferredCategories = [
  "Sushi Menu",
  "Masterpiece & Grill",
  "Coffee",
  "Burgers",
  "Pastas",
  "Breakfast",
  "Mocktails",
  "Robot Special Tables",
];

function hasRealMenuPhoto(item) {
  const image = item.imageUrl || item.image || item.src || "";
  return image.includes("robotcafe.co.ke/qr-menu-images") || image.includes("/menu/");
}

function menuItemToOffer(item, index) {
  const badge = index === 0 ? "Menu favourite" : item.category;

  return {
    id: item.id || item.title,
    title: item.title,
    price: item.price || badge,
    badge,
    image: item.imageUrl || item.image || item.src,
    description: item.description || `Explore this ${item.category || "Robot Cafe"} favourite from the live menu.`,
    cta: "View Menu",
    href: "/menu",
  };
}

function buildFeaturedMenuOffers(items = []) {
  const photoItems = items.filter(hasRealMenuPhoto);
  const selected = [];

  preferredCategories.forEach((category) => {
    const match = photoItems.find(
      (item) => item.category === category && !selected.some((selectedItem) => selectedItem.id === item.id)
    );
    if (match) selected.push(match);
  });

  photoItems.forEach((item) => {
    if (selected.length >= 8) return;
    if (!selected.some((selectedItem) => selectedItem.id === item.id)) selected.push(item);
  });

  return selected.slice(0, 8).map(menuItemToOffer);
}

export default function OffersSection() {
  const { items, status } = useMenuContent();
  const offers = buildFeaturedMenuOffers(items);

  return (
    <section id="offers" className="luxury-surface px-5 py-20 lg:px-6 light:bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="section-kicker">Exclusive offers</span>
            <SectionHeading
              align="left"
              title="Featured Offers"
              subtitle="Live menu highlights using real Robot Cafe menu photos from the QR menu source."
            />
          </div>
          <a href="/offers" className="focus-ring inline-flex items-center text-sm font-bold uppercase tracking-[0.18em] text-robot-blue hover:text-white">
            View all offers
          </a>
        </div>
        <div className="mt-12">
          {offers.length ? (
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              autoplay={{ delay: 4200, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop={offers.length > 3}
              spaceBetween={24}
              breakpoints={{ 768: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } }}
            >
              {offers.map((offer, index) => (
                <SwiperSlide key={offer.id || offer.title} className="h-auto pb-12">
                  <OfferCard offer={offer} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-robot-muted">
              {status === "loading" ? "Loading live Robot Cafe menu photos..." : "Featured menu photos will appear here once the QR menu source is available."}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
