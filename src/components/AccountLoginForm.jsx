import { motion } from "framer-motion";
import { LockKeyhole, ShieldCheck, UserRoundCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/surveyService";

export default function AccountLoginForm() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();

  async function onSubmit(data) {
    setError("");
    setStatus("submitting");

    try {
      const { token, user } = await adminLogin(String(data.email || "").trim().toLowerCase(), data.password);
      localStorage.setItem("robotCafeAdminToken", token);
      localStorage.setItem("robotCafeStaffUser", JSON.stringify(user));
      navigate(user?.role === "hostess" ? "/admin/reservations" : "/admin");
    } catch (loginError) {
      setError(loginError.message);
      setStatus("idle");
    }
  }

  const inputClass = "focus-ring rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white placeholder:text-robot-muted/60";

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-7 md:p-10"
      >
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-robot-blue text-white shadow-glow">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <p className="mt-6 text-center section-kicker">Staff only</p>
        <h1 className="mt-4 text-center font-display text-4xl font-bold text-white">My Account</h1>
        <p className="mt-4 text-center leading-7 text-robot-muted">
          Secure access for Robot Cafe admins and hostesses. Guests do not need an account to view the website, explore menus, or make reservations.
        </p>

        <div className="mt-8 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-robot-silver">
            Staff email address *
            <input className={inputClass} type="email" autoComplete="username" {...register("email", { required: true })} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-robot-silver">
            Password *
            <input className={inputClass} type="password" autoComplete="current-password" {...register("password", { required: true })} />
          </label>
        </div>

        {error ? <p className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-bold text-red-100">{error}</p> : null}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-robot-blue px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-white shadow-glow disabled:opacity-60"
        >
          <LockKeyhole className="h-4 w-4" />
          {status === "submitting" ? "Checking credentials..." : "Open Staff Dashboard"}
        </button>
      </motion.form>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-panel rounded-3xl p-7 md:p-10">
        <p className="section-kicker">Role protected</p>
        <h2 className="mt-4 font-display text-3xl font-bold text-white">Built for daily operations</h2>
        <p className="mt-4 leading-8 text-robot-muted">
          Admins can manage menus, reservations, surveys, branches, and hostess access. Hostesses only see and process reservations for their assigned Robot Cafe branch.
        </p>
        <div className="mt-8 grid gap-4">
          {[
            ["Admin", "Full access to menu management, surveys, reservations, users, and branches."],
            ["Lana Plaza Hostess", "Reservation processing limited to Lana Plaza."],
            ["Imaara Mall Hostess", "Reservation processing limited to Imaara Mall."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <UserRoundCheck className="h-6 w-6 text-robot-blue" />
              <h3 className="mt-4 font-display text-xl font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-robot-muted">{text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
