import { motion } from "framer-motion";
import { BarChart3, BookOpenText, LogOut, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const adminCards = [
  {
    title: "Survey Insights",
    description: "See live guest feedback, branch summaries, and recommended actions.",
    href: "/admin/surveys",
    icon: BarChart3,
  },
  {
    title: "Menu Manager",
    description: "Update dishes, prices, categories, featured items, and availability.",
    href: "/admin/menu",
    icon: BookOpenText,
  },
];

export default function AdminHomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("robotCafeAdminToken")) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("robotCafeAdminToken");
    navigate("/admin/login");
  };

  return (
    <section className="px-5 py-16 sm:py-24">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">Robot Cafe admin</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-white md:text-6xl">Admin Control Room</h1>
            <p className="mt-4 max-w-2xl leading-8 text-robot-muted">
              Manage the live menu and review customer feedback from one premium admin area.
            </p>
          </div>
          <button onClick={logout} className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-black text-white hover:border-robot-blue">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {adminCards.map(({ title, description, href, icon: Icon }) => (
            <Link key={href} to={href} className="glass-panel premium-card-hover rounded-[2rem] p-8 transition hover:-translate-y-1">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-robot-blue text-white shadow-glow">
                <Icon className="h-7 w-7" />
              </span>
              <h2 className="mt-6 font-display text-3xl font-bold text-white">{title}</h2>
              <p className="mt-3 leading-8 text-robot-muted">{description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-robot-gold" />
            <p className="leading-8 text-robot-muted">
              Menu changes save to Supabase and update the public website menu immediately after visitors refresh or open the menu page.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
