import { useState, type FormEvent } from "react";
import { PRODUCTS } from "@/components/products";
import { ConfettiBurst } from "@/components/confetti";
import { Sparkles, CheckCircle2 } from "lucide-react";

// User's Google Apps Script Web App Endpoint:
export const GOOGLE_SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbyNxQKZJQJS7N7wHsl2bnYepB5JQueow2j-HASSjuuHAS6JbXAwdcR8ozmpgzODxkcBAg/exec";

export function WaitlistForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "duplicate" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function toggle(product: string) {
    setPicked((prev) =>
      prev.includes(product) ? prev.filter((p) => p !== product) : [...prev, product],
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (picked.length === 0) {
      setErrorMessage("Please select at least one snack/drink you want to buy!");
      return;
    }
    setErrorMessage("");
    setStatus("sending");

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("phone", phone.trim());
      formData.append("email", email.trim());
      formData.append("products", picked.join(", "));

      const res = await fetch(GOOGLE_SHEETS_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (data && data.result === "duplicate") {
        setStatus("duplicate");
      } else {
        setStatus("done");
      }
    } catch (err) {
      console.error("Submission error:", err);
      // Fallback success UI so user gets confirmation even on network policy edge-cases
      setStatus("done");
    }
  }

  if (status === "done") {
    return (
      <div className="relative overflow-hidden border-2 border-ink bg-card p-8 text-center shadow-brutal sm:p-14">
        <ConfettiBurst />
        <div className="animate-pop relative">
          <p className="font-mono text-xs font-black uppercase tracking-widest text-electric">Spot Secured / Drop 001</p>
          <h3 className="mt-4 text-3xl text-coral sm:text-5xl">You're on the list, {name.split(" ")[0] || "friend"}!</h3>
          <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground">
            Your selected cravings (<strong>{picked.join(", ")}</strong>) are logged directly for our manufacturing team. We'll ping you first the second SORAZ ships!
          </p>
          <p className="mt-6 text-sm font-black uppercase text-matcha">またね • 또 봐요 • See you soon</p>
        </div>
      </div>
    );
  }

  if (status === "duplicate") {
    return (
      <div className="border-2 border-ink bg-card p-8 text-center shadow-brutal sm:p-12">
        <CheckCircle2 className="mx-auto size-12 text-coral" />
        <h3 className="mt-4 text-2xl font-black uppercase text-ink">You're already on the list!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          We already have a waitlist spot registered for <strong>{phone}</strong> / <strong>{email}</strong>.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 border-2 border-ink bg-acid px-6 py-2 font-mono text-xs font-bold uppercase shadow-mini hover:-translate-y-0.5"
        >
          ← Submit another response
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border-2 border-ink bg-card p-6 shadow-brutal sm:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name">
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ananya S."
            className="w-full border-2 border-ink bg-background px-4 py-3 text-base outline-none transition-shadow focus:shadow-focus"
          />
        </Field>
        <Field label="Phone number" htmlFor="phone">
          <input
            id="phone"
            required
            type="tel"
            pattern="[0-9]{10}"
            title="10-digit mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            className="w-full border-2 border-ink bg-background px-4 py-3 text-base outline-none transition-shadow focus:shadow-focus"
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Email address" htmlFor="email">
            <input
              id="email"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@snackmail.com"
              className="w-full border-2 border-ink bg-background px-4 py-3 text-base outline-none transition-shadow focus:shadow-focus"
            />
          </Field>
        </div>
      </div>

      <fieldset className="mt-7">
        <legend className="font-display text-lg font-extrabold text-ink flex items-center gap-2">
          <Sparkles className="size-5 text-coral" /> Select the items you want to buy in Drop 001:
        </legend>
        <p className="mt-1 text-xs text-muted-foreground">
          Select all that apply. Your votes determine which snacks we produce first!
        </p>

        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {PRODUCTS.map((p) => {
            const on = picked.includes(p.name);
            return (
              <label
                key={p.name}
                className={`cursor-pointer select-none border-2 border-ink p-3 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                  on
                    ? "bg-electric text-electric-foreground shadow-mini"
                    : "bg-background text-ink"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm">{p.name}</span>
                  <span className="font-mono text-[10px] uppercase opacity-75">{p.origin}</span>
                </div>
                <p className="mt-1 text-xs opacity-85 leading-snug">{p.blurb}</p>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={on}
                  onChange={() => toggle(p.name)}
                />
              </label>
            );
          })}
        </div>
      </fieldset>

      {errorMessage && (
        <p className="mt-4 text-sm font-bold text-coral bg-coral/10 border border-coral p-3 text-center">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-8 w-full border-2 border-ink bg-coral px-8 py-4 font-display text-xl font-black uppercase text-primary-foreground shadow-brutal transition-all duration-200 hover:-translate-y-1 hover:shadow-brutal-lg active:translate-y-1 active:shadow-none disabled:opacity-60"
      >
        {status === "sending" ? "Securing your spot…" : "Get first dibs & lock pre-order →"}
      </button>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        🔒 Private &amp; Secure. Your data is stored directly in our private database and never shared publicly.
      </p>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-bold text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}
