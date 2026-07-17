import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, BarChart3, LogOut, Star, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchSurveyDashboard } from "../services/surveyService";
import { cn } from "../utils/cn";

function MetricCard({ icon: Icon, label, value, helper }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <Icon className="h-6 w-6 text-robot-blue" />
      <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-robot-muted">{label}</p>
      <p className="mt-2 font-display text-4xl font-bold text-white">{value}</p>
      {helper ? <p className="mt-2 text-sm text-robot-muted">{helper}</p> : null}
    </div>
  );
}

export default function AdminSurveysPage() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("robotCafeAdminToken");
    if (!token) {
      navigate("/my-account");
      return;
    }

    fetchSurveyDashboard(token)
      .then((data) => {
        setDashboard(data);
        setStatus("loaded");
      })
      .catch((loadError) => {
        setError(loadError.message);
        setStatus("error");
      });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("robotCafeAdminToken");
    localStorage.removeItem("robotCafeStaffUser");
    navigate("/my-account");
  };

  if (status === "loading") {
    return <section className="px-5 py-24 text-center text-robot-muted">Loading Robot Cafe survey insights...</section>;
  }

  if (status === "error") {
    return (
      <section className="px-5 py-24">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-400/30 bg-red-500/10 p-6 text-red-100">
          <AlertTriangle className="h-8 w-8" />
          <h1 className="mt-4 font-display text-3xl font-bold">Dashboard unavailable</h1>
          <p className="mt-3">{error}</p>
          <Link to="/my-account" className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-robot-night">
            Return to login
          </Link>
        </div>
      </section>
    );
  }

  const { summary, recommendations, responses } = dashboard;

  return (
    <section className="px-5 py-10 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-robot-blue">
              <ArrowLeft className="h-4 w-4" />
              Back to admin
            </Link>
            <p className="section-kicker">Robot Cafe admin</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-white md:text-6xl">Customer survey intelligence</h1>
            <p className="mt-4 max-w-3xl leading-8 text-robot-muted">
              Live feedback across Lana Plaza and Imaara Mall, translated into practical actions for the team.
            </p>
          </div>
          <button onClick={logout} className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-black text-white hover:border-robot-blue">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <MetricCard icon={Users} label="Responses" value={summary.totalResponses} helper="Latest 500 survey entries" />
          <MetricCard icon={Star} label="Overall average" value={`${summary.overallAverage || 0}/5`} helper="Guest satisfaction score" />
          <MetricCard icon={TrendingUp} label="Branches tracked" value={summary.branchSummary.length} helper="Separated by location" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="glass-panel rounded-[2rem] p-5 md:p-7">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-robot-blue" />
              <h2 className="font-display text-2xl font-bold text-white">Experience scores</h2>
            </div>
            <div className="mt-6 grid gap-3">
              {summary.metricAverages.map((metric) => (
                <div key={metric.field} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-white">{metric.label}</span>
                    <span className="font-display text-2xl font-bold text-robot-gold">{metric.value || 0}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-robot-blue to-robot-gold" style={{ width: `${((metric.value || 0) / 5) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-5 md:p-7">
            <h2 className="font-display text-2xl font-bold text-white">Recommended actions</h2>
            <div className="mt-6 grid gap-4">
              {recommendations.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className={cn("rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em]", item.priority === "high" ? "bg-robot-gold text-robot-night" : "bg-robot-blue/20 text-robot-blue")}>
                    {item.priority}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-bold text-white">{item.title}</h3>
                  <p className="mt-2 leading-7 text-robot-muted">{item.action}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-8 font-display text-2xl font-bold text-white">Top guest signals</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {summary.topTags.length ? (
                summary.topTags.map((tag) => (
                  <span key={tag.label} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-robot-silver">
                    {tag.label} <strong className="text-white">{tag.count}</strong>
                  </span>
                ))
              ) : (
                <span className="text-robot-muted">No quick comments yet.</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {summary.branchSummary.map((branch) => (
            <div key={branch.branchId} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="font-display text-2xl font-bold text-white">{branch.branchName}</h2>
              <p className="mt-2 text-robot-muted">{branch.count} responses</p>
              <p className="mt-4 font-display text-4xl font-bold text-robot-gold">{branch.overallAverage || 0}/5</p>
            </div>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
          <div className="border-b border-white/10 p-5">
            <h2 className="font-display text-2xl font-bold text-white">Recent responses</h2>
          </div>
          <div className="grid divide-y divide-white/10">
            {responses.slice(0, 12).map((response) => (
              <div key={response.id} className="grid gap-3 p-5 md:grid-cols-[1.2fr_0.7fr_1.2fr] md:items-center">
                <div>
                  <p className="font-bold text-white">{response.branch?.name}</p>
                  <p className="mt-1 text-sm text-robot-muted">{new Date(response.createdAt).toLocaleString()}</p>
                </div>
                <p className="font-display text-3xl font-bold text-robot-gold">{response.overallRating}/5</p>
                <p className="text-sm leading-6 text-robot-muted">{response.comment || "No written comment."}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
