import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X, Copy, Check, Building2, Smartphone, ArrowUpRight
} from "lucide-react";

const bankDetails = {
  accountName: "Christ Commonwealth Community",
  accountNumber: "1441002382441",
  bank: "Ecobank Ghana",
  branch: "Kwashieman",
};

const mobileDetails = {
  accountName: "Christ Commonwealth Community",
  number: "+233 24 123 4567",
  networks: ["MTN Mobile Money", "Telecel Cash", "AT Money"],
};

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt("Copy this information:", value);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${value}`}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
        copied
          ? "bg-[#f4e5e5] text-[#681923]"
          : "bg-[#991313] text-white hover:bg-[#741010]"
      }`}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function DetailRow({ label, value, copyable = false, prominent = false }) {
  return (
    <div
      className={`flex min-w-0 items-center justify-between gap-3 rounded-xl border p-3.5 sm:p-4 ${
        prominent
          ? "border-[#d9b4b4] bg-[#fbf3f3]"
          : "border-[#e8e8e8] bg-white"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#737780]">
          {label}
        </p>
        <p className="break-words text-sm font-semibold leading-5 text-[#101A2B] sm:text-[15px]">
          {value}
        </p>
      </div>
      {copyable && <CopyButton value={value} />}
    </div>
  );
}

export default function PartnershipModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("bank");

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-[#101A2B]/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="partnership-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="relative flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-[#e6e6e6] bg-white shadow-[0_24px_80px_rgba(16,26,43,0.28)]"
      >
        {/* Burgundy header */}
        <header className="relative shrink-0 overflow-hidden bg-[#4a1515] px-6 py-6 text-white sm:px-8 sm:py-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full border-[30px] border-white/[0.05]"
          />

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close partnership modal"
            className="absolute right-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60 sm:right-6 sm:top-6"
          >
            <X size={18} />
          </button>

          <div className="relative z-10 pr-10">
            <h2
              id="partnership-title"
              className="max-w-md text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
            >
              Be part of the vision.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/80 sm:text-[15px]">
              Your partnership helps us reach more lives with the message of Christ.
            </p>
          </div>
        </header>

        {/* Scrollable content area */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-7 sm:py-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold tracking-tight text-[#101A2B]">
              Ways to give
            </h3>
            <p className="mt-1 text-sm leading-5 text-[#6b7280]">
              Choose your preferred payment method.
            </p>
          </div>

          {/* Payment tabs */}
          <div
            role="tablist"
            aria-label="Payment method"
            className="grid w-full grid-cols-2 gap-2 rounded-xl bg-[#f4f4f5] p-1.5"
          >
            <button
              id="bank-tab"
              type="button"
              role="tab"
              aria-selected={activeTab === "bank"}
              aria-controls="payment-panel"
              onClick={() => setActiveTab("bank")}
              className={`flex min-w-0 items-center justify-center gap-2 rounded-lg border px-2 py-3 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-[#991313]/30 sm:gap-3 ${
                activeTab === "bank"
                  ? "border-[#991313] bg-[#991313] text-white shadow-sm"
                  : "border-transparent bg-transparent text-[#4d5057] hover:bg-white hover:text-[#991313]"
              }`}
            >
              <Building2 size={18} className="shrink-0" />
              <span>Bank Transfer</span>
            </button>

            <button
              id="mobile-tab"
              type="button"
              role="tab"
              aria-selected={activeTab === "mobile"}
              aria-controls="payment-panel"
              onClick={() => setActiveTab("mobile")}
              className={`flex min-w-0 items-center justify-center gap-2 rounded-lg border px-2 py-3 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-[#991313]/30 sm:gap-3 ${
                activeTab === "mobile"
                  ? "border-[#991313] bg-[#991313] text-white shadow-sm"
                  : "border-transparent bg-transparent text-[#4d5057] hover:bg-white hover:text-[#991313]"
              }`}
            >
              <Smartphone size={18} className="shrink-0" />
              <span>Mobile Money</span>
            </button>
          </div>

          {/* Active payment panel */}
          <div
            id="payment-panel"
            role="tabpanel"
            aria-labelledby={activeTab === "bank" ? "bank-tab" : "mobile-tab"}
            className="mt-4 min-w-0 rounded-2xl border border-[#e5e5e5] bg-[#fafafa] p-3.5 sm:p-5"
          >
            {activeTab === "bank" ? (
              <div className="space-y-3">
                <div className="mb-4 flex items-center gap-3 border-b border-[#e5e5e5] pb-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4a1515] text-white">
                    <Building2 size={20} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#101A2B]">
                      Bank account details
                    </h4>
                    <p className="mt-0.5 text-xs text-[#6b7280]">
                      Direct bank transfer
                    </p>
                  </div>
                </div>

                <DetailRow
                  label="Account name"
                  value={bankDetails.accountName}
                />
                <DetailRow
                  label="Account number"
                  value={bankDetails.accountNumber}
                  copyable
                  prominent
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <DetailRow label="Bank" value={bankDetails.bank} />
                  <DetailRow label="Branch" value={bankDetails.branch} />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="mb-4 flex items-center gap-3 border-b border-[#e5e5e5] pb-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4a1515] text-white">
                    <Smartphone size={20} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#101A2B]">
                      Mobile Money details
                    </h4>
                    <p className="mt-0.5 text-xs text-[#6b7280]">
                      Give using your mobile wallet
                    </p>
                  </div>
                </div>

                <DetailRow
                  label="Account name"
                  value={mobileDetails.accountName}
                />
                <DetailRow
                  label="Mobile Money number"
                  value={mobileDetails.number}
                  copyable
                  prominent
                />

                <div className="rounded-xl border border-[#e5e5e5] bg-white p-4">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#737780]">
                    Available networks
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {mobileDetails.networks.map((network) => (
                      <span
                        key={network}
                        className="rounded-lg border border-[#e7d2d2] bg-[#fbf3f3] px-3 py-2 text-xs font-semibold text-[#681923]"
                      >
                        {network}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="rounded-xl border-l-4 border-[#991313] bg-[#f5f5f5] p-3.5 text-xs leading-5 text-[#4d5057]">
                  Please confirm the recipient name before completing your
                  transaction.
                </p>
              </div>
            )}
          </div>

          {/* Scripture */}
          <div className="mt-7 text-center text-[11px] leading-5 text-[#737780]">
            <p>
              "Each of you should give what you have decided in your heart to
              give, not reluctantly or under compulsion, for God loves a
              cheerful giver."
            </p>
            <p className="mt-1 font-semibold">(2 Corinthians 9:7)</p>
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a
              href="https://machairawithapostlebennie.org"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-[#681923] transition hover:bg-[#f5e8e8] sm:justify-start"
            >
              Visit our website
              <ArrowUpRight size={16} />
            </a>

            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#991313] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#741010] focus:outline-none focus:ring-2 focus:ring-[#991313]/40 focus:ring-offset-2"
            >
              <Check size={16} />
              Done
            </button>
          </div>
        </div>
      </section>
    </div>,
    document.body
  );
}
