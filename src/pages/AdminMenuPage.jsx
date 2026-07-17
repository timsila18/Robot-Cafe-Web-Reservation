import { motion } from "framer-motion";
import { ArrowLeft, BookOpenText, ExternalLink, LogOut, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingBrand from "../components/LoadingBrand";
import { cn } from "../utils/cn";

function tokenOrRedirect(navigate) {
  const token = localStorage.getItem("robotCafeAdminToken");
  if (!token) navigate("/my-account");
  return token;
}

function logout(navigate) {
  localStorage.removeItem("robotCafeAdminToken");
  localStorage.removeItem("robotCafeStaffUser");
  navigate("/my-account");
}

async function fetchLiveMenu() {
  const response = await fetch("/api/content/menu");
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Unable to load live menu.");
  return data;
}

function branchLabel(item) {
  const labels = item.branchLabels || item.branches || item.availableBranches || [];
  if (!labels.length) return "Available where listed in QR menu";
  return `Available in ${labels.join(" and ")}`;
}

export default function AdminMenuPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState({ categories: ["All"], items: [] });
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!tokenOrRedirect(navigate)) return;

    fetchLiveMenu()
      .then((menu) => {
        setContent(menu);
        setStatus("loaded");
      })
      .catch((loadError) => {
        setError(loadError.message);
        setStatus("error");
      });
  }, [navigate]);

  const categories = useMemo(() => {
    const derived = (content.items || []).map((item) => item.category).filter(Boolean);
    return Array.from(new Set(["All", ...(content.categories || []), ...derived]));
  }, [content]);

  const visibleItems = useMemo(() => {
    const search = query.trim().toLowerCase();
    return (content.items || []).filter((item) => {
      const categoryMatch = activeCategory === "All" || item.category === activeCategory;
      const queryMatch = !search || [item.title, item.price, item.category, item.description, branchLabel(item)].join(" ").toLowerCase().includes(search);
      return categoryMatch && queryMatch;
    });
  }, [activeCategory, content.items, query]);

  const groupedItems = useMemo(() => {
    return visibleItems.reduce((groups, item) => {
      const key = item.category || "Uncategorized";
      groups[key] = groups[key] || [];
      groups[key].push(item);
      return groups;
    }, {});
  }, [visibleItems]);

  if (status === "loading") {
    return <LoadingBrand label="Loading live QR menu..." />;
  }

  return (
    <section className="px-5 py-10 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-robot-blue">
              <ArrowLeft className="h-4 w-4" />
              Back to admin
            </Link>
            <p className="mt-6 section-kicker">QR menu viewer</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-white md:text-6xl">Live Menu</h1>
            <p className="mt-4 max-w-3xl leading-8 text-robot-muted">
              This is a read-only view of the customer menu currently drawn from the Robot Cafe QR menu source.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/menu" target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-black text-white hover:border-robot-blue">
              <ExternalLink className="h-4 w-4" />
              Public Menu
            </a>
            <button onClick={() => logout(navigate)} className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-black text-white hover:border-robot-blue">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {error ? <p className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100">{error}</p> : null}

        <div className="mt-8 grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-robot-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search dish, price, branch, or category"
              className="focus-ring w-full rounded-2xl border border-white/10 bg-robot-night/70 py-4 pl-12 pr-4 text-white"
            />
          </label>
          <div className="flex items-center gap-3 rounded-2xl border border-robot-blue/20 bg-robot-blue/10 px-4 py-3 text-sm font-bold text-robot-silver">
            <BookOpenText className="h-5 w-5 text-robot-blue" />
            {visibleItems.length} of {(content.items || []).length} dishes
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "focus-ring shrink-0 rounded-full border px-4 py-2 text-sm font-black transition",
                activeCategory === category ? "border-robot-blue bg-robot-blue text-white shadow-glow" : "border-white/10 bg-white/5 text-robot-silver hover:border-robot-blue"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-10">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="font-display text-2xl font-bold text-white">{category}</h2>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-robot-muted">{items.length} items</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <article key={`${item.id}-${item.title}`} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-xl font-bold text-white">{item.title}</h3>
                        <p className="mt-2 text-sm font-bold text-robot-gold">{item.price}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-robot-muted">{item.category}</span>
                    </div>
                    <p className="mt-4 min-h-12 text-sm leading-6 text-robot-muted">{item.description || "No description added in QR menu."}</p>
                    <p className="mt-4 rounded-2xl border border-robot-blue/20 bg-robot-blue/10 px-4 py-3 text-xs font-bold text-robot-silver">{branchLabel(item)}</p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
