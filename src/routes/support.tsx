import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import QRCode from "react-qr-code";
import { Heart, ArrowLeft, CheckCircle2, Copy, Check } from "lucide-react";
import { ConfettiBurst } from "@/components/confetti";

export const Route = createFileRoute("/support")({
  component: SupportPage,
  head: () => ({
    meta: [
      { title: "Support SORAZ – Back the Snack Revolution" },
      {
        name: "description",
        content:
          "Help SORAZ bring authentic Asian pop-culture snacks to India. Contribute any amount to fuel local manufacturing.",
      },
    ],
  }),
});

const UPI_ID = "9958078417@kotak811";
const UPI_NAME = "SORAZ";
const GOOGLE_SHEETS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyNxQKZJQJS7N7wHsl2bnYepB5JQueow2j-HASSjuuHAS6JbXAwdcR8ozmpgzODxkcBAg/exec";

const PRESETS = [49, 99, 199, 499, 999];

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
  const [amount, setAmount] = useState<number | "">("");
  const [customInput, setCustomInput] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [paidStatus, setPaidStatus] = useState<"idle" | "sending" | "done">("idle");
  const [supporterName, setSupporterName] = useState("");
  const [supporterPhone, setSupporterPhone] = useState("");

  const finalAmount = amount !== "" ? amount : Number(customInput) || 0;

  function selectPreset(val: number) {
    setAmount(val);
    setCustomInput("");
    setQrValue("");
  }

  function handleCustomChange(v: string) {
    setCustomInput(v);
    setAmount("");
    setQrValue("");
  }

  function generateQr() {
    if (finalAmount < 1) return;
    setQrValue(buildUpiUrl(finalAmount));
  }

  async function copyUpiId() {
    await navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handlePaid() {
    setPaidStatus("sending");
    try {
      const fd = new FormData();
      fd.append("type", "payment");
      fd.append("name", supporterName.trim() || "Anonymous");
      fd.append("phone", supporterPhone.trim() || "—");
      fd.append("amount", String(finalAmount));
      await fetch(GOOGLE_SHEETS_ENDPOINT, { method: "POST", body: fd });
    } catch (_) {
      // still show success regardless
    }
    setPaidStatus("done");
  }

  if (paidStatus === "done") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-20">
        <div className="relative max-w-md w-full overflow-hidden border-2 border-ink bg-card p-10 text-center shadow-brutal">
          <ConfettiBurst />
          <Heart className="mx-auto size-14 text-coral" fill="currentColor" />
          <h2 className="mt-4 text-3xl font-black uppercase text-ink">
            You're a legend! 🎉
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Your ₹{finalAmount} contribution is fuelling India's first authentic Asian
            snack brand. We'll remember this.
          </p>
          <p className="mt-5 font-mono text-xs font-bold uppercase text-electric">
            まじありがとう · 진심으로 감사해요 · Thank you!
          </p>
          <Link
            to="/"
            className="mt-8 inline-block border-2 border-ink bg-acid px-6 py-3 font-display text-base font-black uppercase shadow-mini transition-all hover:-translate-y-0.5"
          >
            ← Back to SORAZ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      {/* Back link */}
      <div className="mx-auto max-w-2xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase text-muted-foreground transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Back to SORAZ
        </Link>
      </div>

      {/* Hero */}
      <div className="mx-auto mt-8 max-w-2xl text-center">
        <span className="font-mono text-xs font-black uppercase tracking-widest text-coral">
          Back the Revolution
        </span>
        <h1 className="mt-2 text-4xl font-black uppercase leading-none text-ink sm:text-6xl">
          Support <span className="text-coral">SORAZ</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
          No payment gateway. No middleman. Direct UPI to our manufacturing fund.
          Every rupee goes toward producing India's first authentic Asian snack drop.
        </p>
      </div>

      {/* Card */}
      <div className="mx-auto mt-10 max-w-xl border-2 border-ink bg-card p-6 shadow-brutal sm:p-10">
        {/* Name + phone (optional, for notification) */}
        <p className="mb-4 font-mono text-xs font-bold uppercase text-muted-foreground">
          Optional — so we can thank you personally
        </p>
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <input
            placeholder="Your name"
            value={supporterName}
            onChange={(e) => setSupporterName(e.target.value)}
            className="w-full border-2 border-ink bg-background px-4 py-3 text-base outline-none transition-shadow focus:shadow-focus"
          />
          <input
            placeholder="Phone number"
            value={supporterPhone}
            onChange={(e) => setSupporterPhone(e.target.value)}
            className="w-full border-2 border-ink bg-background px-4 py-3 text-base outline-none transition-shadow focus:shadow-focus"
          />
        </div>

        {/* Amount selector */}
        <p className="mb-3 font-display text-lg font-extrabold text-ink">
          Pick an amount (₹)
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => selectPreset(p)}
              className={`border-2 border-ink px-4 py-2 font-mono text-sm font-bold uppercase transition-all hover:-translate-y-0.5 ${
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
          <span className="font-mono text-xs uppercase text-muted-foreground">or enter custom</span>
          <input
            type="number"
            min={1}
            placeholder="e.g. 250"
            value={customInput}
            onChange={(e) => handleCustomChange(e.target.value)}
            className="w-36 border-2 border-ink bg-background px-3 py-2 text-base outline-none transition-shadow focus:shadow-focus"
          />
          <span className="font-mono text-xs text-muted-foreground">INR</span>
        </div>

        {/* Generate QR button */}
        <button
          onClick={generateQr}
          disabled={finalAmount < 1}
          className="mt-6 w-full border-2 border-ink bg-coral px-8 py-4 font-display text-xl font-black uppercase text-primary-foreground shadow-brutal transition-all hover:-translate-y-1 hover:shadow-brutal-lg active:translate-y-1 active:shadow-none disabled:opacity-40"
        >
          {qrValue ? "Refresh QR →" : `Generate ₹${finalAmount || "?"} QR →`}
        </button>

        {/* QR Section */}
        {qrValue && (
          <div className="mt-8 flex flex-col items-center gap-5 border-2 border-ink bg-white p-6">
            <p className="font-mono text-xs font-bold uppercase text-ink">
              Scan with any UPI app · PhonePe · GPay · Paytm
            </p>
            <QRCode value={qrValue} size={220} />
            <p className="text-2xl font-black text-ink">₹{finalAmount}</p>

            {/* UPI ID copy */}
            <div className="flex items-center gap-2 border border-dashed border-ink px-4 py-2">
              <span className="font-mono text-sm text-ink">{UPI_ID}</span>
              <button
                onClick={copyUpiId}
                className="ml-1 text-muted-foreground transition-colors hover:text-ink"
                title="Copy UPI ID"
              >
                {copied ? (
                  <Check className="size-4 text-matcha" />
                ) : (
                  <Copy className="size-4" />
                )}
              </button>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              If QR doesn't open your app directly, copy the UPI ID above and pay
              manually with the exact amount shown.
            </p>

            {/* I've paid section */}
            <div className="mt-2 w-full border-t-2 border-ink pt-5 text-center">
              <p className="text-sm font-bold text-ink">
                Paid? Tap below so we know! 🙌
              </p>
              <button
                onClick={handlePaid}
                disabled={paidStatus === "sending"}
                className="mt-3 inline-flex items-center gap-2 border-2 border-ink bg-matcha px-6 py-3 font-display text-base font-black uppercase text-primary-foreground shadow-mini transition-all hover:-translate-y-0.5 disabled:opacity-60"
              >
                <CheckCircle2 className="size-5" />
                {paidStatus === "sending" ? "Recording…" : "I've Paid ✓"}
              </button>
              <p className="mt-2 text-xs text-muted-foreground">
                This just lets us track support — no auto-verification needed.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Trust note */}
      <p className="mx-auto mt-8 max-w-md text-center text-xs text-muted-foreground">
        🔒 Direct UPI transfer. No third-party payment processor. Your contribution goes
        straight to SORAZ's manufacturing account.
      </p>
    </div>
  );
}
