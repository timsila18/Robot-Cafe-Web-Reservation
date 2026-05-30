import ReservationForm from "../components/ReservationForm";
import SectionHeading from "../components/SectionHeading";
import { getLatestReservation } from "../utils/reservations";

export default function ReservationModifyPage() {
  const reservation = getLatestReservation();

  return (
    <section className="px-5 py-24 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          align="left"
          title="Modify Reservation"
          subtitle={reservation ? `Updating reservation ${reservation.confirmationNumber}.` : "Start a new request or update your reservation details."}
        />
        <div className="mt-10">
          <ReservationForm />
        </div>
      </div>
    </section>
  );
}
