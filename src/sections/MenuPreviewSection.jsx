import { useMemo, useState } from "react";
import MenuCard from "../components/MenuCard";
import PremiumButton from "../components/PremiumButton";
import SectionHeading from "../components/SectionHeading";
import { menuCategories, menuItems } from "../data/menu";

export default function MenuPreviewSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...menuCategories];
  const filteredItems = useMemo(
    () => (activeCategory === "All" ? menuItems : menuItems.filter((item) => item.category === activeCategory)),
    [activeCategory]
  );

  return (
    <section id="menu" className="bg-robot-navy/72 px-5 py-24 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading align="left" title="Menu structure guests already know." subtitle="Signature plates, robotic brews, bistro classics, and desserts stay easy to browse with elevated presentation." />
          <PremiumButton as="a" href="/menu" variant="secondary">
            Full Menu
          </PremiumButton>
        </div>
        <div className="mt-10 flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`focus-ring shrink-0 rounded-full border px-5 py-3 text-sm font-bold transition ${
                activeCategory === category
                  ? "border-robot-blue bg-robot-blue text-white"
                  : "border-white/10 bg-white/5 text-robot-muted hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredItems.map((item, index) => (
            <MenuCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
