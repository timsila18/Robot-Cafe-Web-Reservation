import FAQAccordion from "../components/FAQAccordion";
import SectionHeading from "../components/SectionHeading";
import { faqs } from "../data/faqs";

export default function FAQSection() {
  return (
    <section className="px-5 pb-24 lg:px-6">
      <SectionHeading title="Quick answers before guests book." subtitle="Clear FAQ content reduces friction while preserving the familiar pre-visit questions." />
      <div className="mt-12">
        <FAQAccordion items={faqs} />
      </div>
    </section>
  );
}
