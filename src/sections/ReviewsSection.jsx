import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ReviewCard from "../components/ReviewCard";
import SectionHeading from "../components/SectionHeading";
import { reviews } from "../data/reviews";

export default function ReviewsSection() {
  return (
    <section className="luxury-surface px-5 py-24 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_0.45fr] lg:items-end">
          <div>
            <span className="section-kicker mb-5">Guest confidence</span>
            <SectionHeading align="left" title="Customer Reviews" subtitle="Elegant testimonials that build confidence before guests order, book, or visit." />
          </div>
          <div className="glass-panel rounded-3xl p-6 text-center">
            <p className="font-display text-5xl font-black text-white">4.63</p>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-robot-gold">Average guest rating</p>
          </div>
        </div>
        <div className="mt-12">
          <Swiper modules={[Autoplay]} autoplay={{ delay: 4200, disableOnInteraction: false }} loop spaceBetween={24} breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}>
            {reviews.map((review) => (
              <SwiperSlide key={review.name} className="h-auto">
                <ReviewCard review={review} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
