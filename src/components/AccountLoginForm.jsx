import { useState } from "react";
import { useForm } from "react-hook-form";
import { Gift, LockKeyhole, Mail, Sparkles, Star, UserPlus } from "lucide-react";
import PremiumButton from "./PremiumButton";

export default function AccountLoginForm() {
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");
  const { register, handleSubmit } = useForm();

  function onSubmit(data) {
    if (mode === "login") {
      setMessage(`Welcome back${data.email ? `, ${data.email.split("@")[0]}` : ""}. Account access is ready for backend integration.`);
    }
    if (mode === "register") {
      setMessage("Your member profile is ready for loyalty points, rewards, and member-only offers.");
    }
    if (mode === "forgot") {
      setMessage("Password reset instructions would be sent to your email when backend email is connected.");
    }
  }

  const inputClass = "focus-ring rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white";
  const tabs = [
    { key: "login", label: "Login", icon: LockKeyhole },
    { key: "register", label: "Register", icon: UserPlus },
    { key: "forgot", label: "Forgot Password", icon: Mail },
  ];

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <form onSubmit={handleSubmit(onSubmit)} className="glass-panel rounded-3xl p-7">
        <h1 className="text-center font-display text-3xl font-bold text-white">My Account</h1>
        <p className="mt-3 text-center leading-7 text-robot-muted">Access orders, reservations, loyalty rewards, and saved guest details.</p>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              type="button"
              key={key}
              onClick={() => {
                setMode(key);
                setMessage("");
              }}
              className={`focus-ring rounded-2xl border px-4 py-3 text-sm font-extrabold transition ${
                mode === key ? "border-robot-blue bg-robot-blue text-white" : "border-white/10 bg-white/5 text-robot-silver hover:border-robot-blue/50"
              }`}
            >
              <Icon className="mx-auto mb-2 h-5 w-5" />
              {label}
            </button>
          ))}
        </div>

        <div className="mt-7 grid gap-4">
          {mode === "register" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-robot-silver">
                First Name *
                <input className={inputClass} {...register("firstName", { required: mode === "register" })} />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-robot-silver">
                Last Name *
                <input className={inputClass} {...register("lastName", { required: mode === "register" })} />
              </label>
            </div>
          ) : null}
          <label className="grid gap-2 text-sm font-semibold text-robot-silver">
            Username or email address *
            <input className={inputClass} type="email" {...register("email", { required: true })} />
          </label>
          {mode !== "forgot" ? (
            <label className="grid gap-2 text-sm font-semibold text-robot-silver">
              Password *
              <input className={inputClass} type="password" {...register("password", { required: true })} />
            </label>
          ) : null}
          {mode === "register" ? (
            <label className="grid gap-2 text-sm font-semibold text-robot-silver">
              Phone Number
              <input className={inputClass} placeholder="+254..." {...register("phone")} />
            </label>
          ) : null}
        </div>

        <PremiumButton type="submit" className="mt-6">
          {mode === "login" ? "Sign In" : mode === "register" ? "Create Account" : "Send Reset Link"}
        </PremiumButton>
        {message ? <p className="mt-5 rounded-2xl border border-robot-blue/30 bg-robot-blue/10 p-4 text-sm text-robot-silver">{message}</p> : null}
      </form>

      <div className="glass-panel rounded-3xl p-7">
        <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-robot-gold">Loyalty architecture</p>
        <h2 className="mt-4 font-display text-3xl font-bold text-white">Robot Cafe Rewards</h2>
        <p className="mt-4 leading-8 text-robot-muted">
          The account structure is prepared for customer points, rewards, promotions, and member-only offers once backend services are connected.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            { icon: Star, title: "Customer Points", text: "Track points per order, booking, or promotion." },
            { icon: Gift, title: "Rewards", text: "Redeem points for dining perks and special treats." },
            { icon: Sparkles, title: "Promotions", text: "Personalized seasonal offers and birthday moments." },
            { icon: UserPlus, title: "Member-only Offers", text: "Exclusive discounts for registered Robot Cafe members." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <Icon className="h-6 w-6 text-robot-blue" />
              <h3 className="mt-4 font-display text-xl font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-robot-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
