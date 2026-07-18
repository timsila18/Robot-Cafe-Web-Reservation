import { motion } from "framer-motion";
import { ArrowLeft, Building2, LogOut, ShieldCheck, UserRoundCog } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { siteConfig } from "../config/site";

function readStaffUser() {
  try {
    return JSON.parse(localStorage.getItem("robotCafeStaffUser") || "null");
  } catch {
    return null;
  }
}

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const staff = useMemo(() => readStaffUser(), []);

  useEffect(() => {
    if (!localStorage.getItem("robotCafeAdminToken")) {
      navigate("/staff-login");
      return;
    }
    if (staff?.role !== "admin") {
      navigate("/admin/reservations");
    }
  }, [navigate, staff]);

  const staffAccounts = [
    { name: "Robot Cafe Administrator", email: "admin@robotcafe.co.ke", role: "Admin", access: "Menu, reservations, surveys, users, branches" },
    { name: "Lana Plaza Hostess", email: "lana@robotcafe.co.ke", role: "Hostess", access: "Lana Plaza reservations only" },
    { name: "Imaara Mall Hostess", email: "imaara@robotcafe.co.ke", role: "Hostess", access: "Imaara Mall reservations only" },
  ];

  const logout = () => {
    localStorage.removeItem("robotCafeAdminToken");
    localStorage.removeItem("robotCafeStaffUser");
    navigate("/staff-login");
  };

  return (
    <section className="px-5 py-10 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-robot-blue">
              <ArrowLeft className="h-4 w-4" />
              Back to admin
            </Link>
            <p className="mt-6 section-kicker">Access control</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-white md:text-6xl">Users & Branches</h1>
            <p className="mt-4 max-w-3xl leading-8 text-robot-muted">
              Staff accounts are locked to known emails and secure passwords. No public registration is available on Robot Cafe.
            </p>
          </div>
          <button onClick={logout} className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-black text-white hover:border-robot-blue">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <div className="mt-10 grid gap-5">
          {staffAccounts.map((account) => (
            <article key={account.email} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-robot-blue text-white shadow-glow">
                    <UserRoundCog className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-white">{account.name}</h2>
                    <p className="mt-1 text-sm text-robot-muted">{account.email}</p>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-black text-robot-gold">{account.role}</p>
                  <p className="mt-1 text-sm text-robot-muted">{account.access}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {siteConfig.branches.map((branch) => (
            <article key={branch.id} className="glass-panel rounded-[2rem] p-6">
              <Building2 className="h-7 w-7 text-robot-blue" />
              <h2 className="mt-5 font-display text-2xl font-bold text-white">{branch.shortName}</h2>
              <p className="mt-3 leading-7 text-robot-muted">{branch.address}</p>
              <p className="mt-3 text-sm font-bold text-robot-silver">{branch.phone}</p>
              <p className="mt-2 text-sm text-robot-muted">{branch.reservationRoutingLabel}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-robot-gold/20 bg-robot-gold/10 p-6">
          <div className="flex gap-4">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-robot-gold" />
            <p className="leading-8 text-robot-silver">
              Password changes are managed through protected Vercel environment variables so outsiders cannot self-register or create staff accounts from the website.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
