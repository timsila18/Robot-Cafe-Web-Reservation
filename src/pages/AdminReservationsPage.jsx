import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, CheckCircle2, Loader2, LogOut, MapPin, RefreshCw, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchAdminReservations, updateReservationStatus } from "../services/surveyService";
import { cn } from "../utils/cn";

const statusStyles = {
  PENDING: "border-amber-300/30 bg-amber-400/10 text-amber-100",
  CONFIRMED: "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
  REJECTED: "border-red-300/30 bg-red-400/10 text-red-100",
  CANCELLED: "border-slate-300/20 bg-slate-400/10 text-slate-100",
  CANCELLATION_REQUESTED: "border-orange-300/30 bg-orange-400/10 text-orange-100",
  MODIFICATION_REQUESTED: "border-blue-300/30 bg-blue-400/10 text-blue-100",
};

function readStaffUser() {
  try {
    return JSON.parse(localStorage.getItem("robotCafeStaffUser") || "null");
  } catch {
    return null;
  }
}

function formatDate(value) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-KE", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

function guestName(customer) {
  return [customer?.firstName, customer?.lastName].filter(Boolean).join(" ") || "Guest";
}

export default function AdminReservationsPage() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState(() => readStaffUser());
  const [reservations, setReservations] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const token = useMemo(() => localStorage.getItem("robotCafeAdminToken"), []);

  const loadReservations = async () => {
    if (!token) {
      navigate("/my-account");
      return;
    }

    setError("");
    setStatus("loading");
    try {
      const data = await fetchAdminReservations(token);
      setReservations(data.reservations || []);
      if (data.staff) {
        setStaff(data.staff);
        localStorage.setItem("robotCafeStaffUser", JSON.stringify(data.staff));
      }
      setStatus("loaded");
    } catch (loadError) {
      setError(loadError.message);
      setStatus("error");
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const updateStatus = async (reservation, nextStatus) => {
    setUpdatingId(`${reservation.id}:${nextStatus}`);
    setError("");
    try {
      const updated = await updateReservationStatus(token, reservation.id, nextStatus, reservation.notes);
      setReservations((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setUpdatingId("");
    }
  };

  const logout = () => {
    localStorage.removeItem("robotCafeAdminToken");
    localStorage.removeItem("robotCafeStaffUser");
    navigate("/my-account");
  };

  const visibleTitle = staff?.role === "hostess" ? `${staff.branchName} Reservations` : "All Branch Reservations";

  return (
    <section className="px-5 py-10 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-robot-blue">
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
            <p className="mt-6 section-kicker">Reservation desk</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-white md:text-6xl">{visibleTitle}</h1>
            <p className="mt-4 max-w-3xl leading-8 text-robot-muted">
              Confirm, reject, cancel, and monitor Robot Cafe booking requests from one secure staff view.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={loadReservations} className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-black text-white hover:border-robot-blue">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button onClick={logout} className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-black text-white hover:border-robot-blue">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {error ? <p className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100">{error}</p> : null}

        {status === "loading" ? (
          <div className="mt-10 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-robot-muted">
            <Loader2 className="h-5 w-5 animate-spin text-robot-blue" />
            Loading reservations...
          </div>
        ) : null}

        {status !== "loading" && reservations.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
            <CalendarDays className="mx-auto h-10 w-10 text-robot-blue" />
            <h2 className="mt-4 font-display text-2xl font-bold text-white">No reservations yet</h2>
            <p className="mt-3 text-robot-muted">New website reservation requests will appear here automatically.</p>
          </div>
        ) : null}

        <div className="mt-8 grid gap-5">
          {reservations.map((reservation) => (
            <article key={reservation.id} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-premium">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={cn("rounded-full border px-3 py-1 text-xs font-black", statusStyles[reservation.status] || statusStyles.PENDING)}>
                      {reservation.status.replaceAll("_", " ")}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-robot-silver">
                      #{reservation.confirmationNumber}
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-bold text-white">{guestName(reservation.customer)}</h2>
                  <p className="mt-2 flex items-center gap-2 text-sm text-robot-muted">
                    <MapPin className="h-4 w-4 text-robot-blue" />
                    {reservation.branch?.shortName || reservation.branchId}
                  </p>
                  <div className="mt-4 grid gap-2 text-sm leading-6 text-robot-muted sm:grid-cols-2 lg:grid-cols-4">
                    <p><strong className="text-white">Date:</strong> {formatDate(reservation.date)}</p>
                    <p><strong className="text-white">Time:</strong> {reservation.selectedTime}</p>
                    <p><strong className="text-white">Guests:</strong> {reservation.guests}</p>
                    <p><strong className="text-white">Phone:</strong> {reservation.customer?.phone || "Not provided"}</p>
                    <p className="sm:col-span-2"><strong className="text-white">Email:</strong> {reservation.customer?.email || "Not provided"}</p>
                    <p className="sm:col-span-2"><strong className="text-white">Preferences:</strong> {(reservation.preferences || []).join(", ") || "None"}</p>
                  </div>
                  {reservation.notes ? <p className="mt-4 rounded-2xl border border-white/10 bg-robot-night/60 p-4 text-sm leading-6 text-robot-silver">{reservation.notes}</p> : null}
                </div>

                <div className="grid min-w-56 gap-2">
                  <button onClick={() => updateStatus(reservation, "CONFIRMED")} disabled={Boolean(updatingId)} className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-black text-white disabled:opacity-60">
                    <CheckCircle2 className="h-4 w-4" />
                    Confirm
                  </button>
                  <button onClick={() => updateStatus(reservation, "REJECTED")} disabled={Boolean(updatingId)} className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-red-400/30 px-4 py-3 text-sm font-black text-red-100 hover:bg-red-500/10 disabled:opacity-60">
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                  <button onClick={() => updateStatus(reservation, "CANCELLED")} disabled={Boolean(updatingId)} className="focus-ring rounded-full border border-white/10 px-4 py-3 text-sm font-black text-white hover:border-robot-blue disabled:opacity-60">
                    Cancel
                  </button>
                  <button onClick={() => updateStatus(reservation, "PENDING")} disabled={Boolean(updatingId)} className="focus-ring rounded-full border border-white/10 px-4 py-3 text-sm font-black text-robot-silver hover:border-robot-blue disabled:opacity-60">
                    Mark Pending
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
