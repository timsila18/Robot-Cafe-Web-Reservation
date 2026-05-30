import OfferCard from "../components/OfferCard";
import SectionHeading from "../components/SectionHeading";
import { offers } from "../data/offers";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function OffersSection() {
  return (
    <section id="offers" className="luxury-surface px-5 py-20 lg:px-6 light:bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="section-kicker">Exclusive offers</span>
            <SectionHeading
              align="left"
              title="Featured Offers"
              subtitle="Modern promotions with the same familiar offer-first journey guests already recognize."
            />
          </div>
          <a href="/offers" className="focus-ring inline-flex items-center text-sm font-bold uppercase tracking-[0.18em] text-robot-blue hover:text-white">
            View all offers
          </a>
        </div>
        <div className="mt-12">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            autoplay={{ delay: 4200, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            spaceBetween={24}
            breakpoints={{ 768: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } }}
          >
          {offers.map((offer, index) => (
            <SwiperSlide key={offer.title} className="h-auto pb-12">
              <OfferCard offer={offer} index={index} />
            </SwiperSlide>
          ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
