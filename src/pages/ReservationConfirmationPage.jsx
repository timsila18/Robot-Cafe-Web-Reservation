import { CalendarCheck, Clock, Hash, MapPin, Users } from "lucide-react";
import { useLocation } from "react-router-dom";
import PremiumButton from "../components/PremiumButton";
import { createReservationFallback, getLatestReservation } from "../utils/reservations";

export default function ReservationConfirmationPage() {
  const { state } = useLocation();
  const reservation = state?.reservation || getLatestReservation() || createReservationFallback();

  const summary = [
    { icon: Hash, label: "Confirmation Number", value: reservation.confirmationNumber },
    { icon: CalendarCheck, label: "Date", value: reservation.date },
    { icon: Clock, label: "Time", value: reservation.selectedTime },
    { icon: Users, label: "Guest Count", value: `${reservation.guests} ${Number(reservation.guests) === 1 ? "guest" : "guests"}` },
    { icon: MapPin, label: "Branch", value: reservation.branch?.shortName || reservation.branchName || "Robot Cafe" },
  ];

  return (
    <section className="px-5 py-24 lg:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="glass-panel premium-ring rounded-[2rem] p-7 sm:p-10">
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-robot-gold">Booking confirmation</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-white sm:text-5xl">Your reservation request has been received.</h1>
          <p className="mt-5 max-w-3xl leading-8 text-robot-muted">
            Thank you{reservation.firstName ? `, ${reservation.firstName}` : ""}. Your request has been routed to the {reservation.reservationRoutingLabel || "Robot Cafe reservation desk"} for confirmation.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {summary.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <Icon className="h-6 w-6 text-robot-blue" />
                <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-robot-muted">{label}</p>
                <p className="mt-2 font-display text-2xl font-bold text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-robot-blue/25 bg-robot-blue/10 p-6">
            <h2 className="font-display text-2xl font-bold text-white">Reservation Summary</h2>
            <div className="mt-4 grid gap-3 text-robot-silver sm:grid-cols-2">
              <p><strong className="text-white">Name:</strong> {reservation.firstName} {reservation.lastName}</p>
              <p><strong className="text-white">Phone:</strong> {reservation.phone || "Not provided"}</p>
              <p><strong className="text-white">Email:</strong> {reservation.email || "Not provided"}</p>
              <p><strong className="text-white">Status:</strong> {reservation.status}</p>
              <p><strong className="text-white">Branch Address:</strong> {reservation.branchAddress || reservation.branch?.address || "Robot Cafe"}</p>
              <p><strong className="text-white">Reservation Desk:</strong> {reservation.reservationInbox || "reservation@robotcafe.co.ke"}</p>
            </div>
            {reservation.preferences?.length ? (
              <p className="mt-4 text-robot-silver"><strong className="text-white">Preferences:</strong> {reservation.preferences.join(", ")}</p>
            ) : null}
            {reservation.notes ? (
              <p className="mt-4 text-robot-silver"><strong className="text-white">Special Requests:</strong> {reservation.notes}</p>
            ) : null}
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <PremiumButton as="a" href="/reservations/status">View Reservation Status</PremiumButton>
            <PremiumButton as="a" href="/reservations/modify" variant="secondary">Modify Reservation</PremiumButton>
            <PremiumButton as="a" href="/reservations/cancel" variant="secondary">Cancel Reservation</PremiumButton>
          </div>
        </div>
      </div>
    </section>
  );
}
