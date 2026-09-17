import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";
import { School } from "@/lib/store";

interface SchoolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filteredSchools: School[];
}

export function SchoolSearchModal({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  filteredSchools,
}: SchoolSearchModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900">Find Your School</h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by school name, city, or state..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-12 pl-10 rounded-full text-sm border-slate-300 focus-visible:ring-[#FFB21D]"
            autoFocus
          />
        </div>

        <div className="mt-4 max-h-60 overflow-y-auto divide-y divide-slate-100">
          {filteredSchools.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching registered schools found for "{searchQuery}".
            </div>
          ) : (
            filteredSchools.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  onClose();
                  navigate(`/pay/${s.slug}`);
                }}
                className="flex w-full items-center justify-between p-3 text-left hover:bg-slate-50 rounded-xl transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                  <div className="text-xs text-slate-500">{s.address}</div>
                </div>
                <span className="text-xs font-bold text-[#FFB21D] flex items-center gap-1">
                  Pay Fees <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>
            ))
          )}
        </div>

        <div className="mt-4 border-t border-slate-100 pt-3 text-center">
          <Link
            to="/pay"
            onClick={onClose}
            className="text-xs font-bold text-[#FFB21D] hover:underline"
          >
            Browse all registered schools on the payment portal →
          </Link>
        </div>
      </div>
    </div>
  );
}
