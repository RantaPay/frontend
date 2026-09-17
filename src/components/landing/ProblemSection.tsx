export function ProblemSection() {
  return (
    <section className="py-20 sm:py-28 bg-white text-center">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Pill Badge matching user reference */}
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs mb-6">
          What we are Solving
        </div>

        {/* Main Headline */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Paying School Fees Shouldn't Mean Payment Problems
        </h2>

        {/* Concise Marketing Paragraph capturing Parents and Schools */}
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          Across Nigeria, parents still spend hours in crowded bank queues battling lost paper tellers,
          while schools lose revenue to unverified bank receipts and chaotic manual reconciliation. Ranta Pay transforms
          this broken system into one seamless platform, delivering instant WhatsApp checkout for families
          and automated, verified direct bank deposits for schools.
        </p>
      </div>
    </section>
  );
}
