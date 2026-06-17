import { motion } from "framer-motion";
import { Check, MapPin, MessageSquareText, Send, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { siteConfig } from "../config/site";
import { submitSurveyResponse } from "../services/surveyService";
import { cn } from "../utils/cn";

const surveyQuestions = [
  {
    key: "priceRating",
    tagsKey: "priceTags",
    title: "Prices",
    helper: "How did the pricing feel today?",
    suggestions: ["Fair for the experience", "Premium but worth it", "Bundle offers would help", "Too high today"],
  },
  {
    key: "waiterServiceRating",
    tagsKey: "waiterServiceTags",
    title: "Customer service",
    helper: "Waiters, welcome, speed, and care.",
    suggestions: ["Warm welcome", "Fast service", "Needed more table checks", "Very attentive"],
  },
  {
    key: "robotExperienceRating",
    tagsKey: "robotExperienceTags",
    title: "Robot Elixer experience",
    helper: "Presence, approach, and interaction.",
    suggestions: ["Fun and memorable", "Clear interaction", "Children loved it", "Could be more present"],
  },
  {
    key: "ambienceRating",
    tagsKey: "ambienceTags",
    title: "Ambience",
    helper: "The feeling, comfort, music, lighting, and mood.",
    suggestions: ["Premium feeling", "Comfortable seating", "Great for photos", "Too noisy"],
  },
  {
    key: "foodFlavorRating",
    tagsKey: "foodFlavorTags",
    title: "Food flavor",
    helper: "Taste, freshness, and presentation.",
    suggestions: ["Excellent flavor", "Fresh ingredients", "Beautiful plating", "Needs more seasoning"],
  },
  {
    key: "foodValueRating",
    tagsKey: "foodValueTags",
    title: "Food value",
    helper: "Did the food match the price?",
    suggestions: ["Worth the price", "Good quality", "More sides would help", "Expected more value"],
  },
  {
    key: "foodPortionRating",
    tagsKey: "foodPortionTags",
    title: "Food portions",
    helper: "Was the portion size satisfying?",
    suggestions: ["Portion was enough", "Perfect for sharing", "Could be larger", "Great presentation"],
  },
];

const defaultRatings = surveyQuestions.reduce(
  (acc, question) => ({ ...acc, [question.key]: 5, [question.tagsKey]: [] }),
  { overallRating: 5 }
);

function RatingButtons({ value, onChange, label }) {
  return (
    <div className="flex gap-2" aria-label={label}>
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          className={cn(
            "focus-ring grid h-10 w-10 place-items-center rounded-full border text-sm font-black transition sm:h-11 sm:w-11",
            value >= rating
              ? "border-robot-blue bg-robot-blue text-white shadow-glow"
              : "border-white/10 bg-white/5 text-robot-muted hover:border-robot-blue/50"
          )}
          aria-label={`${rating} out of 5`}
        >
          {rating}
        </button>
      ))}
    </div>
  );
}

function TagChip({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring rounded-full border px-3 py-2 text-xs font-bold transition",
        active
          ? "border-robot-gold bg-robot-gold text-robot-night"
          : "border-white/10 bg-white/5 text-robot-silver hover:border-robot-blue hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

export default function SurveyPage() {
  const [searchParams] = useSearchParams();
  const queryBranch = searchParams.get("branch");
  const [form, setForm] = useState({
    ...defaultRatings,
    branchId: siteConfig.branches.some((branch) => branch.id === queryBranch) ? queryBranch : "",
    tableCode: searchParams.get("table") || "",
    comment: "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const selectedBranch = useMemo(
    () => siteConfig.branches.find((branch) => branch.id === form.branchId),
    [form.branchId]
  );

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const toggleTag = (key, value) => {
    setForm((current) => {
      const tags = current[key] || [];
      return {
        ...current,
        [key]: tags.includes(value) ? tags.filter((tag) => tag !== value) : [...tags, value],
      };
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.branchId) {
      setError("Please choose the branch you visited.");
      return;
    }

    setStatus("submitting");
    try {
      await submitSurveyResponse({ ...form, source: "qr" });
      setStatus("submitted");
    } catch (submitError) {
      setError(submitError.message);
      setStatus("idle");
    }
  };

  if (status === "submitted") {
    return (
      <section className="px-5 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl rounded-[2rem] border border-robot-blue/30 bg-robot-navy/80 p-8 text-center shadow-glow backdrop-blur md:p-12"
        >
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-robot-blue text-white">
            <Check className="h-8 w-8" />
          </div>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.3em] text-robot-gold">Survey received</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white">Thank you for helping Robot Cafe improve.</h1>
          <p className="mt-5 leading-8 text-robot-muted">
            Your feedback for {selectedBranch?.shortName || "Robot Cafe"} has been saved. It helps the team improve service, food portions, value, and the robot dining experience.
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="relative px-5 py-10 sm:py-16">
      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(10,132,255,0.28),transparent_56%)]" />
      <form onSubmit={submit} className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-[2rem] p-5 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-kicker">20 second guest survey</p>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
                How was your Robot Cafe visit?
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-robot-muted md:text-base">
                Tap quick ratings and suggestions. No long typing needed.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-robot-silver">
              <Sparkles className="mr-2 inline h-4 w-4 text-robot-gold" />
              QR table feedback
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {siteConfig.branches.map((branch) => (
              <button
                key={branch.id}
                type="button"
                onClick={() => updateField("branchId", branch.id)}
                className={cn(
                  "focus-ring rounded-3xl border p-5 text-left transition",
                  form.branchId === branch.id
                    ? "border-robot-blue bg-robot-blue/18 shadow-glow"
                    : "border-white/10 bg-white/5 hover:border-robot-blue/50"
                )}
              >
                <span className="flex items-center gap-3 text-lg font-black text-white">
                  <MapPin className="h-5 w-5 text-robot-blue" />
                  {branch.name}
                </span>
                <span className="mt-2 block text-sm leading-6 text-robot-muted">{branch.address}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {surveyQuestions.map((question) => (
              <div key={question.key} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">{question.title}</h2>
                    <p className="mt-1 text-sm text-robot-muted">{question.helper}</p>
                  </div>
                  <RatingButtons value={form[question.key]} label={question.title} onChange={(value) => updateField(question.key, value)} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {question.suggestions.map((suggestion) => (
                    <TagChip key={suggestion} active={(form[question.tagsKey] || []).includes(suggestion)} onClick={() => toggleTag(question.tagsKey, suggestion)}>
                      {suggestion}
                    </TagChip>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-white">Overall experience</h2>
                <p className="mt-1 text-sm text-robot-muted">Your final quick rating for today.</p>
              </div>
              <RatingButtons value={form.overallRating} label="Overall experience" onChange={(value) => updateField("overallRating", value)} />
            </div>
            <label className="mt-5 block">
              <span className="flex items-center gap-2 text-sm font-bold text-robot-silver">
                <MessageSquareText className="h-4 w-4 text-robot-blue" />
                Optional note
              </span>
              <textarea
                value={form.comment}
                onChange={(event) => updateField("comment", event.target.value)}
                rows="3"
                placeholder="One quick thought, if you have it..."
                className="focus-ring mt-2 w-full rounded-2xl border border-white/10 bg-robot-night/70 px-4 py-3 text-white placeholder:text-robot-muted"
              />
            </label>
          </div>

          {error ? <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">{error}</p> : null}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-robot-blue to-[#0052cc] px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-white shadow-glow transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {status === "submitting" ? "Submitting..." : "Submit feedback"}
            <Send className="h-4 w-4" />
          </button>
        </motion.div>
      </form>
    </section>
  );
}
