import { useState } from "react";
import PremiumButton from "../components/PremiumButton";
import { createReservationFallback, getLatestReservation, saveLatestReservation } from "../utils/reservations";

export default function ReservationCancelPage() {
  const [reservation, setReservation] = useState(() => getLatestReservation() || createReservationFallback());
  const [cancelled, setCancelled] = useState(reservation.status === "Cancellation requested");

  function requestCancellation() {
    const updated = { ...reservation, status: "Cancellation requested" };
    saveLatestReservation(updated);
    setReservation(updated);
    setCancelled(true);
  }

  return (
    <section className="px-5 py-24 lg:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="glass-panel rounded-[2rem] p-7 sm:p-10">
          <h1 className="font-display text-4xl font-extrabold text-white">Cancel Reservation</h1>
          <p className="mt-4 leading-8 text-robot-muted">
            Request cancellation for confirmation number <strong className="text-white">{reservation.confirmationNumber}</strong>.
          </p>
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-robot-silver">
            <p><strong className="text-white">Date:</strong> {reservation.date}</p>
            <p className="mt-2"><strong className="text-white">Time:</strong> {reservation.selectedTime}</p>
            <p className="mt-2"><strong className="text-white">Guests:</strong> {reservation.guests}</p>
          </div>
          <PremiumButton type="button" variant={cancelled ? "secondary" : "gold"} className="mt-8" onClick={requestCancellation}>
            {cancelled ? "Cancellation Requested" : "Request Cancellation"}
          </PremiumButton>
          {cancelled ? <p className="mt-5 text-sm font-semibold text-robot-silver">Our host team will review and confirm the cancellation shortly.</p> : null}
        </div>
      </div>
    </section>
  );
}
