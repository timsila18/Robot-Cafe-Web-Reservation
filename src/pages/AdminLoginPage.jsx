import { motion } from "framer-motion";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/surveyService";
import BrandLogo from "../components/BrandLogo";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("submitting");

    try {
      const { token, user } = await adminLogin(email.trim().toLowerCase(), password);
      localStorage.setItem("robotCafeAdminToken", token);
      localStorage.setItem("robotCafeStaffUser", JSON.stringify(user));
      navigate(user?.role === "hostess" ? "/admin/reservations" : "/admin");
    } catch (loginError) {
      setError(loginError.message);
      setStatus("idle");
    }
  };

  return (
    <section className="px-5 py-16 sm:py-24">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel mx-auto max-w-xl rounded-[2rem] p-6 md:p-10"
      >
        <BrandLogo className="justify-start" imageClassName="h-16 max-w-[320px]" />
        <div className="mt-8 grid h-14 w-14 place-items-center rounded-full bg-robot-blue text-white shadow-glow">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <p className="mt-6 section-kicker">Staff access</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-white">Robot Cafe control room</h1>
        <p className="mt-4 leading-7 text-robot-muted">
          Admins manage menu, surveys, branches, and staff. Hostesses process reservations for their assigned branch.
        </p>

        <label className="mt-8 block">
          <span className="text-sm font-bold text-robot-silver">Email address</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            required
            className="focus-ring mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white"
          />
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-bold text-robot-silver">Password</span>
          <span className="relative mt-2 block">
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type={showPassword ? "text" : "password"}
              required
              className="focus-ring w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 pr-14 text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="focus-ring absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-robot-silver transition hover:bg-white/10 hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </span>
        </label>

        {error ? <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">{error}</p> : null}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-robot-blue px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-white shadow-glow disabled:opacity-60"
        >
          <LockKeyhole className="h-4 w-4" />
          {status === "submitting" ? "Signing in..." : "Open dashboard"}
        </button>
      </motion.form>
    </section>
  );
}
