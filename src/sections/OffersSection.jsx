import OfferCard from "../components/OfferCard";
import SectionHeading from "../components/SectionHeading";
import { offers } from "../data/offers";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function OffersSection() {
  return (
    <section id="offers" className="px-5 py-20 lg:px-6 light:bg-white">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Featured Offers"
          subtitle="Modern promotions with the same familiar offer-first journey guests already recognize."
        />
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
