import { usePageTitle } from "@/hooks/use-page-title";
import { useLandingData } from "@/components/landing/use-landing-data";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { WhyRantaPaySection } from "@/components/landing/WhyRantaPaySection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { CoreFeaturesSection } from "@/components/landing/CoreFeaturesSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { SchoolSearchModal } from "@/components/landing/SchoolSearchModal";
import { ScrollToTopButton } from "@/components/landing/ScrollToTopButton";

export default function Landing() {
  usePageTitle("Ranta Pay : Smart School Payments, Anytime, Anywhere");

  const {
    filteredSchools,
    searchQuery,
    setSearchQuery,
    searchModalOpen,
    setSearchModalOpen,
    showScrollTop,
    scrollToTop,
    openFaq,
    toggleFaq,
    faqs,
  } = useLandingData();

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-slate-900 font-sans selection:bg-[#FFB21D] selection:text-white relative">
      {/* 1. Permanently Fixed Header */}
      <LandingNavbar />

      {/* 2. Hero Section occupying 100vh */}
      <HeroSection onOpenSearch={() => setSearchModalOpen(true)} />

      {/* 3. Why Ranta Pay (Dark Modern Classic Section) */}
      <WhyRantaPaySection onOpenSearch={() => setSearchModalOpen(true)} />

      {/* 4. What We Are Solving (Plain Background Section) */}
      <ProblemSection />

      {/* 5. Core Features (Parents, Schools) */}
      <CoreFeaturesSection />

      {/* 5. FAQ Accordion */}
      <FaqSection faqs={faqs} openFaq={openFaq} onToggleFaq={toggleFaq} />

      {/* 10. Warm Gold CTA Banner */}
      <CtaBanner onOpenSearch={() => setSearchModalOpen(true)} />

      {/* 11. Deep Navy Footer */}
      <LandingFooter />

      {/* Floating Scroll To Top Button */}
      <ScrollToTopButton show={showScrollTop} onClick={scrollToTop} />

      {/* Quick Interactive School Search Modal */}
      <SchoolSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filteredSchools={filteredSchools}
      />
    </div>
  );
}
