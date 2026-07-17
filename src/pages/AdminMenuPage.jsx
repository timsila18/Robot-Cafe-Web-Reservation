import { motion } from "framer-motion";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchAdminMenu, saveAdminMenu } from "../services/surveyService";
import { cn } from "../utils/cn";

const emptyItem = {
  title: "",
  category: "Main Course",
  price: "KES ",
  description: "",
  featured: false,
  popular: false,
  signature: false,
  active: true,
  tags: [],
  media: { publicId: "", fallbackKey: "plates" },
};

function tokenOrRedirect(navigate) {
  const token = localStorage.getItem("robotCafeAdminToken");
  if (!token) navigate("/my-account");
  return token;
}

export default function AdminMenuPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState({ categories: ["All"], seasonalMenus: [], items: [] });
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = tokenOrRedirect(navigate);
    if (!token) return;

    fetchAdminMenu(token)
      .then((menu) => {
        setContent(menu);
        setStatus("loaded");
      })
      .catch((loadError) => {
        setError(loadError.message);
        setStatus("error");
      });
  }, [navigate]);

  const categoriesText = useMemo(() => (content.categories || []).join(", "), [content.categories]);

  const updateCategories = (value) => {
    setContent((current) => ({
      ...current,
      categories: value.split(",").map((item) => item.trim()).filter(Boolean),
    }));
  };

  const updateItem = (index, key, value) => {
    setContent((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    }));
  };

  const toggleItem = (index, key) => updateItem(index, key, !content.items[index][key]);

  const addItem = () => {
    setContent((current) => ({ ...current, items: [{ ...emptyItem }, ...current.items] }));
  };

  const removeItem = (index) => {
    setContent((current) => ({ ...current, items: current.items.filter((_, itemIndex) => itemIndex !== index) }));
  };

  const save = async () => {
    const token = tokenOrRedirect(navigate);
    if (!token) return;

    setError("");
    setMessage("");
    setStatus("saving");
    try {
      const saved = await saveAdminMenu(token, content);
      setContent(saved);
      setMessage("Menu saved. Public menu is now updated.");
      setStatus("loaded");
    } catch (saveError) {
      setError(saveError.message);
      setStatus("loaded");
    }
  };

  if (status === "loading") {
    return <section className="px-5 py-24 text-center text-robot-muted">Loading menu manager...</section>;
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
            <h1 className="mt-4 font-display text-4xl font-bold text-white md:text-6xl">Menu Manager</h1>
            <p className="mt-4 max-w-3xl leading-8 text-robot-muted">
              Update live dishes, prices, categories, status, and premium menu highlights.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={addItem} className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-black text-white hover:border-robot-blue">
              <Plus className="h-4 w-4" />
              Add Dish
            </button>
            <button onClick={save} disabled={status === "saving"} className="focus-ring inline-flex items-center gap-2 rounded-full bg-robot-blue px-5 py-3 text-sm font-black text-white shadow-glow disabled:opacity-60">
              <Save className="h-4 w-4" />
              {status === "saving" ? "Saving..." : "Save Menu"}
            </button>
          </div>
        </div>

        {message ? <p className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-100">{message}</p> : null}
        {error ? <p className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100">{error}</p> : null}

        <div className="mt-8 glass-panel rounded-[2rem] p-5">
          <label className="block text-sm font-black uppercase tracking-[0.18em] text-robot-muted">Categories</label>
          <input
            value={categoriesText}
            onChange={(event) => updateCategories(event.target.value)}
            className="focus-ring mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white"
            placeholder="All, Appetizers, Main Course, Desserts"
          />
        </div>

        <div className="mt-6 grid gap-5">
          {content.items.map((item, index) => (
            <article key={`${item.id || item.title}-${index}`} className={cn("rounded-[2rem] border p-5", item.active === false ? "border-white/10 bg-white/[0.025] opacity-70" : "border-white/10 bg-white/[0.04]")}>
              <div className="grid gap-4 lg:grid-cols-[1.3fr_0.8fr_0.65fr_auto]">
                <label>
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-robot-muted">Dish name</span>
                  <input value={item.title || ""} onChange={(event) => updateItem(index, "title", event.target.value)} className="focus-ring mt-2 w-full rounded-2xl border border-white/10 bg-robot-night/70 px-4 py-3 text-white" />
                </label>
                <label>
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-robot-muted">Category</span>
                  <input value={item.category || ""} onChange={(event) => updateItem(index, "category", event.target.value)} className="focus-ring mt-2 w-full rounded-2xl border border-white/10 bg-robot-night/70 px-4 py-3 text-white" />
                </label>
                <label>
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-robot-muted">Price</span>
                  <input value={item.price || ""} onChange={(event) => updateItem(index, "price", event.target.value)} className="focus-ring mt-2 w-full rounded-2xl border border-white/10 bg-robot-night/70 px-4 py-3 text-white" />
                </label>
                <button onClick={() => removeItem(index)} className="focus-ring mt-6 inline-flex h-12 items-center justify-center rounded-2xl border border-red-400/30 px-4 text-red-200 hover:bg-red-500/10" aria-label="Remove dish">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <label className="mt-4 block">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-robot-muted">Description</span>
                <textarea value={item.description || ""} onChange={(event) => updateItem(index, "description", event.target.value)} rows="2" className="focus-ring mt-2 w-full rounded-2xl border border-white/10 bg-robot-night/70 px-4 py-3 text-white" />
              </label>

              <div className="mt-4 flex flex-wrap gap-3">
                {["active", "featured", "popular", "signature"].map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleItem(index, key)}
                    className={cn(
                      "focus-ring rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.16em]",
                      item[key] ? "border-robot-gold bg-robot-gold text-robot-night" : "border-white/10 bg-white/5 text-robot-muted"
                    )}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
