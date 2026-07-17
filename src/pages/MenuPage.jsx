import { Search, Sparkles, Star, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import MenuCard from "../components/MenuCard";
import PremiumButton from "../components/PremiumButton";
import SectionHeading from "../components/SectionHeading";
import { useMenuContent } from "../hooks/useMenuContent";

const filterOptions = [
  { key: "all", label: "All dishes" },
  { key: "featured", label: "Featured" },
  { key: "popular", label: "Popular" },
  { key: "signature", label: "Signature" },
];

function DishStrip({ title, icon: Icon, items }) {
  if (!items.length) return null;

  return (
    <div className="glass-panel rounded-3xl p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-robot-blue/15 text-robot-blue">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="font-display text-xl font-bold text-white">{title}</h3>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {items.slice(0, 3).map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="font-bold text-white">{item.title}</p>
            <p className="mt-1 text-sm text-robot-muted">{item.category}</p>
            <p className="mt-3 font-bold text-robot-gold">{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("all");
  const { categories, items, status } = useMenuContent();
  const featuredDishes = items.filter((item) => item.featured);
  const popularDishes = items.filter((item) => item.popular);
  const signatureDishes = items.filter((item) => item.signature);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery = `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || item.category === category;
      const matchesType = type === "all" || item[type];
      return matchesQuery && matchesCategory && matchesType;
    });
  }, [category, items, query, type]);

  const groupedItems = useMemo(() => {
    return categories
      .filter((item) => item !== "All")
      .map((groupCategory) => ({
        category: groupCategory,
        items: filteredItems.filter((item) => item.category === groupCategory),
      }))
      .filter((group) => group.items.length);
  }, [categories, filteredItems]);

  return (
    <main>
      <section className="border-b border-white/10 bg-robot-night px-5 py-20 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <SectionHeading
              align="left"
              title="Our Menu"
              subtitle={status === "loaded" ? "Live Robot Cafe menu content drawn from the QR platform, including cPanel-hosted dish photography when available." : "The familiar Robot Cafe menu journey, now upgraded with search, categories, signature picks, and premium dish imagery."}
            />
            <div className="glass-panel rounded-3xl p-5">
              <label className="text-sm font-bold uppercase tracking-[0.18em] text-robot-muted" htmlFor="menu-search">
                Search menu
              </label>
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <Search className="h-5 w-5 text-robot-blue" />
                <input
                  id="menu-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search dishes, categories, desserts..."
                  className="w-full bg-transparent text-white outline-none placeholder:text-robot-muted"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <DishStrip title="Featured Dishes" icon={Sparkles} items={featuredDishes} />
            <DishStrip title="Popular Dishes" icon={Star} items={popularDishes} />
            <DishStrip title="Signature Dishes" icon={Trophy} items={signatureDishes} />
          </div>
        </div>
      </section>

      <section id="menu" className="bg-robot-navy/72 px-5 py-20 lg:px-6 light:bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-3 overflow-x-auto pb-2">
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
            <div className="flex gap-3 overflow-x-auto pb-2">
              {filterOptions.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setType(item.key)}
                  className={`focus-ring shrink-0 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
                    type === item.key ? "border-robot-gold bg-robot-gold text-robot-night" : "border-white/10 bg-white/5 text-robot-muted hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-9 space-y-14">
            {groupedItems.map((group) => (
              <section key={group.category} className="scroll-mt-32" id={`category-${group.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                <div className="mb-6 flex flex-col gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="section-kicker">Menu category</p>
                    <h2 className="mt-3 font-display text-3xl font-bold text-white">{group.category}</h2>
                  </div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-robot-muted">{group.items.length} selections</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.items.map((item, index) => (
                    <MenuCard key={item.id} item={item} index={index} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {!filteredItems.length ? (
            <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-lg font-bold text-white">No dishes found.</p>
              <p className="mt-2 text-robot-muted">Try another category, search term, or dish type.</p>
            </div>
          ) : null}

          <div className="mt-12 flex justify-center">
            <PremiumButton as="a" href="/reservations" variant="gold">
              Reserve a Table
            </PremiumButton>
          </div>
        </div>
      </section>
    </main>
  );
}
