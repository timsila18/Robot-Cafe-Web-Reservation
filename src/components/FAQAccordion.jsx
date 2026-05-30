import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mx-auto max-w-4xl divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/[0.035]">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.question}>
            <button
              className="focus-ring flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-display text-lg font-bold text-white"
              onClick={() => setOpenIndex(open ? -1 : index)}
              aria-expanded={open}
            >
              {item.question}
              <ChevronDown className={`h-5 w-5 shrink-0 text-robot-gold transition ${open ? "rotate-180" : ""}`} />
            </button>
            {open ? <p className="px-6 pb-6 leading-7 text-robot-muted">{item.answer}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
