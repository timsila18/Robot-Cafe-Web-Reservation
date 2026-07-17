import { CheckCircle2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import PremiumButton from "../components/PremiumButton";
import { fetchReservationStatus } from "../services/reservationService";
import { createReservationFallback, getLatestReservation } from "../utils/reservations";

export default function ReservationStatusPage() {
  const [reservation, setReservation] = useState(() => getLatestReservation() || createReservationFallback());
  const [lookup, setLookup] = useState(reservation.confirmationNumber);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const checkStatus = async () => {
    const confirmationNumber = String(lookup || "").trim().toUpperCase();

    if (!confirmationNumber || confirmationNumber === "RC-PENDING") {
      setError("Please enter a valid confirmation number.");
      return;
    }

    setError("");
    setStatus("checking");
    try {
      const liveReservation = await fetchReservationStatus(confirmationNumber);
      setReservation(liveReservation);
      setLookup(liveReservation.confirmationNumber);
      setStatus("loaded");
    } catch (lookupError) {
      setError(lookupError.message);
      setStatus("idle");
    }
  };

  useEffect(() => {
    if (reservation.confirmationNumber && reservation.confirmationNumber !== "RC-PENDING") {
      checkStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="px-5 py-24 lg:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="glass-panel rounded-[2rem] p-7 sm:p-10">
          <h1 className="font-display text-4xl font-extrabold text-white">View Reservation Status</h1>
          <p className="mt-4 leading-8 text-robot-muted">Enter your confirmation number or review the latest reservation saved on this device.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="confirmationLookup">Confirmation number</label>
            <input
              id="confirmationLookup"
              className="focus-ring min-h-14 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 text-white"
              value={lookup}
              onChange={(event) => {
                setLookup(event.target.value);
                setError("");
              }}
            />
            <PremiumButton type="button" onClick={checkStatus}>
              <Search className="h-4 w-4" />
              {status === "checking" ? "Checking..." : "Check Status"}
            </PremiumButton>
          </div>
          {error ? <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100">{error}</p> : null}
          <div className="mt-8 rounded-3xl border border-robot-blue/25 bg-robot-blue/10 p-6">
            <CheckCircle2 className="h-8 w-8 text-robot-blue" />
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-robot-muted">Current Status</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">{reservation.status}</p>
            <p className="mt-3 text-robot-silver">Confirmation: {lookup || reservation.confirmationNumber}</p>
            <p className="mt-2 text-robot-silver">Branch: {reservation.branch?.shortName || reservation.branchName || "Robot Cafe"}</p>
            <p className="mt-2 text-robot-silver">Date: {reservation.date ? new Date(reservation.date).toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "Pending"}</p>
            <p className="mt-2 text-robot-silver">Time: {reservation.selectedTime || "Pending"}</p>
            <p className="mt-2 text-robot-silver">Reservation desk: {reservation.reservationInbox || "reservation@robotcafe.co.ke"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
