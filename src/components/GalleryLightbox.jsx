import { X } from "lucide-react";
import { useState } from "react";

export default function GalleryLightbox({ images }) {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={image.title}
            className={`group focus-ring overflow-hidden rounded-3xl border border-white/10 bg-white/5 ${index === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}
            onClick={() => setActiveImage(image)}
          >
            <img src={image.src} alt={image.title} loading="lazy" className="h-full min-h-64 w-full object-cover transition duration-700 group-hover:scale-105" />
          </button>
        ))}
      </div>

      {activeImage ? (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-5 backdrop-blur" role="dialog" aria-modal="true">
          <button className="focus-ring absolute right-5 top-5 rounded-full bg-white/10 p-3 text-white" onClick={() => setActiveImage(null)} aria-label="Close gallery image">
            <X />
          </button>
          <img src={activeImage.src} alt={activeImage.title} className="max-h-[82vh] rounded-3xl object-contain shadow-glow" />
        </div>
      ) : null}
    </>
  );
}
