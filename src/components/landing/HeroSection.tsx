import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface HeroSectionProps {
  onOpenSearch: () => void;
}

type Audience = "parents" | "schools";

interface AudienceContent {
  keyword: string;
  leadWord: string;
  headlineRest: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
}

const AUDIENCE_CONTENT: Record<Audience, AudienceContent> = {
  parents: {
    leadWord: "The",
    keyword: "easiest",
    headlineRest: "way to make school payments",
    description:
      "Pay your child's fees, books, and uniforms from home. Get an instant verified digital clearance receipt on your phone.",
    primaryCtaText: "Pay School Fees",
    primaryCtaLink: "/pay",
    secondaryCtaText: "Find Your School",
  },
  schools: {
    leadWord: "The",
    keyword: "clearest",
    headlineRest: "way to collect school fees",
    description:
      "See every fee payment the moment it enters your school bank account. Stop chasing unpaid fees with paper records and automatically issue verified payment receipts.",
    primaryCtaText: "School Bursar Portal",
    primaryCtaLink: "/school/login",
    secondaryCtaText: "Find Your School",
  },
};

export function HeroSection({ onOpenSearch }: HeroSectionProps) {
  const [audience, setAudience] = useState<Audience>("parents");
  const content = AUDIENCE_CONTENT[audience];

  const handleSecondaryClick = () => {
    onOpenSearch();
  };

  const handlePrimaryClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (content.primaryCtaLink.startsWith("#")) {
      e.preventDefault();
      const targetId = content.primaryCtaLink.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className="relative min-h-[100dvh] pt-24 pb-28 sm:pb-36 flex flex-col items-center justify-center overflow-hidden bg-white w-full">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center my-auto w-full">
        {/* Top Centered Audience Switcher Pill (Parents, Schools) */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center rounded-full bg-slate-100 p-1 border border-slate-200/80 shadow-xs">
            <button
              onClick={() => setAudience("parents")}
              className={`rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-xs font-bold transition-all ${
                audience === "parents"
                  ? "bg-[#0F172A] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              For Parents
            </button>
            <button
              onClick={() => setAudience("schools")}
              className={`rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-xs font-bold transition-all ${
                audience === "schools"
                  ? "bg-[#0F172A] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              For Schools
            </button>
          </div>
        </div>

        {/* Headline Container with Ambient Soft Gradient Behind the Text */}
        <div className="relative mx-auto max-w-4xl">
          {/* Small warm gradient glow behind the text */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 rounded-[48px] bg-gradient-to-tr from-[#FFF5E0]/90 via-[#FFF9ED]/70 to-transparent blur-2xl opacity-90 sm:-inset-x-16 sm:-inset-y-10"
          />

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl sm:leading-[1.12]">
            {content.leadWord}{" "}
            <span className="relative inline-block text-[#FFB21D]">
              {content.keyword}
              {/* Hand-drawn curved underline */}
              <svg
                className="absolute -bottom-2 sm:-bottom-3 left-0 w-full text-[#FFB21D]"
                viewBox="0 0 200 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 10C50 3 150 3 196 10"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            {content.headlineRest}
          </h1>
        </div>

        {/* Clear, Jargon-Free Audience Description */}
        <p className="mt-8 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto min-h-[56px] transition-all">
          {content.description}
        </p>

        {/* Centered Dual Action Buttons in Brand Color */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          <Button
            asChild
            className="rounded-full bg-[#FFB21D] hover:bg-[#EAA315] px-10 py-7 text-base font-bold text-white shadow-lg hover:shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <Link to={content.primaryCtaLink} onClick={handlePrimaryClick}>
              {content.primaryCtaText}
            </Link>
          </Button>

          <button
            onClick={handleSecondaryClick}
            className="inline-flex items-center gap-1.5 px-6 py-4 text-base font-semibold text-slate-800 hover:text-[#FFB21D] transition-colors group"
          >
            <span>{content.secondaryCtaText}</span>
            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#FFB21D] transition-all" />
          </button>
        </div>
      </div>
    </section>
  );
}
