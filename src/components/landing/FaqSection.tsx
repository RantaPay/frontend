import { ChevronDown } from "lucide-react";
import { FaqItem } from "./use-landing-data";

interface FaqSectionProps {
  faqs: FaqItem[];
  openFaq: number | null;
  onToggleFaq: (index: number) => void;
}

export function FaqSection({ faqs, openFaq, onToggleFaq }: FaqSectionProps) {
  return (
    <section id="faqs" className="py-20 bg-white border-t border-slate-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FFB21D]">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Everything You Need to Know
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Answers to common questions from Nigerian parents, bursars, and school proprietors.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all"
            >
              <button
                onClick={() => onToggleFaq(idx)}
                className="flex w-full items-center justify-between p-6 text-left text-base font-bold text-slate-900 hover:text-[#FFB21D] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${
                    openFaq === idx ? "rotate-180 text-[#FFB21D]" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="border-t border-slate-100 p-6 pt-0 text-sm text-slate-600 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
