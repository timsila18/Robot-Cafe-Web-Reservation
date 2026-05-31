import GalleryLightbox from "../components/GalleryLightbox";
import SectionHeading from "../components/SectionHeading";
import { galleryImages } from "../data/gallery";

export default function GallerySection() {
  return (
    <section id="gallery" className="luxury-surface border-y border-white/10 bg-robot-navy/72 px-5 py-24 lg:px-6 light:border-slate-200 light:bg-slate-50">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="section-kicker mb-5">Follow our journey</span>
            <SectionHeading align="left" title="Instagram & Gallery Preview" subtitle="A polished visual feed for food, interior details, offers, and memorable Robot Cafe moments." />
          </div>
          <a href="/gallery" className="focus-ring text-sm font-black uppercase tracking-[0.18em] text-robot-blue hover:text-white">
            View gallery
          </a>
        </div>
        <div className="mt-12">
          <GalleryLightbox images={galleryImages} />
        </div>
      </div>
    </section>
  );
}
