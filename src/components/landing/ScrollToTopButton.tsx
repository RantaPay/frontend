import { ChevronUp } from "lucide-react";

interface ScrollToTopButtonProps {
  show: boolean;
  onClick: () => void;
}

export function ScrollToTopButton({ show, onClick }: ScrollToTopButtonProps) {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      aria-label="Scroll to top"
      className="fixed bottom-22 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-xl backdrop-blur-md transition-all duration-300 hover:bg-[#FFB21D] hover:text-white hover:border-[#FFB21D] hover:scale-110 active:scale-95"
    >
      <ChevronUp className="h-6 w-6" />
    </button>
  );
}
