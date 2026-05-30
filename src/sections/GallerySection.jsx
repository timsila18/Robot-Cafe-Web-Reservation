import GalleryLightbox from "../components/GalleryLightbox";
import SectionHeading from "../components/SectionHeading";
import { galleryImages } from "../data/gallery";

export default function GallerySection() {
  return (
    <section id="gallery" className="border-y border-white/10 bg-robot-navy/72 px-5 py-24 lg:px-6 light:border-slate-200 light:bg-slate-50">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title="Instagram & Gallery Preview" subtitle="A polished visual feed for food, interior details, offers, and memorable Robot Cafe moments." />
        <div className="mt-12">
          <GalleryLightbox images={galleryImages} />
        </div>
      </div>
    </section>
  );
}
