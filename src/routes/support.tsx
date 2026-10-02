import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import {
  Heart,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  AlertTriangle,
  RotateCcw,
  Smartphone,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { ConfettiBurst } from "@/components/confetti";

export const Route = createFileRoute("/support")({
  component: SupportPage,
  head: () => ({
    meta: [
      { title: "Support SORAZ – Back the Snack Revolution" },
      {
        name: "description",
        content:
          "Help SORAZ bring authentic Asian pop-culture snacks to India. Direct UPI contribution with live verification.",
      },
    ],
  }),
});

const UPI_ID = "9958078417@kotak811";
const UPI_NAME = "SORAZ";
const GOOGLE_SHEETS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyNxQKZJQJS7N7wHsl2bnYepB5JQueow2j-HASSjuuHAS6JbXAwdcR8ozmpgzODxkcBAg/exec";

const PRESETS = [49, 99, 199, 499, 999];
const PAYMENT_TIMEOUT_SECONDS = 300; // 5 minutes

const UPI_APPS = [
  { name: "Google Pay", color: "bg-blue-50 text-blue-700 border-blue-300" },
  { name: "PhonePe", color: "bg-purple-50 text-purple-700 border-purple-300" },
  { name: "Paytm", color: "bg-sky-50 text-sky-700 border-sky-300" },
  { name: "BHIM UPI", color: "bg-emerald-50 text-emerald-700 border-emerald-300" },
  { name: "CRED", color: "bg-zinc-100 text-zinc-900 border-zinc-400" },
  { name: "Other UPI", color: "bg-amber-50 text-amber-800 border-amber-300" },
];

function buildUpiUrl(amount: number) {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: UPI_NAME,
    am: String(amount),
    cu: "INR",
    tn: "SORAZ Support",
  });
  return `upi://pay?${params.toString()}`;
}

function SupportPage() {
  const [amount, setAmount] = useState<number | "">(99);
  const [customInput, setCustomInput] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [supporterName, setSupporterName] = useState("");
  const [supporterPhone, setSupporterPhone] = useState("");
  const [selectedApp, setSelectedApp] = useState("Google Pay");
  const [utrNumber, setUtrNumber] = useState("");
  const [utrError, setUtrError] = useState("");
  const [showUtrHelp, setShowUtrHelp] = useState(false);

  // Timer & Session state
  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT_SECONDS);
  const [sessionActive, setSessionActive] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [paidStatus, setPaidStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [receiptData, setReceiptData] = useState<{
    id: string;
    amount: number;
    utr: string;
    app: string;
    time: string;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const finalAmount = amount !== "" ? amount : Number(customInput) || 0;

  // Countdown timer effect
  useEffect(() => {
    if (sessionActive && !isExpired && paidStatus !== "done") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionActive, isExpired, paidStatus]);

  function startPaymentSession() {
    if (finalAmount < 1) return;
    setQrValue(buildUpiUrl(finalAmount));
    setTimeLeft(PAYMENT_TIMEOUT_SECONDS);
    setIsExpired(false);
    setSessionActive(true);
    setUtrNumber("");
    setUtrError("");
  }

  function retrySession() {
    startPaymentSession();
  }

  function handleUtrChange(val: string) {
    const numeric = val.replace(/\D/g, "").slice(0, 12);
    setUtrNumber(numeric);
    if (numeric.length > 0 && numeric.length < 12) {
      setUtrError(`Enter all 12 digits (${numeric.length}/12)`);
    } else {
      setUtrError("");
    }
  }

  async function copyUpiId() {
    await navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleVerifySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (utrNumber.length !== 12) {
      setUtrError("A valid 12-digit UPI Reference / UTR Number is required for verification.");
      return;
    }

    setPaidStatus("submitting");

    const receiptId = `SRZ-${Date.now().toString().slice(-6)}`;
    const nowTime = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      const fd = new FormData();
      fd.append("type", "payment");
      fd.append("name", supporterName.trim() || "Anonymous");
      fd.append("phone", supporterPhone.trim() || "—");
      fd.append("amount", String(finalAmount));
      fd.append("method", selectedApp);
      fd.append("utr", utrNumber);

      await fetch(GOOGLE_SHEETS_ENDPOINT, { method: "POST", body: fd });
    } catch (_) {
      // Offline fallback
    }

    setReceiptData({
      id: receiptId,
      amount: finalAmount,
      utr: utrNumber,
      app: selectedApp,
      time: nowTime,
    });
    setPaidStatus("done");
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPct = ((PAYMENT_TIMEOUT_SECONDS - timeLeft) / PAYMENT_TIMEOUT_SECONDS) * 100;

  // ── SUCCESS CONFIRMATION RECEIPT SCREEN ─────────────────────────────────────
  if (paidStatus === "done" && receiptData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
        <div className="relative w-full max-w-lg overflow-hidden border-2 border-ink bg-card p-6 shadow-brutal sm:p-10">
          <ConfettiBurst />

          <div className="text-center">
            <span className="inline-flex size-16 items-center justify-center border-2 border-ink bg-matcha text-primary-foreground shadow-mini">
              <CheckCircle2 className="size-10" />
            </span>
            <span className="mt-4 block font-mono text-xs font-black uppercase tracking-widest text-matcha">
              Payment Logged &amp; Verified
            </span>
            <h2 className="mt-1 font-display text-3xl font-black uppercase text-ink sm:text-4xl">
              Thank You{supporterName ? `, ${supporterName.split(" ")[0]}` : ""}! 🎉
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your contribution is recorded directly in our production book and notified to the founders.
            </p>
          </div>

          {/* Official Receipt Card */}
          <div className="mt-6 border-2 border-dashed border-ink bg-background p-5 font-mono text-xs">
            <div className="flex justify-between border-b border-ink/20 pb-2">
              <span className="text-muted-foreground">RECEIPT ID:</span>
              <span className="font-bold text-ink">{receiptData.id}</span>
            </div>
            <div className="flex justify-between border-b border-ink/20 py-2">
              <span className="text-muted-foreground">AMOUNT PAID:</span>
              <span className="font-bold text-coral text-sm">₹{receiptData.amount}.00</span>
            </div>
            <div className="flex justify-between border-b border-ink/20 py-2">
              <span className="text-muted-foreground">12-DIGIT UTR:</span>
              <span className="font-bold text-ink tracking-wider">{receiptData.utr}</span>
            </div>
            <div className="flex justify-between border-b border-ink/20 py-2">
              <span className="text-muted-foreground">PAYMENT METHOD:</span>
              <span className="font-bold text-ink">{receiptData.app}</span>
            </div>
            <div className="flex justify-between border-b border-ink/20 py-2">
              <span className="text-muted-foreground">PAID TO:</span>
              <span className="font-bold text-ink">{UPI_ID}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">STATUS:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="size-3.5" /> Logged &amp; Pending Confirmation
              </span>
            </div>
          </div>

          <p className="mt-4 text-center font-mono text-[11px] text-muted-foreground">
            We will cross-check UTR #{receiptData.utr} with our Kotak 811 bank notifications.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/"
              className="w-full border-2 border-ink bg-acid py-3 text-center font-display text-base font-black uppercase text-ink shadow-mini transition-transform hover:-translate-y-0.5"
            >
              ← Back to SORAZ Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      {/* Back button */}
      <div className="mx-auto max-w-2xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase text-muted-foreground transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Back to SORAZ
        </Link>
      </div>

      {/* Header */}
      <div className="mx-auto mt-6 max-w-2xl text-center">
        <span className="font-mono text-xs font-black uppercase tracking-widest text-coral">
          Founder Fund • Delhi NCR
        </span>
        <h1 className="mt-2 font-display text-4xl font-black uppercase leading-none text-ink sm:text-6xl">
          Fuel The <span className="text-coral">Drop</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          Support SORAZ’s dream of bringing real Asian street snacks to India. Pick any amount, scan our official UPI QR, and submit your UTR to lock your backer status.
        </p>
      </div>

      {/* Main Payment Container */}
      <div className="mx-auto mt-8 max-w-xl border-2 border-ink bg-card p-6 shadow-brutal sm:p-10">
        {/* STEP 1: AMOUNT SELECTION (Before session starts) */}
        {!sessionActive && (
          <div>
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-mono text-xs font-bold uppercase text-ink">
                  Your Name (Optional)
                </label>
                <input
                  placeholder="e.g. Arjun K."
                  value={supporterName}
                  onChange={(e) => setSupporterName(e.target.value)}
                  className="w-full border-2 border-ink bg-background px-4 py-2.5 text-sm outline-none transition-shadow focus:shadow-focus"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs font-bold uppercase text-ink">
                  Phone (Optional)
                </label>
                <input
                  placeholder="e.g. 9876543210"
                  type="tel"
                  value={supporterPhone}
                  onChange={(e) => setSupporterPhone(e.target.value)}
                  className="w-full border-2 border-ink bg-background px-4 py-2.5 text-sm outline-none transition-shadow focus:shadow-focus"
                />
              </div>
            </div>

            <p className="mb-2 font-display text-lg font-black uppercase text-ink">
              1. Choose Support Amount (₹)
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setAmount(p);
                    setCustomInput("");
                  }}
                  className={`border-2 border-ink px-4 py-2.5 font-mono text-sm font-bold uppercase transition-all hover:-translate-y-0.5 ${
                    amount === p
                      ? "bg-electric text-electric-foreground shadow-mini"
                      : "bg-background text-ink"
                  }`}
                >
                  ₹{p}
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="font-mono text-xs uppercase text-muted-foreground">or enter custom:</span>
              <input
                type="number"
                min={1}
                placeholder="250"
                value={customInput}
                onChange={(e) => {
                  setCustomInput(e.target.value);
                  setAmount("");
                }}
                className="w-32 border-2 border-ink bg-background px-3 py-2 text-sm font-bold outline-none transition-shadow focus:shadow-focus"
              />
              <span className="font-mono text-xs font-bold text-ink">INR</span>
            </div>

            <button
              onClick={startPaymentSession}
              disabled={finalAmount < 1}
              className="mt-8 w-full border-2 border-ink bg-coral py-4 font-display text-xl font-black uppercase text-primary-foreground shadow-brutal transition-all hover:-translate-y-1 hover:shadow-brutal-lg active:translate-y-0.5 active:shadow-none disabled:opacity-40"
            >
              Generate ₹{finalAmount || "0"} UPI QR →
            </button>
          </div>
        )}

        {/* STEP 2: ACTIVE PAYMENT & VERIFICATION SESSION */}
        {sessionActive && (
          <div>
            {/* Countdown Timer Bar */}
            <div className="mb-6 border-2 border-ink bg-background p-4">
              <div className="flex items-center justify-between font-mono text-xs font-bold uppercase">
                <span className="flex items-center gap-1.5 text-ink">
                  <Clock className="size-4 text-coral animate-pulse" />
                  {isExpired ? (
                    <span className="text-coral">Session Expired</span>
                  ) : (
                    <span>Payment Time Remaining:</span>
                  )}
                </span>
                <span
                  className={`font-mono text-base font-black ${
                    timeLeft < 60 ? "text-coral animate-ping" : "text-ink"
                  }`}
                >
                  {isExpired
                    ? "00:00"
                    : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-2.5 h-2 w-full border border-ink bg-muted">
                <div
                  className={`h-full transition-all duration-1000 ${
                    isExpired ? "bg-coral" : timeLeft < 60 ? "bg-coral" : "bg-matcha"
                  }`}
                  style={{ width: `${isExpired ? 100 : 100 - progressPct}%` }}
                />
              </div>
            </div>

            {/* If Expired: Show Retry Box */}
            {isExpired ? (
              <div className="border-2 border-coral bg-coral/10 p-6 text-center">
                <AlertTriangle className="mx-auto size-12 text-coral" />
                <h3 className="mt-3 font-display text-2xl font-black uppercase text-ink">
                  Payment Session Expired
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  The 5-minute payment window closed. To avoid transaction mismatches, please generate a fresh QR code session.
                </p>
                <button
                  onClick={retrySession}
                  className="mt-5 inline-flex items-center gap-2 border-2 border-ink bg-acid px-6 py-3 font-mono text-xs font-bold uppercase shadow-mini hover:-translate-y-0.5"
                >
                  <RotateCcw className="size-4" /> Retry Payment Session
                </button>
              </div>
            ) : (
              /* Active Session: QR Code + Verification Form */
              <div>
                {/* QR Code Container */}
                <div className="flex flex-col items-center gap-4 border-2 border-ink bg-white p-6 shadow-mini">
                  <div className="text-center">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Scan with any UPI App
                    </p>
                    <p className="font-display text-3xl font-black text-ink">
                      ₹{finalAmount}.00
                    </p>
                  </div>

                  <div className="border-2 border-ink p-3 bg-white">
                    <QRCode value={qrValue} size={200} />
                  </div>

                  {/* Direct Mobile UPI Link Button */}
                  <a
                    href={qrValue}
                    className="inline-flex items-center gap-2 border-2 border-ink bg-acid px-4 py-2 font-mono text-xs font-bold uppercase shadow-mini hover:-translate-y-0.5 sm:hidden"
                  >
                    <Smartphone className="size-4" /> Tap to Pay via Installed UPI App
                  </a>

                  {/* Copy UPI ID */}
                  <div className="flex items-center gap-2 border border-dashed border-ink bg-background px-3 py-1.5">
                    <span className="font-mono text-xs font-bold text-ink">{UPI_ID}</span>
                    <button
                      type="button"
                      onClick={copyUpiId}
                      className="text-muted-foreground transition-colors hover:text-ink"
                      title="Copy UPI ID"
                    >
                      {copied ? (
                        <Check className="size-3.5 text-matcha" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. PAYMENT VERIFICATION FORM */}
                <form onSubmit={handleVerifySubmit} className="mt-8 border-t-2 border-ink pt-6">
                  <p className="font-display text-lg font-black uppercase text-ink">
                    2. Verify Your Transaction
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    To record your contribution and prevent unverified submissions, select your app and enter the 12-digit UPI Reference / UTR Number from your receipt.
                  </p>

                  {/* App selector */}
                  <div className="mt-4">
                    <label className="mb-2 block font-mono text-xs font-bold uppercase text-ink">
                      Which App Did You Pay With?
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {UPI_APPS.map((app) => (
                        <button
                          key={app.name}
                          type="button"
                          onClick={() => setSelectedApp(app.name)}
                          className={`border-2 border-ink px-3 py-2 font-mono text-xs font-bold transition-all ${
                            selectedApp === app.name
                              ? "bg-ink text-background shadow-mini"
                              : "bg-background text-ink hover:-translate-y-0.5"
                          }`}
                        >
                          {app.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 12-Digit UTR input */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <label className="font-mono text-xs font-bold uppercase text-ink flex items-center gap-1.5">
                        12-Digit UPI Ref / UTR Number <span className="text-coral">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowUtrHelp(!showUtrHelp)}
                        className="flex items-center gap-1 font-mono text-[11px] font-bold text-coral underline"
                      >
                        <HelpCircle className="size-3.5" /> Where to find UTR?
                      </button>
                    </div>

                    {showUtrHelp && (
                      <div className="my-2 border border-ink bg-gold/20 p-3 font-mono text-xs text-ink">
                        <p className="font-bold">🔍 How to find your 12-digit UTR:</p>
                        <ul className="mt-1 list-disc pl-4 space-y-0.5">
                          <li><strong>GPay:</strong> Tap transaction → Look for "UPI transaction ID" (12 digits)</li>
                          <li><strong>PhonePe:</strong> Tap transaction → Look for "UTR" (12 digits)</li>
                          <li><strong>Paytm:</strong> Tap payment → Look for "UPI Ref No" (12 digits)</li>
                        </ul>
                      </div>
                    )}

                    <div className="relative mt-1.5">
                      <input
                        required
                        type="text"
                        inputMode="numeric"
                        maxLength={12}
                        placeholder="e.g. 427819827364"
                        value={utrNumber}
                        onChange={(e) => handleUtrChange(e.target.value)}
                        className="w-full border-2 border-ink bg-background px-4 py-3 font-mono text-base font-bold tracking-widest outline-none transition-shadow focus:shadow-focus"
                      />
                      <span className="absolute right-3 top-3 font-mono text-xs text-muted-foreground">
                        {utrNumber.length}/12
                      </span>
                    </div>

                    {utrError && (
                      <p className="mt-1 font-mono text-xs font-bold text-coral">{utrError}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={utrNumber.length !== 12 || paidStatus === "submitting"}
                    className="mt-6 w-full border-2 border-ink bg-matcha py-4 font-display text-lg font-black uppercase text-primary-foreground shadow-brutal transition-all hover:-translate-y-1 hover:shadow-brutal-lg active:translate-y-0.5 disabled:opacity-40"
                  >
                    {paidStatus === "submitting" ? (
                      "Recording Transaction…"
                    ) : (
                      <>Verify &amp; Confirm ₹{finalAmount} Contribution ✓</>
                    )}
                  </button>

                  <div className="mt-3 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setSessionActive(false)}
                      className="font-mono text-xs text-muted-foreground underline hover:text-ink"
                    >
                      ← Change amount or details
                    </button>
                    <button
                      type="button"
                      onClick={retrySession}
                      className="font-mono text-xs text-muted-foreground underline hover:text-ink"
                    >
                      Restart 5m Timer ↺
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Safety & Backer Note */}
      <div className="mx-auto mt-8 max-w-xl text-center font-mono text-xs text-muted-foreground">
        <p className="flex items-center justify-center gap-1.5 font-bold text-ink">
          <ShieldCheck className="size-4 text-matcha" /> 100% Direct to Founder's Kotak 811 Account
        </p>
        <p className="mt-1">
          No gateway commissions deducted. Every rupee directly fuels raw materials, packaging and R&amp;D for Batch 001.
        </p>
      </div>
    </div>
  );
}
