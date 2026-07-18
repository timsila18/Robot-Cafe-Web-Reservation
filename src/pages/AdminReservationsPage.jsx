import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, CheckCircle2, Download, History, Loader2, LogOut, MapPin, RefreshCw, Search, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import { fetchAdminReservations, updateReservationStatus } from "../services/surveyService";
import { cn } from "../utils/cn";

const statusStyles = {
  PENDING: "border-amber-300/30 bg-amber-400/10 text-amber-100",
  CONFIRMED: "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
  REJECTED: "border-red-300/30 bg-red-400/10 text-red-100",
  CANCELLED: "border-slate-300/20 bg-slate-400/10 text-slate-100",
  COMPLETED: "border-robot-gold/40 bg-robot-gold/10 text-robot-gold",
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

function formatDateTime(value) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function guestName(customer) {
  return [customer?.firstName, customer?.lastName].filter(Boolean).join(" ") || "Guest";
}

function searchableReservationText(reservation) {
  return [
    reservation.confirmationNumber,
    reservation.status,
    reservation.branch?.name,
    reservation.branch?.shortName,
    reservation.branchId,
    guestName(reservation.customer),
    reservation.customer?.firstName,
    reservation.customer?.lastName,
    reservation.customer?.email,
    reservation.customer?.phone,
    reservation.selectedTime,
    reservation.guests,
    reservation.notes,
    ...(reservation.preferences || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function excelEscape(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatExportDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-KE");
}

function formatExportDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString("en-KE");
}

function reservationExportRows(reservations) {
  return reservations.map((reservation) => ({
    "Confirmation Number": reservation.confirmationNumber,
    Status: reservation.status?.replaceAll("_", " "),
    Basket: reservation.status === "COMPLETED" ? "History" : "Ongoing",
    Branch: reservation.branch?.name || reservation.branchId,
    "Branch Short Name": reservation.branch?.shortName || "",
    "Reservation Date": formatExportDate(reservation.date),
    "Time Slot": reservation.selectedTime,
    Guests: reservation.guests,
    "First Name": reservation.customer?.firstName || "",
    "Last Name": reservation.customer?.lastName || "",
    "Guest Name": guestName(reservation.customer),
    Phone: reservation.customer?.phone || "",
    Email: reservation.customer?.email || "",
    Preferences: (reservation.preferences || []).join(", "),
    "Customer Details / Special Requests": reservation.notes || "",
    Source: reservation.source || "website",
    "Reservation Inbox": reservation.routingInbox || "",
    "Received At": formatExportDateTime(reservation.createdAt),
    "Last Updated": formatExportDateTime(reservation.updatedAt),
  }));
}

function downloadExcelReport(reservations, staff) {
  const rows = reservationExportRows(reservations);
  if (!rows.length) return false;

  const columns = Object.keys(rows[0]);
  const tableRows = rows
    .map(
      (row) =>
        `<tr>${columns
          .map((column) => `<td style="border:1px solid #d9e2ec;padding:8px;mso-number-format:'\\@';">${excelEscape(row[column])}</td>`)
          .join("")}</tr>`
    )
    .join("");
  const reportTitle = `${staff?.branchName || "All Branches"} Reservation Report`;
  const generatedAt = new Date().toLocaleString("en-KE");
  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: Arial, sans-serif; color: #050B12; }
      h1 { color: #0A84FF; }
      table { border-collapse: collapse; width: 100%; }
      th { background: #050B12; color: #FFFFFF; border: 1px solid #0A84FF; padding: 9px; text-align: left; }
    </style>
  </head>
  <body>
    <h1>${excelEscape(reportTitle)}</h1>
    <p>Generated: ${excelEscape(generatedAt)}</p>
    <p>Total reservations: ${rows.length}</p>
    <table>
      <thead><tr>${columns.map((column) => `<th>${excelEscape(column)}</th>`).join("")}</tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
  </body>
</html>`;

  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStamp = new Date().toISOString().slice(0, 10);
  const branchSlug = (staff?.branchName || "all-branches").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  link.href = url;
  link.download = `robot-cafe-reservations-${branchSlug}-${dateStamp}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  return true;
}

export default function AdminReservationsPage() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState(() => readStaffUser());
  const [reservations, setReservations] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [basket, setBasket] = useState("ongoing");

  const token = useMemo(() => localStorage.getItem("robotCafeAdminToken"), []);

  const loadReservations = async () => {
    if (!token) {
      navigate("/staff-login");
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
    navigate("/staff-login");
  };

  const visibleTitle = staff?.role === "hostess" ? `${staff.branchName} Reservations` : "All Branch Reservations";
  const ongoingReservations = useMemo(() => reservations.filter((reservation) => reservation.status !== "COMPLETED"), [reservations]);
  const historyReservations = useMemo(() => reservations.filter((reservation) => reservation.status === "COMPLETED"), [reservations]);
  const basketReservations = basket === "history" ? historyReservations : ongoingReservations;
  const filteredReservations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return basketReservations;
    return basketReservations.filter((reservation) => searchableReservationText(reservation).includes(query));
  }, [basketReservations, searchQuery]);

  const submitSearch = (event) => {
    event.preventDefault();
    setSearchQuery(searchInput);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  const exportReservations = () => {
    const exported = downloadExcelReport(reservations, staff);
    if (!exported) setError("There are no reservations available to export yet.");
  };

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
              Confirm, reject, cancel, complete, and monitor Robot Cafe booking requests from one secure staff view.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={exportReservations} disabled={status === "loading" || reservations.length === 0} className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-robot-gold/40 px-5 py-3 text-sm font-black text-robot-gold hover:bg-robot-gold hover:text-robot-night disabled:cursor-not-allowed disabled:opacity-50">
              <Download className="h-4 w-4" />
              Export Excel
            </button>
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

        {status !== "loading" ? (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-premium sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { id: "ongoing", label: "Ongoing", count: ongoingReservations.length, icon: CalendarDays },
                { id: "history", label: "History", count: historyReservations.length, icon: History },
              ].map((item) => {
                const Icon = item.icon;
                const active = basket === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setBasket(item.id);
                      setSearchInput("");
                      setSearchQuery("");
                    }}
                    className={cn(
                      "focus-ring flex min-h-14 items-center justify-between rounded-2xl border px-5 py-3 text-left transition",
                      active ? "border-robot-blue bg-robot-blue text-white shadow-glow" : "border-white/10 bg-robot-night/60 text-robot-silver hover:border-robot-blue/50"
                    )}
                  >
                    <span className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.14em]">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">{item.count}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={submitSearch} className="mt-5">
              <label htmlFor="reservationSearch" className="text-sm font-black uppercase tracking-[0.18em] text-robot-gold">
                Search reservation
              </label>
              <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-robot-muted" />
                  <input
                    id="reservationSearch"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search by name, code, phone, email, status, branch, notes..."
                    className="focus-ring min-h-14 w-full rounded-2xl border border-white/10 bg-robot-night/70 py-3 pl-12 pr-4 text-white placeholder:text-robot-muted"
                  />
                </div>
                <button type="submit" className="focus-ring inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-robot-blue px-5 text-sm font-black uppercase tracking-[0.14em] text-white shadow-glow hover:bg-[#2d96ff]">
                  <Search className="h-4 w-4" />
                  Search reservation
                </button>
                {searchQuery ? (
                  <button type="button" onClick={clearSearch} className="focus-ring inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/10 px-5 text-sm font-black text-robot-silver hover:border-robot-blue">
                    Clear
                  </button>
                ) : null}
              </div>
              <p className="mt-3 text-sm text-robot-muted">
                Showing {filteredReservations.length} of {basketReservations.length} {basket === "history" ? "completed history" : "ongoing"} reservations{searchQuery ? ` for "${searchQuery}"` : ""}.
              </p>
            </form>
          </div>
        ) : null}

        {status === "loading" ? (
          <div className="mt-10 flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-robot-muted sm:flex-row sm:items-center">
            <BrandLogo imageClassName="h-12 max-w-[230px]" />
            <span className="inline-flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-robot-blue" />
              Loading reservations...
            </span>
          </div>
        ) : null}

        {status !== "loading" && reservations.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
            <CalendarDays className="mx-auto h-10 w-10 text-robot-blue" />
            <h2 className="mt-4 font-display text-2xl font-bold text-white">No reservations yet</h2>
            <p className="mt-3 text-robot-muted">New website reservation requests will appear here automatically.</p>
          </div>
        ) : null}

        {status !== "loading" && reservations.length > 0 && filteredReservations.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
            {basket === "history" && !searchQuery ? <History className="mx-auto h-10 w-10 text-robot-blue" /> : <Search className="mx-auto h-10 w-10 text-robot-blue" />}
            <h2 className="mt-4 font-display text-2xl font-bold text-white">{basket === "history" && !searchQuery ? "No completed visits yet" : "No matching reservations"}</h2>
            <p className="mt-3 text-robot-muted">
              {basket === "history" && !searchQuery
                ? "When staff mark a visit as Completed, it will move here automatically."
                : "Try a guest name, phone number, email address, confirmation code, branch, or status."}
            </p>
          </div>
        ) : null}

        <div className="mt-8 grid gap-5">
          {filteredReservations.map((reservation) => (
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
                    <p><strong className="text-white">Received:</strong> {formatDateTime(reservation.createdAt)}</p>
                    <p className="sm:col-span-2"><strong className="text-white">Email:</strong> {reservation.customer?.email || "Not provided"}</p>
                    <p className="sm:col-span-2"><strong className="text-white">Preferences:</strong> {(reservation.preferences || []).join(", ") || "None"}</p>
                  </div>
                  {reservation.notes ? (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-robot-night/60 p-4 text-sm leading-6 text-robot-silver">
                      <p className="font-black uppercase tracking-[0.16em] text-robot-gold">Customer details entered</p>
                      <p className="mt-2">{reservation.notes}</p>
                    </div>
                  ) : null}
                </div>

                <div className="grid min-w-56 gap-2">
                  {reservation.status !== "COMPLETED" ? (
                    <>
                      <button onClick={() => updateStatus(reservation, "COMPLETED")} disabled={Boolean(updatingId)} className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-robot-gold px-4 py-3 text-sm font-black text-robot-night disabled:opacity-60">
                        <CheckCircle2 className="h-4 w-4" />
                        Completed
                      </button>
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
                    </>
                  ) : (
                    <button onClick={() => updateStatus(reservation, "PENDING")} disabled={Boolean(updatingId)} className="focus-ring rounded-full border border-white/10 px-4 py-3 text-sm font-black text-robot-silver hover:border-robot-blue disabled:opacity-60">
                      Reopen to Ongoing
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
