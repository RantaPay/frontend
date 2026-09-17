import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";

export interface FaqItem {
  q: string;
  a: string;
}

export interface PartnerBank {
  name: string;
  bg: string;
  badge: string;
  brandType: "gateway" | "bank" | "exam";
}

export function useLandingData() {
  const schools = useStore((s) => s.schools.filter((x) => x.status === "Active"));
  const [searchQuery, setSearchQuery] = useState("");
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const navigate = useNavigate();

  // Scroll listener for floating scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  // Honest & practical FAQs covering WhatsApp and web payments
  const faqs: FaqItem[] = [
    {
      q: "How can parents pay school fees via WhatsApp?",
      a: "Parents can initiate fee payment on WhatsApp by sending their child's school admission number to our official WhatsApp line. Our automated service replies with the student's itemized fee breakdown, generates a secure payment checkout, and sends the verified digital QR clearance receipt right inside the chat upon completion.",
    },
    {
      q: "Do parents need to create an account or remember a password?",
      a: "No. Ranta Pay is built as a zero-login guest checkout portal. You simply search your child's school, enter their admission number, confirm their details and assigned term fees, and pay securely in seconds.",
    },
    {
      q: "Can I pay for tuition, textbooks, and school uniforms together?",
      a: "Yes. Ranta Pay features an integrated School Store. You can bundle term tuition, PTA levies, class-specific curriculum books, and sports wear into a single consolidated payment.",
    },
    {
      q: "How does the student prove they have paid on exam day?",
      a: "Immediately upon payment, an official receipt is generated with a secure QR code. Teachers and school gatekeepers can verify it on any phone for instant clearance.",
    },
    {
      q: "How do schools receive their funds?",
      a: "Payments made by parents go directly into your school's official bank account. RantaPay never holds your money in a middleman wallet.",
    },
    {
      q: "What payment channels are supported for parents?",
      a: "Parents can pay easily through WhatsApp, direct bank transfer, debit cards (Mastercard, Visa, Verve), or bank USSD codes.",
    },
  ];

  const filteredSchools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return schools;
    return schools.filter(
      (s) =>
        (s.name || "").toLowerCase().includes(q) ||
        (s.address || "").toLowerCase().includes(q) ||
        (s.slug || "").toLowerCase().includes(q)
    );
  }, [schools, searchQuery]);

  // const partnerBanks: PartnerBank[] = [
  //   { name: "Paystack", bg: "bg-[#001737] text-white", badge: "PAYMENT GATEWAY", brandType: "gateway" },
  //   { name: "GTBank", bg: "bg-[#E85012] text-white", badge: "COMMERCIAL BANK", brandType: "bank" },
  //   { name: "School Board", bg: "bg-[#FFE082] text-slate-900", badge: "ACCREDITED COUNCIL", brandType: "exam" },
  //   { name: "Access Bank", bg: "bg-white text-slate-900 border border-slate-200", badge: "COMMERCIAL BANK", brandType: "bank" },
  //   { name: "Kuda", bg: "bg-[#431878] text-white", badge: "DIGITAL BANK", brandType: "bank" },
  //   { name: "WAEC Board", bg: "bg-[#FFE082] text-slate-900", badge: "EXAM COUNCIL", brandType: "exam" },
  //   { name: "FirstBank", bg: "bg-[#002D62] text-white", badge: "COMMERCIAL BANK", brandType: "bank" },
  //   { name: "UBA", bg: "bg-[#FFCDD2] text-[#D32F2F]", badge: "COMMERCIAL BANK", brandType: "bank" },
  //   { name: "Jaiz Bank", bg: "bg-[#DCEDC8] text-[#2E7D32]", badge: "NON-INTEREST BANK", brandType: "bank" },
  //   { name: "Union Bank", bg: "bg-[#00A3E0] text-white", badge: "COMMERCIAL BANK", brandType: "bank" },
  //   { name: "Zenith Bank", bg: "bg-white text-slate-900 border border-slate-200", badge: "COMMERCIAL BANK", brandType: "bank" },
  //   { name: "Fidelity Bank", bg: "bg-[#C8E6C9] text-[#1B5E20]", badge: "COMMERCIAL BANK", brandType: "bank" },
  // ];

  return {
    schools,
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
    // partnerBanks,
    navigate,
  };
}
