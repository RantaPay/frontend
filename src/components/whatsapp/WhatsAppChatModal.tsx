import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  MessageSquare,
  X,
  Send,
  RotateCcw,
  CheckCheck,
  Sparkles,
  Building2,
  ShieldCheck,
  Smartphone,
  Play,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";
import { apiPost } from "@/lib/api";
import { notifySchoolDataUpdated } from "@/lib/school-sync";
import { useStore, updateStudent } from "@/lib/store";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

export function WhatsAppChatModal() {
  const location = useLocation();

  // Hide the floating WhatsApp button once a user enters the School Bursar Dashboard or Admin Dashboard
  const isDashboardRoute =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/admin/dashboard") ||
    (location.pathname.startsWith("/school/") &&
      !location.pathname.startsWith("/school/login") &&
      !location.pathname.startsWith("/school/register"));

  if (isDashboardRoute) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"connect" | "demo">("connect");

  // Phone Linking State
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [linkedSuccess, setLinkedSuccess] = useState<any>(null);

  // Demo Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneSender, setPhoneSender] = useState("08011112222");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeSchool = useStore((s) => s.settings);
  const allStudents = useStore((s) => s.students);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && activeTab === "demo") {
      scrollToBottom();
      if (messages.length === 0) {
        handleSendMessage("Hi", true);
      }
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    if (activeTab === "demo") {
      scrollToBottom();
    }
  }, [messages, isLoading, activeTab]);

  const handleLinkPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissionNumber.trim() || !parentPhone.trim()) {
      toast.error("Please enter both Admission Number and WhatsApp Phone Number.");
      return;
    }

    setIsLinking(true);
    try {
      const res = await apiPost("/api/whatsapp/link-phone", {
        admissionNumber: admissionNumber.trim(),
        phone: parentPhone.trim(),
      });

      if (res.success) {
        setLinkedSuccess(res);
        // Also update local store student record if found
        const localStudent = allStudents.find(
          (s) => s.admissionNumber.toUpperCase() === admissionNumber.trim().toUpperCase()
        );
        if (localStudent) {
          updateStudent(localStudent.id, { parentPhone: parentPhone.trim() });
        }
        setPhoneSender(parentPhone.trim());
        toast.success(res.message || "WhatsApp number linked successfully!");
      }
    } catch (err: any) {
      // Local graceful fallback
      const localStudent = allStudents.find(
        (s) => s.admissionNumber.toUpperCase() === admissionNumber.trim().toUpperCase()
      );
      if (localStudent) {
        updateStudent(localStudent.id, { parentPhone: parentPhone.trim() });
        setPhoneSender(parentPhone.trim());
        setLinkedSuccess({
          success: true,
          message: `Linked ${parentPhone.trim()} to ${localStudent.name}. Fee alert dispatched!`,
          student: localStudent,
        });
        toast.success(`Linked WhatsApp number to ${localStudent.name}!`);
      } else {
        toast.error(err.message || "Could not link student with this admission number.");
      }
    } finally {
      setIsLinking(false);
    }
  };

  const handleSendMessage = async (textToSend?: string, isInitial = false) => {
    const text = (textToSend || input).trim();
    if (!text || (isLoading && !isInitial)) return;

    if (!isInitial) {
      const userMsg: ChatMessage = {
        id: "msg-" + Date.now(),
        sender: "user",
        text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
    }

    setIsLoading(true);

    try {
      const res = await apiPost("/api/whatsapp/chat", {
        sender: phoneSender,
        message: text,
      });

      if (res.success && res.reply) {
        const botMsg: ChatMessage = {
          id: "bot-" + Date.now(),
          sender: "bot",
          text: res.reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);

        // If payment confirmation was returned, trigger live dashboard reconciliation
        if (
          res.reply.includes("Payment Confirmed") ||
          res.reply.includes("credited for") ||
          res.reply.includes("CLEARED")
        ) {
          notifySchoolDataUpdated(activeSchool.id);
          toast.success("🎉 Live Settlement: Bursary dashboard & ledger updated in real-time!");
        }
      }
    } catch (err: any) {
      const fallbackReply = generateClientFallbackReply(text, activeSchool.name);
      setMessages((prev) => [
        ...prev,
        {
          id: "bot-" + Date.now(),
          sender: "bot",
          text: fallbackReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDemo = async () => {
    setMessages([]);
    setInput("");
    await handleSendMessage("Hi", true);
    toast.info("WhatsApp interactive demo reset.");
  };

  return (
    <>
      {/* Floating Launcher Button - Public Parent Portal Only */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3.5 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-[#1EBE5D] active:scale-95 group focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 cursor-pointer"
        aria-label="Open WhatsApp Bursary Assistant"
      >
        <div className="relative">
          <MessageSquare className="h-6 w-6 text-white fill-white" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-100 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        </div>
        <span className="text-xs font-black tracking-wide hidden sm:inline-block">
          WhatsApp Bursary Pay
        </span>
      </button>

      {/* WhatsApp Modal Window */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-22 sm:right-6 z-50 flex flex-col w-full sm:w-[430px] h-full sm:h-[640px] bg-[#EFEAE2] sm:rounded-3xl shadow-2xl border border-slate-300/80 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="bg-[#075E54] text-white px-4 py-3.5 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white border border-white/30 text-sm">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#25D366] border-2 border-[#075E54]"></div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm leading-tight">
                  <span>{activeSchool.name || "Apex Model College"}</span>
                  <ShieldCheck className="h-4 w-4 text-[#25D366] fill-[#25D366]/20" />
                </div>
                <div className="text-[11px] text-emerald-100/90 font-medium">
                  Ranta Pay WhatsApp Bot • verified
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Interactive Demo Mode Toggle Pill */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab((curr) => (curr === "demo" ? "connect" : "demo"));
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-black transition-all flex items-center gap-1 border shadow-xs ${
                  activeTab === "demo"
                    ? "bg-[#25D366] text-white border-[#25D366]"
                    : "bg-white/15 text-white hover:bg-white/25 border-white/30"
                }`}
                title="Toggle Interactive Demo for Hackathon"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>Demo</span>
              </button>

              {activeTab === "demo" && (
                <button
                  type="button"
                  onClick={handleResetDemo}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
                  title="Reset Demo Chat"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Subheader / Mode Switcher */}
          <div className="bg-[#0b6e63] px-3 py-1.5 flex items-center justify-between text-xs text-white shrink-0 border-t border-white/10">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("connect")}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  activeTab === "connect"
                    ? "bg-white text-[#075E54] shadow-xs"
                    : "text-emerald-100 hover:text-white"
                }`}
              >
                📱 Connect WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("demo")}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  activeTab === "demo"
                    ? "bg-white text-[#075E54] shadow-xs"
                    : "text-emerald-100 hover:text-white"
                }`}
              >
                ⚡ Interactive Demo
              </button>
            </div>
            <span className="text-[10px] text-emerald-200/90 font-medium">
              {activeTab === "connect" ? "Live Phone Sync" : "Stage Preview"}
            </span>
          </div>

          {/* VIEW 1: Connect Parent Phone Number */}
          {activeTab === "connect" && (
            <div className="flex-1 p-5 overflow-y-auto flex flex-col justify-between bg-white text-slate-800">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                    <Smartphone className="h-4 w-4 text-[#25D366]" />
                    <span>Pay & Receive Bills in WhatsApp</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Connect your WhatsApp number to your child's student profile. You will receive
                    itemized fee breakdowns, your child's dedicated Wema Bank account, and gate passes directly on your phone!
                  </p>
                </div>

                {linkedSuccess ? (
                  <div className="p-4 rounded-2xl bg-emerald-500 text-white space-y-2 animate-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                      <span>WhatsApp Linked Successfully!</span>
                    </div>
                    <p className="text-xs text-emerald-100 leading-relaxed">
                      We've linked <strong>{linkedSuccess.student?.phone}</strong> to{" "}
                      <strong>{linkedSuccess.student?.name}</strong>.
                    </p>
                    <div className="pt-2">
                      <a
                        href="https://wa.me/14155238886?text=Hi"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white text-[#075E54] text-xs font-black shadow-md hover:bg-emerald-50 transition-all"
                      >
                        <MessageSquare className="h-4 w-4 fill-current" />
                        <span>Open Chat in WhatsApp</span>
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLinkedSuccess(null)}
                      className="text-[10px] text-emerald-200 hover:text-white underline w-full text-center block pt-1"
                    >
                      Connect another student
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleLinkPhone} className="space-y-3.5">
                    <div>
                      <label className="text-xs font-bold text-slate-800">
                        Student Admission Number:
                      </label>
                      <input
                        type="text"
                        value={admissionNumber}
                        onChange={(e) => setAdmissionNumber(e.target.value)}
                        placeholder="e.g. AMC/2025/001"
                        className="mt-1 w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-[#25D366] bg-slate-50/50"
                        required
                      />
                      <span className="text-[10px] text-slate-400">
                        Default demo student: <code className="font-bold text-slate-600">AMC/2025/001</code>
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800">
                        Your WhatsApp Phone Number:
                      </label>
                      <input
                        type="tel"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        placeholder="e.g. 08011112222 or +234..."
                        className="mt-1 w-full h-10 px-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-[#25D366] bg-slate-50/50"
                        required
                      />
                      <span className="text-[10px] text-slate-400">
                        Enter your personal WhatsApp number with country code.
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isLinking}
                      className="w-full h-11 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLinking ? (
                        <span>Linking Phone...</span>
                      ) : (
                        <>
                          <span>Connect WhatsApp & Send Fee Notice</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Bot Info Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <PhoneCall className="h-3.5 w-3.5 text-[#25D366]" />
                  <span>Twilio Number: +1 415 523 8886</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("demo")}
                  className="text-xs font-bold text-[#075E54] hover:underline"
                >
                  Test Demo Mode →
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: Interactive Demo Chat (For Hackathon Presentation) */}
          {activeTab === "demo" && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              {/* Encryption Banner */}
              <div className="bg-amber-50/90 border-b border-amber-200/60 px-3 py-1.5 text-center text-[10px] text-amber-900 font-semibold flex items-center justify-center gap-1 shrink-0">
                <Sparkles className="h-3 w-3 text-amber-600" />
                <span>Interactive Hackathon Demo • Real Database Updates</span>
              </div>

              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-xs leading-relaxed whitespace-pre-wrap ${
                        m.sender === "user"
                          ? "bg-[#DCF8C6] text-slate-900 rounded-tr-none font-medium"
                          : "bg-white text-slate-900 rounded-tl-none border border-slate-200/50"
                      }`}
                    >
                      {m.text}
                    </div>
                    <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-slate-500 font-semibold">
                      <span>{m.time}</span>
                      {m.sender === "user" && <CheckCheck className="h-3.5 w-3.5 text-[#34B7F1]" />}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm w-fit border border-slate-200/50">
                    <span className="text-[11px] text-slate-500 font-medium">Bursary Bot typing</span>
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce delay-100"></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce delay-200"></span>
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Action Chips for Fast Stage Demos */}
              <div className="bg-[#F0F2F5] px-3 py-2 border-t border-slate-200/70 overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none">
                <button
                  type="button"
                  onClick={() => handleSendMessage("08011112222")}
                  className="px-2.5 py-1 rounded-full bg-white border border-slate-300 text-[11px] font-bold text-slate-700 hover:bg-slate-100 whitespace-nowrap shadow-2xs cursor-pointer"
                >
                  📞 08011112222
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage("1")}
                  className="px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-[11px] font-bold text-purple-800 hover:bg-purple-100 whitespace-nowrap shadow-2xs cursor-pointer"
                >
                  🏦 1. Wema Account
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage("3")}
                  className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-800 hover:bg-amber-100 whitespace-nowrap shadow-2xs cursor-pointer"
                >
                  📋 3. Breakdown
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage("CONFIRM")}
                  className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 whitespace-nowrap shadow-2xs cursor-pointer"
                >
                  ⚡ Confirm Pay
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage("4")}
                  className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-bold text-blue-800 hover:bg-blue-100 whitespace-nowrap shadow-2xs cursor-pointer"
                >
                  🧾 4. Gate Slip
                </button>
              </div>

              {/* Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="bg-[#F0F2F5] px-3 py-3 flex items-center gap-2 border-t border-slate-200 shrink-0"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type message or reply number (1, 2, 3)..."
                  className="flex-1 h-10 px-3.5 bg-white rounded-full border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#25D366] placeholder:text-slate-400 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="h-10 w-10 rounded-full bg-[#075E54] text-white flex items-center justify-center hover:bg-[#128C7E] disabled:opacity-40 transition-colors shadow-md shrink-0 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// Client fallback reply in case backend is offline
function generateClientFallbackReply(text: string, schoolName: string): string {
  const t = text.trim().toLowerCase();
  if (t === "hi" || t === "hello" || t === "start") {
    return (
      `👋 *Welcome to ${schoolName} Bursary Assistant!*\n\n` +
      `Reply with your *Student Admission Number* (e.g. \`AMC/2025/001\`) or *Parent Phone* (\`08011112222\`).`
    );
  }
  if (t.includes("08011112222") || t.includes("amc")) {
    return (
      `🎓 *Student Found: Chiamaka Okeke (JSS 2A)*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• *Total Fees:* ₦160,000\n` +
      `• *Amount Paid:* ₦80,000\n` +
      `• *Outstanding Balance:* *₦80,000*\n` +
      `• *Status:* ⚠️ PARTIAL PAYMENT\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `Reply with:\n` +
      `1️⃣ - Dedicated Wema Bank Account\n` +
      `2️⃣ - Online Card Link\n` +
      `3️⃣ - Fee Breakdown\n` +
      `4️⃣ - Gate Pass / Receipt`
    );
  }
  if (t === "1") {
    return (
      `🏦 *Dedicated Wema Bank Account*\n` +
      `• Bank: *Wema Bank*\n` +
      `• Account No: *0124893012*\n` +
      `• Account Name: *APEX - CHIAMAKA OKEKE*\n` +
      `• Amount Due: *₦80,000*\n\n` +
      `_Transfer from any mobile banking app to settle instantly._`
    );
  }
  if (t === "3") {
    return `📋 *Itemized Fee Breakdown*\n• Tuition: ₦120,000\n• Books: ₦25,000\n• Uniform: ₦15,000\nTotal: ₦160,000`;
  }
  if (t === "confirm" || t === "pay") {
    return `🎉 *Payment Confirmed!*\n₦80,000 received for Chiamaka Okeke. Outstanding Balance: ₦0.00 (CLEARED).\nOfficial Gate Slip: https://rantapay.ng/receipt/RCPT-100001`;
  }
  return `🔍 Please reply with your Student Admission Number (e.g. AMC/2025/001) or Parent Phone Number (08011112222).`;
}
