import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ReviewCard from "../components/ReviewCard";
import SectionHeading from "../components/SectionHeading";
import { reviews } from "../data/reviews";

export default function ReviewsSection() {
  return (
    <section className="px-5 py-24 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title="Customer Reviews" subtitle="Elegant testimonials that build confidence before guests order, book, or visit." />
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
