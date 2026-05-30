import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import PremiumButton from "./PremiumButton";

export default function ReservationForm({ compact = false }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedTime, setSelectedTime] = useState("12:30 pm - 1:00 pm");
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm({
    defaultValues: { guests: "2" },
  });

  async function continueToGuestInfo() {
    await trigger(["guests", "date"]);
    setStep(2);
  }

  function onSubmit(data) {
    const confirmationNumber = `RCB-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const reservation = {
      ...data,
      date: data.date || "Pending host confirmation",
      selectedTime,
      preferences: selectedPreferences,
      confirmationNumber,
      status: "Pending host confirmation",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("robotCafeLatestReservation", JSON.stringify(reservation));
    navigate("/reservations/confirmation", { state: { reservation } });
  }

  function togglePreference(preference) {
    setSelectedPreferences((current) =>
      current.includes(preference) ? current.filter((item) => item !== preference) : [...current, preference]
    );
  }

  const inputClass = "focus-ring w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-robot-muted";
  const timeSlots = [
    "6:30 am - 7:00 am",
    "7:00 am - 7:30 am",
    "7:30 am - 8:00 am",
    "8:00 am - 8:30 am",
    "8:30 am - 9:00 am",
    "9:00 am - 9:30 am",
    "9:30 am - 10:00 am",
    "10:00 am - 10:30 am",
    "10:30 am - 11:00 am",
    "11:00 am - 11:30 am",
    "11:30 am - 12:00 pm",
    "12:00 pm - 12:30 pm",
    "12:30 pm - 1:00 pm",
    "1:00 pm - 1:30 pm",
    "1:30 pm - 2:00 pm",
    "2:00 pm - 2:30 pm",
  ];
  const preferences = [
    "Birthday Celebration",
    "Anniversary",
    "Business Meeting",
    "Family Gathering",
    "Window Seating",
    "Quiet Seating",
  ];
  const availableSlots = timeSlots.filter((_, index) => index !== 2).length;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-panel rounded-3xl p-5 sm:p-8">
      {step === 1 ? (
        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <h3 className="font-display text-3xl font-extrabold text-white sm:text-4xl">Step 1: Select guests, date and time</h3>
            <div className="grid gap-2 text-sm font-semibold text-red-300">
              <a href="/reservations/cancel" className="text-left hover:text-white">Cancel reservation</a>
              <a href="/reservations/modify" className="text-left hover:text-white">Modify reservation</a>
              <a href="/reservations/status" className="text-left text-robot-blue hover:text-white">View reservation status</a>
            </div>
          </div>
          <div className="mt-6 grid gap-4 rounded-3xl border border-robot-blue/20 bg-robot-blue/10 p-5 text-sm text-robot-silver sm:grid-cols-3">
            <div>
              <p className="font-extrabold text-white">Availability</p>
              <p className="mt-1">{availableSlots} time slots available today</p>
            </div>
            <div>
              <p className="font-extrabold text-white">Peak guidance</p>
              <p className="mt-1">Evening and weekend tables fill fastest.</p>
            </div>
            <div>
              <p className="font-extrabold text-white">Selected time</p>
              <p className="mt-1">{selectedTime}</p>
            </div>
          </div>
          <div className="mt-8 grid gap-5">
            <label className="grid min-w-0 gap-2 text-sm font-semibold text-robot-silver">
              Number of Guests *
              <select className={inputClass} {...register("guests")}>
                {[1, 2, 3, 4, 5, 6, 8, 10].map((value) => (
                  <option key={value} value={value} className="bg-robot-navy">
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid min-w-0 gap-2 text-sm font-semibold text-robot-silver">
              Date *
              <input className={inputClass} type="date" {...register("date", { required: true })} />
              {errors.date ? <span className="text-xs text-robot-gold">Date is required.</span> : null}
            </label>
            <div>
              <p className="text-sm font-semibold text-robot-silver">Time Slot *</p>
              <p className="mt-2 font-semibold text-white">Robot Cafe:</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {timeSlots.map((slot, index) => (
                  <button
                    type="button"
                    key={slot}
                    disabled={index === 2}
                    onClick={() => setSelectedTime(slot)}
                    className={`focus-ring rounded-xl px-4 py-4 text-sm font-extrabold transition ${
                      selectedTime === slot
                        ? "bg-robot-blue text-white shadow-glow"
                        : index === 2
                          ? "cursor-not-allowed bg-white/10 text-robot-muted"
                          : "bg-sky-300/80 text-white hover:bg-robot-blue"
                    }`}
                    title={index === 2 ? "This time is fully booked" : undefined}
                  >
                    <span className="block">{slot}</span>
                    <span className="mt-1 block text-[0.68rem] uppercase tracking-[0.16em] opacity-80">
                      {index === 2 ? "Fully booked" : selectedTime === slot ? "Selected" : "Available"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <PremiumButton type="button" onClick={continueToGuestInfo} className="mt-8">
            Continue
          </PremiumButton>
        </div>
      ) : (
        <div>
          <h3 className="font-display text-3xl font-extrabold text-white sm:text-4xl">Step 2: Guest Information</h3>
          <div className="mt-4 grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-robot-silver sm:grid-cols-3">
            <p><span className="font-extrabold text-white">Guests:</span> {getValues("guests")}</p>
            <p><span className="font-extrabold text-white">Date:</span> {getValues("date") || "Not selected"}</p>
            <p><span className="font-extrabold text-white">Time:</span> {selectedTime}</p>
          </div>
          <div className="mt-8 grid min-w-0 gap-4 sm:grid-cols-2">
            <label className="grid min-w-0 gap-2 text-sm font-semibold text-robot-silver">
              First Name: *
              <input className={inputClass} {...register("firstName", { required: true })} />
              {errors.firstName ? <span className="text-xs text-robot-gold">First name is required.</span> : null}
            </label>
            <label className="grid min-w-0 gap-2 text-sm font-semibold text-robot-silver">
              Last Name: *
              <input className={inputClass} {...register("lastName", { required: true })} />
              {errors.lastName ? <span className="text-xs text-robot-gold">Last name is required.</span> : null}
            </label>
            <label className="grid min-w-0 gap-2 text-sm font-semibold text-robot-silver">
              Phone: *
              <input className={inputClass} placeholder="+254..." {...register("phone", { required: true })} />
              {errors.phone ? <span className="text-xs text-robot-gold">Phone is required.</span> : null}
            </label>
            <label className="grid min-w-0 gap-2 text-sm font-semibold text-robot-silver">
              Email: *
              <input className={inputClass} type="email" {...register("email", { required: true })} />
              {errors.email ? <span className="text-xs text-robot-gold">Email is required.</span> : null}
            </label>
          </div>
          <div className="mt-6">
            <p className="text-sm font-semibold text-robot-silver">Reservation Preferences</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {preferences.map((preference) => {
                const active = selectedPreferences.includes(preference);
                return (
                  <button
                    type="button"
                    key={preference}
                    onClick={() => togglePreference(preference)}
                    className={`focus-ring rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
                      active
                        ? "border-robot-blue bg-robot-blue text-white"
                        : "border-white/10 bg-white/5 text-robot-silver hover:border-robot-blue/50"
                    }`}
                    aria-pressed={active}
                  >
                    {preference}
                  </button>
                );
              })}
            </div>
          </div>
          {!compact ? (
            <label className="mt-4 grid min-w-0 gap-2 text-sm font-semibold text-robot-silver">
              Special Requests
              <textarea className={`${inputClass} min-h-36 resize-y`} placeholder="Dietary notes, celebration details, seating needs..." {...register("notes")} />
            </label>
          ) : null}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <PremiumButton type="submit">
              Make a reservation request
            </PremiumButton>
            <button type="button" onClick={() => setStep(1)} className="focus-ring rounded-full px-5 py-3 text-sm font-bold text-robot-silver hover:bg-white/10">
              Back
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
