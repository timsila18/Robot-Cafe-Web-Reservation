import SectionHeading from "../components/SectionHeading";
import { getMedia } from "../services/mediaService";

export default function AboutPage() {
  return (
    <section className="px-5 py-24 lg:px-6">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading align="left" title="Robot Cafe" subtitle="Nestled on the ground floor of Lana Plaza, Oloitoktok Rd, Kileleshwa, Robot Cafe is not just a place to eat, it is an experience." />
          <div className="mt-8 space-y-6 text-lg leading-9 text-robot-silver">
            <p>We are a modern cafe that seamlessly blends cutting-edge technology with the warmth of human hospitality.</p>
            <p>From the moment you step through our doors, you are greeted by the hum of robotic efficiency paired with the inviting ambiance of a contemporary cafe.</p>
          </div>
        </div>
        <div className="premium-ring rounded-3xl">
          <img src={getMedia("robot-cafe/about/interior", "dining")} alt="Robot Cafe interior" className="aspect-[4/3] rounded-3xl object-cover" />
        </div>
      </div>
    </section>
  );
}
