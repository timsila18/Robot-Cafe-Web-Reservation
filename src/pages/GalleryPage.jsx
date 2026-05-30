import { Camera, X } from "lucide-react";
import { useMemo, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import { getGalleryCategories, getGalleryItems } from "../services/contentService";

export default function GalleryPage() {
  const [category, setCategory] = useState("All");
  const [activeImage, setActiveImage] = useState(null);
  const categories = getGalleryCategories();
  const images = getGalleryItems();
  const filteredImages = useMemo(
    () => images.filter((image) => category === "All" || image.category === category),
    [category, images]
  );

  return (
    <main>
      <section className="border-b border-white/10 bg-robot-night px-5 py-20 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <SectionHeading
              align="left"
              title="Gallery"
              subtitle="A Cloudinary-ready visual library for interiors, food, robot moments, events, and holiday campaigns."
            />
            <div className="glass-panel rounded-3xl p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-robot-blue/15 text-robot-blue">
                  <Camera />
                </span>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-robot-muted">Media library</p>
                  <p className="font-display text-3xl font-bold text-white">{images.length} curated images</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-3 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`focus-ring shrink-0 rounded-full border px-5 py-3 text-sm font-bold transition ${
                  category === item ? "border-robot-blue bg-robot-blue text-white" : "border-white/10 bg-white/5 text-robot-muted hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-robot-navy/72 px-5 py-20 lg:px-6 light:bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {filteredImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setActiveImage(image)}
                className="group focus-ring mb-5 block w-full break-inside-avoid overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left"
              >
                <img
                  src={image.src}
                  alt={image.title}
                  loading="lazy"
                  className={`w-full object-cover transition duration-700 group-hover:scale-105 ${index % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"}`}
                />
                <div className="p-5">
                  <p className="font-bold text-white">{image.title}</p>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-robot-blue">{image.category}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeImage ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/82 p-5 backdrop-blur" role="dialog" aria-modal="true">
          <button className="focus-ring absolute right-5 top-5 rounded-full bg-white/10 p-3 text-white" onClick={() => setActiveImage(null)} aria-label="Close gallery image">
            <X />
          </button>
          <div className="max-w-5xl">
            <img src={activeImage.src} alt={activeImage.title} className="max-h-[80vh] rounded-3xl object-contain shadow-glow" />
            <p className="mt-4 text-center font-display text-2xl font-bold text-white">{activeImage.title}</p>
          </div>
        </div>
      ) : null}
    </main>
  );
}
